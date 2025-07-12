import React, { createContext, useState } from "react";

export const AuthContext = createContext(null);

function AuthContextProvider({ children }) {
  // state waarin de context data wordt geplaatst
  const [user, setUser] = useState(null);

  const login = (userDetails) => {
    setUser(userDetails);
  };

  const logout = () => {
    setUser(null);
  };

  const authContextObject = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextObject}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
