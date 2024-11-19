import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import './CardCreator.css';

const CardCreator = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [stats, setStats] = useState('');
    const [type, setType] = useState('');
    const [cost, setCost] = useState('');
    const [image, setImage] = useState('https://via.placeholder.com/400x250');
    const [color, setColor] = useState('transparent');

    const titleRef = useRef();

    const adjustFontSize = () => {
        const element = titleRef.current;
        if (!element) return;

        let fontSize = 32; // Startowa wielkość czcionki
        const maxWidth = element.offsetWidth;

        while (element.scrollWidth > maxWidth && fontSize > 8) {
            fontSize -= 1; // Zmniejsz czcionkę
            element.style.fontSize = `${fontSize}px`;
        }
    };

    useEffect(() => {
        adjustFontSize();
    }, [title]);

    const setCardColor = (color) => {
        setColor(color);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        for (let item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImage(e.target.result);
                };
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
            .catch((error) => {
                console.error('Błąd przy pobieraniu karty:', error);
            });
    };

    const resetCard = () =>{
        setTitle('');
        setDescription('');
        setStats('');
        setType('');
        setImage('https://via.placeholder.com/400x250');
        setColor('transparent');
    }

    return (
        <div onPaste={handlePaste} style={{ display: 'flex', gap: '20px', padding: '20px', outline: 'none' }} tabIndex="0">
            {/* Kontrolki */}
            <div className="controls" style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <input
                    type="text"
                    placeholder="Tytuł Karty"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <input
                    type="text"
                    placeholder="Opis Karty"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <input
                    type="text"
                    placeholder="Statystyki (opcjonalne)"
                    value={stats}
                    onChange={(e) => setStats(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <input
                    type="text"
                    placeholder="Typ Karty (opcjonalny)"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <input
                    type="text"
                    placeholder="Koszt (opcjonalny)"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />
                <div className="color-options" style={{ marginBottom: '20px' }}>
                    <button onClick={() => setCardColor('#800080')} className="color-button" style={{ marginRight: '10px' }}>
                        Pułaka
                    </button>
                    <button onClick={() => setCardColor('#008000')} className="color-button" style={{ marginRight: '10px' }}>
                        Zaklęcie
                    </button>
                    <button onClick={() => setCardColor('#FFFF00')} className="color-button">
                        Potwór
                    </button>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '10px' }} />
                <button onClick={downloadCard} style={{ marginBottom: '10px' }}>
                    Pobierz Kartę
                </button>
                <button onClick={resetCard} style={{ marginBottom: '10px' }}>
                    Reset
                </button>
            </div>

            {/* Podgląd karty */}
            <div className="card-container" id="cardContainer" style={{ position: 'relative', width: '496px', height: '693px' }}>
                <div
                    className="bottom-layer"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: color,
                        mask: 'url(bottom-border.png) center/contain',
                    }}
                ></div>
                <img
                    src="top-border.png"
                    alt="Górna Ramka"
                    className="top-layer"
                    style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2 }}
                />
                <div
                    className="card"
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: '20px',
                        borderRadius: '30px',
                        textAlign: 'center',
                        position: 'relative',
                        boxSizing: 'border-box',
                        zIndex: 3,
                        backgroundColor: 'transparent',
                    }}
                >
                    <div
                        ref={titleRef}
                        className="card-title"
                        style={{
                            fontSize: '32px',
                            marginBottom: '10px',
                            position: 'absolute',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '90%',
                            textAlign: 'center',
                            color: 'black',
                            textShadow:
                                '2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        }}
                    >
                        {title}
                    </div>
                    <img
                        src={image}
                        alt="Obrazek Karty"
                        className="card-image"
                        style={{
                            width: '400px',
                            height: '250px',
                            objectFit: 'fill',
                            marginBottom: '10px',
                            position: 'absolute',
                            top: '80px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            border: '5px solid black',
                        }}
                    />
                    <div
                        className="card-description"
                        style={{
                            fontSize: '1.4em',
                            marginBottom: '10px',
                            position: 'absolute',
                            top: '360px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '90%',
                            textAlign: 'center',
                            color: 'black',
                            textShadow:
                                '2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white',
                            fontWeight: 'bold',
                        }}
                    >
                        {description}
                    </div>
                    <div className="card-stats" style={{ fontSize: '1.2em', position: 'absolute', bottom: '30px', right: '40px' }}>
                        {stats}
                    </div>
                    {cost && (
                        <div className="card-stats" style={{ fontSize: '1.2em', position: 'absolute', bottom: '30px', right: '180px' }}>
                            Koszt: {cost}
                        </div>
                    )}

                    {type && (
                        <div
                            className="card-type"
                            style={{
                                fontSize: '1.2em',
                                position: 'absolute',
                                bottom: '30px',
                                left: '40px',
                                color: 'black',
                                textShadow:
                                    '2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white',
                                fontWeight: 'bold',
                            }}
                        >
                            {type}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardCreator;
