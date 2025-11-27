"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Book, Film, Gamepad2, Menu, X, Check, Loader2, ArrowLeft, Plus } from 'lucide-react';

// --- データ定義 ---
const CATEGORIES = [
    { id: 'book', name: '書籍', icon: Book },
    { id: 'movie', name: '映画', icon: Film },
    { id: 'game', name: 'ゲーム', icon: Gamepad2 },
    { id: 'other', name: 'その他', icon: Plus },
];

const GENRE_OPTIONS = {
    book: ['フィクション', 'ノンフィクション', 'ファンタジー', 'SF', 'ミステリ', 'ビジネス'],
    movie: ['アクション', 'ドラマ', 'SF', 'ホラー', 'コメディ', 'ドキュメンタリー'],
    game: ['RPG', 'アクション', 'シミュレーション', 'パズル', 'アドベンチャー', 'スポーツ'],
    other: ['技術', '音楽', 'アート', '学習'],
};

// --- 初期フォームデータとバリデーション定義 ---
const initialFormData = {
    title: '',
    authors: [''], // 最初の著者は必須なので1つ初期値
    category: 'book',
    genres: [''], // 最初のジャンル選択肢
    release_year: '',
    size: 'short',
    description: '',
    intro_url: '',
    affiliate_url: '',
    imageFile: null,
};

const MAX_AUTHORS = 5;

// コンポーネント定義
const App = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    // カテゴリに応じたジャンルオプションを動的に取得
    const availableGenres = useMemo(() => GENRE_OPTIONS[formData.category] || [], [formData.category]);

    // リアルタイムバリデーションとエラーハンドリング
    const validateField = (name, value) => {
        let error = '';
        const currentYear = new Date().getFullYear();

        switch (name) {
            case 'title':
                if (!value) error = 'タイトルは必須です';
                else if (value.length > 255) error = 'タイトルは255文字以内で入力してください';
                break;
            case 'authors':
                if (value.some(a => !a || a.length > 100)) error = '著者名は必須で、100文字以内で入力してください';
                break;
            case 'release_year':
                const year = parseInt(value);
                if (!value) error = '発売年は必須です';
                else if (!/^\d{4}$/.test(value) || year < 1900 || year > currentYear) error = '発売年は1900年から現在年までの4桁の西暦で入力してください';
                break;
            case 'description':
                if (!value) error = '作品説明は必須です';
                else if (value.length < 10) error = '作品説明は10文字以上で入力してください';
                else if (value.length > 5000) error = '作品説明は5000文字以内で入力してください';
                break;
            case 'category':
                if (!value) error = 'カテゴリは必須です';
                break;
            case 'intro_url':
            case 'affiliate_url':
                if (value && !/^https?:\/\/.+/.test(value)) error = '有効なURL形式で入力してください';
                break;
        }
        return error;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // リアルタイムバリデーション
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    // 著者配列の更新
    const handleAuthorChange = (index, value) => {
        const newAuthors = [...formData.authors];
        newAuthors[index] = value;
        setFormData(prev => ({ ...prev, authors: newAuthors }));

        // バリデーション
        const authorError = validateField('authors', newAuthors);
        setErrors(prev => ({ ...prev, authors: authorError }));
    };

    const handleAddAuthor = () => {
        if (formData.authors.length < MAX_AUTHORS) {
            setFormData(prev => ({ ...prev, authors: [...prev.authors, ''] }));
        }
    };

    const handleRemoveAuthor = (index) => {
        const newAuthors = formData.authors.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, authors: newAuthors }));

        // バリデーション更新
        const authorError = validateField('authors', newAuthors);
        setErrors(prev => ({ ...prev, authors: authorError }));
    };

    // ジャンル配列の更新
    const handleGenreChange = (index, value) => {
        const newGenres = [...formData.genres];
        newGenres[index] = value;
        setFormData(prev => ({ ...prev, genres: newGenres }));
    };

    const handleAddGenre = () => {
        setFormData(prev => ({ ...prev, genres: [...prev.genres, ''] }));
    };

    const handleRemoveGenre = (index) => {
        const newGenres = formData.genres.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, genres: newGenres }));
    };

    // ファイルアップロードの処理
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, imageFile: '対応形式: JPG, PNG, GIFのみです' }));
                setFormData(prev => ({ ...prev, imageFile: null }));
                setImagePreviewUrl(null);
                return;
            }

            if (file.size > maxSize) {
                setErrors(prev => ({ ...prev, imageFile: 'ファイルサイズは5MB以下にしてください' }));
                setFormData(prev => ({ ...prev, imageFile: null }));
                setImagePreviewUrl(null);
                return;
            }

            setErrors(prev => ({ ...prev, imageFile: '' }));
            setFormData(prev => ({ ...prev, imageFile: file }));
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    // フォーム全体のバリデーション
    const validateForm = () => {
        const newErrors = {};
        Object.keys(initialFormData).forEach(key => {
            // authorsは配列としてバリデーションを別途実行
            if (key !== 'authors' && key !== 'genres' && key !== 'imageFile') {
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });

        const authorError = validateField('authors', formData.authors);
        if (authorError) newErrors.authors = authorError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // フォーム送信（登録する）
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            // エラーがある場合は一番上のエラーにスクロールするなどのUX改善が必要
            alert('入力内容にエラーがあります。確認してください。');
            return;
        }

        setIsLoading(true);
        // 実際の登録処理（Supabase/Hono/DrizzleへのAPIコールをシミュレーション）
        console.log('作品登録データを送信:', formData);

        setTimeout(() => {
            setIsLoading(false);
            // 成功シミュレーション
            setSubmitSuccess(true);

            // 成功メッセージ表示後、作品詳細画面へ遷移をシミュレーション
            setTimeout(() => {
                // window.location.href = '/works/[work_id]'; // 実際の遷移
                console.log('登録成功！作品詳細画面へ遷移します。');
                setFormData(initialFormData);
                setSubmitSuccess(false);
            }, 3000);

        }, 1500); // ローディング時間シミュレーション
    };

    // キャンセルボタンのハンドラ
    const handleCancel = () => {
        setIsModalOpen(true);
    };

    // モーダルからの破棄実行
    const handleDiscard = () => {
        setIsModalOpen(false);
        // window.location.href = '/works'; // 実際の遷移
        console.log('入力内容を破棄し、作品一覧へ遷移します。');
        setFormData(initialFormData);
        setErrors({});
    };

    // UIコンポーネント定義 (Tailwind CSSを使用)
    const Sidebar = () => (
        <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition duration-200 ease-in-out bg-gray-800 text-white w-64 p-4 z-20`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">メニュー</h2>
                <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                    <X size={24} />
                </button>
            </div>
            <nav>
                {['HOME', '作品', 'レビュー', '設定'].map(item => (
                    <a key={item} href="#" className={`block p-3 rounded-lg ${item === '作品' ? 'bg-indigo-600 font-semibold' : 'hover:bg-gray-700'}`}>
                        {item}
                    </a>
                ))}
            </nav>
        </div>
    );

    const Header = () => (
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center">
                <button className="lg:hidden mr-4 p-1" onClick={() => setIsSidebarOpen(true)}>
                    <Menu size={24} />
                </button>
                <h1 className="text-2xl font-extrabold text-indigo-700">AppLogo</h1>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">認証済みユーザー</span>
                <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center font-semibold text-indigo-800">U</div>
            </div>
        </header>
    );

    const FormControl = ({ label, name, required, hint, error, children }) => (
        <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 102 0V7a1 1 0 10-2 0v1zm1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                    {error}
                </p>
            )}
            {hint && <p className="text-gray-500 text-sm mt-1">{hint}</p>}
        </div>
    );

    const GenreSelect = ({ index, genre, error }) => (
        <div className="flex items-center space-x-2 mb-2">
            <select
                value={genre}
                onChange={(e) => handleGenreChange(index, e.target.value)}
                className={`flex-grow border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm`}
            >
                <option value="" disabled>ジャンルを選択...</option>
                {availableGenres.map(g => (
                    <option key={g} value={g}>{g}</option>
                ))}
            </select>
            {formData.genres.length > 1 && (
                <button
                    type="button"
                    onClick={() => handleRemoveGenre(index)}
                    className="text-gray-500 hover:text-red-500 p-2 transition duration-150"
                    title="ジャンルを削除"
                >
                    <X size={20} />
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            {/* ヘッダー */}
            <Header />

            <div className="flex">
                {/* サイドバー */}
                <Sidebar />

                {/* メインコンテンツ */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">作品登録</h2>

                        {/* 戻るボタン */}
                        <a href="/works" className="text-indigo-600 hover:text-indigo-800 font-medium mb-8 inline-flex items-center transition duration-150">
                            <ArrowLeft size={20} className="mr-1" />
                            一覧へ
                        </a>

                        {/* 成功メッセージ */}
                        {submitSuccess && (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg font-semibold flex items-center space-x-2">
                                <Check size={20} />
                                <span>作品を登録しました! (3秒後に遷移をシミュレーション)</span>
                            </div>
                        )}

                        {/* フォームエリア */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b-4 border-indigo-400 pb-2 mb-8 inline-block">作品情報を入力</h3>

                            {/* 1. 作品タイトル */}
                            <FormControl
                                label="作品タイトル"
                                name="title"
                                required
                                hint="正式名称を入力してください"
                                error={errors.title}
                            >
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    placeholder="作品のタイトルを入力"
                                    className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm`}
                                />
                            </FormControl>

                            {/* 2. 著者名 */}
                            <FormControl
                                label={`著者名 (最大${MAX_AUTHORS}人)`}
                                name="authors"
                                required
                                error={errors.authors}
                            >
                                {formData.authors.map((author, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-3">
                                        <input
                                            type="text"
                                            value={author}
                                            onChange={(e) => handleAuthorChange(index, e.target.value)}
                                            placeholder={`著者${index + 1}名`}
                                            className={`flex-grow border ${errors.authors && formData.authors.length === 1 ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm`}
                                        />
                                        {formData.authors.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAuthor(index)}
                                                className="text-gray-500 hover:text-red-500 p-2 transition duration-150"
                                                title="著者を削除"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {formData.authors.length < MAX_AUTHORS && (
                                    <button
                                        type="button"
                                        onClick={handleAddAuthor}
                                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
                                    >
                                        <Plus size={16} className="mr-1" />
                                        著者を追加
                                    </button>
                                )}
                            </FormControl>

                            {/* 3. カテゴリ */}
                            <FormControl label="カテゴリ" name="category" required error={errors.category} hint="選択肢: 書籍、映画、ゲーム、その他">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => {
                                        handleFormChange(e);
                                        // カテゴリ変更時にジャンル選択をリセット
                                        setFormData(prev => ({ ...prev, genres: [''] }));
                                    }}
                                    className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 pr-10 appearance-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm`}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>

                            {/* 4. ジャンル */}
                            <FormControl label="ジャンル (複数選択可)" name="genres" hint="カテゴリに応じてジャンルの選択肢が変わります">
                                {formData.genres.map((genre, index) => (
                                    <GenreSelect key={index} index={index} genre={genre} />
                                ))}

                                <button
                                    type="button"
                                    onClick={handleAddGenre}
                                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
                                >
                                    <Plus size={16} className="mr-1" />
                                    ジャンルを追加
                                </button>
                            </FormControl>

                            {/* 5. 発売年 */}
                            <FormControl
                                label="発売年"
                                name="release_year"
                                required
                                hint="西暦4桁 (例: 2020)"
                                error={errors.release_year}
                            >
                                <input
                                    type="number"
                                    name="release_year"
                                    value={formData.release_year}
                                    onChange={handleFormChange}
                                    placeholder="2020"
                                    maxLength="4"
                                    className={`w-full max-w-[120px] border ${errors.release_year ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm`}
                                />
                            </FormControl>

                            {/* 6. サイズ */}
                            <FormControl label="サイズ" name="size" required error={errors.size}>
                                <div className="mt-2 space-y-2">
                                    {['short', 'medium', 'long', 'never_ending'].map((s) => (
                                        <label key={s} className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="size"
                                                value={s}
                                                checked={formData.size === s}
                                                onChange={handleFormChange}
                                                className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                            />
                                            <span className="ml-3 text-gray-700">
                                                {s === 'short' && 'short (短編)'}
                                                {s === 'medium' && 'medium (中編)'}
                                                {s === 'long' && 'long (長編)'}
                                                {s === 'never_ending' && 'never_ending (連載中)'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </FormControl>

                            {/* 7. 作品説明 */}
                            <FormControl
                                label="作品説明"
                                name="description"
                                required
                                hint="作品の内容や特徴を詳しく記入してください"
                                error={errors.description}
                            >
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    placeholder="作品の内容や特徴を詳しく記入してください"
                                    rows="6"
                                    className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm`}
                                />
                            </FormControl>

                            {/* 8. 紹介URL */}
                            <FormControl
                                label="紹介URL"
                                name="intro_url"
                                hint="公式サイトなどのURL (オプション)"
                                error={errors.intro_url}
                            >
                                <input
                                    type="url"
                                    name="intro_url"
                                    value={formData.intro_url}
                                    onChange={handleFormChange}
                                    placeholder="https://example.com"
                                    className={`w-full border ${errors.intro_url ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm`}
                                />
                            </FormControl>

                            {/* 9. アフィリエイトURL */}
                            <FormControl
                                label="アフィリエイトURL"
                                name="affiliate_url"
                                hint="購入ページのURL (オプション)"
                                error={errors.affiliate_url}
                            >
                                <input
                                    type="url"
                                    name="affiliate_url"
                                    value={formData.affiliate_url}
                                    onChange={handleFormChange}
                                    placeholder="https://affiliate.example.com"
                                    className={`w-full border ${errors.affiliate_url ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm`}
                                />
                            </FormControl>

                            {/* 10. 作品画像 */}
                            <FormControl
                                label="作品画像 (オプション)"
                                name="imageFile"
                                hint="対応形式: JPG, PNG, GIF (最大5MB)"
                                error={errors.imageFile}
                            >
                                <input
                                    type="file"
                                    name="imageFile"
                                    accept=".jpg,.jpeg,.png,.gif"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100 transition duration-150
                  "
                                />
                                {imagePreviewUrl && (
                                    <div className="mt-4 border border-gray-200 rounded-lg p-2 w-32 h-32 flex items-center justify-center overflow-hidden">
                                        <img src={imagePreviewUrl} alt="作品画像プレビュー" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                            </FormControl>

                            {/* ボタンエリア */}
                            <div className="pt-8 flex justify-end space-x-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition duration-150"
                                    disabled={isLoading}
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className={`px-8 py-3 rounded-lg text-white font-semibold shadow-lg transition duration-150 ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <Loader2 size={20} className="animate-spin mr-2" /> 登録中...
                                        </span>
                                    ) : (
                                        '登録する'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            {/* キャンセル確認モーダル */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">確認</h4>
                        <p className="text-gray-700 mb-6">入力内容が破棄されます。よろしいですか?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
                            >
                                戻る
                            </button>
                            <button
                                onClick={handleDiscard}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-150"
                            >
                                破棄する
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* フッター (シンプルにモック) */}
            <footer className="bg-gray-800 text-white p-4 text-center text-sm mt-10">
                &copy; 2024 AppName. All rights reserved.
            </footer>
        </div>
    );
};

export default App;
