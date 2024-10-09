'use client';
import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import Image from "next/image";
import React, { useState } from "react";
import { FaClipboardList, FaPlus, FaProjectDiagram, FaUserAlt } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import { FcManager } from "react-icons/fc";
import AddDriver from "../Modals/AddDriver";
import GetDocs from "../FireBase/getDocs";
import AddRoad from "../Modals/AddRoad";


export default function beanat() {
    const [type, setType] = useState('السائقين');
    const [loading, setLoading] = useState(false);
    const [showAddDriver, setShowAddDriver] = useState(false);
    const [showAddRoad, setShowAddRoad] = useState(false);
    const Drivers = GetDocs('Drivers');
    const Roads = GetDocs('Roads');
    const metadata = GetDocs('metadata');




    return (
        <div dir='rtl'>
            <AddDriver metadata={metadata} Drivers={Drivers} show={showAddDriver} disable={() => setShowAddDriver(false)} />
            <AddRoad Roads={Roads} metadata={metadata} Drivers={Drivers} show={showAddRoad} disable={() => setShowAddRoad(false)} />
            <div className='p-10'>
                <div className='h-[600px]'>
                    <div className='h-full'>
                        <div className='w-full flex h-full p-5'>
                            <div className='w-1/3'>
                                <Card className='h-full pt-16 pb-16'>
                                    <CardBody>
                                        <div className="h-full flex items-center flex-wrap w-full justify-center border-b-1">
                                            <Button variant='flat' color={type === 'السائقين' ? 'primary' : 'default'} className='w-full' onClick={() => setType('السائقين')}>
                                                <FaUserAlt className='text-xl w-full text-right' />
                                                <div className='w-full text-right'>السائقين</div>
                                            </Button>
                                        </div>
                                        <div className="h-full flex items-center flex-wrap w-full justify-center border-b-1">
                                            <Button variant='flat' color={type === 'الخطوط' ? 'primary' : 'default'} className='w-full' onClick={() => setType('الخطوط')}>
                                                <FaProjectDiagram className='text-xl w-full text-right' />
                                                <div className='w-full text-right'>الخطوط</div>
                                            </Button>
                                        </div>
                                        <div className="h-full flex items-center flex-wrap w-full justify-center border-b-1">
                                            <Button variant='flat' color={type === 'التقارير المالية' ? 'primary' : 'default'} className='w-full' onClick={() => setType('التقارير المالية')}>
                                                <FaClipboardList className='text-xl w-full text-right' />
                                                <div className='w-full text-right'>التقارير المالية</div>
                                            </Button>
                                        </div>
                                        <div className="h-full flex items-center flex-wrap w-full justify-center">
                                            <Button variant='flat' color={type === 'التجار' ? 'primary' : 'default'} className='w-full' onClick={() => setType('التجار')}>
                                                <FcManager className='text-xl w-full text-right' />
                                                <div className='w-full text-right'>التجار</div>
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className='w-full'>
                                <Card className='mr-5 h-full'>
                                    <CardBody>
                                        <div className='w-full flex justify-center items-center p-3 border-b-1'>
                                            <div className='flex items-center'>
                                                {
                                                    type === 'السائقين' && <FaUserAlt className='text-xl ml-2' />
                                                }
                                                {
                                                    type === 'الخطوط' && <FaProjectDiagram className='text-xl ml-2' />
                                                }
                                                {
                                                    type === 'التقارير المالية' && <FaClipboardList className='text-xl ml-2' />
                                                }
                                                {
                                                    type === 'التجار' && <FcManager className='text-xl ml-2' />
                                                }
                                                <div className='text-xl'>{type}</div>
                                            </div>
                                            <div className='w-full'>
                                                {
                                                    type === 'السائقين' && <Button size="sm" color="primary" variant="flat" onClick={() => setShowAddDriver(true)}>
                                                        <div>اضافة</div>
                                                        <FaPlus />
                                                    </Button>
                                                }
                                                {
                                                    type === 'الخطوط' && <Button size="sm" color="primary" variant="flat" onClick={() => setShowAddRoad(true)}>
                                                        <div>اضافة</div>
                                                        <FaPlus />
                                                    </Button>
                                                }
                                                {
                                                    type === 'التقارير المالية' && <Button size="sm" color="primary" variant="flat" onClick={() => setShowAddDriver(true)}>
                                                        <div>اضافة</div>
                                                        <FaPlus />
                                                    </Button>
                                                }
                                                {
                                                    type === 'التجار' && <Button size="sm" color="primary" variant="flat" onClick={() => setShowAddDriver(true)}>
                                                        <div>اضافة</div>
                                                        <FaPlus />
                                                    </Button>
                                                }
                                            </div>
                                        </div>
                                        {
                                            type === 'السائقين' && <div>
                                                <table className="w-full table-auto border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs"></th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">اسم السائق</th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">رقم السائق</th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">معدل التوصيل</th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">تفصيل</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Drivers.map((driver, index) => {
                                                                return <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"></td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{driver.name}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{driver.number}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{driver.AvgOrders}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><Button color='primary' variant='flat' size="sm" onClick={() => { setShowModalCreate(true); setTfaolAgla(agla); setMsbarDrag(agla.msbarAgla); setMsbarLkoh(agla.msbarLkoh); }}>دخول</Button></td>
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        }
                                        {
                                            type === 'الخطوط' && <div>
                                                <table className="w-full table-auto border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs"></th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">اسم الخط</th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">السائق الشائع</th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">اجرة الطرد</th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">معدل الطرود</th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">عدد البلدان</th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">البلدان</th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">تفصيل</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Roads.map((road, index) => {
                                                                return <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"></td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.name}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.driver}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.orderPrice}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.avgOrders}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{123}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><Button color='primary' variant='flat' size="sm" onClick={() => { setShowModalCreate(true); setTfaolAgla(agla); setMsbarDrag(agla.msbarAgla); setMsbarLkoh(agla.msbarLkoh); }}>دخول</Button></td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><Button color='primary' variant='flat' size="sm" onClick={() => { setShowModalCreate(true); setTfaolAgla(agla); setMsbarDrag(agla.msbarAgla); setMsbarLkoh(agla.msbarLkoh); }}>دخول</Button></td>
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        }
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