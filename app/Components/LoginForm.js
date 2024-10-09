'use client';

import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Spinner } from "@nextui-org/react";
import { useAuth } from "../auth/authContext";
import { useState } from "react";
import { authh } from "../FireBase/firebase";
import Link from "next/link";
import ResetPassword from "./ResetPassword";
import Register from "./Register";
import rep1 from '../Images/rep1.jpg';
import './LoginForm.css';
import Image from "next/image";

export default function LoginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, currentUser } = useAuth();
    const [error, setError] = useState('');
    const [loading,setLoading] = useState(false);
    const [resetPassword,setResetPassowrd] = useState(false);
    const [register,setRegister] = useState(false);

    const handleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
        } catch (error) {
            setError('הנתונים שהוזנו אינם נכונים');
        }
        setLoading(false);
    };

    return (

        <div className="h-screen flex justify-center items-center z-10">
            {resetPassword && <ResetPassword disable={() => setResetPassowrd(false)} />}
            {register && <Register disable={() => setRegister(false)} />}
            {loading && <Spinner className="absolute left-0 top-0 right-0 bottom-0 z-50" />}
            {
                !resetPassword && !register &&
                <Card dir="rtl" className="w-[450px] z-10 gggg m-5">
                    <CardHeader>
                        <div className="w-full">
                            <div className="flex flex-col ">
                                <div className='flex justify-center items-center'>
                                    <div className='w-[60px]'></div>
                                    <div className="text-xl text-center w-full">نيترو</div>
                                    <Image src={rep1} className='w-[60px] rounded-full'/>
                                </div>
                                <div onClick={() => setRegister(true)} className="text-sm text-default-500 mt-2 flex">او لاضافة &nbsp;<div className="hover:text-primary cursor-pointer">حساب جديد</div></div>
                            </div>
                        </div>

                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <div className="flex items-center ml-5 mr-5">
                            <div className="w-[170px] text-right">البريد الالكتروني</div>
                        <Input
                            type="email"
                            className="mt-5 mb-5"
                            value={email}
                            onValueChange={(e) => { setError(''); setEmail(e); }}
                        />
                    </div>
                    <div className="flex items-center ml-5 mr-5">
                        <div className="w-[170px] text-right">كلمة السر</div>
                        <Input
                            type="password"
                            className="mt-5 mb-5"
                            value={password}
                            onValueChange={(e) => { setError(''); setPassword(e); }}
                        />
                    </div>
                    {
                        error && <div className="text-danger text-right text-sm mt-5">{error} !!</div>
                    }
                    <div onClick={() => setResetPassowrd(true)} className="text-danger text-right text-sm mt-5 cursor-pointer">
                        نسيت كلمة السر ؟
                    </div>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Button className="w-full m-5" color="primary" variant="flat" onClick={handleSignIn}>تسجيل دخول</Button>
                </CardFooter>
            </Card>
        }


    </div>



    )
}