import React, {useEffect, useState} from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate,useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import {doc, collection, addDoc, getDocs, setDoc} from "firebase/firestore";
import Collection from "../components/Collection";

function Flashcard(props) {
    async function processXpGain(xp){
        const base=10;
        const mult = 1.25;
        currentUser.xp-=-xp
        if( currentUser.xp > currentUser.level * mult *base){
            currentUser.level-=-1;
            currentUser.xp = 0;
        }

        await setDoc(doc(db, "users", currentUser.uid), {
            email: currentUser.email,
            displayName: currentUser.displayName,
            level: currentUser.level ?? 1,
            xp: currentUser.xp ?? 0
        }, {merge: true});

    }

    const { currentUser, userLogged } = useAuth();
    useEffect(() => {
        console.log(currentUser);
    },[])

    return (

        <>
            { props.card &&

             <div className="container card my-4">
                <div>
                    {props.card.q}
                </div>

                <div>
                    {props.card.a}
                </div>
                 <button onClick={() => {
                     processXpGain(10)
                     console.log(currentUser)
                 }}>XP TEST</button>
            </div>
            }
        </>

    );
}

export default Flashcard;