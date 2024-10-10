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
  const [driver, setDriver] = useState(null);
  const [aedara, setAedara] = useState([]);

  useEffect(() => {
    const unsubscribe = useGetDataByConditionWithoutUseEffect(
      'Aedara',
      'date',
      '==',
      format(new Date(), 'dd-MM-yyyy'),
      result => {
        if (result.length) {
          console.log(ReduceDrivers(result[0]?.aedartAlkhtot));
          setAedara(ReduceDrivers(result[0]?.aedartAlkhtot));
        }
      }
    );
  }, [Roads]);

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




  return (
    <div dir='rtl'>
      <div className='p-10'>
        <div className='h-[600px]'>
          <div className='h-full'>
            <div className='w-full flex h-full p-5'>
              <div className='w-full'>
                <Card className='mr-5 h-full'>
                  <CardBody>
                    <div className='w-full flex justify-start p-3 border-b-1 font-extrabold text-xl'>
                      <div className="mr-2 ml-2">{format(new Date(), 'dd-MM-yyyy')}</div>-<div className="mr-2 ml-2">{format(new Date(), 'EEEE', { locale: ar })}</div>
                    </div>
                    <table className="w-full table-auto border-collapse">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                          <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">السائق</th>
                          <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">عدد الطرود</th>
                          <th className="px-4 py-2 text-center  font-extrabold text-black text-xs"></th>
                          <th className="px-4 py-2 text-center  font-extrabold text-black text-xs"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          aedara?.map((item, index) => {
                            return <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{item.driverName}</td>
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{item.dialyOrders}</td>
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"></td>
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"></td>
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
        </div>
      </div>
    </div>
  );
}
