import React, { useState, useContext, useEffect } from 'react';
import { PageContext } from '../../contexts/PageContext';
import { UserContext } from '../../contexts/UserContext';
import apiService from '../../services/apiService';
import './PageEditor.css';

const PageEditor = () => {
  const { page, setPage } = useContext(PageContext);
  const { user } = useContext(UserContext);
  const [newVersion, setNewVersion] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Check for unsaved changes
    const unsavedChanges = Object.keys(page).some(key => localStorage.getItem(key) !== null && localStorage.getItem(key) !== page[key]);
    setNewVersion(unsavedChanges);
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPage(prev => ({ ...prev, [name]: value }));
  };

  const savePage = async () => {
    try {
      if (page.id) {
        await apiService.updatePage(page.id, page);
        alert('Page updated successfully');
      } else {
        const newPage = await apiService.createPage({ ...page, author: user.id });
        setPage(newPage);
        alert('Page created successfully');
      }
    } catch (error) {
      alert('Failed to save page');
    }
  };

  const deletePage = async () => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await apiService.deletePage(page.id);
        setPage({});
        alert('Page deleted successfully');
      } catch (error) {
        alert('Failed to delete page');
      }
    }
  };

  const revertToLocalVersion = () => {
    const localPage = Object.keys(page).reduce((acc, key) => {
      const item = localStorage.getItem(key);
      if (item) {
        acc[key] = item;
      }
      return acc;
    }, {});
    setPage(localPage);
    setNewVersion(false);
  };

  const discardLocalVersion = () => {
    Object.keys(page).forEach(key => {
      localStorage.removeItem(key);
    });
    setNewVersion(false);
  };

  return (
    <div className="page-editor">
      {newVersion && (
        <div className="new-version-notice">
          <p>A newer version of this page was found in local storage.</p>
          <button onClick={revertToLocalVersion}>Use Local Version</button>
          <button onClick={discardLocalVersion}>Discard Local Version</button>
        </div>
      )}
      <div className="form-group">
        <label>Title</label>
        <input type="text" name="title" value={page.title || ''} onChange={handleInputChange} />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea name="description" value={page.description || ''} onChange={handleInputChange}></textarea>
      </div>
      <div className="form-group">
        <label>URL</label>
        <input type="text" name="url" value={page.url || ''} onChange={handleInputChange} />
      </div>
      <div className="form-group">
        <label>Tags</label>
        <input type="text" name="tags" value={page.tags || ''} onChange={handleInputChange} />
      </div>
      <div className="actions">
        <button onClick={savePage}>Save Page</button>
        <button onClick={() => setConfirmDelete(true)}>Delete Page</button>
        {confirmDelete && (
          <div>
            <p>Confirm delete?</p>
            <button onClick={deletePage}>Yes</button>
            <button onClick={() => setConfirmDelete(false)}>No</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageEditor;