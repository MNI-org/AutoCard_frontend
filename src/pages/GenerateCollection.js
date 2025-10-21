import React, {useState} from "react";
import {generate} from "../generator/generator";
import {useAuth} from "../contexts/authContext";
import {addDoc, collection, doc, setDoc} from "firebase/firestore";
import {db} from "../firebase/firebase";
import {useParams} from "react-router-dom";

function GenerateCollection() {
    const {id} = useParams();
    const {currentUser, userLogged} = useAuth();
    const [name,setName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [generatedJson, setGeneratedJson] = useState(null);
    const [status, setStatus] = useState("");
    const [grade, setGrade] = useState("");
    const [subject, setSubject] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [cards, setCards] = useState([]);

    const addCard = () => {
        setCards([...cards, { q: "", a: "", order: cards.length + 1 }]);
    };

    const removeCard = (index) => {
        const newCards = cards.filter((_, i) => i !== index);
        const reorderedCards = newCards.map((card, i) => ({ ...card, order: i + 1 }));
        setCards(reorderedCards);
    };

    const updateCard = (index, field, value) => {
        const newCards = [...cards];
        newCards[index][field] = value;
        setCards(newCards);
    };

    const initializeCards = (json) => {
        if (!json || !Array.isArray(json.cards)) return;
        setCards(json.cards.map((card, i) => ({
            q: card.q || "",
            a: card.a || "",
            order: i
        })));
    };

    const onFileChange = (event) => {
        setSelectedFile(event.target.files?.[0] ?? null);
    };

    const handleGenerate = async () => {
        setStatus("Generiram zbirko...");
        const json = await generate(selectedFile);
        if (json != null) {
            setSubject(json.subject);
            setGeneratedJson(json);
            initializeCards(json);
        }
        setStatus("Generiranje zaključeno.");
    };

    const saveCollectionToDatabase = async (e) => {
        e.preventDefault();

        if (!userLogged) return;

        if (!grade) {
            alert("Prosim izberi razred.");
            return;
        }

        if (!difficulty) {
            alert("Prosim izberi težavnost.");
            return;
        }

        if (cards.some(card => !card.q.trim() || !card.a.trim())) {
            alert("Vse kartice morajo imeti vprašanje in odgovor.");
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

            if (!id) {
                await addDoc(collection(db, "collections"), collectionData);
                setStatus("Zbirka uspešno ustvarjena!");
            } else {
                alert("Urejanje obstoječih zbirk v tem generatorju ni podprto.");
            }

            setTimeout(() => {
                setGrade("");
                setSubject("");
                setDifficulty("");
                setCards([]);
                setStatus("");
            }, 2000);
        } catch (error) {
            setStatus("Napaka: " + error.message);
        }
    }

    return (
        <div className="container mt-4">
            <h1>Generiraj zbirko</h1>
            <form onSubmit={saveCollectionToDatabase}>
                <div className="mb-2">
                    <label className="form-label">Ime zbirke</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={!currentUser}
                    />
                </div>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label className="form-label">Naloži PDF</label>
                        <input type="file" className="form-control" onChange={onFileChange} accept="application/pdf"/>
                        <button type="button" className="btn btn-secondary mt-2" onClick={handleGenerate}
                                disabled={!selectedFile}>
                            Generiraj zbirko
                        </button>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Razred</label>
                        <select
                            className="form-select"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            required
                            disabled={!currentUser}
                        >
                            <option value="">Izberi razred...</option>
                            {[6, 7, 8, 9].map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Težavnost</label>
                        <select
                            className="form-select"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            required
                            disabled={!currentUser}
                        >
                            <option value="">Izberi težavnost...</option>
                            {[1, 2, 3].map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {status && (
                    <div className={`alert mt-3 ${status.includes("Napaka") ? "alert-danger" : "alert-success"}`}>
                        {status}
                    </div>
                )}
            </form>
            <h4 className="mt-4">Kartice</h4>
            {cards.map((card, index) => (
                <div key={index} className="card mb-3">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="card-title mb-0">Kartica {card.order}</h5>
                            {cards.length > 1 && currentUser && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeCard(index)}
                                >
                                    Odstrani
                                </button>
                            )}
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Vprašanje</label>
                            <input
                                type="text"
                                className="form-control"
                                value={card.q}
                                onChange={(e) => updateCard(index, "q", e.target.value)}
                                required
                                disabled={!currentUser}
                            />
                        </div>
                        <div>
                            <label className="form-label">Odgovor</label>
                            <input
                                type="text"
                                className="form-control"
                                value={card.a}
                                onChange={(e) => updateCard(index, "a", e.target.value)}
                                required
                                disabled={!currentUser}
                            />
                        </div>
                    </div>
                </div>
            ))}

            {!currentUser && (<button
                type="button"
                className="btn btn-secondary mb-3"
                onClick={addCard}
            >
                + Dodaj kartico
            </button>)}
            <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg" disabled={!generatedJson}>
                    Shrani zbirko
                </button>
            </div>
        </div>
    );
}

export default GenerateCollection;
