import React, { createContext, useState } from "react";
export const LoginContext = createContext(null);
const ContextProvider = ({ children }) => {
  const [account, setaccount] = useState("");
  return (
    <div>
      <LoginContext.Provider value={{ account, setaccount }}>
        {children}
      </LoginContext.Provider>
    </div>
  );
};

export default ContextProvider;
