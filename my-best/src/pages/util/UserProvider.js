import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

function UserProvider({ children }) {
    const [ userInfo, setUser ] = useState({ user_id: 0, user_name: "testname" });
    const setUserInfo = (userInfo) => {
        setUser(userInfo);
    };
    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;

