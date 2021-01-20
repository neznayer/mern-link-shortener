import { useState, useCallback, useEffect } from "react";

const storageName = "userData";

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [ready, setReady] = useState(false);
    const [userId, setUserId] = useState(null);

    const login = useCallback((jwtToken, id) => {
        // set state
        setToken(jwtToken);
        setUserId(id);
        // write to local storage
        localStorage.setItem(
            storageName,
            JSON.stringify({ userId: id, token: jwtToken })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem(storageName);
    }, []);

    // if there is Local storage , write automatically its token to state:

    useEffect(() => {
        //try to get local storage contents
        const data = JSON.parse(localStorage.getItem(storageName));
        if (data && data.token) {
            login(data.token, data.userId);
        }
        setReady(true);
    }, [login]);

    return { login, logout, token, userId, ready };
};
