import React, {useEffect, useState} from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate,useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import {doc, collection, addDoc, getDoc, setDoc} from "firebase/firestore";
import Dropdown from "../components/Dropdown";
import Navbar from "../components/Navbar";

function CollectionEditor() {
    const { currentUser, userLogged } = useAuth();
    const navigate = useNavigate();


    const { id } = useParams();
    const [name,setName] = useState("");
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

    const addCard = () => {
        setCards([...cards, { q: "", a: "", order: cards.length + 1 }]);
    };

    const removeCard = (index) => {
        const newCards = cards.filter((_, i) => i !== index);
        // Update order numbers
        const reorderedCards = newCards.map((card, i) => ({ ...card, order: i + 1 }));
        setCards(reorderedCards);
    };

    const updateCard = (index, field, value) => {
        const newCards = [...cards];
        newCards[index][field] = value;
        setCards(newCards);
    };

    const loadCollection = async (id) => {
        const docRef = doc(db, "collections", id);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
            const data=docSnap.data();
            setName(data.name);
            setCards(data.cards);
            setGrade(data.grade);
            setSubject(data.subject);
            setDifficulty(data.difficulty);
            setCreator(data.user.uid);
            // console.log(docSnap.data());
            // console.log(data.user.uid)
            // console.log("..................")
        }
        // console.log(docSnap.data().creatorId);
        // console.log(currentUser.uid)
        // console.log(docSnap.data().creatorId===currentUser.uid);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Creating collection...");

        // Validation
        if (!grade || !subject || !difficulty) {
            setStatus("Error: Please fill in all fields.");
            return;
        }

        if (cards.some(card => !card.q.trim() || !card.a.trim())) {
            setStatus("Error: All cards must have both question and answer.");
            return;
        }

        try {
            const collectionData = {
                user: currentUser,
                name: name,
                grade: parseInt(grade),
                subject: subject,
                difficulty: parseInt(difficulty),
                cards: cards,
                dateCreated: new Date(),
                likes: []
            };

            if(!id){
                await addDoc(collection(db, "collections"), collectionData);
                setStatus("Collection created successfully!");
            }
            else
            {
                await setDoc(doc(db, "collections", id), collectionData, { merge: true });
                setStatus("Collection updated successfully!");
            }


            // Reset form
            setTimeout(() => {
                setGrade("");
                setSubject("");
                setDifficulty("");
                setCards([{ q: "", a: "", order: 1 }]);
                setStatus("");
            }, 2000);
        } catch (error) {
            setStatus("Error: " + error.message);
        }
    };

    useEffect(() => {

        if (id!==undefined) {
            loadCollection(id);
        }
        else
            setCreator(currentUser.uid)
        // console.log(currentUser)
        // console.log(creator)
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
        <><Navbar curr={"editor"}/>
        <div className="container col-lg-8 mt-4">


            <h1>Create Collection</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="form-label">Collection Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={creator!==currentUser.uid}
                    />
                </div>
                <div className="row mb-3">
                    <Dropdown items={[6,7,8,9]} name={"Grade"} set={setGrade} get={grade} disabled={creator!==currentUser.uid}></Dropdown>
                    <Dropdown items={subjects} name={"Subjects"} set={setSubject} get={subject} disabled={creator!==currentUser.uid} ></Dropdown>
                    <Dropdown items={[1, 2, 3]} name={"Difficulty"} set={setDifficulty} get={difficulty} disabled={creator!==currentUser.uid} ></Dropdown>
                </div>

                <h4 className="mt-4">Cards</h4>
                {cards.map((card, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="card-title mb-0">Card {card.order}</h5>
                                {cards.length > 1 && creator===currentUser.uid && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeCard(index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Question</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={card.q}
                                    onChange={(e) => updateCard(index, "q", e.target.value)}
                                    required
                                    disabled={creator!==currentUser.uid}
                                />
                            </div>
                            <div>
                                <label className="form-label">Answer</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={card.a}
                                    onChange={(e) => updateCard(index, "a", e.target.value)}
                                    required
                                    disabled={creator!==currentUser.uid}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {creator===currentUser.uid &&(<button
                    type="button"
                    className="btn btn-secondary mb-3"
                    onClick={addCard}
                >
                    + Add Card
                </button>)}



                <div className="d-grid gap-2">
                    {!id ?
                        <button type="submit" className="btn btn-primary btn-lg">
                            Create Collection
                        </button>
                        :
                        creator===currentUser.uid &&
                        <button type="submit" className="btn btn-primary btn-lg">
                            Update Collection
                        </button>
                    }
                </div>



                {status && (
                    <div className={`alert mt-3 ${status.includes("Error") ? "alert-danger" : "alert-success"}`}>
                        {status}
                    </div>
                )}
            </form>
        </div>
        </>
    );
}

export default CollectionEditor;