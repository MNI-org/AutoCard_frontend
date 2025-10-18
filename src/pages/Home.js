import React from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "../firebase/auth";

function Home() {
    const { currentUser, userLogged } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await doSignOut();
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div>
            <h1>Home Page</h1>

            {userLogged ? (
                <div>
                    <p>Welcome, {currentUser?.displayName}!</p>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={() => navigate("/editor")}>Collection Creation</button>

                    <button onClick={() => navigate("/collections")}>Collections</button>
                </div>
            ) : (
                <div>
                    <p>You are not logged in.</p>
                    <button onClick={() => navigate("/login")}>Go to Login</button>

                </div>
            )}
        </div>
    );
}

export default Home;