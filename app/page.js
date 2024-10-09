'use client';
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import Image from "next/image";
import React, { useState } from "react";
import { FaClipboardList, FaPlus, FaProjectDiagram, FaUserAlt, FaWhatsapp } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import { FcManager } from "react-icons/fc";
import AddDriver from "./Modals/AddDriver";
import GetDocs from "./FireBase/getDocs";
import AddRoad from "./Modals/AddRoad";
import { format } from "date-fns";
import { ar } from 'date-fns/locale';
export default function Home() {

  const [type, setType] = useState('السائقين');
  const [loading, setLoading] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showAddRoad, setShowAddRoad] = useState(false);
  const Drivers = GetDocs('Drivers');
  const Roads = GetDocs('Roads');
  const metadata = GetDocs('metadata');

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
                          <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">اسم الخط</th>
                          <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">معدل الطرود</th>
                          <th className="px-4 py-2 text-center  font-extrabold text-black text-xs max-w-[300px]">طرود اليوم</th>
                          <th className="px-4 py-2 text-center  font-extrabold text-black text-xs max-w-[300px]">اسم السائق</th>
                          <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">ارسال تنبيه</th>
                          <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">ارسال الخط</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          Roads.map((road, index) => {
                            return <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.name}</td>
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.AvgOrders}</td>
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Input color='primary' className="max-w-[150px]" label='' /></div></td>
                              <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><Autocomplete
                                className="max-w-[150px]"
                                color="primary"
                                size="xs"
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
                              </Autocomplete></div></td>
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
        </div>
      </div>
    </div>
  );
}
