const GIST_URL = 'YOUR_GIST_RAW_URL';

export const fetchSnippets = async () => {
  try {
    const response = await fetch(GIST_URL);
    const data = await response.json();
    return data.snippets || [];
  } catch (error) {
    console.error('Error fetching snippets:', error);
    return [];
  }
};

export const saveSnippets = async (snippets) => {
  // For now, we'll just save to localStorage as a fallback
  localStorage.setItem('skriptSnippets', JSON.stringify(snippets));
}; 