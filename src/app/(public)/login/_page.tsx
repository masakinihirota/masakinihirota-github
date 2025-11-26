import { LoginForm } from './_components/LoginForm'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center bg-background">
                <LoginForm />
            </main>
            <Footer />
        </div>
    )
}
