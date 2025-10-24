import React, { useEffect, useState } from 'react';
import { useAuth } from "../contexts/authContext";
import Navbar from '../components/Navbar'
import Collection from '../components/Collection';
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { doPasswordReset} from "../firebase/auth";
import { useNavigate } from 'react-router-dom';


export default function Profile() {
    const { currentUser, loading } = useAuth();
    const [userCollections, setUserCollections] = useState([]);
    const [loadingCollections, setLoadingCollections] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [resetError, setResetError] = useState(null);
    const [resettingPassword, setResettingPassword] = useState(false);
    const navigate = useNavigate();

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

    const handlePasswordReset = async () => {
        setResettingPassword(true);
        setResetError(null);
        try {
            await doPasswordReset(currentUser.email);
            setResetEmailSent(true);
            setTimeout(() => setResetEmailSent(false), 5000);
        } catch (e) {
            setResetError(e.message)
        }
        setResettingPassword(false);
    };

    if (loading) {
        return <div className="container mt-5"><p>Loading...</p></div>;
    }

    if (!currentUser) {
        return <div className="container mt-5">
            <p>Please log in to view your profile.</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Login Here
            </button>
        </div>;
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

                        <div className="row mt-4">
                            <div className="col-12">
                                { resetEmailSent && (
                                    <div className="alert alert-success">
                                        Password reset email sent ! Check email address
                                    </div>
                                )}
                                {resetError && (
                                    <div className="alert alert-danger" role="alert">
                                        {resetError}
                                    </div>
                                )}
                                <button
                                    className="btn btn-warning"
                                    onClick={handlePasswordReset}
                                    disabled={resettingPassword}>

                                    {resettingPassword ? 'Sending...' : 'Reset password'}
                                </button>
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
