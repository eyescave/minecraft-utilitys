const BIN_ID = '679e0a2cacd3cb34a8d67e73'; // You'll get this after creating a bin
const API_KEY = '$2a$10$PvDAlZlOuGGbTAymGh8OOuDPZw4y1eEQaNv6RsPPomSB.yO.JgjXO'; // Get this from JSONBin.io
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Add a debounce timer
let saveTimer = null;

export const fetchSnippets = async () => {
  try {
    const response = await fetch(JSONBIN_URL, {
      method: 'GET',
      headers: {
        'X-Master-Key': API_KEY
      }
    });
    const data = await response.json();
    const fetchedSnippets = data.record.snippets || [];
    
    // Compare with local snippets and merge if necessary
    const localSnippets = localStorage.getItem('skriptSnippets');
    const parsedLocalSnippets = localSnippets ? JSON.parse(localSnippets) : [];
    
    // Merge snippets, keeping the most recent version of each snippet
    const mergedSnippets = mergeSnippets(fetchedSnippets, parsedLocalSnippets);
    
    // If we have local snippets that aren't in the fetched data, save the merged result
    if (mergedSnippets.length > fetchedSnippets.length) {
      await saveSnippets(mergedSnippets);
    }
    
    return mergedSnippets;
  } catch (error) {
    console.error('Error fetching snippets:', error);
    // Fallback to localStorage if fetch fails
    const localSnippets = localStorage.getItem('skriptSnippets');
    return localSnippets ? JSON.parse(localSnippets) : [];
  }
};

// Helper function to merge snippets arrays
const mergeSnippets = (remote, local) => {
  const snippetMap = new Map();
  
  // Add all remote snippets to the map
  remote.forEach(snippet => {
    snippetMap.set(snippet.id, snippet);
  });
  
  // Add local snippets if they don't exist in remote or are newer
  local.forEach(snippet => {
    const existingSnippet = snippetMap.get(snippet.id);
    if (!existingSnippet || snippet.createdAt > existingSnippet.createdAt) {
      snippetMap.set(snippet.id, snippet);
    }
  });
  
  return Array.from(snippetMap.values())
    .sort((a, b) => b.createdAt - a.createdAt);
};

export const saveSnippets = async (snippets) => {
  // Save to localStorage immediately
  localStorage.setItem('skriptSnippets', JSON.stringify(snippets));
  
  // Clear existing timer
  if (saveTimer) {
    clearTimeout(saveTimer);
  }
  
  // Set new timer for JSONBin save
  saveTimer = setTimeout(async () => {
    try {
      await fetch(JSONBIN_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify({ snippets })
      });
    } catch (error) {
      console.error('Error saving snippets to JSONBin:', error);
    }
  }, 1000); // Wait 1 second before saving to JSONBin
}; 