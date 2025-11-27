"use client";

// import React, { useState, useCallback, useMemo } from 'react';
// import { ChevronLeft, ChevronRight, Check, AlertTriangle, Loader2 } from 'lucide-react';

// // --- Configuration Data ---

// // Step 1: Location options
// const LOCATION_OPTIONS = [
//     { id: 'asia_oceania', label: 'アジア・オセアニア' },
//     { id: 'europe_africa', label: 'ヨーロッパ・アフリカ' },
//     { id: 'americas', label: '南北アメリカ' },
// ];

// // Step 2: Language options
// const LANGUAGE_OPTIONS = [
//     { id: 'japanese', label: '日本語' },
//     { id: 'english', label: '英語' },
//     { id: 'other', label: 'その他' },
// ];

// // Step 3: Generation options
// const GENERATION_OPTIONS = [
//     { id: 'pre-1940', label: '1940年代以前' },
//     { id: '1950s', label: '1950年代' },
//     { id: '1960s', label: '1960年代' },
//     { id: '1970s', label: '1970年代' },
//     { id: '1980s', label: '1980年代' },
//     { id: '1990s', label: '1990年代' },
//     { id: '2000s', label: '2000年代' },
//     { id: 'post-2010', label: '2010年代以降' },
// ];

// const TOTAL_STEPS = 3;

// /**
//  * Custom Radio Input Component for Onboarding Steps
//  */
// const RadioOption = ({ id, name, label, value, checked, onChange }) => (
//     <label
//         htmlFor={id}
//         className={`
//       flex items-center p-3 my-2 cursor-pointer rounded-lg transition-all duration-200
//       ${checked ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700 font-semibold shadow-md' : 'bg-white border border-gray-300 hover:bg-gray-50'}
//     `}
//     >
//         <input
//             type="radio"
//             id={id}
//             name={name}
//             value={value}
//             checked={checked}
//             onChange={onChange}
//             className="hidden" // Hide native radio button
//         />
//         <div className={`
//       w-5 h-5 mr-3 flex items-center justify-center rounded-full border-2
//       ${checked ? 'bg-indigo-500 border-indigo-500' : 'border-gray-400'}
//     `}>
//             {checked && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
//         </div>
//         <span className="text-base sm:text-lg">{label}</span>
//     </label>
// );

// /**
//  * Mock function to simulate data saving to Supabase (via Hono/Drizzle)
//  * @param {object} data - The form data to save
//  * @returns {Promise<boolean>} - True if save successful
//  */
// const saveOnboardingData = async (data) => {
//     // In a real application, this would be an API call to a Hono endpoint
//     // which then interacts with Drizzle/Supabase.
//     console.log('--- MOCK: Saving Onboarding Data ---', data);

//     return new Promise((resolve) => {
//         setTimeout(() => {
//             // Simulate random failure 10% of the time
//             const success = Math.random() > 0.1;
//             resolve(success);
//         }, 1500);
//     });
// };

// /**
//  * Main Onboarding Modal Component
//  */
// export default function App() {
//     const [step, setStep] = useState(1);
//     const [formData, setFormData] = useState({
//         location: '',
//         native_language: '',
//         custom_language: '',
//         birth_generation: '',
//     });
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [isCompleted, setIsCompleted] = useState(false);

//     // Helper function for required field validation
//     const validateStep = useCallback(() => {
//         setError('');

//         if (step === 1 && !formData.location) {
//             setError('⚠️ 居住地域を選択してください。');
//             return false;
//         }

//         if (step === 2) {
//             if (!formData.native_language) {
//                 setError('⚠️ 母語を選択してください。');
//                 return false;
//             }
//             if (formData.native_language === 'other' && !formData.custom_language.trim()) {
//                 setError('⚠️ 「その他」を選択した場合は、言語名を自由入力してください。');
//                 return false;
//             }
//         }

//         if (step === 3 && !formData.birth_generation) {
//             setError('⚠️ 生誕世代を選択してください。');
//             return false;
//         }

//         return true;
//     }, [step, formData]);

//     // Handler for all form field changes
//     const handleChange = (field, value) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//         setError(''); // Clear error on input change
//     };

//     // Move to the next step or complete the process
//     const handleNext = useCallback(async () => {
//         if (isLoading) return;

//         if (!validateStep()) {
//             return;
//         }

//         if (step < TOTAL_STEPS) {
//             setStep(prev => prev + 1);
//             window.scrollTo(0, 0); // Scroll to top when step changes
//         } else if (step === TOTAL_STEPS) {
//             // Final step: Save data
//             setIsLoading(true);
//             try {
//                 const success = await saveOnboardingData(formData);
//                 setIsLoading(false);

//                 if (success) {
//                     setIsCompleted(true);
//                     // In a real app, redirect to /tutorial or /home here
//                     console.log('Onboarding process complete! Redirecting...');
//                 } else {
//                     setError('⚠️ 保存に失敗しました。もう一度お試しください。');
//                 }
//             } catch (e) {
//                 setIsLoading(false);
//                 setError('⚠️ 予期せぬエラーが発生しました。時間を置いてお試しください。');
//             }
//         }
//     }, [step, validateStep, formData, isLoading]);

//     // Move to the previous step
//     const handleBack = () => {
//         if (step > 1) {
//             setStep(prev => prev - 1);
//             setError('');
//             window.scrollTo(0, 0);
//         }
//     };

//     // Skip the onboarding process
//     const handleSkip = () => {
//         if (window.confirm('基本情報を未入力のままHOME画面へ遷移します。後で設定できますが、マッチング精度が下がる可能性があります。続行しますか？')) {
//             // In a real app, redirect to /home here
//             console.log('Onboarding skipped. Redirecting to /home...');
//             // Optional: Mark user as having seen onboarding but skipped it
//             setIsCompleted(true);
//         }
//     };

//     // Text content based on the current step
//     const stepContent = useMemo(() => {
//         switch (step) {
//             case 1:
//                 return (
//                     <div className="space-y-4">
//                         <h3 className="text-xl font-bold text-gray-800">【居住地域】（地球3分割）</h3>
//                         <div className="space-y-2">
//                             {LOCATION_OPTIONS.map((option) => (
//                                 <RadioOption
//                                     key={option.id}
//                                     id={`location-${option.id}`}
//                                     name="location"
//                                     label={option.label}
//                                     value={option.id}
//                                     checked={formData.location === option.id}
//                                     onChange={() => handleChange('location', option.id)}
//                                 />
//                             ))}
//                         </div>
//                         <p className="text-sm font-semibold text-red-500 mt-6 pt-3 border-t border-red-200">
//                             ※この情報は後から変更できません
//                         </p>
//                     </div>
//                 );
//             case 2:
//                 return (
//                     <div className="space-y-4">
//                         <h3 className="text-xl font-bold text-gray-800">【母語】</h3>
//                         <div className="space-y-2">
//                             {LANGUAGE_OPTIONS.map((option) => (
//                                 <RadioOption
//                                     key={option.id}
//                                     id={`lang-${option.id}`}
//                                     name="language"
//                                     label={option.label}
//                                     value={option.id}
//                                     checked={formData.native_language === option.id}
//                                     onChange={() => handleChange('native_language', option.id)}
//                                 />
//                             ))}
//                         </div>
//                         {formData.native_language === 'other' && (
//                             <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
//                                 <label htmlFor="custom_language" className="block text-sm font-medium text-gray-700 mb-2">
//                                     その他の言語名を入力してください
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="custom_language"
//                                     value={formData.custom_language}
//                                     onChange={(e) => handleChange('custom_language', e.target.value)}
//                                     placeholder="例: フランス語"
//                                     className="w-full p-2 border border-indigo-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                 />
//                             </div>
//                         )}
//                         <p className="text-sm font-semibold text-red-500 mt-6 pt-3 border-t border-red-200">
//                             ※この情報は後から変更できません
//                         </p>
//                     </div>
//                 );
//             case 3:
//                 return (
//                     <div className="space-y-4">
//                         <h3 className="text-xl font-bold text-gray-800">【生誕世代】</h3>
//                         <div className="grid sm:grid-cols-2 gap-2">
//                             {GENERATION_OPTIONS.map((option) => (
//                                 <RadioOption
//                                     key={option.id}
//                                     id={`gen-${option.id}`}
//                                     name="generation"
//                                     label={option.label}
//                                     value={option.id}
//                                     checked={formData.birth_generation === option.id}
//                                     onChange={() => handleChange('birth_generation', option.id)}
//                                 />
//                             ))}
//                         </div>
//                         <p className="text-sm font-semibold text-red-500 mt-6 pt-3 border-t border-red-200">
//                             ※この情報は後から変更できません
//                         </p>
//                     </div>
//                 );
//             default:
//                 return null;
//         }
//     }, [step, formData]);

//     // --- Rendering Functions ---

//     // Renders the main modal content
//     const renderModalContent = () => (
//         <div className="p-6 sm:p-8 space-y-8">
//             {/* Header Area */}
//             <header className="text-center space-y-2">
//                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-indigo-700">
//                     VNS masakinihirota へようこそ！
//                 </h1>
//                 <p className="text-base sm:text-lg text-gray-600 font-medium">
//                     プロフィールを作成する前に、基本情報を設定しましょう。
//                 </p>
//             </header>

//             {/* Progress Bar Area */}
//             <div className="space-y-2">
//                 <div className="relative pt-1">
//                     <div className="flex mb-2 items-center justify-between">
//                         <div>
//                             <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
//                                 ステップ {step} / {TOTAL_STEPS}
//                             </span>
//                         </div>
//                     </div>
//                     <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
//                         <div
//                             style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
//                             className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
//                         ></div>
//                     </div>
//                 </div>
//             </div>

//             {/* Content Area */}
//             <div className="min-h-[250px]">
//                 {error && (
//                     <div className="flex items-center p-3 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-lg" role="alert">
//                         <AlertTriangle className="w-5 h-5 mr-2" />
//                         <div>{error}</div>
//                     </div>
//                 )}
//                 {stepContent}
//             </div>

//             {/* Footer Area (Navigation) */}
//             <footer className="pt-6 border-t border-gray-200 space-y-4">
//                 {/* Main Buttons (Back/Next/Complete) */}
//                 <div className="flex justify-between items-center">
//                     {step > 1 ? (
//                         <button
//                             onClick={handleBack}
//                             disabled={isLoading}
//                             className="flex items-center justify-center px-4 py-2 text-base font-semibold text-gray-700 bg-gray-200 rounded-xl shadow-md hover:bg-gray-300 transition-all duration-200 disabled:opacity-50"
//                         >
//                             <ChevronLeft className="w-5 h-5 mr-1" />
//                             前へ
//                         </button>
//                     ) : (
//                         <div className="w-[80px]"></div> // Spacer for alignment
//                     )}

//                     <button
//                         onClick={handleNext}
//                         disabled={isLoading}
//                         className={`
//               flex items-center justify-center px-6 py-3 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300
//               ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'}
//               disabled:opacity-70
//             `}
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                                 保存中...
//                             </>
//                         ) : step === TOTAL_STEPS ? (
//                             <>
//                                 <Check className="w-5 h-5 mr-2" />
//                                 完了
//                             </>
//                         ) : (
//                             <>
//                                 次へ
//                                 <ChevronRight className="w-5 h-5 ml-1" />
//                             </>
//                         )}
//                     </button>
//                 </div>

//                 {/* Skip Link */}
//                 <div className="text-center">
//                     <button
//                         onClick={handleSkip}
//                         disabled={isLoading}
//                         className="text-sm text-gray-500 underline hover:text-indigo-600 transition-colors disabled:opacity-50"
//                     >
//                         スキップして開始
//                     </button>
//                 </div>
//             </footer>
//         </div>
//     );

//     // --- Main Render ---

//     if (isCompleted) {
//         // Post-completion screen / redirect message
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-gray-100">
//                 <div className="w-full max-w-lg p-10 bg-white rounded-2xl shadow-2xl text-center space-y-6">
//                     <Check className="w-16 h-16 text-indigo-600 mx-auto" />
//                     <h2 className="text-3xl font-bold text-gray-800">設定完了！</h2>
//                     <p className="text-lg text-gray-600">
//                         基本情報の設定が完了しました。チュートリアル画面、またはHOME画面へ移動します。
//                         （※本デモではコンソールにメッセージを出力しています）
//                     </p>
//                     <a href="#" className="inline-block px-8 py-3 text-lg font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg">
//                         HOME画面へ
//                     </a>
//                 </div>
//             </div>
//         );
//     }

//     // The main modal layout
//     return (
//         <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
//             <div
//                 className="
//           relative w-full max-w-xl sm:max-w-2xl bg-white rounded-3xl shadow-2xl transform transition-all duration-300
//           md:scale-100 scale-95
//           my-8
//         "
//             >
//                 {/* Modal Content */}
//                 {renderModalContent()}
//             </div>
//         </div>
//     );
// }
import React, { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertTriangle, Loader2 } from 'lucide-react';

// --- Configuration Data ---

// ステップ総数を4に変更（設定3 + 確認1）
const TOTAL_STEPS = 4;

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

/**
 * Helper component for displaying confirmation fields in Step 4
 */
const ConfirmationField = ({ label, children }) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-1">{children}</div>
    </div>
);

/**
 * Custom Radio Input Component for Onboarding Steps (Dark Mode enhanced)
 */
const RadioOption = ({ id, name, label, value, checked, onChange }) => (
    <label
        htmlFor={id}
        className={`
      flex items-center p-3 my-2 cursor-pointer rounded-xl transition-all duration-200 shadow-sm
      ${checked
                ? 'bg-indigo-100 border-2 border-indigo-600 text-indigo-800 font-semibold dark:bg-indigo-900 dark:border-indigo-500 dark:text-indigo-200'
                : 'bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-100'
            }
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
      ${checked ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500' : 'border-gray-400 dark:border-gray-500'}
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
    // 新しいステート：二段階確認の最終警告画面を管理
    const [isAwaitingFinalConfirmation, setIsAwaitingFinalConfirmation] = useState(false);

    // Helper function for required field validation (PURE - NO SIDE EFFECTS)
    const isStepValid = useCallback(() => {
        // Validation for steps where user input is required
        if (step === 1 && !formData.location) {
            return false;
        }

        if (step === 2) {
            if (!formData.native_language) {
                return false;
            }
        }

        if (step === 3 && !formData.birth_generation) {
            return false;
        }

        // ステップ4（確認画面）は常に有効とみなす
        return true;
    }, [step, formData]);

    // Helper function to run validation and set error message (called ONLY on button click)
    const handleStepValidation = useCallback(() => {
        setError(''); // クリック時にエラーをクリア

        if (isStepValid()) {
            return true;
        }

        // isStepValid()がfalseの場合、具体的なエラーメッセージを設定
        if (step === 1 && !formData.location) {
            setError('⚠️ 居住地域を選択してください。');
        } else if (step === 2) {
            if (!formData.native_language) {
                setError('⚠️ 母語を選択してください。');
            }
        } else if (step === 3 && !formData.birth_generation) {
            setError('⚠️ 生誕世代を選択してください。');
        }

        return false;
    }, [step, formData, isStepValid]);

    // Handler for all form field changes
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(''); // Clear error on input change
    };

    // Move to the next step or initiate the final confirmation (First Press)
    const handleNext = useCallback(async () => {
        if (isLoading) return;

        // ステップ3までは、バリデーションとエラー設定を実行
        if (step <= 3 && !handleStepValidation()) {
            return;
        }

        if (step < TOTAL_STEPS) {
            setStep(prev => prev + 1);
            window.scrollTo(0, 0); // Scroll to top when step changes
        } else if (step === TOTAL_STEPS) {
            // Step 4: First click transitions to the final warning screen (Second Confirmation)
            setIsAwaitingFinalConfirmation(true);
            setError(''); // Clear any previous errors before final confirm
            window.scrollTo(0, 0);
        }
    }, [step, handleStepValidation, isLoading]);

    // Actual data saving function (Second Press)
    const handleFinalSave = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);
        setError('');
        try {
            const success = await saveOnboardingData(formData);
            setIsLoading(false);

            if (success) {
                setIsCompleted(true);
                console.log('Onboarding process complete! Redirecting...');
            } else {
                setError('⚠️ 保存に失敗しました。もう一度お試しください。');
                setIsAwaitingFinalConfirmation(false); // エラー時は確認画面に戻す
            }
        } catch (e) {
            setIsLoading(false);
            setError('⚠️ 予期せぬエラーが発生しました。時間を置いてお試しください。');
            setIsAwaitingFinalConfirmation(false); // エラー時は確認画面に戻す
        }
    }, [formData, isLoading]);

    // Move to the previous step
    const handleBack = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
            setError('');
            window.scrollTo(0, 0);
        }
    };


    // Text content based on the current step
    const stepContent = useMemo(() => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">【居住地域】（地球3分割）</h3>
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
                        <p className="text-sm font-semibold text-red-500 mt-6 pt-3 border-t border-red-200 dark:border-red-900">
                            ※この情報は後から変更できません
                        </p>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">【母語】</h3>
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
                        <p className="text-sm font-semibold text-red-500 mt-6 pt-3 border-t border-red-200 dark:border-red-900">
                            ※この情報は後から変更できません
                        </p>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">【生誕世代】</h3>
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
                        <p className="text-sm font-semibold text-red-500 mt-6 pt-3 border-t border-red-200 dark:border-red-900">
                            ※この情報は後から変更できません
                        </p>
                    </div>
                );
            case 4: // 最終確認画面 (二段階確認)

                if (isAwaitingFinalConfirmation) {
                    // 第二段階の最終警告画面
                    return (
                        <div className="space-y-8 flex flex-col items-center pt-4">
                            <AlertTriangle className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto" />
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">最終確認</h3>

                            {/* 警告色を青系統に、文言を緩和 */}
                            <div className="text-center p-5 w-full bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-300 dark:border-indigo-600 rounded-xl space-y-3">
                                <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                                    以下の設定は、あなたのマッチングにおいて<span className="text-red-600 dark:text-red-400">極めて重要</span>です。
                                </p>
                                <p className="text-base text-gray-700 dark:text-gray-300">
                                    この操作で設定が確定しますが、万が一誤りがあった場合は、<br />
                                    HOME画面の設定から<span className="font-bold">全データをリセットし、最初から再設定することが可能</span>です。
                                </p>
                            </div>

                            {/* 戻るボタンを大きく、プライマリとして配置 */}
                            <button
                                onClick={() => setIsAwaitingFinalConfirmation(false)}
                                disabled={isLoading}
                                className={`
                  flex items-center justify-center w-full sm:w-3/4 px-8 py-4 text-xl font-extrabold rounded-xl shadow-xl transition-all duration-300 transform
                  ${isLoading ? 'bg-indigo-400 cursor-not-allowed text-white' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/50 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600'}
                  ${!isLoading && 'hover:scale-[1.02]'}
                  disabled:opacity-50
                `}
                            >
                                <ChevronLeft className="w-6 h-6 mr-3" />
                                内容を再確認する（戻る）
                            </button>

                            {/* 確定ボタンを小さく、セカンダリとして配置（注意喚起のため赤色を維持）
                  ホバー時に色を反転させ、ボタンを拡大 */}
                            <button
                                onClick={handleFinalSave}
                                disabled={isLoading}
                                className={`
                    flex items-center justify-center w-full sm:w-3/4 px-6 py-2 text-base font-bold rounded-xl transition-all duration-300 mt-2 border border-red-500
                    ${isLoading
                                        ? 'bg-red-300 cursor-not-allowed text-white'
                                        : 'bg-white text-red-600 hover:bg-red-600 hover:text-white dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white'}
                    ${!isLoading && 'hover:scale-[1.05]'}
                    shadow-md
                    disabled:opacity-50
                  `}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        データを保存しています...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5 mr-2" />
                                        設定を確定する
                                    </>
                                )}
                            </button>
                        </div>
                    );
                }

                // 最初の確認画面 (First Confirmation View)
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 border-b pb-3 border-gray-200 dark:border-gray-700">
                            最終確認
                        </h3>
                        {/* 警告色を赤系統に変更 */}
                        <p className="text-lg text-gray-700 dark:text-gray-300 p-4 bg-red-50 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-xl flex items-start">
                            <AlertTriangle className="w-5 h-5 mr-3 mt-1 text-red-600 dark:text-red-400 flex-shrink-0" />
                            以下の情報は一度決定すると後から変更できません。<br />この内容でよろしいですか？
                        </p>

                        <ConfirmationField label="居住地域">
                            {LOCATION_OPTIONS.find(o => o.id === formData.location)?.label || '未選択'}
                        </ConfirmationField>

                        <ConfirmationField label="母語">
                            {/* 'other' の場合は 'その他' と表示するのみに変更 */}
                            {formData.native_language === 'other'
                                ? 'その他'
                                : LANGUAGE_OPTIONS.find(o => o.id === formData.native_language)?.label || '未選択'}
                        </ConfirmationField>

                        <ConfirmationField label="生誕世代">
                            {GENERATION_OPTIONS.find(o => o.id === formData.birth_generation)?.label || '未選択'}
                        </ConfirmationField>
                    </div>
                );

            default:
                return null;
        }
    }, [step, formData, isAwaitingFinalConfirmation, isLoading, handleFinalSave]);

    // --- Rendering Functions ---

    // Renders the main modal content
    const renderModalContent = () => (
        <div className="p-6 sm:p-8 space-y-8">
            {/* Header Area */}
            <header className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-indigo-700 dark:text-indigo-400">
                    VNS masakinihirota へようこそ！
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium">
                    プロフィールを作成する前に、基本情報を設定しましょう。
                </p>
            </header>

            {/* Progress Bar Area */}
            <div className="space-y-2">
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 dark:text-indigo-900 dark:bg-indigo-300">
                                ステップ {step} / {TOTAL_STEPS}
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200 dark:bg-indigo-900">
                        <div
                            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 dark:bg-indigo-600 transition-all duration-500"
                        ></div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[250px]">
                {error && (
                    <div className="flex items-center p-3 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-xl dark:bg-red-900 dark:text-red-300" role="alert">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        <div>{error}</div>
                    </div>
                )}
                {stepContent}
            </div>

            {/* Footer Area (Navigation) - isAwaitingFinalConfirmationがfalseの場合のみ表示 */}
            {!isAwaitingFinalConfirmation && (
                <footer className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    {/* Main Buttons (Back/Next/Complete) */}
                    <div className="flex justify-between items-center">
                        {step > 1 ? (
                            <button
                                onClick={handleBack}
                                disabled={isLoading}
                                className="flex items-center justify-center px-4 py-2 text-base font-semibold text-gray-700 bg-gray-200 rounded-xl shadow-md hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                前へ
                            </button>
                        ) : (
                            <div className="w-[80px]"></div> // Spacer for alignment
                        )}

                        <button
                            onClick={handleNext}
                            disabled={isLoading || (step <= 3 && !isStepValid())} // 純粋なisStepValid()を使用
                            className={`
                flex items-center justify-center px-6 py-3 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300
                ${isLoading
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl dark:bg-indigo-500 dark:hover:bg-indigo-600'}
                ${!isLoading && step === TOTAL_STEPS ? 'hover:scale-[1.05]' : ''}
                disabled:opacity-50
              `}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    処理中...
                                </>
                            ) : step === TOTAL_STEPS ? (
                                <>
                                    <Check className="w-5 h-5 mr-2" />
                                    最終確認して完了
                                </>
                            ) : (
                                <>
                                    次へ
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </>
                            )}
                        </button>
                    </div>
                </footer>
            )}
        </div>
    );

    // --- Main Render ---

    if (isCompleted) {
        // Post-completion screen / redirect message
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
                {/* いつでもやり直せるリンクバーとして、設定変更が可能な旨を伝えるメッセージを表示 */}
                <div className="w-full bg-indigo-100 dark:bg-indigo-900 p-3 text-center text-sm font-medium text-indigo-800 dark:text-indigo-300 shadow-lg absolute top-0">
                    ✓ 基本情報の設定が完了しました。ユーザー名やプロフィール画像などの<span className="font-bold">他の設定は、HOME画面からいつでも変更できます。</span>
                </div>

                <div className="w-full max-w-lg p-10 mt-16 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl text-center space-y-6">
                    <Check className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto" />
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">設定完了！</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        基本情報の設定が完了しました。チュートリアル画面、またはHOME画面へ移動します。
                        （※本デモではコンソールにメッセージを出力しています）
                    </p>
                    <a href="#" className="inline-block px-8 py-3 text-lg font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg dark:bg-indigo-500 dark:hover:bg-indigo-600">
                        HOME画面へ
                    </a>
                </div>
            </div>
        );
    }

    // The main modal layout
    return (
        // <div class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4 dark:bg-gray-900/90">
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div
                className="
          relative w-full max-w-xl sm:max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl transform transition-all duration-300
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
