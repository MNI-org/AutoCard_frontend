import React, {useState} from "react";
import {doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword} from "./firebase/auth";
import {db} from "./firebase/firebase";
import {doc, setDoc} from "firebase/firestore";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");

    // Proof of Concept function to create user and store email in Firestore.
    // This function only demonstrates connection to firebase services. It can be removed.
    // The entries can be seen in the Firebase Console -> Authentication and Firestore Database.
    const runPOC = async (email, password) => {
        setStatus("Processing...");
        try {
            const userCredential = await doCreateUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {email: user.email});
            setStatus("User created and email stored in Firestore: " + user.email);
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setStatus("Error: User already exists.");
            } else {
                setStatus("Error: " + error.message);
            }
        }
    };

    return (
        <div className="App" style={{padding: 32}}>
            <h1>Firebase Proof Of Concept</h1>
            <input
                type="email"
                placeholder="Gmail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{marginRight: 8}}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{marginRight: 8}}
            />
            <button onClick={() => runPOC(email, password)}>Create/Sign In</button>
            <div style={{marginTop: 16}}>{status}</div>
        </div>
    );
}

export default App;
