import React from 'react';
import CardCreator from './CardCreator';
import TarotCreator from './Tarot';

const App = () => {
    const [mode, setMode] = React.useState('card');


    return (
        <>
            <div className="color-options" style={{ marginBottom: '20px' }}>
                    <button onClick={() => setMode('card')} className="color-button" style={{ marginRight: '10px' }}>
                        Karty
                    </button>
                    <button onClick={() => setMode('tarot')} className="color-button" style={{ marginRight: '10px' }}>
                        Tarot
                    </button>
                </div>
            {mode === 'card' ? <CardCreator /> : <TarotCreator />}
        </>
    );
};

export default App;
