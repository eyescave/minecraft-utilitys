import React, { useState, useEffect, useCallback } from 'react';
import '../styles/SkriptSnippets.css';
import { fetchSnippets, saveSnippets } from '../utils/snippetsAPI';

function SkriptSnippets() {
  const [snippets, setSnippets] = useState(() => {
    const savedSnippets = localStorage.getItem('skriptSnippets');
    return savedSnippets ? JSON.parse(savedSnippets) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [newSnippet, setNewSnippet] = useState({ title: '', code: '', tags: '' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [copySuccessMessage, setCopySuccessMessage] = useState('');

  const VALID_PASSWORD = '!6_-T3#}<QoxAY£Kybh9'; // Move the password to the frontend

  // Load initial snippets
  useEffect(() => {
    const loadSnippets = async () => {
      const fetchedSnippets = await fetchSnippets();
      if (fetchedSnippets.length > 0) {
        setSnippets(fetchedSnippets);
        saveSnippets(fetchedSnippets);
      }
    };
    loadSnippets();
  }, []);

  // Save snippets to localStorage whenever they change
  useEffect(() => {
    saveSnippets(snippets);
  }, [snippets]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date().getTime();
    const tagsArray = newSnippet.tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    const newSnippetWithMetadata = {
      id: timestamp,
      title: newSnippet.title,
      code: newSnippet.code,
      tags: tagsArray,
      createdAt: timestamp
    };
    
    const updatedSnippets = [...snippets, newSnippetWithMetadata];
    setSnippets(updatedSnippets);
    await saveSnippets(updatedSnippets);
    
    setNewSnippet({ title: '', code: '', tags: '' });
    setShowAddForm(false);
  };

  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent multiple refreshes
    
    setIsRefreshing(true);
    try {
      const fetchedSnippets = await fetchSnippets();
      setSnippets(fetchedSnippets);
    } catch (error) {
      console.error('Error refreshing snippets:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (id) => {
    if (password !== VALID_PASSWORD) {
      console.error('Invalid password');
      alert('Invalid password. Please try again.'); // Notify user of invalid password
      return;
    }

    // If password is valid, proceed to delete the snippet
    setSnippets(snippets.filter(snippet => snippet.id !== id));
    setShowPasswordInput(false);
    setPassword('');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchTerm) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );

  const handleCopy = useCallback(async (snippet, e) => {
    e.stopPropagation();
    
    // Check if the copy action is allowed
    if (snippet.copyDelay && Date.now() < snippet.copyDelay) {
        setCopyMessage('Please wait to register another copy.');
        setTimeout(() => setCopyMessage(''), 3000); // Clear message after 3 seconds
        return;
    }

    // Copy the code to clipboard
    await navigator.clipboard.writeText(snippet.code);
    
    // Update the copy count and set the delay
    const updatedSnippet = {
        ...snippet,
        copyCount: (snippet.copyCount || 0) + 1,
        copyDelay: Date.now() + 60000 // 1 minute delay
    };

    // Update snippets state
    setSnippets(snippets.map(s => s.id === snippet.id ? updatedSnippet : s));
    await saveSnippets(snippets.map(s => s.id === snippet.id ? updatedSnippet : s));

    // Set success message
    setCopySuccessMessage('Snippet copied successfully!');
    setTimeout(() => setCopySuccessMessage(''), 3000); // Clear message after 3 seconds
  }, [snippets]);

  const getCodePreview = useCallback((code) => {
    const lines = code.split('\n');
    if (lines.length <= 3) return code;
    return lines.slice(0, 3).join('\n') + '\n...';
  }, []);

  // Sort snippets by creation date (newest first)
  const sortedSnippets = [...filteredSnippets].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="snippets-container">
      {showSuccessMessage && (
        <div className="success-message">Snippet deleted successfully!</div>
      )}
      {copyMessage && (
        <div className="copy-message">{copyMessage}</div>
      )}
      {copySuccessMessage && (
        <div className="copy-success">{copySuccessMessage}</div>
      )}
      {selectedSnippet ? (
        <div className="full-snippet-view">
          <button 
            className="back-button"
            onClick={() => setSelectedSnippet(null)}
          >
            ← Back to Snippets
          </button>
          <h2>{selectedSnippet.title}</h2>
          <pre className="code-block full">
            <code>{selectedSnippet.code}</code>
          </pre>
          <div className="snippet-footer">
            <div className="tags">
              {selectedSnippet.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
            <button 
              className="copy-btn"
              onClick={(e) => handleCopy(selectedSnippet, e)}
            >
              Copy Code
            </button>
            <button 
              className="delete-btn"
              onClick={() => {
                setShowPasswordInput(true);
              }}
            >
              Delete Snippet
            </button>
          </div>
          <div className="snippet-date">
            Added: {new Date(selectedSnippet.createdAt).toLocaleDateString()}
          </div>
          {showPasswordInput && (
            <div className="password-input">
              <input
                type="password"
                placeholder="Enter password to delete"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={() => handleDelete(selectedSnippet.id)}>Confirm Delete</button>
              <button onClick={() => setShowPasswordInput(false)}>Cancel</button>
            </div>
          )}
        </div>
      ) : (
        <>
          <h1>Skript Snippets</h1>
          <p className="subtitle">Find and share useful Skript code snippets</p>
          
          <div className="snippets-controls">
            <input
              type="text"
              placeholder="Search snippets..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <button 
              className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              title="Refresh snippets"
              disabled={isRefreshing}
            >
              ↻
            </button>
            <button 
              className="add-snippet-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : 'Add Snippet'}
            </button>
          </div>

          {showAddForm && (
            <form className="add-snippet-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Snippet title"
                value={newSnippet.title}
                onChange={(e) => setNewSnippet({...newSnippet, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Paste your Skript code here..."
                value={newSnippet.code}
                onChange={(e) => setNewSnippet({...newSnippet, code: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={newSnippet.tags}
                onChange={(e) => setNewSnippet({...newSnippet, tags: e.target.value})}
              />
              <button type="submit">Submit Snippet</button>
            </form>
          )}

          <div className="snippets-grid">
            {sortedSnippets.map(snippet => (
              <div 
                key={snippet.id}
                className="snippet-card"
                onClick={() => setSelectedSnippet(snippet)}
              >
                <h3>{snippet.title}</h3>
                <pre className="code-block preview">
                  <code>{getCodePreview(snippet.code)}</code>
                </pre>
                <div className="snippet-footer">
                  <div className="tags">
                    {snippet.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                  <button 
                    className="copy-btn"
                    onClick={(e) => handleCopy(snippet, e)}
                  >
                    Copy Code
                  </button>
                  <span className="copy-count">{snippet.copyCount || 0} copies</span>
                </div>
                <div className="snippet-date">
                  {new Date(snippet.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SkriptSnippets; 