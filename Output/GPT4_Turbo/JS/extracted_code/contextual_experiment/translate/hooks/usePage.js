import { useContext, useEffect, useState } from 'react';
import { PageContext } from '../contexts/PageContext';
import apiService from '../services/apiService';

const usePage = (pageId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { page, setPage } = useContext(PageContext);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const data = await apiService.getContent(pageId);
        setPage(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPage();
    }
  }, [pageId, setPage]);

  return { page, setPage, loading, error };
};

export default usePage;