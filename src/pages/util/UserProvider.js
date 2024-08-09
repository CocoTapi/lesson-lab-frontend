import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

function UserProvider({ children }) {
    const [ userInfo, setUserInfo ] = useState({ user_id: null, user_name: null });
   

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;

