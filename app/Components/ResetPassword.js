'use client';

import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Spinner } from "@nextui-org/react";
import { useAuth } from "../auth/authContext";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function ResetPassword(props) {
    const [email, setEmail] = useState('');
    const { resetPassword, currentUser } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message,setMessage] = useState('');
    const [disableAll,setDisableAll] = useState(false);

    const handleResetPassword = async () => {
        setError('');
        setMessage('');
        setLoading(true);
        try {
            await resetPassword(email);
            setDisableAll(true);
            setMessage('נשלח לחשבון המייל שלך בקשה לשנוי הסיסמה בהצלחה');
        } catch (errorr) {
            console.log(errorr);
            setError('האימייל שהוזן אינו נכון');
        }
        setLoading(false);
    };
    return (
        <div className="h-screen flex justify-center items-center z-10">
            {loading && <Spinner className="absolute left-0 top-0 right-0 bottom-0 z-50" />}
            <Card dir="rtl" className="w-[450px]">
                <CardHeader>
                    <div className="w-full">
                        <div className="flex flex-col ">
                            <div className="text-lg text-center">تفيير كلمة السر</div>
                            <Button onClick={props.disable} className="text-ms text-right flex items-center w-fit"><FaArrowRight/>الصفحة السابقة</Button>
                            <div className="text-sm text-default-500 mt-2 flex">ارسال رسالة عبر البريد الالكتروني لتغيير كلمة السر</div>
                        </div>
                    </div>

                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="flex items-center ml-5 mr-5">
                        <div className="w-[170px] text-right">البريد الالكتروني</div>
                        <Input
                            disabled={disableAll}
                            type="email"
                            className="mt-5 mb-5"
                            value={email}
                            onValueChange={(e) => { setError(''); setEmail(e); }}
                        />
                    </div>
                    {
                        message && <div className="text-success text-right text-sm mt-5">{message} !!</div>
                    }
                    {
                        error && <div className="text-danger text-right text-sm mt-5">{error} !!</div>
                    }
                </CardBody>
                <Divider />
                <CardFooter>
                    <Button disabled={disableAll} className="w-full m-5" color="primary" variant="flat" onClick={handleResetPassword}>ارسال</Button>
                </CardFooter>
            </Card>


        </div>
    )
}