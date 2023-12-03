import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [token, setToken] = useState("token");
  const [user, setuser] = useState("user");
  const [refreshToken, setRefreshToken] = useState("refreshToken");
  const [loggedIn, setLoggedIn] = useState("loggedIn");

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        user,
        setuser,
        refreshToken,
        setRefreshToken,
        loggedIn,
        setLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(UserContext);
};

export default UserProvider;
