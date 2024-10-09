// authContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authh } from '../FireBase/firebase';
import { Spinner } from '@nextui-org/react';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword ,signOut} from 'firebase/auth';

const AuthContext = createContext({});


export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signUp = (email, password) => {
        return createUserWithEmailAndPassword(authh,email, password);
    }

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(authh,email, password);
    }

    const signOutt = () => {
        return signOut(authh);
    }

    const resetPassword = (email) => {
        return sendPasswordResetEmail(authh,email);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authh,(user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, signUp, signIn, signOutt,resetPassword }}>
            {loading ? <Spinner className="absolute left-0 top-0 right-0 bottom-0" /> : children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}

