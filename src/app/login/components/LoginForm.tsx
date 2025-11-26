'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        try {
            setIsLoading(true)
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error) {
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-[350px]">
            <CardHeader className="text-center">
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Login with your Google account</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
                    {isLoading ? 'Connecting...' : 'Sign in with Google'}
                </Button>
            </CardContent>
        </Card>
    )
}
