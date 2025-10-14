import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const { userLogged } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (userLogged) {
            navigate("/");
        }
    }, [userLogged, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setStatus("Processing...");
        try {
            const userCredential = await doCreateUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                // displayName: user.displayName
                level:1,
                xp:0
            });
            setStatus("Account created successfully!");
            navigate("/");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setStatus("Error: Email already in use.");
            } else {
                setStatus("Error: " + error.message);
            }
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setStatus("Processing...");
        try {
            await doSignInWithEmailAndPassword(email, password);
            setStatus("Logged in successfully!");
            navigate("/");
        } catch (error) {
            if (error.code === "auth/invalid-credential") {
                setStatus("Error: Invalid email or password.");
            } else {
                setStatus("Error: " + error.message);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        setStatus("Processing...");
        try {
            const result = await doSignInWithGoogle();
            const user = result.user;
            // Store user in Firestore (merge: true handles both new and existing users)
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: user.displayName,
                level:1,
                xp:0
            }, { merge: true });
            setStatus("Logged in with Google successfully!");
            navigate("/");
        } catch (error) {
            setStatus("Error: " + error.message);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">
                                {isSignUp ? "Sign Up" : "Login"}
                            </h2>

                            <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-100 mb-2">
                                    {isSignUp ? "Sign Up" : "Login"}
                                </button>
                            </form>

                            <div className="text-center my-2">
                                <span className="text-muted">or</span>
                            </div>

                            <button
                                onClick={handleGoogleSignIn}
                                className="btn btn-outline-danger w-100 mb-2"
                            >
                                <i className="bi bi-google me-2"></i>
                                Continue with Google
                            </button>

                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setStatus("");
                                }}
                                className="btn btn-link w-100"
                            >
                                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                            </button>

                            {status && (
                                <div className={`alert ${status.includes("Error") ? "alert-danger" : "alert-success"} mt-3`} role="alert">
                                    {status}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;