"use server";

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { rootAccounts } from '@/db/schema';
import { redirect } from 'next/navigation';

const schema = z.object({
    displayName: z.string().min(1, 'Display Name is required'),
    location: z.string().optional(),
});

export async function createRootAccountAction(prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        displayName: formData.get('displayName') ?? undefined,
        location: formData.get('location') ?? undefined,
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed',
        };
    }

    const { displayName, location } = validatedFields.data;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    console.log('DEBUG: user', user);

    if (!user) {
        return {
            success: false,
            message: 'Unauthorized',
        };
    }

    try {
        await db.insert(rootAccounts).values({
            userId: user.id,
            displayName,
            location: location || null,
        });
    } catch (error) {
        console.error('Database Error:', error);
        return {
            success: false,
            message: 'Database Error: Failed to create account.',
        };
    }

    // Redirect or return success
    // For MVP, maybe redirect to dashboard or profiles page
    // redirect('/dashboard');
    return { success: true, message: 'Account created successfully!' };
}
