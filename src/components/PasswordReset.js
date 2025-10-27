import React, { useState } from 'react';
import { doPasswordReset } from "../firebase/auth";

export default function PasswordReset({ email }) {
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [resetError, setResetError] = useState(null);
    const [resettingPassword, setResettingPassword] = useState(false);

    const handlePasswordReset = async () => {
        setResettingPassword(true);
        setResetError(null);
        try {
            await doPasswordReset(email);
            setResetEmailSent(true);
            setTimeout(() => setResetEmailSent(false), 5000);
        } catch (e) {
            setResetError(e.message);
        }
        setResettingPassword(false);
    };

    return (
        <div className="row mt-4">
            <div className="col-12">
                {resetEmailSent && (
                    <div className="alert alert-success">
                        Password reset email sent! Check email address
                    </div>
                )}
                {resetError && (
                    <div className="alert alert-danger">{resetError}</div>
                )}
                <button
                    className="btn btn-warning"
                    onClick={handlePasswordReset}
                    disabled={resettingPassword}
                >
                    {resettingPassword ? 'Sending...' : 'Reset password'}
                </button>
            </div>
        </div>
    );
}
