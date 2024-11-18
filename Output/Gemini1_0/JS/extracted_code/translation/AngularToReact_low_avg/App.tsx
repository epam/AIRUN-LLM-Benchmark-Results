import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminInfo, setOfficialMessage, setUserInfo } from './features/adminPanelSlice';
import { AdminPanelState } from './features/adminPanelSlice';
import AdminSidebar from './components/AdminSidebar';
import AdminMessage from './components/AdminMessage';
import AdminFiles from './components/AdminFiles';
import { nanoid } from 'nanoid';

const App = () => {
  const dispatch = useDispatch();
  const { admin, officialMessage, userInfo } = useSelector((state: AdminPanelState) => state.adminPanel);

  useEffect(() => {
    // Get latest official message from Cosmo
    fetch('http://www.cosmocms.org/message.php?dontcache=' + new Date().getTime())
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          dispatch(setOfficialMessage({ id: data.id, message: data.message }));
        }
      });

    // Get user's info
    if (userInfo.id) {
      fetch(`/api/users/${userInfo.id}`)
        .then((res) => res.json())
        .then((data) => {
          dispatch(setUserInfo(data));
        });
    }
  }, [dispatch, userInfo.id]);

  return (
    <div className="cosmo-default">
      <AdminSidebar />
      <div className="sidebar" style={{ display: admin.showAdminPanel ? 'block' : 'none' }}>
        {admin.sidebar === 'core/html/login.html' && <AdminMessage />}
        {admin.sidebar === 'core/html/files.html' && <AdminFiles />}
      </div>
      {officialMessage.displayMessage && (
        <div className="official-message">
          <div className="official-message-content" dangerouslySetInnerHTML={{ __html: officialMessage.message }} />
          <button className="official-message-close" onClick={() => dispatch(setOfficialMessage({ displayMessage: false }))}>
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default App;