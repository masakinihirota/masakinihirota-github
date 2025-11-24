'use client';

import { useActionState } from 'react';
import { createRootAccountAction } from './CreateRootAccount.fetch';

const initialState = {
    message: '',
    errors: {},
};

export function CreateRootAccount() {
    const [state, formAction, isPending] = useActionState(createRootAccountAction, initialState);

    return (
        <form action={formAction} className="space-y-4 p-4 border rounded-lg shadow-md max-w-md mx-auto" data-testid="create-root-account-form">
            <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                    Display Name
                </label>
                <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
                {state?.errors?.displayName && (
                    <p className="text-red-500 text-xs mt-1">{state.errors.displayName}</p>
                )}
            </div>

            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {isPending ? 'Creating...' : 'Create Account'}
            </button>

            {state?.message && (
                <p className={`text-sm mt-2 ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                    {state.message}
                </p>
            )}
        </form>
    );
}
