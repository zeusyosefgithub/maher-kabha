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

export default function AddRoad({ show, disable, Drivers, metadata,Roads }) {

    const [loading, setLoading] = useState(false);
    const [error,setError] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorTowns, setErrorTowns] = useState('');
    const [errorOrderPrice, setErrorOrderPrice] = useState('');

    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [driver, setDriver] = useState(null);
    const [driver2, setDriver2] = useState(null);
    const [orderPrice,setOrderPrice] = useState(0);

    const [choosedPlaces, setChoosedPlaces] = useState([]);



    const counterRoads = metadata.find((count) => count.id === 'roads');
    const places = metadata.find((count) => count.id === 'places');

    const ResetAll = () => {
        setErrorName('');
        setErrorTowns('');
        setErrorOrderPrice('');
        setName('');
        setNumber('');
        setDriver(null);
        setOrderPrice(0);
        setChoosedPlaces([]);
        disable();
    }

    const checkRoads = () => {
        for (let index = 0; index < Roads.length; index++) {
            if (Roads[index].name === name) {
                return false;
            }
        }
        return true;
    }

    const removeDuplicatesAndNulls = (arr) => {
        return Array?.from(new Set(arr?.filter(item => item !== null)));
    };
    const removeItemAtIndex = (index) => {
        setChoosedPlaces(choosedPlaces.filter((_, i) => i !== index));
    };








    return (
        <Modal placement="center" className="test-fontt" backdrop={"blur"} size="3xl" isOpen={show} onClose={ResetAll}>
            <ModalContent>
                <ModalHeader className="flex justify-center border-b-2">
                    اضافة خط جديد
                </ModalHeader>
                <ModalBody className="border-b-2">
                    <div dir='rtl' className='p-5 h-[400px]'>
                        <div className="w-full h-full flex ml-3">
                            <div className="w-full">
                                <Input type='text' value={name} onValueChange={(val) => setName(val)} color='primary' className=' max-w-[350px]' label='اسم الخط' />
                                <div className='text-danger text-xs mt-1'>{errorName}</div>
                                <Autocomplete
                                    label="السائق الشائع"
                                    className="max-w-[350px] mt-3"
                                    color="primary"
                                    defaultItems={Drivers}
                                    onSelectionChange={setDriver}
                                    onInputChange={setDriver}
                                >
                                    {
                                        Drivers?.map((driver, index) => (
                                            <AutocompleteItem className='text-right' key={driver?.name} value={driver?.name}>
                                                {driver?.name}
                                            </AutocompleteItem>
                                        ))
                                    }
                                </Autocomplete>
                                <Input type='number' value={orderPrice || ''} onValueChange={(val) => setOrderPrice(val)} color='primary' className=' max-w-[350px] mt-3' label='اجرة الطرد' />
                                <div className='text-danger text-xs mt-1'>{errorOrderPrice}</div>
                                <Autocomplete
                                    label="اضافة بلد"
                                    className="max-w-[350px] mt-3"
                                    color="primary"
                                    onSelectionChange={(val) => {
                                        let newArray = [];
                                        newArray.push(...choosedPlaces);
                                        newArray.push(val);
                                        setChoosedPlaces(removeDuplicatesAndNulls(newArray));
                                    }}
                                >
                                    {
                                        places?.places?.map((place, index) => (
                                            <AutocompleteItem className='text-right' key={place} value={place}>
                                                {place}
                                            </AutocompleteItem>
                                        ))
                                    }
                                </Autocomplete>
                                <div className='text-danger text-xs mt-1'>{errorTowns}</div>
                                <div className='text-danger text-xs mt-10'>{error}</div>
                            </div>
                            <div className="w-full mr-3 h-full">
                                <Card>
                                    <CardBody >
                                        <div className='flex w-full flex-wrap h-[340px]'>
                                            <Reorder.Group className="w-full" values={choosedPlaces} onReorder={setChoosedPlaces}>
                                                {
                                                    choosedPlaces?.map((item, index) => (
                                                        <Reorder.Item className="w-full mt-2 mb-2 cursor-grab" value={item} key={item}>
                                                            <Card className="w-full">
                                                                <CardBody className="w-full">
                                                                    <div className="w-full flex items-center">
                                                                        <div className="w-full items-center flex">
                                                                            <div>{index + 1}.</div>
                                                                            <div className="mr-2">{item}</div>
                                                                        </div>
                                                                        <IoCloseCircleSharp onClick={() => removeItemAtIndex(index)} className="text-xl text-danger cursor-pointer"/>
                                                                    </div>
                                                                </CardBody>
                                                            </Card>
                                                        </Reorder.Item>
                                                    ))
                                                }
                                            </Reorder.Group>
                                        </div>
                                    </CardBody>
                                </Card>
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
                            if (!orderPrice) {
                                setLoading(false);
                                return setErrorOrderPrice('لم يتم ادخال البيان المطلوب!');
                            }
                            if(!choosedPlaces.length){
                                setLoading(false);
                                return setErrorTowns('لم يتم ادخال البيان المطلوب!');
                            }
                            if(choosedPlaces.length > 15){
                                setLoading(false);
                                return setErrorTowns('تجاوزت الحد الاقصى لعدد البلاد!');
                            }
                            if (name.length > 30) {
                                setLoading(false);
                                return setErrorName('تجاوزت الحد الاقصى للاحرف!');
                            }
                            if(!checkRoads()){
                                setLoading(false);
                                return setError('اسم الخط موجود بالفعل!');
                            }
                            await addDoc(collection(firestore, 'Roads'), {
                                idnum: counterRoads.count,
                                name: name,
                                driver: driver,
                                orderPrice: orderPrice,
                                towns : choosedPlaces,
                                avgOrders : 0
                            });
                            await updateDoc(doc(firestore, 'metadata', 'roads'), {
                                count: counterRoads.count + 1
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


