import React, {
  createContext,
  useContext,
  useState,
} from "react";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  // ================= TOKEN =================

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });


  // ================= USER =================

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {

      try {
        return JSON.parse(savedUser);
      } catch (error) {
        return null;
      }

    }

    return null;

  });


  // ================= LOGIN =================

  const login = (userData, jwtToken) => {

    // React state
    setUser(userData);
    setToken(jwtToken);


    // Save token
    localStorage.setItem(
      "token",
      jwtToken
    );


    // Save user data
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

  };


  // ================= LOGOUT =================

  const logout = () => {

    // Clear React state
    setUser(null);
    setToken(null);


    // Remove localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

  };


  // ================= AUTH STATUS =================

  const isAuthenticated =
    Boolean(token);


  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};


// ================= USE AUTH =================

export const useAuth = () => {

  return useContext(AuthContext);

};


export default AuthContext;