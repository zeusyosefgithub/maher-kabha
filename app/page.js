'use client';
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, Divider, Input, Progress } from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaClipboardList, FaPlus, FaProjectDiagram, FaSave, FaUserAlt, FaWhatsapp } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import { FcManager } from "react-icons/fc";
import AddDriver from "./Modals/AddDriver";
import GetDocs from "./FireBase/getDocs";
import AddRoad from "./Modals/AddRoad";
import { format, min } from "date-fns";
import { ar } from 'date-fns/locale';
import { useGetDataByConditionWithoutUseEffect } from "./FireBase/getDataByCondition";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "./FireBase/firebase";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";

export default function Home() {

  const [type, setType] = useState('السائقين');
  const [loading, setLoading] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showAddRoad, setShowAddRoad] = useState(false);
  const Drivers = GetDocs('Drivers');
  const Roads = GetDocs('Roads');
  const metadata = GetDocs('metadata');
  const Tojar = GetDocs('Tojar');
  const [aedaraID, setAedaraID] = useState('');
  const [aedara, setAedara] = useState([]);
  const [aedaraTojar, setAedaraTojar] = useState([]);
  const [resData, setResData] = useState(false);
  const counterAedaraMony = metadata.find((count) => count.id === 'aedaraMony');
  const [showAlert, setShowAlert] = useState(false);


  useEffect(() => {
    const unsubscribe = useGetDataByConditionWithoutUseEffect(
      'AedaraMony',
      'date',
      '==',
      format(new Date(), 'dd-MM-yyyy'),
      result => {
        if (result.length) {
          setResData(true);
          setAedaraID(result[0]?.id);
          setAedara(result[0]?.aedartMoney);
          setAedaraTojar(result[0]?.aedaraTojar);
        }
        else {
          const unsubscribe = useGetDataByConditionWithoutUseEffect(
            'Aedara',
            'date',
            '==',
            format(new Date(), 'dd-MM-yyyy'),
            result => {
              if (result.length) {
                let newArray = [];
                let res = ReduceDrivers(result[0]?.aedartAlkhtot);
                for (let index = 0; index < res.length; index++) {
                  newArray.push({
                    ...res[index],
                    takedOrders: 0,
                    sumOrders: 0,
                    valueOrders: 0
                  });
                }
                setAedara(newArray);
              }
            }
          );
          let newArray = [];
          for (let index = 0; index < Tojar.length; index++) {
            newArray.push({
              ...Tojar[index],
              serialNumber: '',
              sum: 0
            });
          }
          setAedaraTojar(newArray);
        }
      }
    );
  }, [Roads, Tojar])



  const ReduceDrivers = (array) => {
    let newArray = [];
    let removed = [];
    for (let index = 0; index < array?.length; index++) {
      if (!removed.includes(index)) {
        let res = false;
        let orders = parseFloat(array[index].dialyOrders);
        for (let index1 = 0; index1 < array?.length; index1++) {
          if (array[index].driverName && array[index1].driverName && array[index].driverName === array[index1].driverName && index !== index1 && array[index].orderPrice === array[index1].orderPrice) {
            res = true;
            orders += parseFloat(array[index1].dialyOrders);
            removed.push(index1);
          }
        }
        if (!res) {
          newArray.push(array[index]);
        }
        else {
          newArray.push({ ...array[index], dialyOrders: orders });
        }
      }
    }
    return newArray;
  }

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

  const onValueChangeTojar = (index, field, value) => {
    setAedaraTojar((prevAedara) => {
      const updatedArray = [...prevAedara];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value,
      };
      return updatedArray;
    });
  };

  const GetMjmoaDrivers = () => {
    let orders = 0;
    let takedOrders = 0;
    let mjmoaAlthsel = 0;
    let valueThsel = 0;
    let driverCost = 0;
    let delevaryCost = 0;
    let other = 0;
    for (let index = 0; index < aedara.length; index++) {
      if (aedara[index].driverName) {
        orders += parseFloat(aedara[index].dialyOrders);
        takedOrders += parseFloat(aedara[index].takedOrders);
        mjmoaAlthsel += parseFloat(aedara[index].sumOrders);
        valueThsel += parseFloat(aedara[index].valueOrders);
        driverCost += parseFloat(aedara[index].takedOrders) * parseFloat(aedara[index].orderPrice);
        delevaryCost += parseFloat(aedara[index]?.valueOrders) - (parseFloat(aedara[index]?.takedOrders) * parseFloat(aedara[index].orderPrice));
        other += parseFloat(aedara[index]?.sumOrders) - (parseFloat(aedara[index]?.takedOrders) * parseFloat(aedara[index].orderPrice));
      }
    }
    return {
      orders: orders,
      takedOrders: takedOrders,
      mjmoaAlthsel: mjmoaAlthsel,
      valueThsel: valueThsel,
      driverCost: driverCost,
      delevaryCost: delevaryCost,
      other: other
    }
  }


  const GetMjmoaAlthsel = () => {
    let sum = 0;
    for (let index = 0; index < aedaraTojar.length; index++) {
      sum += parseFloat(aedaraTojar[index].sum)
    }
    return sum || '';
  }

  const calculatePercentage = (totalOrders, suppliedOrders) => {
    if (totalOrders === 0) return 0;
    return (suppliedOrders / totalOrders) * 100;
  };

  const checkIfMorThanOneInAedara = (val) => {
    let count = 0;
    for (let index = 0; index < aedara.length; index++) {
      if(aedara[index].driverName === val.driverName){
        count++;
      } 
    }
    if(count > 1){
      return true;
    }
    return false;
  }

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

        <div className='h-[600px]'>
          <div className='h-full'>
            <div className='w-full flex h-full p-5'>
              <div className='w-full'>
                <Card className='h-full'>
                  <CardBody>
                    <div className='w-full flex justify-start p-3 border-b-1 font-extrabold text-xl'>
                      <div className="mr-2 ml-2">{format(new Date(), 'dd-MM-yyyy')}</div>-<div className="mr-2 ml-2">{format(new Date(), 'EEEE', { locale: ar })}</div>
                    </div>
                    <div className="flex flex-grow items-start">
                      <table className="w-full table-auto border-collapse">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">السائق</th>
                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">عدد الطرود</th>
                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">الطرود المسلمة</th>
                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">مجموع التحصيل</th>
                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">قيمة التوصيل</th>
                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">تكلفة السائق</th>
                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">ربح التوصيل</th>
                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">الباقي</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            aedara?.map((item, index) => {
                              return item.driverName && <tr key={index} className="border-b border-gray-200 dark:border-gray-700 h-">
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{checkIfMorThanOneInAedara(item) ? `${item.driverName} (${item.name})` : item.driverName}</td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{item.dialyOrders}<Progress aria-label="Loading..." value={calculatePercentage(parseFloat(item.dialyOrders), parseFloat(item?.takedOrders))} className="max-w-md" /></td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input size="sm" type="number" value={item?.takedOrders || ''} onValueChange={(value) => { onValueChange(index, 'takedOrders', Math.min(parseFloat(value || 0), parseFloat(item.dialyOrders))); }} color='primary' className="max-w-[100px]" label='' /></div></td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input size="sm" type="number" value={item?.sumOrders || ''} onValueChange={(value) => { onValueChange(index, 'sumOrders', value); }} color='primary' className="max-w-[100px]" label='' /></div></td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input size="sm" type="number" value={item?.valueOrders || ''} onValueChange={(value) => { onValueChange(index, 'valueOrders', value); }} color='primary' className="max-w-[100px]" label='' /></div></td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{(parseFloat(item?.takedOrders) * parseFloat(item.orderPrice)) || ''}</td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{(parseFloat(item?.valueOrders) - (parseFloat(item?.takedOrders) * parseFloat(item.orderPrice)) || '')}</td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{(parseFloat(item?.sumOrders) - (parseFloat(item?.takedOrders) * parseFloat(item.orderPrice))) || ''}</td>
                              </tr>
                            })
                          }
                          <tr className="border-b border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white">
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">المجموع</td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaDrivers().orders || ''} className="max-w-[100px]" /></div></td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaDrivers().takedOrders || ''} className="max-w-[100px]" /></div></td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaDrivers().mjmoaAlthsel || ''} className="max-w-[100px]" /></div></td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaDrivers().valueThsel || ''} className="max-w-[100px]" /></div></td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaDrivers().driverCost || ''} className="max-w-[100px]" /></div></td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaDrivers().delevaryCost || ''} className="max-w-[100px]" /></div></td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaDrivers().other || ''} className="max-w-[100px]" /></div></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className='w-1/3'>
                <Card className='mr-5 h-full'>
                  <CardBody>
                    <div className='w-full flex justify-start p-3 border-b-1 font-extrabold text-xl'>
                      <div className="mr-2 ml-2">{format(new Date(), 'dd-MM-yyyy')}</div>-<div className="mr-2 ml-2">{format(new Date(), 'EEEE', { locale: ar })}</div>
                    </div>
                    <div className="flex flex-grow items-start">
                      <table className="w-full table-auto border-collapse">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">التاجر</th>
                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">الرقم التسلسلي</th>
                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">التحصيل</th>
                          </tr>
                        </thead>
                        <tbody>

                          {
                            aedaraTojar?.map((item, index) => {
                              return <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{item.name}</td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input size="sm" type="number" value={item?.serialNumber || ''} onValueChange={(value) => { onValueChangeTojar(index, 'serialNumber', value); }} color='primary' className="max-w-[100px]" label='' /></div></td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input size="sm" type="number" value={item?.sum || ''} onValueChange={(value) => { onValueChangeTojar(index, 'sum', value); }} color='primary' className="max-w-[100px]" label='' /></div></td>
                              </tr>
                            })
                          }
                          <tr className="border-b border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white">
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">المجموع</td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> </td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaAlthsel()} className="max-w-[100px]" /></div></td>
                          </tr>
                        </tbody>

                      </table>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
            <div className="mr-5">
              <Button isLoading={loading} onClick={async () => {
                setLoading(true);
                if (resData) {
                  console.log(aedaraID);
                  await updateDoc(doc(firestore, 'AedaraMony', aedaraID), {
                    aedartMoney: aedara,
                    aedaraTojar: aedaraTojar
                  });
                }
                else {
                  await addDoc(collection(firestore, 'AedaraMony'), {
                    idnum: counterAedaraMony.count,
                    date: format(new Date(), 'dd-MM-yyyy'),
                    time: format(new Date(), 'HH:mm'),
                    aedartMoney: aedara,
                    aedaraTojar: aedaraTojar
                  });
                  await updateDoc(doc(firestore, 'metadata', 'aedaraMony'), {
                    count: counterAedaraMony.count + 1
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
    </div>
  );
}
