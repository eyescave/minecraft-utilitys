import './App.css';
import { useState } from 'react';
import GradientGenerator from './components/GradientGenerator';
import ColorPalette from './components/ColorPalette';

function App() {
  const [currentPage, setCurrentPage] = useState('converter');
  const [inputText, setInputText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const convertText = (text) => {
    const normalChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const smallCapsChars = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀѕᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀѕᴛᴜᴠᴡxʏᴢ';
    
    return text.split('').map(char => {
      const index = normalChars.indexOf(char);
      return index !== -1 ? smallCapsChars[index] : char;
    }).join('');
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);
    setConvertedText(convertText(newText));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedText);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'converter':
        return (
          <div className="converter-container">
            <h1>Small Text Converter</h1>
            <p className="subtitle">Convert into ꜱᴍᴀʟʟ ᴛᴇxᴛ seen on servers on eyes hub.</p>
            <div className="text-container">
              <div className="input-section">
                <h2>Input</h2>
                <textarea
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Type your text here..."
                />
              </div>
              <div className="output-section">
                <h2>SMALL TEXT</h2>
                <textarea
                  value={convertedText}
                  readOnly
                  placeholder="Converted text will appear here..."
                />
                <button onClick={handleCopy}>Copy</button>
              </div>
            </div>
          </div>
        );
      case 'gradient':
        return <GradientGenerator />;
      case 'palette':
        return <ColorPalette />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-left">
          <img src='%PUBLIC_URL%/logo.png' alt="Planet Logo" className="logo" />
        </div>
        <div className="nav-right">
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'converter' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('converter');
            }}
          >
            Text Converter
          </a>
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'gradient' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('gradient');
            }}
          >
            Colour Gradient Creator
          </a>
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'palette' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('palette');
            }}
          >
            Colour Palette
          </a>
        </div>
      </nav>
      {renderPage()}
      {showCopySuccess && <div className="copy-success">Copied successfully!</div>}
    </div>
  );
}

export default App;
