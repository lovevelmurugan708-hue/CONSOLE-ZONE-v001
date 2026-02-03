import { NextResponse } from "next/server";
import { BookingLogic } from "@/services/booking-logic";
import { createClient } from "@/utils/supabase/server";
import { PLANS } from "@/constants";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            userId, // Ideally from session, but passed for now if auth not fully integrated
            // OR use: const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser();
            productCategory, // 'PS5', 'Xbox'
            planId, // 'daily', 'weekly'
            startDate,
            endDate,
            deliveryType, // 'DELIVERY', 'PICKUP'
            address,
            addons
        } = body;

        // Basic validation
        if (!productCategory || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        // 1. Validate User Constraints (if userId provided)
        if (userId) {
            try {
                const constraints = await BookingLogic.validateUserConstraints(userId);
                if (deliveryType === 'PICKUP' && !constraints.canPickup) {
                    return NextResponse.json({ error: "Pickup not available for your account type." }, { status: 403 });
                }
            } catch (e) {
                // Ignore if user lookup fails for guest checkout (if allowed)
                console.warn("User validation skipped or failed", e);
            }
        }

        // 2. Find Available Console (Tetris Logic)
        const consoleId = await BookingLogic.findAvailableConsole(productCategory, start, end);

        if (!consoleId) {
            return NextResponse.json({
                error: "No consoles available for these dates.",
                available: false
            }, { status: 409 });
        }

        // 3. Create Booking Record
        const supabase = await createClient();

        // Resolve Plan ID to DB ID if needed, or store string. Schema uses int references for plan_id.
        // For now, assuming we might need to look up plan_id from 'plans' table.
        // Let's check 'plans' table. It might be empty.
        // Fallback: If plans table not populated, just use raw data or dummy ID.
        // Ideally we should have inserted plans in a seed script.

        const { data: booking, error } = await supabase
            .from('bookings')
            .insert({
                user_id: userId || null, // Allow null for guest? Schema says references users(user_id)
                console_id: consoleId,
                plan_id: null, // TODO: Map 'daily' to actual ID
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                delivery_type: deliveryType,
                delivery_address: address,
                status: 'CONFIRMED' // Or PENDING if payment flow is separate
            })
            .select()
            .single();

        if (error) {
            console.error("Booking Insert Error:", error);
            return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
        }

        // 4. Record Addons
        if (addons && addons.length > 0) {
            const addonInserts = addons.map((a: any) => ({
                booking_id: booking.booking_id,
                item_name: a.id,
                quantity: a.qty,
                price: 0 // Fetch price
            }));
            await supabase.from('addons').insert(addonInserts);
        }

        return NextResponse.json({
            success: true,
            bookingId: booking.booking_id,
            consoleId: consoleId, // Internal info, maybe don't return to user
            message: "Booking confirmed!"
        });

    } catch (error) {
        console.error("Booking API Error:", error);
        return NextResponse.json({ error: "Internal System Error" }, { status: 500 });
    }
}
