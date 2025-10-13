import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

function Login() {



    return (
        <div >
            login page :)
        </div>
    );
}

export default Login;