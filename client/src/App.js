import React from "react";
import { useRoutes } from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import "materialize-css";
import { Loader } from "./components/Loader";

function App() {
    const { login, logout, token, userId, ready } = useAuth();
    const isAuthenticated = !!token; // if there is token, then user is authenticated

    const routes = useRoutes(isAuthenticated);

    if (!ready) {
        return <Loader />;
    }
    return (
        <AuthContext.Provider
            value={{
                token,
                userId,
                login,
                logout,
                isAuthenticated,
            }}
        >
            <Router>
                {isAuthenticated && <Navbar />}
                <div className="container">{routes}</div>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
