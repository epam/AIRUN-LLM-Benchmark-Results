import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../features/users/userSlice';
import axios from 'axios';
import { RootState } from '../app/store';

const AdminPanel: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [adminPanel, setAdminPanel] = useState({
    showAdminPanel: false,
    active: false,
    sidebar: 'core/html/sidebar.html',
    message: '',
    displayMessage: false,
  });

  useEffect(() => {
    if (user.id) {
      axios.get(`api/users/${user.id}`).then((response) => {
        dispatch(setUser(response.data));
      });
    }
  }, [user.id, dispatch]);

  const logout = () => {
    dispatch(clearUser());
    // Additional logout logic here
  };

  // Additional component logic here

  return (
    <div>
      {/* Admin Panel UI here */}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminPanel;