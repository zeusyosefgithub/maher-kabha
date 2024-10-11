'use client';
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaClipboardList, FaPlus, FaProjectDiagram, FaUserAlt, FaWhatsapp } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import { FcManager } from "react-icons/fc";
import AddDriver from "./Modals/AddDriver";
import GetDocs from "./FireBase/getDocs";
import AddRoad from "./Modals/AddRoad";
import { format } from "date-fns";
import { ar } from 'date-fns/locale';
import { useGetDataByConditionWithoutUseEffect } from "./FireBase/getDataByCondition";
export default function Home() {

  const [type, setType] = useState('السائقين');
  const [loading, setLoading] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showAddRoad, setShowAddRoad] = useState(false);
  const Drivers = GetDocs('Drivers');
  const Roads = GetDocs('Roads');
  const metadata = GetDocs('metadata');
  const Tojar = GetDocs('Tojar');
  const [driver, setDriver] = useState(null);
  const [aedara, setAedara] = useState([]);
  const [aedaraTojar, setAedaraTojar] = useState([]);

  useEffect(() => {
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
          console.log(newArray);
          setAedara(newArray);
        }
      }
    );
  }, [Roads]);

  useEffect(() => {
    let newArray = [];
    for (let index = 0; index < Tojar.length; index++) {
      newArray.push({
        ...Tojar[index],
        serialNumber: '',
        sum: 0
      });
    }
    setAedaraTojar(newArray);
  }, [Tojar]);

  console.log(aedaraTojar);

  const ReduceDrivers = (array) => {
    let newArray = [];
    let removed = [];
    for (let index = 0; index < array?.length; index++) {
      if (!removed.includes(index)) {
        let res = false;
        let orders = parseFloat(array[index].dialyOrders);
        for (let index1 = 0; index1 < array?.length; index1++) {
          if (array[index].driverName === array[index1].driverName && index !== index1) {
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


  console.log(aedara);
  const GetMjmoaAlthsel = () => {
    let sum = 0;
    for (let index = 0; index < aedaraTojar.length; index++) {
      sum += parseFloat(aedaraTojar[index].sum)
    }
    return sum || '';
  }









  return (
    <div dir='rtl'>
      <div className='pr-3 pl-3'>
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
                              return <tr key={index} className="border-b border-gray-200 dark:border-gray-700 h-">
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{item.driverName}</td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{item.dialyOrders}</td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input type="number" value={item?.takedOrders || ''} onValueChange={(value) => { onValueChange(index, 'takedOrders', value); }} color='primary' className="max-w-[100px]" label='' /></div></td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input type="number" value={item?.sumOrders || ''} onValueChange={(value) => { onValueChange(index, 'sumOrders', value); }} color='primary' className="max-w-[100px]" label='' /></div></td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input type="number" value={item?.valueOrders || ''} onValueChange={(value) => { onValueChange(index, 'valueOrders', value); }} color='primary' className="max-w-[100px]" label='' /></div></td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{(parseFloat(item?.takedOrders) * parseFloat(item.orderPrice)) || ''}</td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{(parseFloat(item?.valueOrders) - (parseFloat(item?.takedOrders) * parseFloat(item.orderPrice)) || '')}</td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{(parseFloat(item?.sumOrders) - (parseFloat(item?.takedOrders) * parseFloat(item.orderPrice))) || ''}</td>
                              </tr>
                            })
                          }
                          <tr className="border-b border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white">
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">المجموع</td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaAlthsel()} className="max-w-[100px]" /></div></td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaAlthsel()} className="max-w-[100px]" /></div></td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaAlthsel()} className="max-w-[100px]" /></div></td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaAlthsel()} className="max-w-[100px]" /></div></td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaAlthsel()} className="max-w-[100px]" /></div></td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaAlthsel()} className="max-w-[100px]" /></div></td>
                            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"> <div className="flex justify-center"><Input color='success' isReadOnly value={GetMjmoaAlthsel()} className="max-w-[100px]" /></div></td>
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
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input type="number" value={item?.serialNumber || ''} onValueChange={(value) => { onValueChangeTojar(index, 'serialNumber', value); }} color='primary' className="max-w-[100px]" label='' /></div></td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input type="number" value={item?.sum || ''} onValueChange={(value) => { onValueChangeTojar(index, 'sum', value); }} color='primary' className="max-w-[100px]" label='' /></div></td>
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
          </div>
        </div>
      </div>
    </div>
  );
}
