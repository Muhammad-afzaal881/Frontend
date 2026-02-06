import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  function logout() {
    localStorage.removeItem("token"); // JWT remove
    setUser(null); // Context clear
  }

 useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    fetch("https://backend-code-production-9f20.up.railway.app/profile", { // ✅ Correct URL
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }
}, []);


  return (
    <UserContext.Provider value={{ user, setUser,logout }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
