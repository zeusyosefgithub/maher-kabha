'use client';
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, Divider, Input, Spinner, Switch } from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaClipboardList, FaPlus, FaProjectDiagram, FaSave, FaUserAlt, FaWhatsapp } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import { FcManager } from "react-icons/fc";
import AddDriver from "../Modals/AddDriver";
import GetDocs from "../FireBase/getDocs";
import AddRoad from "../Modals/AddRoad";
import { format } from "date-fns";
import { ar } from 'date-fns/locale';
import { useGetDataByConditionWithoutUseEffect, useGetDataByConditionWithoutUseEffectTwoQueres } from "../FireBase/getDataByCondition";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../FireBase/firebase";
import { Alert } from "@mui/material";


export default function aedara() {

    const [type, setType] = useState('السائقين');
    const [loading, setLoading] = useState(false);
    const [showAddDriver, setShowAddDriver] = useState(false);
    const [showAddRoad, setShowAddRoad] = useState(false);
    const Drivers = GetDocs('Drivers');
    const Roads = GetDocs('Roads');
    const Aedara = GetDocs('Aedara');
    const metadata = GetDocs('metadata');
    const [aedaraID, setAedaraID] = useState('');
    const [aedara, setAedara] = useState([]);
    const [resData, setResData] = useState(false);
    const counterAedara = metadata.find((count) => count.id === 'aedara');
    const [showAlert, setShowAlert] = useState(false);

    const sendWhatsAppMessage = (phoneNumber, message) => {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };
    const GetDriversInfo = (val) => {
        for (let index = 0; index < Drivers.length; index++) {
            if (Drivers[index].name === val) {
                return Drivers[index];
            }
        }
        return false;
    }

    const checkIfInRes = (array,val) => {
        for (let index = 0; index < array.length; index++) {
            if(val === array[index].id){
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        const unsubscribe = useGetDataByConditionWithoutUseEffect(
            'Aedara',
            'date',
            '==',
            format(new Date(), 'dd-MM-yyyy'),
            result => {
                if (result.length) {
                    let newArray = [];
                    for (let index = 0; index < Roads.length; index++) {
                        if(!checkIfInRes(result[0]?.aedartAlkhtot,Roads[index].id)){
                            newArray.push({
                                ...Roads[index],
                                dialyOrders: 0,
                                driverName: '',
                                twkel: false,
                            });
                        }
                    }
                    setAedaraID(result[0]?.id);
                    newArray.push(...result[0]?.aedartAlkhtot);
                    setAedara(newArray);
                    setResData(true);
                }
                else {
                    let newArray = [];
                    for (let index = 0; index < Roads.length; index++) {
                        newArray.push({
                            ...Roads[index],
                            dialyOrders: 0,
                            driverName: '',
                            twkel: false,
                        })
                    }
                    setAedara(newArray);
                }
            }
        );
    }, [Roads]);
    const onValueChange = (index, field, value) => {
        setAedara((prevAedara) => {
            const updatedArray = [...prevAedara];
            updatedArray[index] = {
                ...updatedArray[index],
                [field]: value,
            };
            return updatedArray;
        });
    };

    console.log(aedara);
    return (
        <div dir='rtl'>
            <div className='pr-3 pl-3'>
                <div className="absolute z-50 flex w-full justify-center">
                    <div
                        className={`transition-all duration-500 ease-in-out w-1/2 ${showAlert ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                            }`}
                    >
                        <Alert dir="rtl" severity="success">
                            تم الحفظ بنجاح.
                        </Alert>
                    </div>
                </div>
                <div className='h-[600px] flex flex-col'>
                    <div className='h-full'>
                        <div className='w-full flex h-full p-5'>
                            <div className='w-full h-full'>
                                <Card className='h-full'>
                                    <CardBody>
                                        <div className='w-full flex justify-start p-3 border-b-1 font-extrabold text-xl'>
                                            <div className="mr-2 ml-2">{format(new Date(), 'dd-MM-yyyy')}</div>-<div className="mr-2 ml-2">{format(new Date(), 'EEEE', { locale: ar })}</div>
                                        </div>
                                        <table className="w-full table-auto border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                                                    <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">اسم الخط</th>
                                                    <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">معدل الطرود</th>
                                                    <th className="px-4 py-2 text-center  font-extrabold text-black text-xs max-w-[300px]">طرود اليوم</th>
                                                    <th className="px-4 py-2 text-center  font-extrabold text-black text-xs max-w-[300px]">اسم السائق</th>
                                                    <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">توكيل الطرود</th>
                                                    <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">ارسال تنبيه</th>
                                                    <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">ارسال الخط</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    aedara?.map((road, index) => {
                                                        return <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.name}</td>
                                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.avgOrders}</td>
                                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input type="number" value={road?.dialyOrders || ''} onValueChange={(value) => onValueChange(index, 'dialyOrders', value)} color='primary' className="max-w-[150px]" label='' /></div></td>
                                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Autocomplete
                                                                className="max-w-[150px]"
                                                                color="primary"
                                                                size="xs"
                                                                defaultSelectedKey={road.driverName}
                                                                defaultItems={Drivers}
                                                                onSelectionChange={(value) => onValueChange(index, 'driverName', value)}
                                                                onInputChange={(value) => onValueChange(index, 'driverName', value)}
                                                            >
                                                                {
                                                                    Drivers?.map((driver, index) => (
                                                                        <AutocompleteItem className='text-right' key={driver?.name} value={driver?.name}>
                                                                            {driver?.name}
                                                                        </AutocompleteItem>
                                                                    ))
                                                                }
                                                            </Autocomplete></div></td>
                                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><Switch isSelected={road.twkel} value={road.twkel} onValueChange={(value) => onValueChange(index, 'twkel', value)}></Switch></td>
                                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><Button onClick={() => sendWhatsAppMessage(`+972${GetDriversInfo(road.driver)?.number}`, '')} color='success' variant='flat' className="" size="sm"><div className="w-full flex items-center">ارسال<FaWhatsapp className="mr-1 text-success text-lg" /></div></Button></td>
                                                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><Button onClick={() => sendWhatsAppMessage(`+972${GetDriversInfo(road.driver)?.number}`, '')} color='success' variant='flat' className="" size="sm"><div className="w-full flex items-center">ارسال<FaWhatsapp className="mr-1 text-success text-lg" /></div></Button></td>
                                                        </tr>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div className="mr-5">
                        <Button isLoading={loading} onClick={async () => {
                            setLoading(true);
                            if (resData) {
                                await updateDoc(doc(firestore, 'Aedara', aedaraID), {
                                    aedartAlkhtot: aedara
                                });
                                
                            }
                            else {
                                await addDoc(collection(firestore, 'Aedara'), {
                                    idnum: counterAedara.count,
                                    date: format(new Date(), 'dd-MM-yyyy'),
                                    time: format(new Date(), 'HH:mm'),
                                    aedartAlkhtot: aedara
                                });
                                await updateDoc(doc(firestore, 'metadata', 'aedara'), {
                                    count: counterAedara.count + 1
                                });
                            }
                            setLoading(false);
                            setShowAlert(true);
                            setTimeout(() => {
                                setShowAlert(false);
                            }, 1500);
                        }} color='primary' variant="flat"><FaSave className="text-xl" />حفظ</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}