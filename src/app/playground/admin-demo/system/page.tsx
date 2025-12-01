
import { systemLogs } from '../data';
import { Terminal, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function AdminSystemPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">システム設定 & ログ</h1>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800">
                    システム設定を編集
                </button>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden text-gray-300 font-mono text-sm">
                <div className="p-4 border-b border-gray-800 flex items-center">
                    <Terminal className="h-4 w-4 mr-2" />
                    System Logs
                </div>
                <div className="divide-y divide-gray-800">
                    {systemLogs.map((log) => (
                        <div key={log.id} className="p-4 flex items-start hover:bg-gray-800 transition-colors">
                            <div className="mr-4 mt-0.5">
                                {log.level === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                                {log.level === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                                {log.level === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                                {log.level === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`uppercase text-xs font-bold ${log.level === 'error' ? 'text-red-500' :
                                            log.level === 'warning' ? 'text-yellow-500' :
                                                log.level === 'success' ? 'text-green-500' :
                                                    'text-blue-500'
                                        }`}>
                                        [{log.level}]
                                    </span>
                                    <span className="text-gray-500 text-xs">{log.timestamp}</span>
                                </div>
                                <p>{log.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
