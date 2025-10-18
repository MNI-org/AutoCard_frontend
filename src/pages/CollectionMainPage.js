import React, {useEffect, useState} from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate,useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import {doc, collection, addDoc, getDocs, setDoc} from "firebase/firestore";
import Collection from "../components/Collection";

function CollectionMainPage() {
    const { currentUser, userLogged } = useAuth();
    const navigate = useNavigate();


    const { id } = useParams();
    // const [creator,setCreator] = useState("");
    // const [grade, setGrade] = useState("");
    // const [subject, setSubject] = useState("");
    // const [difficulty, setDifficulty] = useState("");
    // const [cards, setCards] = useState([{ q: "", a: "", order: 1 }]);
    // const [status, setStatus] = useState("");
    const [collections, setCollections] = useState([]);
    const subjects = [
        "SLO", "MAT", "ANG", "LUM", "GUM",
        "GEO", "ZGO", "ETK", "FIZ", "KEM",
        "BIO", "NAR", "TEH", "GOS", "SPO"
    ];






    const loadCollections = async (id) => {
        try {
            const querySnapshot = await getDocs((collection(db, "collections")));
            const collections = [];

            querySnapshot.forEach((doc) => {
                collections.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            console.log(collections);
            setCollections(collections);
        }catch (error) {
            console.error("Error fetching users:", error);
        }
    }




    useEffect(() => {
        loadCollections();
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
        <div className="container my-4">
            col main page<br/>
            index: {id}
        </div>
    );
}

export default CollectionMainPage;