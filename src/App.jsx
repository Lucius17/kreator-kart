// App.jsx
import React, { useState } from 'react';
import CardCreator from './CardCreator';
import TarotCreator from './Tarot';
import "./App.css"

const App = () => {
    const [mode, setMode] = useState('card');
    const [isDark, setIsDark] = useState(true);

    return (
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
            <div className="dark:bg-gray-900 min-h-screen p-4">
                {/* Kontrolki górne */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMode('card')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                mode === 'card' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                            }`}
                        >
                            Karty
                        </button>
                        <button
                            onClick={() => setMode('tarot')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                mode === 'tarot' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                            }`}
                        >
                            Tarot
                        </button>
                    </div>
                    
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        {isDark ? '🌞' : '🌙'}
                    </button>
                </div>

                {mode === 'card' ? <CardCreator /> : <TarotCreator />}
            </div>
        </div>
    );
};

export default App;