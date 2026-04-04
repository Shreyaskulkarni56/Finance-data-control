// import { createContext, useContext, useState } from "react";
// import api from "../api/axios";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null); // { id, name, email, role }
//     const [token, setToken] = useState(null);

//     const login = async (email, password) => {
//         const res = await api.post("/auth/login", { email, password });
//         const token = res.data.data.token;

//         // Decode JWT payload to get user info
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         console.log("JWT payload:", payload);

//         const user = {
//             id: payload.id || payload.userId,
//             email: payload.email,
//             role: payload.role,
//         };

//         setToken(token);
//         setUser(user);
//         api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//         return user;
//     };

//     const logout = () => {
//         setUser(null);
//         setToken(null);
//         delete api.defaults.headers.common["Authorization"];
//     };

//     return (
//         <AuthContext.Provider value={{ user, token, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

// // Custom hook — so any component just does: const { user, login, logout } = useAuth()
// export function useAuth() {
//     return useContext(AuthContext);
// }

import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

// Load from sessionStorage on startup
function getInitialUser() {
    try {
        const user = sessionStorage.getItem("user");
        const token = sessionStorage.getItem("token");
        if (user && token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            return { user: JSON.parse(user), token };
        }
    } catch { }
    return { user: null, token: null };
}

export function AuthProvider({ children }) {
    const initial = getInitialUser();
    const [user, setUser] = useState(initial.user);
    const [token, setToken] = useState(initial.token);

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        const token = res.data.data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = { id: payload.id, email: payload.email, role: payload.role };

        setToken(token);
        setUser(user);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Persist
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        return user;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        delete api.defaults.headers.common["Authorization"];
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}