const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let snippets = []; // This should be replaced with your database logic

// Endpoint to delete a snippet
app.delete('/api/snippets/:id', (req, res) => {
    const { id } = req.params;
    // Check if the user is authorized (implement your own logic)
    if (req.headers.authorization !== 'Bearer !6_-T3#}<QoxAY£Kybh9') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    
    snippets = snippets.filter(snippet => snippet.id !== id);
    res.status(200).json({ message: 'Snippet deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 