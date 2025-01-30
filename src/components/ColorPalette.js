import '../styles/ColorPalette.css';

function ColorPalette() {
  const colors = [
    // Row 1
    '#f9ebea', '#fdedec', '#f5eef8', '#f4ecf7', '#eaf2f8', '#ebf5fb', '#e8f8f5', '#e8f6f3', '#e9f7ef', '#eafaf1',
    '#fef9e7', '#fef5e7', '#fdf2e9', '#fbeee6', '#fdfefe', '#f8f9f9', '#f4f6f6', '#f2f4f4', '#ebedef', '#eaecee',
    
    // Row 2
    '#f2d7d5', '#fadbd8', '#ebdef0', '#e8daef', '#d4e6f1', '#d6eaf8', '#d1f2eb', '#d0ece7', '#d4efdf', '#d5f5e3',
    '#fcf3cf', '#fdebd0', '#fae5d3', '#f6ddcc', '#fbfcfc', '#f2f3f4', '#eaeded', '#e5e8e8', '#d6dbdf', '#d5d8dc',
    
    // Row 3
    '#e6b0aa', '#f5b7b1', '#d7bde2', '#d2b4de', '#a9cce3', '#aed6f1', '#a3e4d7', '#a2d9ce', '#a9dfbf', '#abebc6',
    '#f9e79f', '#fad7a0', '#f5cba7', '#edbb99', '#f7f9f9', '#e5e7e9', '#d5dbdb', '#ccd1d1', '#aeb6bf', '#abb2b9',
    
    // Row 4
    '#d98880', '#f1948a', '#c39bd3', '#bb8fce', '#7fb3d5', '#85c1e9', '#76d7c4', '#73c6b6', '#7dcea0', '#82e0aa',
    '#f7dc6f', '#f8c471', '#f0b27a', '#e59866', '#f4f6f7', '#d7dbdd', '#bfc9ca', '#b2babb', '#85929e', '#808b96',
    
    // Row 5
    '#cd6155', '#ec7063', '#af7ac5', '#a569bd', '#5499c7', '#5dade2', '#48c9b0', '#45b39d', '#52be80', '#58d68d',
    '#f4d03f', '#f5b041', '#eb984e', '#dc7633', '#f0f3f4', '#cacfd2', '#aab7b8', '#99a3a4', '#5d6d7e', '#566573',
    
    // Row 6
    '#c0392b', '#e74c3c', '#9b59b6', '#8e44ad', '#2980b9', '#3498db', '#1abc9c', '#16a085', '#27ae60', '#2ecc71',
    '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d', '#34495e', '#2c3e50',
    
    // Row 7
    '#a93226', '#cb4335', '#884ea0', '#7d3c98', '#2471a3', '#2e86c1', '#17a589', '#138d75', '#229954', '#28b463',
    '#d4ac0d', '#d68910', '#ca6f1e', '#ba4a00', '#d0d3d4', '#a6acaf', '#839192', '#707b7c', '#2e4053', '#273746',
    
    // Row 8
    '#922b21', '#b03a2e', '#76448a', '#6c3483', '#1f618d', '#2874a6', '#148f77', '#117a65', '#1e8449', '#239b56',
    '#b7950b', '#b9770e', '#af601a', '#a04000', '#b3b6b7', '#909497', '#717d7e', '#616a6b', '#283747', '#212f3d',
    
    // Row 9
    '#7b241c', '#943126', '#633974', '#5b2c6f', '#1a5276', '#21618c', '#117864', '#0e6655', '#196f3d', '#1d8348',
    '#9a7d0a', '#9c640c', '#935116', '#873600', '#979a9a', '#797d7f', '#5f6a6a', '#515a5a', '#212f3c', '#1c2833',
    
    // Row 10
    '#641e16', '#78281f', '#512e5f', '#4a235a', '#154360', '#1b4f72', '#0e6251', '#0b5345', '#145a32', '#186a3b',
    '#7d6608', '#7e5109', '#784212', '#6e2c00', '#7b7d7d', '#626567', '#4d5656', '#424949', '#1b2631', '#17202a'
  ];

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <div className="palette-container">
      <h1>Colour Palette</h1>
      <p className="subtitle">Click any color to copy its hex code</p>

      <div className="color-palette">
        {colors.map((color, index) => (
          <div
            key={index}
            className="color-item"
            style={{ backgroundColor: color }}
            onClick={() => copyColor(color)}
          >
            <span className="color-tooltip">{color}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ColorPalette; 