import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authNav } from "@/config/nav";
import Sidebar from "@/components/ui/Sidebar";

export const metadata = {
    title: "masakinihirota - Authenticated",
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    // Simple server-side cookie check for a session placeholder.
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    // If no session cookie, redirect to login page.
    if (!session) {
        redirect("/login");
    }

    return (
        <html>
            <body className="min-h-screen bg-slate-50 text-slate-900">
                <header className="p-4 border-b bg-white shadow-sm">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <Link href="/" className="font-semibold">masakinihirota</Link>
                        <nav className="flex gap-3">
                            {authNav.map((item: { href: string; label: string }) => (
                                <Link key={item.href} href={item.href} className="text-sm text-zinc-700 hover:text-zinc-900">
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </header>

                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 max-w-4xl mx-auto p-6">{children}</main>
                </div>

                <footer className="p-6 text-center text-sm text-zinc-400">© masakinihirota</footer>
            </body>
        </html>
    );
}
