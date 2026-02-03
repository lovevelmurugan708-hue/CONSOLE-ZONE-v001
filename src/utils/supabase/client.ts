
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Fallback for development to prevent crash if keys are missing
    if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
        console.warn('⚠️ Supabase credentials missing or invalid. Using placeholder to prevent crash.');
        return createBrowserClient(
            'https://placeholder.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwNjcyMDB9.placeholder_signature_for_development_only'
        )
    }

    return createBrowserClient(supabaseUrl, supabaseKey!)
}
