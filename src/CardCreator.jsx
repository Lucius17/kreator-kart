import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';

const CardCreator = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [stats, setStats] = useState('');
    const [type, setType] = useState('');
    const [cost, setCost] = useState('');
    const [image, setImage] = useState('https://via.placeholder.com/400x250');
    const [color, setColor] = useState('#FFFF00');
    const [arrows, setArrows] = useState({
        top: false,
        topRight: false,
        right: false,
        bottomRight: false,
        bottom: false,
        bottomLeft: false,
        left: false,
        topLeft: false
    });
    const [isDark, setIsDark] = useState(true);

    const titleRef = useRef();

    // Custom SVG Arrow Component
    const ArrowIcon = ({ direction, isActive }) => {
        const rotationMap = {
            top: 0,
            right: 90,
            bottom: 180,
            left: 270,
            topRight: 45,
            bottomRight: 135,
            bottomLeft: 225,
            topLeft: 315
        };

        return (
            <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                style={{
                    transform: `rotate(${rotationMap[direction]}deg)`,
                    transition: 'all 0.3s ease',
                    opacity: isActive ? 1 : 0.5
                }}
            >
                <path
                    d="M12 2L12 22M12 2L22 12M12 2L2 12"
                    stroke={isActive ? "#ff0000" : "#666"}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>
        );
    };

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

    const Arrow = ({ direction }) => {
        const positionClasses = {
            top: 'top-5 left-1/2 -translate-x-1/2',       // Dodano top-2
            topRight: 'top-5 right-5',                    // Dodano top-2 i right-2
            right: 'top-1/2 right-7 -translate-y-1/2',    // Dodano right-2
            bottomRight: 'bottom-5 right-5',              // Dodano bottom-2 i right-2
            bottom: 'bottom-5 left-1/2 -translate-x-1/2', // Dodano bottom-2
            bottomLeft: 'bottom-5 left-5',                // Dodano bottom-2 i left-2
            left: 'top-1/2 left-5 -translate-y-1/2',      // Dodano left-2
            topLeft: 'top-5 left-5'                       // Dodano top-2 i left-2
        };
        if (!arrows[direction]) return null;
    
        return (
            <div
                className={`absolute cursor-pointer z-40 ${positionClasses[direction]}`}
                onClick={() => handleArrowClick(direction)}
            >
                <ArrowIcon direction={direction} isActive={arrows[direction]} />
            </div>
        );
    };

    const setCardColor = (color) => setColor(color);

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
        setDescription('');
        setStats('');
        setType('');
        setCost('');
        setImage('https://via.placeholder.com/400x250');
        setColor('#FFFF00');
        setArrows({
            top: false,
            topRight: false,
            right: false,
            bottomRight: false,
            bottom: false,
            bottomLeft: false,
            left: false,
            topLeft: false
        });
    };

    const textStyle = {
        fontFamily: "'Comic Sans MS', cursive",
        color: 'white',
        textShadow: `
            -1px -1px 0 #000,
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000,
            0 2px 2px rgba(0,0,0,0.5)`
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
                        <input
                            type="text"
                            placeholder="Opis Karty"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                            type="text"
                            placeholder="Statystyki"
                            value={stats}
                            onChange={(e) => setStats(e.target.value)}
                            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                            type="text"
                            placeholder="Typ Karty"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                            type="text"
                            placeholder="Koszt"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4"
                        />

                        <div className="mb-4">
                            <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Kolor karty</h3>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setCardColor('#800080')}
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                                >
                                    Pułaka
                                </button>
                                <button
                                    onClick={() => setCardColor('#008000')}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                    Zaklęcie
                                </button>
                                <button
                                    onClick={() => setCardColor('#FFFF00')}
                                    className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors"
                                >
                                    Potwór
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Strzałki</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {['topLeft', 'top', 'topRight', 'left', '', 'right', 'bottomLeft', 'bottom', 'bottomRight'].map((dir) => 
                                    dir ? (
                                        <button
                                            key={dir}
                                            onClick={() => handleArrowClick(dir)}
                                            className={`p-2 rounded-lg ${arrows[dir] ? 'bg-red-500' : 'bg-gray-100 dark:bg-gray-700'} hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
                                        >
                                            <ArrowIcon direction={dir} isActive={arrows[dir]} />
                                        </button>
                                    ) : <div key="center" className="p-2" />
                                )}
                            </div>
                        </div>

                        <label className="mb-4">
                            <span className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Obrazek</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600"
                            />
                        </label>

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
                        {Object.keys(arrows).map(direction => (
                            <Arrow key={direction} direction={direction} />
                        ))}

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
                                className="absolute top-5 left-1/2 -translate-x-1/2 w-[90%] text-center"
                                style={textStyle}
                            >
                                {title}
                            </div>

                            <img
                                src={image}
                                alt="Obrazek Karty"
                                className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[250px] object-cover border-4 border-black rounded-lg"
                            />

                            <div
                                className="absolute top-[360px] left-1/2 -translate-x-1/2 w-[90%] text-center text-xl"
                                style={textStyle}
                            >
                                {description}
                            </div>

                            <div className="absolute bottom-7 right-10 text-lg font-semibold" style={textStyle}>
                                {stats}
                            </div>

                            {cost && (
                                <div className="absolute bottom-7 right-44 text-lg font-semibold" style={textStyle}>
                                    Koszt: {cost}
                                </div>
                            )}

                            {type && (
                                <div className="absolute bottom-7 left-10 text-lg font-bold" style={textStyle}>
                                    {type}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardCreator;