import { useState } from 'react';
import '../styles/GradientGenerator.css';

function GradientGenerator() {
  const [startColor, setStartColor] = useState('#82e0aa');
  const [endColor, setEndColor] = useState('#17202a');
  const [steps, setSteps] = useState(5);
  const [gradient, setGradient] = useState([]);

  const interpolateColor = (color1, color2, factor) => {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const generateGradient = () => {
    const colors = [];
    const validSteps = Math.min(30, Math.max(1, steps)); // Clamp steps between 1 and 30
    for (let i = 0; i <= validSteps + 1; i++) {
      const factor = i / (validSteps + 1);
      colors.push(interpolateColor(startColor, endColor, factor));
    }
    setGradient(colors);
  };

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <div className="gradient-container">
      <h1>Colour Gradient Generator</h1>
      <p className="subtitle">Generate smooth color transitions the max steps is 30 and bigger number will just output 30</p>
      
      <div className="controls">
        <div className="color-inputs">
          <div className="inputs-group">
            <div className="color-input">
              <label>Start Color</label>
              <input 
                type="color" 
                value={startColor}
                onChange={(e) => setStartColor(e.target.value)}
              />
              <input 
                type="text" 
                value={startColor}
                onChange={(e) => setStartColor(e.target.value)}
              />
            </div>
            
            <div className="color-input">
              <label>End Color</label>
              <input 
                type="color" 
                value={endColor}
                onChange={(e) => setEndColor(e.target.value)}
              />
              <input 
                type="text" 
                value={endColor}
                onChange={(e) => setEndColor(e.target.value)}
              />
            </div>

            <div className="steps-input">
              <label>Steps</label>
              <input 
                type="number" 
                min="1" 
                max="30"
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
        
        <button className="generate-button" onClick={generateGradient}>
          Generate Gradient
        </button>
      </div>

      {gradient.length > 0 && (
        <div className="gradient-result">
          <div className="gradient-preview" style={{
            background: `linear-gradient(to right, ${gradient.join(', ')})`
          }}></div>
          
          <div className="color-squares">
            {gradient.map((color, index) => (
              <div 
                key={index} 
                className="color-square"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color)}
              >
                <span className="color-value">{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GradientGenerator; 