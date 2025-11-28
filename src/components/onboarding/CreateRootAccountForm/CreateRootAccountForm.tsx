'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
import { createRootAccountAction } from './CreateRootAccountForm.fetch';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const schema = z.object({
    displayName: z.string().min(1, '表示名は必須です').max(50, '50文字以内で入力してください'),
    location: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CreateRootAccountForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            try {
                await createRootAccountAction(data);
                router.refresh();
                router.push('/');
            } catch (error) {
                console.error(error);
                alert('エラーが発生しました');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">アカウント作成</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    VNS masakinihirota へようこそ。まずはルートアカウントを作成しましょう。
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="displayName" className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                        表示名 <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="displayName"
                        {...register('displayName')}
                        className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300"
                        placeholder="例: 山田 太郎"
                    />
                    {errors.displayName && (
                        <p className="text-sm text-red-500">{errors.displayName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                        場所 (任意)
                    </label>
                    <input
                        id="location"
                        {...register('location')}
                        className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300"
                        placeholder="例: 東京"
                    />
                    {errors.location && (
                        <p className="text-sm text-red-500">{errors.location.message}</p>
                    )}
                </div>
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? '作成中...' : 'アカウントを作成'}
            </Button>
        </form>
    );
}
