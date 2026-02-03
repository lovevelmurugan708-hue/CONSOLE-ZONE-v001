import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// Robust key handling avoiding strict '!' to prevent crash if env is missing
const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
    console.error("RAZORPAY KEYS MISSING. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local");
}

const razorpay = new Razorpay({
    key_id: key_id || "dummy_id", // Prevent crash on init, fail gracefully on call
    key_secret: key_secret || "dummy_secret",
});

export async function POST(request: Request) {
    try {
        const { amount, currency = "INR" } = await request.json();

        if (!amount) {
            return NextResponse.json(
                { error: "Amount is required" },
                { status: 400 }
            );
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error) {
        console.error("Razorpay Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
