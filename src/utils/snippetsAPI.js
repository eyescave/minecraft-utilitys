const BIN_ID = '679e0a2cacd3cb34a8d67e73'; // You'll get this after creating a bin
const API_KEY = '$2a$10$o2grY1NvGDGnusLDMO7WuOhzCOV9MTcmT5k.WDGeMM1auyKAI6Uke'; // Get this from JSONBin.io
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

export const fetchSnippets = async () => {
  try {
    const response = await fetch(JSONBIN_URL, {
      method: 'GET',
      headers: {
        'X-Master-Key': API_KEY
      }
    });
    const data = await response.json();
    return data.record.snippets || [];
  } catch (error) {
    console.error('Error fetching snippets:', error);
    // Fallback to localStorage if fetch fails
    const localSnippets = localStorage.getItem('skriptSnippets');
    return localSnippets ? JSON.parse(localSnippets) : [];
  }
};

export const saveSnippets = async (snippets) => {
  try {
    // Save to JSONBin
    await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify({ snippets })
    });
    
    // Also save to localStorage as backup
    localStorage.setItem('skriptSnippets', JSON.stringify(snippets));
  } catch (error) {
    console.error('Error saving snippets:', error);
    // At least save to localStorage if JSONBin fails
    localStorage.setItem('skriptSnippets', JSON.stringify(snippets));
  }
}; 