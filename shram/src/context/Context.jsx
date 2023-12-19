import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [token, setToken] = useState("token");
  const [user, setUser] = useState("user");
  const [refreshToken, setRefreshToken] = useState("refreshToken");
  const [loggedIn, setLoggedIn] = useState("loggedIn");

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
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

// export const useAuth = () => {
//   return useContext(UserContext);
// };

export default UserProvider;
