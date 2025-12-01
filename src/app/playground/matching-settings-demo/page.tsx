
'use client';

import { useState } from 'react';
import { values, genres, skills, regions, generations } from './data';
import { ArrowLeft, Save, Play } from 'lucide-react';
import Link from 'next/link';

export default function MatchingSettingsDemoPage() {
    const [valueImportance, setValueImportance] = useState<Record<string, number>>(
        values.reduce((acc, v) => ({ ...acc, [v.id]: 50 }), {})
    );
    const [selectedGenres, setSelectedGenres] = useState<string[]>(['genre-1', 'genre-2', 'genre-4', 'genre-6']);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(['skill-1', 'skill-2', 'skill-4']);
    const [selectedRegion, setSelectedRegion] = useState('japan');
    const [selectedGeneration, setSelectedGeneration] = useState('1980s');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleValueChange = (id: string, newValue: number) => {
        setValueImportance((prev) => ({ ...prev, [id]: newValue }));
    };

    const toggleGenre = (id: string) => {
        setSelectedGenres((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    const toggleSkill = (id: string) => {
        setSelectedSkills((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        // Mock save logic
        setMessage({ type: 'success', text: '設定を保存しました!' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleStartMatching = () => {
        // Mock matching logic
        handleSave();
        alert('マッチングを開始します... (デモ)');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* Navigation */}
            <div>
                <Link href="#" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    戻る
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6 space-y-8">

                    <div className="border-b border-gray-200 pb-5">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">マッチング設定</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            あなたに最適なパートナーを見つけるための条件を設定します。
                        </p>
                    </div>

                    {/* Value Importance */}
                    <section>
                        <h4 className="text-base font-semibold text-gray-900 mb-4 border-b pb-2">価値観の重要度</h4>
                        <div className="space-y-6">
                            {values.map((value) => (
                                <div key={value.id}>
                                    <div className="flex justify-between items-center mb-1">
                                        <label htmlFor={`value-${value.id}`} className="block text-sm font-medium text-gray-700">
                                            {value.name} <span className="text-gray-400 text-xs ml-1">({value.description})</span>
                                        </label>
                                        <span className="text-sm font-medium text-blue-600">{valueImportance[value.id]}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        id={`value-${value.id}`}
                                        min="0"
                                        max="100"
                                        value={valueImportance[value.id]}
                                        onChange={(e) => handleValueChange(value.id, parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Genre Priority */}
                    <section>
                        <h4 className="text-base font-semibold text-gray-900 mb-4 border-b pb-2">作品ジャンルの優先度</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {genres.map((genre) => (
                                <div key={genre.id} className="relative flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id={`genre-${genre.id}`}
                                            name={`genre-${genre.id}`}
                                            type="checkbox"
                                            checked={selectedGenres.includes(genre.id)}
                                            onChange={() => toggleGenre(genre.id)}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor={`genre-${genre.id}`} className="font-medium text-gray-700 cursor-pointer select-none">
                                            {genre.name}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skill Filtering */}
                    <section>
                        <h4 className="text-base font-semibold text-gray-900 mb-4 border-b pb-2">スキルの絞り込み</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {skills.map((skill) => (
                                <div key={skill.id} className="relative flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id={`skill-${skill.id}`}
                                            name={`skill-${skill.id}`}
                                            type="checkbox"
                                            checked={selectedSkills.includes(skill.id)}
                                            onChange={() => toggleSkill(skill.id)}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor={`skill-${skill.id}`} className="font-medium text-gray-700 cursor-pointer select-none">
                                            {skill.name}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Other Settings */}
                    <section>
                        <h4 className="text-base font-semibold text-gray-900 mb-4 border-b pb-2">その他の設定</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="region" className="block text-sm font-medium text-gray-700">地域</label>
                                <select
                                    id="region"
                                    name="region"
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    {regions.map((region) => (
                                        <option key={region.value} value={region.value}>{region.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="generation" className="block text-sm font-medium text-gray-700">世代</label>
                                <select
                                    id="generation"
                                    name="generation"
                                    value={selectedGeneration}
                                    onChange={(e) => setSelectedGeneration(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    {generations.map((gen) => (
                                        <option key={gen.value} value={gen.value}>{gen.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Message Area */}
                    {message && (
                        <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {message.type === 'success' ? (
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                        {message.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto w-full"
                        >
                            <Save className="h-5 w-5 mr-2 text-gray-500" />
                            保存する
                        </button>
                        <button
                            type="button"
                            onClick={handleStartMatching}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto w-full"
                        >
                            <Play className="h-5 w-5 mr-2" />
                            マッチング開始
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
