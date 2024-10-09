'use client';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Spinner } from "@nextui-org/react";
import { useState } from "react";


export default function Register(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    

    const [role,setRole] = useState('');

    const handleSignUp = () => {

    }
    return (
<Card dir="rtl" className="w-[450px] z-10">
            <CardHeader>
                <div className="w-full">
                    <div className="flex flex-col ">
                        <div className="text-md text-center">حساب جديد</div>
                        <div onClick={props.disable} className="text-sm text-default-500 mt-2 flex">او لتسجيل الدخول في &nbsp;<div className="hover:text-primary cursor-pointer">حساب موجود</div></div>
                    </div>
                </div>

            </CardHeader>
            <Divider />
            <CardBody>
                <div className="flex items-center ml-5 mr-5">
                    <div className="w-[85px] text-right">المنصب</div>
                    <Dropdown dir="rtl">
                        <DropdownTrigger>
                            <Button
                                color="primary"
                                variant="bordered"
                                className="capitalize mt-5 mb-5"
                            >
                                {role}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Single selection example"
                            variant="flat"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={role}
                            onSelectionChange={setRole}
                        >
                            <DropdownItem key='نعم'>نعم</DropdownItem>
                            <DropdownItem key='لا'>لا</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="flex items-center ml-5 mr-5">
                    <div className="w-[170px] text-right">الاسم الضخصي</div>
                    <Input
                        type="email"
                        className="mt-5 mb-5"
                        value={email}
                        onValueChange={(e) => { setError(''); setEmail(e); }}
                    />
                </div>
                <div className="flex items-center ml-5 mr-5">
                    <div className="w-[170px] text-right">اسم العائلة</div>
                    <Input
                        type="email"
                        className="mt-5 mb-5"
                        value={email}
                        onValueChange={(e) => { setError(''); setEmail(e); }}
                    />
                </div>
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
            </CardBody>
            <Divider />
            <CardFooter>
                <Button className="w-full m-5" color="primary" variant="flat" onClick={handleSignUp}>انشاء</Button>
            </CardFooter>
        </Card>
    )
}