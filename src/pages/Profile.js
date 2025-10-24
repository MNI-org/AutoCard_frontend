import React from 'react';
import { useAuth } from "../contexts/authContext";
import Navbar from '../components/Navbar'

export default function Profile() {
    const { currentUser, loading } = useAuth();

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
                <div className="card">
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
                                {currentUser.xp}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
