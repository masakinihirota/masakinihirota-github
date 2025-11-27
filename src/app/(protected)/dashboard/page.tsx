import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProtectedDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>You are successfully logged in.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
