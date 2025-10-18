import React, {useEffect, useState} from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate,useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import {doc, collection, addDoc, getDoc, setDoc} from "firebase/firestore";

function Collection() {
    const { currentUser, userLogged } = useAuth();
    const navigate = useNavigate();


    const { id } = useParams();
    const [creator,setCreator] = useState("");
    const [grade, setGrade] = useState("");
    const [subject, setSubject] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [cards, setCards] = useState([{ q: "", a: "", order: 1 }]);
    const [status, setStatus] = useState("");
    const subjects = [
        "SLO", "MAT", "ANG", "LUM", "GUM",
        "GEO", "ZGO", "ETK", "FIZ", "KEM",
        "BIO", "NAR", "TEH", "GOS", "SPO"
    ];






    const loadCollections = async (id) => {
        const docRef = doc(db, "collections");
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
            setCards(docSnap.data().cards);
            setGrade(docSnap.data().grade);
            setSubject(docSnap.data().subject);
            setDifficulty(docSnap.data().difficulty);
            setCreator(docSnap.data().creatorId);
        }
        // console.log(docSnap.data().creatorId);
        // console.log(currentUser.uid)
        // console.log(docSnap.data().creatorId===currentUser.uid);
    }




    useEffect(() => {

        if (id!==undefined) {
            loadCollections(id);
        }
        else
            setCreator(currentUser.uid)

    },[])

    if (!userLogged) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">
                    <p>You need to be logged in to access this!</p>
                    <button className="btn btn-primary" onClick={() => navigate("/login")}>
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            this is a start :3
        </div>
    );
}

export default Collection;