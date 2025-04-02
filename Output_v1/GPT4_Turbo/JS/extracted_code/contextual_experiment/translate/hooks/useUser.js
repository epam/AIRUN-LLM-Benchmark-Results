import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import apiService from '../services/apiService';

const useUser = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await apiService.getUsers(userId);
        setUser(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, setUser]);

  return { user, setUser, loading, error };
};

export default useUser;