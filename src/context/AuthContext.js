import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const API_BASE_URL = "http://localhost:3001";
  
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  
  // ✅ Dynamic isLoggedIn state
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Sync isLoggedIn when token changes
  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  const login = (authData) => {
    localStorage.setItem("user", JSON.stringify(authData.user));
    localStorage.setItem("token", authData.token);
    setUser(authData.user);
    setToken(authData.token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    localStorage.clear();
  };

  // ✅ FIXED: Update Profile Pic
  const updateProfilePic = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/update-pic`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        // Hum check kar rahe hain ke user object ke andar profile property hai ya nahi
        // Aur result.profilePic woh path hai jo humne controller se bheja hai
        const updatedUser = { 
          ...user, 
          profile: { 
            ...(user?.profile || {}), 
            profilePic: result.profilePic 
          } 
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return result;
      }
      return result;
    } catch (err) { 
      console.error("Context Update Error:", err); 
      return { success: false, message: "Server error" };
    }
  };

  // ✅ FIXED: Update Profile Data
  const updateProfileData = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/update-data`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const updatedUser = { 
          ...user, 
          profile: { 
            ...(user?.profile || {}), 
            ...result.profile 
          } 
        };
        
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return result;
      }
      return result;
    } catch (err) { 
      console.error("Context Update Error:", err);
      return { success: false, message: "Server error" };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoggedIn, 
      login, 
      logout, 
      updateProfilePic, 
      updateProfileData 
    }}>
      {children}
    </AuthContext.Provider>
  );
}