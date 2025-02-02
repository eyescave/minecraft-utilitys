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


  // Modify the handleRefresh function
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

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchTerm) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );

  const handleCopy = useCallback((code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
  }, []);

  const getCodePreview = useCallback((code) => {
    const lines = code.split('\n');
    if (lines.length <= 3) return code;
    return lines.slice(0, 3).join('\n') + '\n...';
  }, []);

  // Sort snippets by creation date (newest first)
  const sortedSnippets = [...filteredSnippets].sort((a, b) => b.createdAt - a.createdAt);

  const handleDelete = async (id) => {
    try {
        const response = await fetch(`/api/snippets/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_SECRET_TOKEN' // Use your secret token
            }
        });
        if (response.ok) {
            setSnippets(snippets.filter(snippet => snippet.id !== id));
        } else {
            console.error('Failed to delete snippet');
        }
    } catch (error) {
        console.error('Error deleting snippet:', error);
    }
  };

  return (
    <div className="snippets-container">
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
              onClick={(e) => handleCopy(selectedSnippet.code, e)}
            >
              Copy Code
            </button>
          </div>
          <div className="snippet-date">
            Added: {new Date(selectedSnippet.createdAt).toLocaleDateString()}
          </div>
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
                    onClick={(e) => handleCopy(snippet.code, e)}
                  >
                    Copy Code
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(snippet.id);
                    }}
                  >
                    Delete Snippet
                  </button>
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