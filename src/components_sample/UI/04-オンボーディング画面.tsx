"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertTriangle, Loader2 } from 'lucide-react';

// --- Configuration Data ---

// Step 1: Location options
const LOCATION_OPTIONS = [
    { id: 'asia_oceania', label: 'アジア・オセアニア' },
    { id: 'europe_africa', label: 'ヨーロッパ・アフリカ' },
    { id: 'americas', label: '南北アメリカ' },
];

// Step 2: Language options
const LANGUAGE_OPTIONS = [
    { id: 'japanese', label: '日本語' },
    { id: 'english', label: '英語' },
    { id: 'other', label: 'その他' },
];

// Step 3: Generation options
const GENERATION_OPTIONS = [
    { id: 'pre-1940', label: '1940年代以前' },
    { id: '1950s', label: '1950年代' },
    { id: '1960s', label: '1960年代' },
    { id: '1970s', label: '1970年代' },
    { id: '1980s', label: '1980年代' },
    { id: '1990s', label: '1990年代' },
    { id: '2000s', label: '2000年代' },
    { id: 'post-2010', label: '2010年代以降' },
];

const TOTAL_STEPS = 3;

/**
 * Custom Radio Input Component for Onboarding Steps
 */
const RadioOption = ({ id, name, label, value, checked, onChange }) => (
    <label
        htmlFor={id}
        className={`
      flex items-center p-3 my-2 cursor-pointer rounded-lg transition-all duration-200
      ${checked ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700 font-semibold shadow-md' : 'bg-white border border-gray-300 hover:bg-gray-50'}
    `}
    >
        <input
            type="radio"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className="hidden" // Hide native radio button
        />
        <div className={`
      w-5 h-5 mr-3 flex items-center justify-center rounded-full border-2
      ${checked ? 'bg-indigo-500 border-indigo-500' : 'border-gray-400'}
    `}>
            {checked && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
        </div>
        <span className="text-base sm:text-lg">{label}</span>
    </label>
);

/**
 * Mock function to simulate data saving to Supabase (via Hono/Drizzle)
 * @param {object} data - The form data to save
 * @returns {Promise<boolean>} - True if save successful
 */
const saveOnboardingData = async (data) => {
    // In a real application, this would be an API call to a Hono endpoint
    // which then interacts with Drizzle/Supabase.
    console.log('--- MOCK: Saving Onboarding Data ---', data);

    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate random failure 10% of the time
            const success = Math.random() > 0.1;
            resolve(success);
        }, 1500);
    });
};

/**
 * Main Onboarding Modal Component
 */
export default function App() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        location: '',
        native_language: '',
        custom_language: '',
        birth_generation: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Helper function for required field validation
    const validateStep = useCallback(() => {
        setError('');

        if (step === 1 && !formData.location) {
            setError('⚠️ 居住地域を選択してください。');
            return false;
        }

        if (step === 2) {
            if (!formData.native_language) {
                setError('⚠️ 母語を選択してください。');
                return false;
            }
            if (formData.native_language === 'other' && !formData.custom_language.trim()) {
                setError('⚠️ 「その他」を選択した場合は、言語名を自由入力してください。');
                return false;
            }
        }

        if (step === 3 && !formData.birth_generation) {
            setError('⚠️ 生誕世代を選択してください。');
            return false;
        }

        return true;
    }, [step, formData]);

    // Handler for all form field changes
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(''); // Clear error on input change
    };

    // Move to the next step or complete the process
    const handleNext = useCallback(async () => {
        if (isLoading) return;

        if (!validateStep()) {
            return;
        }

        if (step < TOTAL_STEPS) {
            setStep(prev => prev + 1);
            window.scrollTo(0, 0); // Scroll to top when step changes
        } else if (step === TOTAL_STEPS) {
            // Final step: Save data
            setIsLoading(true);
            try {
                const success = await saveOnboardingData(formData);
                setIsLoading(false);

                if (success) {
                    setIsCompleted(true);
                    // In a real app, redirect to /tutorial or /home here
                    console.log('Onboarding process complete! Redirecting...');
                } else {
                    setError('⚠️ 保存に失敗しました。もう一度お試しください。');
                }
            } catch (e) {
                setIsLoading(false);
                setError('⚠️ 予期せぬエラーが発生しました。時間を置いてお試しください。');
            }
        }
    }, [step, validateStep, formData, isLoading]);

    // Move to the previous step
    const handleBack = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
            setError('');
            window.scrollTo(0, 0);
        }
    };

    // Skip the onboarding process
    const handleSkip = () => {
        if (window.confirm('基本情報を未入力のままHOME画面へ遷移します。後で設定できますが、マッチング精度が下がる可能性があります。続行しますか？')) {
            // In a real app, redirect to /home here
            console.log('Onboarding skipped. Redirecting to /home...');
            // Optional: Mark user as having seen onboarding but skipped it
            setIsCompleted(true);
        }
    };

    // Text content based on the current step
    const stepContent = useMemo(() => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800">【居住地域】（地球3分割）</h3>
                        <div className="space-y-2">
                            {LOCATION_OPTIONS.map((option) => (
                                <RadioOption
                                    key={option.id}
                                    id={`location-${option.id}`}
                                    name="location"
                                    label={option.label}
                                    value={option.id}
                                    checked={formData.location === option.id}
                                    onChange={() => handleChange('location', option.id)}
                                />
                            ))}
                        </div>
                        <p className="text-sm font-semibold text-red-500 mt-6 pt-3 border-t border-red-200">
                            ※この情報は後から変更できません
                        </p>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800">【母語】</h3>
                        <div className="space-y-2">
                            {LANGUAGE_OPTIONS.map((option) => (
                                <RadioOption
                                    key={option.id}
                                    id={`lang-${option.id}`}
                                    name="language"
                                    label={option.label}
                                    value={option.id}
                                    checked={formData.native_language === option.id}
                                    onChange={() => handleChange('native_language', option.id)}
                                />
                            ))}
                        </div>
                        {formData.native_language === 'other' && (
                            <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                                <label htmlFor="custom_language" className="block text-sm font-medium text-gray-700 mb-2">
                                    その他の言語名を入力してください
                                </label>
                                <input
                                    type="text"
                                    id="custom_language"
                                    value={formData.custom_language}
                                    onChange={(e) => handleChange('custom_language', e.target.value)}
                                    placeholder="例: フランス語"
                                    className="w-full p-2 border border-indigo-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        )}
                        <p className="text-sm font-semibold text-red-500 mt-6 pt-3 border-t border-red-200">
                            ※この情報は後から変更できません
                        </p>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800">【生誕世代】</h3>
                        <div className="grid sm:grid-cols-2 gap-2">
                            {GENERATION_OPTIONS.map((option) => (
                                <RadioOption
                                    key={option.id}
                                    id={`gen-${option.id}`}
                                    name="generation"
                                    label={option.label}
                                    value={option.id}
                                    checked={formData.birth_generation === option.id}
                                    onChange={() => handleChange('birth_generation', option.id)}
                                />
                            ))}
                        </div>
                        <p className="text-sm font-semibold text-red-500 mt-6 pt-3 border-t border-red-200">
                            ※この情報は後から変更できません
                        </p>
                    </div>
                );
            default:
                return null;
        }
    }, [step, formData]);

    // --- Rendering Functions ---

    // Renders the main modal content
    const renderModalContent = () => (
        <div className="p-6 sm:p-8 space-y-8">
            {/* Header Area */}
            <header className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-indigo-700">
                    VNS masakinihirota へようこそ！
                </h1>
                <p className="text-base sm:text-lg text-gray-600 font-medium">
                    プロフィールを作成する前に、基本情報を設定しましょう。
                </p>
            </header>

            {/* Progress Bar Area */}
            <div className="space-y-2">
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                                ステップ {step} / {TOTAL_STEPS}
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                        <div
                            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
                        ></div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[250px]">
                {error && (
                    <div className="flex items-center p-3 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-lg" role="alert">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        <div>{error}</div>
                    </div>
                )}
                {stepContent}
            </div>

            {/* Footer Area (Navigation) */}
            <footer className="pt-6 border-t border-gray-200 space-y-4">
                {/* Main Buttons (Back/Next/Complete) */}
                <div className="flex justify-between items-center">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            disabled={isLoading}
                            className="flex items-center justify-center px-4 py-2 text-base font-semibold text-gray-700 bg-gray-200 rounded-xl shadow-md hover:bg-gray-300 transition-all duration-200 disabled:opacity-50"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            前へ
                        </button>
                    ) : (
                        <div className="w-[80px]"></div> // Spacer for alignment
                    )}

                    <button
                        onClick={handleNext}
                        disabled={isLoading}
                        className={`
              flex items-center justify-center px-6 py-3 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300
              ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'}
              disabled:opacity-70
            `}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                保存中...
                            </>
                        ) : step === TOTAL_STEPS ? (
                            <>
                                <Check className="w-5 h-5 mr-2" />
                                完了
                            </>
                        ) : (
                            <>
                                次へ
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </>
                        )}
                    </button>
                </div>

                {/* Skip Link */}
                <div className="text-center">
                    <button
                        onClick={handleSkip}
                        disabled={isLoading}
                        className="text-sm text-gray-500 underline hover:text-indigo-600 transition-colors disabled:opacity-50"
                    >
                        スキップして開始
                    </button>
                </div>
            </footer>
        </div>
    );

    // --- Main Render ---

    if (isCompleted) {
        // Post-completion screen / redirect message
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-lg p-10 bg-white rounded-2xl shadow-2xl text-center space-y-6">
                    <Check className="w-16 h-16 text-indigo-600 mx-auto" />
                    <h2 className="text-3xl font-bold text-gray-800">設定完了！</h2>
                    <p className="text-lg text-gray-600">
                        基本情報の設定が完了しました。チュートリアル画面、またはHOME画面へ移動します。
                        （※本デモではコンソールにメッセージを出力しています）
                    </p>
                    <a href="#" className="inline-block px-8 py-3 text-lg font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg">
                        HOME画面へ
                    </a>
                </div>
            </div>
        );
    }

    // The main modal layout
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div
                className="
          relative w-full max-w-xl sm:max-w-2xl bg-white rounded-3xl shadow-2xl transform transition-all duration-300
          md:scale-100 scale-95
          my-8
        "
            >
                {/* Modal Content */}
                {renderModalContent()}
            </div>
        </div>
    );
}
