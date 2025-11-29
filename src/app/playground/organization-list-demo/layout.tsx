
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

export default function OrganizationListDemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                    <footer className="mt-12 border-t border-gray-200 pt-6 pb-8 text-center text-sm text-gray-500">
                        <div className="flex justify-center space-x-6 mb-4">
                            <a href="#" className="hover:text-gray-900">利用規約</a>
                            <a href="#" className="hover:text-gray-900">プライバシーポリシー</a>
                            <a href="#" className="hover:text-gray-900">ヘルプ</a>
                        </div>
                        <p>&copy; 2025 VNS masakinihirota</p>
                    </footer>
                </main>
            </div>
        </div>
    );
}
