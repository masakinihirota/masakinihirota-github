
import Link from 'next/link';

export default function PlaygroundPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">UI Prototypes (Playground)</h1>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Account & Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DemoCard
                                title="Root Account Demo"
                                path="/playground/root-account-demo"
                                description="Root account details, profile management, and achievements."
                            />
                            <DemoCard
                                title="User Profile Demo"
                                path="/playground/profile-demo"
                                description="User profile details, works, values, and skills."
                            />
                            <DemoCard
                                title="Profile Create Demo"
                                path="/playground/profile-create-demo"
                                description="Form to create a new user profile."
                            />
                            <DemoCard
                                title="Profile Edit Demo"
                                path="/playground/profile-edit-demo"
                                description="Form to edit an existing user profile."
                            />
                            <DemoCard
                                title="Settings Demo"
                                path="/playground/settings-demo"
                                description="Application and account settings."
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Content & Community</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DemoCard
                                title="Home Page Demo"
                                path="/playground/home-demo"
                                description="Main dashboard with quick actions and activity feed."
                            />
                            <DemoCard
                                title="Works List Demo"
                                path="/playground/works-demo"
                                description="List of works with search and filtering."
                            />
                            <DemoCard
                                title="Work Detail Demo"
                                path="/playground/work-detail-demo"
                                description="Detailed view of a specific work."
                            />
                            <DemoCard
                                title="Work Registration Demo"
                                path="/playground/work-registration-demo"
                                description="Form to register a new work."
                            />
                            <DemoCard
                                title="Organization List Demo"
                                path="/playground/organization-list-demo"
                                description="List of organizations."
                            />
                            <DemoCard
                                title="Nation List Demo"
                                path="/playground/nation-list-demo"
                                description="List of nations."
                            />
                            <DemoCard
                                title="Matching Settings Demo"
                                path="/playground/matching-settings-demo"
                                description="Settings for matching preferences."
                            />
                            <DemoCard
                                title="Search Demo"
                                path="/playground/search-demo"
                                description="Global search functionality."
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Admin & System</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DemoCard
                                title="Admin Dashboard Demo"
                                path="/playground/admin-demo/home"
                                description="Admin dashboard with statistics and management tools."
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Authentication & Legal</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DemoCard
                                title="Auth Explanation (Help)"
                                path="/playground/auth-demo/explanation"
                                description="Help center and service explanation."
                            />
                            <DemoCard
                                title="Login Demo"
                                path="/playground/auth-demo/login"
                                description="User login page."
                            />
                            <DemoCard
                                title="Register Demo"
                                path="/playground/auth-demo/register"
                                description="User registration page."
                            />
                            <DemoCard
                                title="Oasis Declaration Demo"
                                path="/playground/oasis-declaration-demo"
                                description="Oasis declaration page."
                            />
                            <DemoCard
                                title="Terms of Service Demo"
                                path="/playground/terms-demo"
                                description="Terms of service page."
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function DemoCard({ title, path, description }: { title: string, path: string, description: string }) {
    return (
        <Link href={path} className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
        </Link>
    );
}
