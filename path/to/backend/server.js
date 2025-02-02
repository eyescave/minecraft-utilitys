const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let snippets = []; // This should be replaced with your database logic
const VALID_PASSWORD = 'your_secure_password'; // Set your secure password here

// Endpoint to validate password
app.post('/api/validate-password', (req, res) => {
    const { password } = req.body;
    if (password === VALID_PASSWORD) {
        return res.status(200).json({ message: 'Password is valid' });
    }
    return res.status(403).json({ message: 'Invalid password' });
});

// Endpoint to delete a snippet
app.delete('/api/snippets/:id', (req, res) => {
    const { id } = req.params;
    // Check if the user is authorized (implement your own logic)
    if (req.headers.authorization !== 'Bearer YOUR_SECRET_TOKEN') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    
    snippets = snippets.filter(snippet => snippet.id !== id);
    res.status(200).json({ message: 'Snippet deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 