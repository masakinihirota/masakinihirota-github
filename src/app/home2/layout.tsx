import Sidebar from './components/Sidebar';

export const metadata = {
  title: 'Home2 - masakinihirota',
};

export default function Home2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
