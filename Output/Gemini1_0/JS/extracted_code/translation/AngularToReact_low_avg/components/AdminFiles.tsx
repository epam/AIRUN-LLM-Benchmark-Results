import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminInfo } from '../features/adminPanelSlice';
import { AdminPanelState } from '../features/adminPanelSlice';

const AdminFiles = () => {
  const dispatch = useDispatch();
  const { admin, files } = useSelector((state: AdminPanelState) => state.adminPanel);

  const [selectedFile, setSelectedFile] = useState('');

  useEffect(() => {
    // Get latest official message from Cosmo
    fetch('http://www.cosmocms.org/message.php?dontcache=' + new Date().getTime())
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          dispatch(setAdminInfo({ showAdminPanel: true, active: true, sidebar: 'core/html/files.html' }));
        }
      });
  }, [dispatch]);

  return (
    <div className="admin-files">
      <div className="admin-files-header">
        <h1>Files</h1>
        <button className="admin-files-new" onClick={() => {}}>
          New
        </button>
      </div>
      <div className="admin-files-list">
        {files.map((file) => (
          <div className="admin-files-item" key={file.id}>
            <div className="admin-files-item-name">{file.name}</div>
            <div className="admin-files-item-actions">
              <button className="admin-files-item-edit" onClick={() => setSelectedFile(file.id)}>
                Edit
              </button>
              <button className="admin-files-item-delete" onClick={() => {}}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedFile && <div className="admin-files-edit">Edit file</div>}
    </div>
  );
};

export default AdminFiles;