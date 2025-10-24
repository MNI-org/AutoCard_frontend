import React, { useEffect, useState } from 'react';
import { useAuth } from "../contexts/authContext";
import Navbar from '../components/Navbar'
import Collection from '../components/Collection';
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Profile() {
    const { currentUser, loading } = useAuth();
    const [userCollections, setUserCollections] = useState([]);
    const [loadingCollections, setLoadingCollections] = useState(false);

    useEffect(() => {
        if (currentUser) {
            loadUserCollections();
        }
    }, [currentUser]);

    const loadUserCollections = async () => {
        setLoadingCollections(true);
        try {
            const q = query(
                collection(db, "collections"),
                where("user.uid", "==", currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const collections = [];
            querySnapshot.forEach((doc) => {
                collections.push({ id: doc.id, ...doc.data() });
            });
            setUserCollections(collections);
        } catch (error) {
            console.error("Error loading collections:", error);
        }
        setLoadingCollections(false);
    };

    if (loading) {
        return <div className="container mt-5"><p>Loading...</p></div>;
    }

    if (!currentUser) {
        return <div className="container mt-5"><p>Please log in to view your profile.</p></div>;
    }

    return (
        <>
            <Navbar curr={"profile"}/>
            <div className="container col-lg-6 mt-5">
                <div className="card mb-4">
                    <div className="card-body">
                        <h1 className="card-title mb-4">Profile</h1>
                        <div className="row mb-3">
                            <div className="col-sm-4">
                                <strong>Email:</strong>
                            </div>
                            <div className="col-sm-8">
                                {currentUser.email}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-4">
                                <strong>Display Name:</strong>
                            </div>
                            <div className="col-sm-8">
                                {currentUser.displayName || 'Not set'}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-4">
                                <strong>Level:</strong>
                            </div>
                            <div className="col-sm-8">
                                {currentUser.level || 'Not set'}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-4">
                                <strong>XP:</strong>
                            </div>
                            <div className="col-sm-8">
                                {currentUser.xp || 'Not set'}
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="mb-3">Your Collections</h2>
                {loadingCollections ? (
                    <p>Loading collections...</p>
                ) : userCollections.length > 0 ? (
                    <div>
                        {userCollections.map((collection) => (
                            <Collection key={collection.id} data={collection} />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted">You haven't created any collections yet.</p>
                )}
            </div>
        </>
    );
}
