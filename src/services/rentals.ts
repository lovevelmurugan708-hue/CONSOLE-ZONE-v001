import { createClient } from "@/utils/supabase/client";
import { Rental } from "@/types";

export const createRental = async (rentalData: Partial<Rental>) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('rentals')
        .insert(rentalData)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getUserRentals = async (userId: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('rentals')
        .select(`
            *,
            product:products(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Rental[];
};
