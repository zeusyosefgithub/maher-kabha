'use client';
import NavBar from "../Components/NavBar";
import { useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import LoginForm from "../Components/LoginForm";
import ContactContext from "./ContactContext";
import GetDocs from "../FireBase/getDocs";

export default function CheckAuth({ children }) {

    const [loading, setLoading] = useState(true);
    const { signUp, signIn, signOutt, currentUser } = useAuth();
    const router = useRouter();
    const [contactName, setContactName] = useState(null);
    const [customerSet, setCustomerSet] = useState(null);
    const [isNehol, setIsNehol] = useState(null);
    const [aobedAuth, setaobedAuth] = useState(null);
    const admins = GetDocs('admins');

    useEffect(() => {
        const checkAuth = async () => {
            await new Promise((res) => setTimeout(res, 50));
            setLoading(false);
        };
        checkAuth();
    }, [currentUser]);

    const bdekatTafked = () => {
        for (let index = 0; index < admins.length; index++) {
            if (currentUser?.email === admins[index].email) {
                return admins[index];
            }
        }
    }

    useEffect(() => {
        if (currentUser?.email && admins.length > 0) {
            if (bdekatTafked()?.tfked === 'nehol') {
                setIsNehol(true);
                setaobedAuth(bdekatTafked());
            }
            else {
                setIsNehol(false);
                setaobedAuth(bdekatTafked());
            }
        }
    }, [currentUser, admins]);

    return (
        <div>
            {
                !loading && !currentUser ?
                    <LoginForm />
                    :
                    !loading && currentUser ?
                        <div>
                            <ContactContext.Provider value={{ contactName, setContactName, customerSet, setCustomerSet, isNehol, setIsNehol, aobedAuth }}>
                                <div>
                                    <div>
                                        <NavBar />
                                    </div>
                                    <div className='mt-10'>
                                        {children}
                                    </div>
                                </div>
                            </ContactContext.Provider>
                        </div>
                        :
                        null
            }
        </div>
    )
}
///
