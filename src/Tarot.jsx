import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';

const TarotCreator = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('https://via.placeholder.com/400x550');
    const [color, setColor] = useState('#FFFFFF');
    const [imageFit, setImageFit] = useState('fill'); // 'fill', 'contain' lub 'cover'
    const [isDark, setIsDark] = useState(true);
    const titleRef = useRef();

    const adjustFontSize = () => {
        const element = titleRef.current;
        if (!element) return;
        let fontSize = 32;
        const maxWidth = element.offsetWidth;
        while (element.scrollWidth > maxWidth && fontSize > 8) {
            fontSize -= 1;
            element.style.fontSize = `${fontSize}px`;
        }
    };

    useEffect(() => { adjustFontSize(); }, [title]);

    const handleArrowClick = (direction) => {
        setArrows(prev => ({...prev, [direction]: !prev[direction]}));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        for (let item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (e) => setImage(e.target.result);
                reader.readAsDataURL(file);
                break;
            }
        }
    };

    const downloadCard = () => {
        const cardContainer = document.getElementById('cardContainer');
        toPng(cardContainer)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'karta.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((error) => console.error('Błąd przy pobieraniu karty:', error));
    };

    const resetCard = () => {
        setTitle('');
        setImage('https://via.placeholder.com/400x550');
        setColor('#FFFFFF');
        setImageFit('cover');
    };

    const textStyle = {
        fontFamily: "'Comic Sans MS', cursive",
        color: 'black',
        fontSize: '20px',
        
    };

    return (
        <div className={`min-h-screen p-8 flex items-center justify-center ${isDark ? 'dark' : ''}`}>
            <div className={`${isDark ? 'dark:bg-gray-900' : 'bg-gray-50'} min-h-screen w-full`}>
                <div onPaste={handlePaste} className="flex gap-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mx-auto max-w-7xl">
                    
                    <button 
                        onClick={() => setIsDark(!isDark)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        {isDark ? '🌞' : '🌙'}
                    </button>

                    <div className="flex flex-col w-72 gap-4">
                        <input
                            type="text"
                            placeholder="Tytuł Karty"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />

                        

                        <label className="mb-4">
                            <span className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Obrazek</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600"
                            />
                        </label>
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Styl obrazka</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setImageFit('fill')}
                                    className={`px-3 py-1 rounded ${imageFit === 'fill' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    Wypełnij
                                </button>
                                <button
                                    onClick={() => setImageFit('contain')}
                                    className={`px-3 py-1 rounded ${imageFit === 'contain' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    Dopasuj
                                </button>
                                <button
                                    onClick={() => setImageFit('cover')}
                                    className={`px-3 py-1 rounded ${imageFit === 'cover' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    Przytnij
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-auto">
                            <button
                                onClick={downloadCard}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Pobierz Kartę
                            </button>
                            <button
                                onClick={resetCard}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                            >
                                Resetuj
                            </button>
                        </div>
                    </div>

                    <div id="cardContainer" className="relative w-[496px] h-[693px] bg-gray-100 dark:bg-gray-900 rounded-xl shadow-lg">
                        

                        <div
                            className="absolute inset-0"
                            style={{ 
                                backgroundColor: color,
                                mask: 'url(bottom-border.png) center/contain'
                            }}
                        />
                        
                        <img
                            src="top-border.png"
                            alt="Górna Ramka"
                            className="absolute inset-0 w-full h-full z-20 pointer-events-none"
                        />

                        <div className="relative h-full p-5 text-center z-30">
                            <div
                                ref={titleRef}
                                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] text-center"
                                style={textStyle}
                            >
                                {title}
                            </div>

                            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[550px] bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <img
                src={image}
                alt="Obrazek Karty"
                className={`w-full h-full ${
                    imageFit === 'cover' ? 'object-cover' : 
                    imageFit === 'contain' ? 'object-contain' : 
                    'object-fill'
                } bg-white`}
                style={{
                    objectFit: imageFit,
                    backgroundColor: 'white'
                }}
            />
                            </div>

                            

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TarotCreator;