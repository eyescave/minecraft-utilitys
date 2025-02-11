const express = require('express');
const bodyParser = require('body-parser');
const { saveSnippets } = require('./utils/snippetsAPI');

const app = express();
app.use(bodyParser.json());

const VALID_PASSWORD = '!6_-T3#}<QoxAY£Kybh9'; // Store this securely in environment variables

// Endpoint to delete a snippet
app.delete('/api/snippets/:id', (req, res) => {
    const { id } = req.params;
    const { password } = req.body; // Expect password in the request body

    if (password !== VALID_PASSWORD) {
        return res.status(403).json({ message: 'Invalid password' });
    }

    // Logic to delete the snippet from your data source
    // Assuming you have a function to get and save snippets
    const snippets = getSnippets(); // Fetch current snippets
    const updatedSnippets = snippets.filter(snippet => snippet.id !== id);
    
    saveSnippets(updatedSnippets); // Save updated snippets
    return res.status(200).json({ message: 'Snippet deleted successfully' });
});

// Other routes...

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 