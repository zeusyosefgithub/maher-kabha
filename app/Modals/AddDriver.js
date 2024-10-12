'use client';
import { Autocomplete, AutocompleteItem, Avatar, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Switch, Tooltip } from "@nextui-org/react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { FaRegCheckSquare } from "react-icons/fa";
import { firestore } from "../FireBase/firebase";
import GetDocs from "../FireBase/getDocs";

export default function AddDriver({ show, disable, Drivers,metadata,showMessage }) {

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorNumber, setErrorNumber] = useState('');

    const [name, setName] = useState('');
    const [number, setNumber] = useState('');


    
    const counterDrivers = metadata.find((count) => count.id === 'drivers');

    console.log(metadata);

    const regexNumber = /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/;

    const ResetAll = () => {
        setErrorName('');
        setErrorNumber('');
        setName('');
        setNumber('');
        disable();
        showMessage();
    }

    const checkDriverInputs = () => {
        for (let index = 0; index < Drivers.length; index++) {
            if(Drivers[index].name === name){
                return false;
            }
            if(Drivers[index].number === number){
                return false;
            }
        }
        return true;
    }

    return (
        <Modal placement="center" className="test-fontt" backdrop={"blur"} size="3xl" isOpen={show} onClose={ResetAll}>
            <ModalContent>
                <ModalHeader className="flex justify-center border-b-2">
                    اضافة سائق جديد
                </ModalHeader>
                <ModalBody className="border-b-2">
                    <div dir='rtl' className='p-5'>
                        <Input type='text' value={name} onValueChange={(val) => setName(val)} color='primary' className=' max-w-[350px]' label='اسم السائق' />
                        <div className='text-danger text-xs mt-1'>{errorName}</div>
                        <Input type='number' value={number} onValueChange={(val) => setNumber(val)} color='primary' className='mt-5 max-w-[350px]' label='رقم الهاتف' />
                        <div className='text-danger text-xs mt-1'>{errorNumber}</div>
                        <Input color='primary' className='mt-5 max-w-[350px]' label='صورة' isDisabled />
                        <div className='text-danger text-xs mt-5'>{error}</div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="w-full flex justify-end">
                        <Button color="warning" variant="flat" size="" onClick={ResetAll}>
                            اغلاق
                        </Button>
                        <Button isLoading={loading} onClick={async () => {
                            setErrorName('');
                            setErrorNumber('');
                            setError('');
                            setLoading(true);
                            if(!name){
                                setLoading(false);
                                return setErrorName('لم يتم ادخال البيان المطلوب!');
                            }
                            if(!number){
                                setLoading(false);
                                return setErrorNumber('لم يتم ادخال البيان المطلوب!');
                            }
                            if(name.lenght > 30){
                                setLoading(false);
                                return setErrorName('تجاوزت الحد الاقصى للاحرف!');
                            }
                            if(!regexNumber.test(number)){
                                setLoading(false);
                                return setErrorNumber('رقم الهاتف غير صحيح!');
                            }
                            if(!checkDriverInputs()){
                                setLoading(false);
                                return setError('اسم السائق او رقم الهاتف مكرر!');
                            }
                            await addDoc(collection(firestore,'Drivers'),{
                                idnum : counterDrivers.count,
                                name : name,
                                number : number,
                                AvgOrders : 0,
                            });
                            await updateDoc(doc(firestore,'metadata','drivers'),{
                                count : counterDrivers.count + 1
                            })
                            setLoading(false);
                            ResetAll();
                        }} color='success' variant="flat" size="" className='ml-2'>
                            اضافة
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


