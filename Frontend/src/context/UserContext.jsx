import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  
  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setUser(null);
      }
    } catch (err) {
      console.error('Erreur déconnexion', err);
    }
  };

  
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, fetchUser, logout, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}


export function useUser() {
  return useContext(UserContext);
}
