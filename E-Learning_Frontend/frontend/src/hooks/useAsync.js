import { useCallback, useState } from 'react';

export function useAsync(asyncFn, initialValue = null) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError('');
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  return { data, setData, loading, error, setError, run };
}
