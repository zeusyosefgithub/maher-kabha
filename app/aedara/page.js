'use client';
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, Divider, Input, Switch } from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaClipboardList, FaPlus, FaProjectDiagram, FaUserAlt, FaWhatsapp } from "react-icons/fa";
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


export default function aedara() {
    const [type, setType] = useState('السائقين');
    const [loading, setLoading] = useState(false);
    const [showAddDriver, setShowAddDriver] = useState(false);
    const [showAddRoad, setShowAddRoad] = useState(false);
    const Drivers = GetDocs('Drivers');
    const Roads = GetDocs('Roads');
    const Aedara = GetDocs('Aedara');
    const metadata = GetDocs('metadata');

    const counterAedara = metadata.find((count) => count.id === 'aedara');


    const [driver, setDriver] = useState(null);

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

    const [aedara, setAedara] = useState([]);
    const [resData, setResData] = useState(false);

    useEffect(() => {
        let newArray = [];
        if (!resData) {
            const unsubscribe = useGetDataByConditionWithoutUseEffect(
                'Aedara',
                'date',
                '==',
                format(new Date(), 'dd-MM-yyyy'),
                result => {
                    if (result.length) {
                        newArray.push(...result);
                        setAedara(newArray);
                        setResData(true);
                    }
                }
            );
        }
    }, [Roads]);



    const onValueChange = (index, field, value) => {
        console.log(value);
        setAedara((prevAedara) => {
            const updatedArray = [...prevAedara];
            updatedArray[index] = {
                ...updatedArray[index],
                [field]: value,
            };
            return updatedArray;
        });
    };

    const onValueChangeE = (outerIndex, innerIndex, field, value) => {
        setAedara((prevState) => {
          const updatedAedara = [...prevState];
          updatedAedara[outerIndex].aedartAlkhtot[innerIndex] = {
            ...updatedAedara[outerIndex].aedartAlkhtot[innerIndex],
            [field]: value,
          };
          return updatedAedara;
        });
    };

    const removeOuterIndex = (outerIndex) => {
        setAedara((prevState) => {
            const updatedAedara = prevState.filter((_, index) => index !== outerIndex);
            return updatedAedara;
        });
    };

    console.log(aedara);







    return (
        <div dir='rtl'>
            <div className='p-10'>
                <div className='h-[600px] flex flex-col'>
                    <div className='h-full'>
                        <div className='w-full flex h-full p-5'>
                            <div className='w-full h-full'>
                                <Card className='mr-5 h-full'>
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
                                                    resData ?
                                                        aedara?.map((road, outerIndex) => {
                                                            return road?.aedartAlkhtot?.map((road, innerIndex) => {
                                                                return <tr key={innerIndex} className="border-b border-gray-200 dark:border-gray-700">
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.name}</td>
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.avgOrders}</td>
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input type="number" value={road?.dialyOrders || ''} onValueChange={(value) => onValueChangeE(outerIndex,innerIndex, 'dialyOrders', value)} color='primary' className="max-w-[150px]" label='' /></div></td>
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Autocomplete
                                                                    className="max-w-[150px]"
                                                                    color="primary"
                                                                    size="xs"
                                                                    defaultInputValue={road.driver}
                                                                    defaultItems={Drivers}
                                                                    onSelectionChange={(value) => onValueChangeE(outerIndex,innerIndex, 'driverName', value)}
                                                                    onInputChange={(value) => onValueChangeE(outerIndex,innerIndex, 'driverName', value)}
                                                                >
                                                                    {
                                                                        Drivers?.map((driver, index) => (
                                                                            <AutocompleteItem className='text-right' key={driver?.name} value={driver?.name}>
                                                                                {driver?.name}
                                                                            </AutocompleteItem>
                                                                        ))
                                                                    }
                                                                </Autocomplete></div></td>
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><Switch isSelected={road.twkel} value={road.twkel} onValueChange={(value) => onValueChangeE(outerIndex,innerIndex, 'twkel', value)}></Switch></td>
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><Button onClick={() => sendWhatsAppMessage(`+972${GetDriversInfo(road.driver)?.number}`, '')} color='success' variant='flat' className="" size="sm"><div className="w-full flex items-center">ارسال<FaWhatsapp className="mr-1 text-success text-lg" /></div></Button></td>
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><Button onClick={() => sendWhatsAppMessage(`+972${GetDriversInfo(road.driver)?.number}`, '')} color='success' variant='flat' className="" size="sm"><div className="w-full flex items-center">ارسال<FaWhatsapp className="mr-1 text-success text-lg" /></div></Button></td>
                                                            </tr>
                                                            })
                                                        })
                                                        :
                                                        aedara.map((road, index) => {
                                                            return <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.name}</td>
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.avgOrders}</td>
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input type="number" value={road?.dialyOrders || ''} onValueChange={(value) => onValueChange(index, 'dialyOrders', value)} color='primary' className="max-w-[150px]" label='' /></div></td>
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Autocomplete
                                                                    className="max-w-[150px]"
                                                                    color="primary"
                                                                    size="xs"
                                                                    
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
                    <div className="mr-10">
                        <Button isLoading={loading} onClick={async() => {
                            setLoading(true);
                            if(resData){
                                await updateDoc(doc(firestore,'Aedara',aedara[0]?.id),{
                                    aedartAlkhtot : aedara[0].aedartAlkhtot
                                });
                            }
                            else{
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
                        }} color='primary' variant="flat">حفظ</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}