import Link from "next/link";
import { publicNav, footerNav } from "@/config/nav";

export const metadata = {
    title: "masakinihirota - Public",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body className="min-h-screen bg-white text-slate-900">
                <header className="p-4 border-b bg-white shadow-sm">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <Link href="/" className="font-semibold">masakinihirota</Link>
                        <nav className="flex gap-3">
                            {publicNav.map((item) => (
                                <Link key={item.href} href={item.href} className="text-sm text-zinc-700 hover:text-zinc-900">
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto p-6">{children}</main>

                <footer className="p-6 text-center text-sm text-zinc-400">
                    <div className="max-w-4xl mx-auto mb-3 flex gap-4 justify-center">
                        {footerNav.map((item) => (
                            <a key={item.href} href={item.href} className="text-sm text-zinc-500 hover:text-zinc-700">
                                {item.label}
                            </a>
                        ))}
                    </div>
                    <div>masakinihirota</div>
                </footer>
            </body>
        </html>
    );
}
