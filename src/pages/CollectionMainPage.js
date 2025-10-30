import React, {useEffect, useState} from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate,useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import {doc, collection, addDoc, getDocs, setDoc, getDoc} from "firebase/firestore";
import Collection from "../components/Collection";
import Flashcard from "../components/Flashcard";
import Navbar from "../components/Navbar";

function CollectionMainPage() {
    const { currentUser, userLogged } = useAuth();
    const navigate = useNavigate();


    const { id } = useParams();
    const [collection, setCollection] = useState(null);
    const [index, setIndex] = useState(0);
    const [max, setMax] = useState(0);

    async function loadCollections () {
        try {
            const docSnap = await getDoc((doc(db, "collections",id)));
            // console.log(docSnap);
            setCollection(docSnap.data());
            setMax(docSnap.data().cards.length);
        }catch (error) {
            console.error("Napaka pri pridobivanju zbirk:", error);
        }
    }






    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [index, collection]);

    useEffect(() => {
        loadCollections();

    },[])

    if (!userLogged) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">
                    <p> Za uporabo se morate prijaviti.</p>
                    <button className="btn btn-primary" onClick={() => navigate("/login")}>
                        Prijava
                    </button>
                </div>
            </div>
        );
    }

    function next(){
        setIndex((index+1) % max);
    }
    function prev(){
        setIndex((index-1)<0?max-1:(index-1));
    }

    return (
        <>
            <Navbar/>
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">



                    {collection && (
                        <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                                <small className="text-muted">
                                    Karta {index + 1} od {collection.cards?.length || 0}
                                </small>
                                <small className="text-muted">
                                    {Math.round(((index + 1) / (collection.cards?.length || 1)) * 100)}% končano
                                </small>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${((index + 1) / (collection.cards?.length || 1)) * 100}%` }}
                                    aria-valuenow={index + 1}
                                    aria-valuemin="0"
                                    aria-valuemax={collection.cards?.length || 0}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <select
                            className="form-select"
                            value={index}
                            onChange={(e) => setIndex(parseInt(e.target.value))}
                        >
                            {collection?.cards.map((card, i) => (
                                <option key={i} value={i}>
                                    Question {i + 1}: {card.q.substring(0, 50)}{card.q.length > 50 ? '...' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {collection ? (
                        <Flashcard card={collection.cards[index]} />
                    ) : (
                        <div className="text-center my-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <button
                            className="btn btn-outline-primary"
                            onClick={prev}
                            disabled={index === 0}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Nazaj
                        </button>



                        <button
                            className="btn btn-outline-primary"
                            onClick={next}
                            disabled={!collection || index === (collection.cards?.length - 1)}
                        >
                            Naprej
                            <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default CollectionMainPage;