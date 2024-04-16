import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserInfoFromToken, getAuthToken } from './checkAuth';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

function UserProvider({ children }) {
    const [ userInfo, setUserInfo ] = useState({ user_id: null, user_name: null });
    const token = getAuthToken();

    //if user has a valid token but refreshes a page
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token && token !== 'EXPIRED' && (!userInfo.user_id || !userInfo.user_name)) {
                try {
                    const userInfoFromToken = await getUserInfoFromToken(token);
                    setUserInfo(userInfoFromToken);
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            }
        };

        fetchUserInfo();
    }, [token, userInfo.user_id, userInfo.user_name]);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;

