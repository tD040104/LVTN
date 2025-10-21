import React from 'react';

const AuthContext = React.createContext({
  user: null,
  isLoggedIn: false,
  showAuth: false,
  setShowAuth: () => {},
  setUser: () => {},
  setIsLoggedIn: () => {}
  , theme: 'light',
  setTheme: () => {}
});

export default AuthContext;
