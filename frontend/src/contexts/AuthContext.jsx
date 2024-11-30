import  { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const updateRole = (newRole) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem('role', newRole);
    } else {
      localStorage.removeItem('role');
    }
  };

  const isAdmin = role === 'admin' || role === 'super_admin';

  return (
    <AuthContext.Provider value={{ role, updateRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth =()=>useContext(AuthContext)
export default useAuth;