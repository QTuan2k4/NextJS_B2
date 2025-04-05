'use client';

import { useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
    };

    const debounce = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm kiếm user bằng email..."
        style={styles.input}
      />
      {loading && <p style={styles.loading}>Đang tải...</p>}
      {results.length > 0 && (
        <ul style={styles.resultsList}>
          {results.map((user) => (
            <li key={user.id} style={styles.resultItem}>
              <span style={styles.email}>{user.email}</span> -{' '}
              <span style={styles.role}>{user.role}</span>{' '}
              <span style={styles.date}>
                (Tạo: {new Date(user.created_at).toLocaleDateString()})
              </span>
            </li>
          ))}
        </ul>
      )}
      {query && !loading && results.length === 0 && (
        <p style={styles.noResults}>Không tìm thấy user nào.</p>
      )}
    </div>
  );
}

// CSS styles object
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  loading: {
    marginTop: '10px',
    color: '#888',
    fontStyle: 'italic',
  },
  resultsList: {
    listStyle: 'none',
    padding: 0,
    marginTop: '20px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  resultItem: {
    padding: '10px 15px',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
    color: '#333',
  },
  email: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  role: {
    color: '#2980b9',
  },
  date: {
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  noResults: {
    marginTop: '10px',
    color: '#e74c3c',
    fontStyle: 'italic',
  },
};