'use client';
import { Autocomplete, AutocompleteItem, Avatar, Button, Card, CardBody, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Switch, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { FaRegCheckSquare } from "react-icons/fa";
import { firestore } from "../FireBase/firebase";
import GetDocs from "../FireBase/getDocs";
import { IoCloseCircleSharp } from "react-icons/io5";
import DraggableCells from "../Components/DraggableCells";
import { Reorder } from "framer-motion";

export default function ShowRoads({ show, disable, showType, Drivers, road, metadata,Roads,showMessage }) {

    const [loading, setLoading] = useState(false);
    const [towns, setTowns] = useState([]);

    const [error, setError] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorTowns, setErrorTowns] = useState('');
    const [errorOrderPrice, setErrorOrderPrice] = useState('');

    const [name, setName] = useState('');
    const [driver, setDriver] = useState(null);
    const [orderPrice, setOrderPrice] = useState(0);

    useEffect(() => {
        setTowns(road?.towns);
        setName(road?.name);
        setDriver(road?.driver);
        setOrderPrice(road?.orderPrice);
    }, [road]);

    const ResetAll = () => {
        disable();
        showMessage();
    }

    const removeDuplicatesAndNulls = (arr) => {
        return Array?.from(new Set(arr?.filter(item => item !== null)));
    };

    const checkRoads = () => {
        for (let index = 0; index < Roads.length; index++) {
            if (Roads[index].name === name) {
                return false;
            }
        }
        return true;
    }

    const removeItemAtIndex = (index) => {
        setChoosedPlaces(choosedPlaces.filter((_, i) => i !== index));
    };

    const places = metadata.find((count) => count.id === 'places');

    return (
        <Modal placement="center" className="test-fontt" backdrop={"blur"} size="3xl" isOpen={show} onClose={ResetAll}>
            <ModalContent>
                <ModalHeader className="flex justify-center border-b-2">
                    {road.name}
                </ModalHeader>
                <ModalBody className="border-b-2">
                    <div dir='rtl' className=''>
                        <Tabs defaultSelectedKey={showType} aria-label="Options">
                            <Tab key="تفصيل" title="تفصيل">
                                <Card>
                                    <CardBody>
                                        <div className="flex items-center">
                                            <div>
                                                <Input size="sm" type='text' value={name} onValueChange={(val) => setName(val)} color='primary' className=' max-w-[350px]' label='اسم الخط' />
                                                <div className='text-danger text-xs mt-1 text-right'>{errorName}</div>
                                                <Autocomplete
                                                    size="sm"
                                                    label="السائق الشائع"
                                                    defaultInputValue={driver}
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
                                                <Input size="sm" type='number' value={orderPrice || ''} onValueChange={(val) => setOrderPrice(val)} color='primary' className=' max-w-[350px] mt-3' label='اجرة الطرد' />
                                                <div className='text-danger text-xs mt-1 text-right'>{errorOrderPrice}</div>
                                                <div className='text-danger text-xs mt-10 text-right'>{error}</div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="البلدان" title="البلدان">
                                <Card>
                                    <CardBody>
                                        <div className=" flex items-center pb-3 mb-3 border-b-1">
                                            <div>
                                                <Autocomplete
                                                    size="sm"
                                                    label="اضافة بلد"
                                                    className="max-w-[350px] mt-2"
                                                    color="primary"
                                                    onSelectionChange={(val) => {
                                                        let newArray = [];
                                                        newArray.push(...towns);
                                                        newArray.push(val);
                                                        setTowns(removeDuplicatesAndNulls(newArray));
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
                                                <div className='text-danger text-xs mt-1 text-right'>{errorTowns}</div>
                                            </div>
                                        </div>
                                        <div className="max-h-[300px] overflow-auto p-3">
                                            {
                                                towns?.length &&
                                                <Reorder.Group className="w-full" values={towns} onReorder={setTowns}>
                                                    {
                                                        towns?.map((item, index) => (
                                                            <Reorder.Item className="w-full mt-2 mb-2 cursor-grab" value={item} key={item}>
                                                                <Card className="w-full">
                                                                    <CardBody className="w-full">
                                                                        <div className="w-full flex items-center">
                                                                            <div className="w-full items-center flex">
                                                                                <div>{index + 1}.</div>
                                                                                <div className="mr-2">{item}</div>
                                                                            </div>
                                                                            <IoCloseCircleSharp onClick={() => removeItemAtIndex(index)} className="text-xl text-danger cursor-pointer" />
                                                                        </div>
                                                                    </CardBody>
                                                                </Card>
                                                            </Reorder.Item>
                                                        ))
                                                    }
                                                </Reorder.Group>
                                            }
                                        </div>
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="w-full flex justify-end">
                        <Button color="warning" variant="flat" size="" onClick={ResetAll}>
                            اغلاق
                        </Button>
                        <Button isLoading={loading} onClick={async () => {
                            setLoading(true);
                            setError('');
                            setErrorName('');
                            setErrorTowns('');
                            setErrorOrderPrice('');
                            if (!name) {
                                setLoading(false);
                                return setErrorName('لم يتم ادخال البيان المطلوب!');
                            }
                            if (!orderPrice) {
                                setLoading(false);
                                return setErrorOrderPrice('لم يتم ادخال البيان المطلوب!');
                            }
                            if (!towns.length) {
                                setLoading(false);
                                return setErrorTowns('لم يتم ادخال البيان المطلوب!');
                            }
                            if(towns.length > 15){
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
                            await updateDoc(doc(firestore, 'Roads', road.id), {
                                towns: towns,
                                name : name,
                                driver : driver,
                                orderPrice : orderPrice
                            });
                            setLoading(false);
                        }} color='primary' variant="flat" size="" className='ml-2'>
                            حفظ
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


