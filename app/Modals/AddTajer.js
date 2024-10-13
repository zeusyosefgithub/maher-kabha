'use client';
import {Autocomplete, AutocompleteItem, Avatar, Button, Card, CardBody, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Switch, Tooltip } from "@nextui-org/react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { FaRegCheckSquare } from "react-icons/fa";
import { firestore } from "../FireBase/firebase";
import GetDocs from "../FireBase/getDocs";
import { IoCloseCircleSharp } from "react-icons/io5";
import DraggableCells from "../Components/DraggableCells";
import { Reorder } from "framer-motion";

export default function AddTajer({ show, disable, metadata,Tojar,showMessage }) {

    const [loading, setLoading] = useState(false);
    const [error,setError] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorNumber,setErrorNumber] = useState('');

    const [name, setName] = useState('');
    const [number, setNumber] = useState('');

    const counterTojar = metadata.find((count) => count.id === 'Tojar');



    const ResetAll = () => {
        setError('');
        setErrorName('');
        setName('');
        setNumber('');
        disable();
    }

    const regexNumber = /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/;

    const checkTajerInputs = () => {
        for (let index = 0; index < Tojar.length; index++) {
            if(Tojar[index].name === name){
                return false;
            }
            if(Tojar[index].number === number){
                return false;
            }
        }
        return true;
    }


    return (
        <Modal placement="center" className="test-fontt" backdrop={"blur"} size="3xl" isOpen={show} onClose={ResetAll}>
            <ModalContent>
                <ModalHeader className="flex justify-center border-b-2">
                    اضافة تاجر جديد
                </ModalHeader>
                <ModalBody className="border-b-2">
                    <div dir='rtl' className='p-5 h-[400px]'>
                        <div className="w-full h-full flex ml-3">
                            <div className="w-full">
                                <Input type='text' value={name} onValueChange={(val) => setName(val)} color='primary' className=' max-w-[350px]' label='اسم التاجر' />
                                <div className='text-danger text-xs mt-1'>{errorName}</div>
                                <Input type='text' value={number} onValueChange={(val) => setNumber(val)} color='primary' className=' max-w-[350px] mt-3' label='رقم التاجر' />
                                <div className='text-danger text-xs mt-1'>{errorNumber}</div>
                                <div className='text-danger text-xs mt-10'>{error}</div>
                            </div>       
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="w-full flex justify-end">
                        <Button color="warning" variant="flat" size="" onClick={ResetAll}>
                            اغلاق
                        </Button>
                        <Button isLoading={loading} onClick={async () => {
                            setErrorName('');
                            setLoading(true);
                            if (!name) {
                                setLoading(false);
                                return setErrorName('لم يتم ادخال البيان المطلوب!');
                            }
                            if (name.length > 30) {
                                setLoading(false);
                                return setErrorName('تجاوزت الحد الاقصى للاحرف!');
                            }
                            if(!number){
                                setLoading(false);
                                return setErrorNumber('رقم الهاتف غير صحيح!');
                            }
                            if(!regexNumber.test(number)){
                                setLoading(false);
                                return setErrorNumber('رقم الهاتف غير صحيح!');
                            }
                            if(!checkTajerInputs()){
                                setLoading(false);
                                return setError('اسم التاجر او رقم الهاتف مكرر!');
                            }
                            await addDoc(collection(firestore, 'Tojar'), {
                                idnum: counterTojar.count,
                                name: name,
                                number: number,
                            });
                            await updateDoc(doc(firestore, 'metadata', 'Tojar'), {
                                count: counterTojar.count + 1
                            })
                            setLoading(false);
                            ResetAll();
                            showMessage();
                        }} color='success' variant="flat" size="" className='ml-2'>
                            اضافة
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


