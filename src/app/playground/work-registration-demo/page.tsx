
'use client';

import { useState } from 'react';
import { categories, genresByCategory, sizes } from './data';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import Link from 'next/link';

export default function WorkRegistrationDemoPage() {
    const [authors, setAuthors] = useState(['']);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [selectedGenres, setSelectedGenres] = useState(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddAuthor = () => {
        if (authors.length < 5) {
            setAuthors([...authors, '']);
        }
    };

    const handleRemoveAuthor = (index: number) => {
        const newAuthors = [...authors];
        newAuthors.splice(index, 1);
        setAuthors(newAuthors);
    };

    const handleAuthorChange = (index: number, value: string) => {
        const newAuthors = [...authors];
        newAuthors[index] = value;
        setAuthors(newAuthors);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setSelectedGenres(['']); // Reset genres when category changes
    };

    const handleAddGenre = () => {
        setSelectedGenres([...selectedGenres, '']);
    };

    const handleRemoveGenre = (index: number) => {
        const newGenres = [...selectedGenres];
        newGenres.splice(index, 1);
        setSelectedGenres(newGenres);
    };

    const handleGenreChange = (index: number, value: string) => {
        const newGenres = [...selectedGenres];
        newGenres[index] = value;
        setSelectedGenres(newGenres);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alert('作品を登録しました！（デモ）');
            // In a real app, redirect here
        }, 1500);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* Navigation */}
            <div>
                <Link href="/playground/works-demo" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    一覧へ戻る
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h1 className="text-lg font-bold text-gray-900">作品情報を入力</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            作品タイトル <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                placeholder="作品のタイトルを入力"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">正式名称を入力してください</p>
                    </div>

                    {/* Authors */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            著者名 <span className="text-red-500">*</span> (最大5人)
                        </label>
                        <div className="space-y-2 mt-1">
                            {authors.map((author, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500 w-12">著者{index + 1}:</span>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => handleAuthorChange(index, e.target.value)}
                                        required={index === 0}
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    />
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAuthor(index)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {authors.length < 5 && (
                            <button
                                type="button"
                                onClick={handleAddAuthor}
                                className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                著者を追加
                            </button>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            カテゴリ <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                            <select
                                id="category"
                                name="category"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Genres */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            ジャンル (複数選択可)
                        </label>
                        <div className="space-y-2 mt-1">
                            {selectedGenres.map((genre, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <select
                                        value={genre}
                                        onChange={(e) => handleGenreChange(index, e.target.value)}
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    >
                                        <option value="">選択してください</option>
                                        {genresByCategory[selectedCategory]?.map((g) => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                    {selectedGenres.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveGenre(index)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddGenre}
                            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            ジャンルを追加
                        </button>
                    </div>

                    {/* Release Year */}
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                            発売年 <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                            <input
                                type="number"
                                name="year"
                                id="year"
                                required
                                min="1900"
                                max={new Date().getFullYear() + 5}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-32 sm:text-sm border-gray-300 rounded-md p-2 border"
                                placeholder="2020"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">西暦4桁 (例: 2020)</p>
                    </div>

                    {/* Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            サイズ <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2 space-y-2">
                            {sizes.map((size) => (
                                <div key={size.value} className="flex items-center">
                                    <input
                                        id={`size-${size.value}`}
                                        name="size"
                                        type="radio"
                                        value={size.value}
                                        required
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <label htmlFor={`size-${size.value}`} className="ml-3 block text-sm font-medium text-gray-700">
                                        {size.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            作品説明 <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows={5}
                                required
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                placeholder="作品の内容や特徴を詳しく記入してください"
                            />
                        </div>
                    </div>

                    {/* URLs */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="introUrl" className="block text-sm font-medium text-gray-700">
                                紹介URL
                            </label>
                            <div className="mt-1">
                                <input
                                    type="url"
                                    name="introUrl"
                                    id="introUrl"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="affiliateUrl" className="block text-sm font-medium text-gray-700">
                                アフィリエイトURL
                            </label>
                            <div className="mt-1">
                                <input
                                    type="url"
                                    name="affiliateUrl"
                                    id="affiliateUrl"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="https://affiliate.example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            作品画像 (オプション)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                    >
                                        <span>ファイルを選択</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/gif" />
                                    </label>
                                    <p className="pl-1">またはドラッグ＆ドロップ</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-5 border-t border-gray-200 flex justify-end space-x-3">
                        <button
                            type="button"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => {
                                if (confirm('入力内容が破棄されます。よろしいですか？')) {
                                    window.location.href = '/playground/works-demo';
                                }
                            }}
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            aria-disabled={isSubmitting}
                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? '登録中...' : '登録する'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
