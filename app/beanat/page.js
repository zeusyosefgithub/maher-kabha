'use client';
import { Accordion, AccordionItem, Button, Card, CardBody, Divider, Spinner, Table, TableBody,TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import Image from "next/image";
import React, { useState } from "react";
import { FaClipboardList, FaEdit, FaPlus, FaProjectDiagram, FaUserAlt } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import { FcManager } from "react-icons/fc";
import AddDriver from "../Modals/AddDriver";
import GetDocs from "../FireBase/getDocs";
import AddRoad from "../Modals/AddRoad";
import AddTajer from "../Modals/AddTajer";
import { Alert } from "@mui/material";
import ShowRoads from "../Modals/ShowRoads";
import { LiaClipboardListSolid } from "react-icons/lia";
import { RiArchiveStackFill } from "react-icons/ri";
import { format, getDaysInMonth } from "date-fns";
import { arSA } from "date-fns/locale";
import { useGetDataByConditionWithoutUseEffect } from "../FireBase/getDataByCondition";


export default function beanat() {
    const [type, setType] = useState('السائقين');
    const [loading, setLoading] = useState(false);
    const [showAddDriver, setShowAddDriver] = useState(false);
    const [showAddRoad, setShowAddRoad] = useState(false);
    const [showAddTajer, setShowAddTajer] = useState(false);
    const Drivers = GetDocs('Drivers');
    const Roads = GetDocs('Roads');
    const metadata = GetDocs('metadata');
    const Tojar = GetDocs('Tojar');
    const [showAlert, setShowAlert] = useState(false);
    const [showRoads, setShowRoads] = useState(false);
    const [roadShow, setRoadShow] = useState({});
    const [showPropsRoads, setShowPropsRoads] = useState(false);



    const [AedaraDates, setAedaraDates] = useState([]);
    const [loadingSpinner, setLoadinSpinner] = useState(false);
    const [clickedYom, setClickedYom] = useState(false);

    const GetHodshem = () => {
        let newArray = [];
        for (let index = 0; index < 12; index++) {
            let munth = `${format(new Date(), 'yyyy')}-${index < 10 ? ('0' + (index + 1)) : index + 1}`;
            newArray.push({
                name: format(munth, 'LLLL', { locale: arSA }),
                dateShow: `${index < 10 ? ('0' + (index + 1)) : index + 1}-${format(new Date(), 'yyyy')}`,
                date: `${format(new Date(), 'yyyy')}-${index < 10 ? ('0' + (index + 1)) : index + 1}`,
                id: index + 1
            });
        }
        return newArray;
    }

    const GetYmem = (month) => {
        let newArray = [];
        let AadHkhshav = parseInt(getDaysInMonth(month));
        for (let index = 0; index < AadHkhshav; index++) {
            let dayOfMonth = index + 1;
            let dateStr = `${dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth}-${format(month, 'MM-yyyy')}`;
            let currentDate = new Date(format(month, 'yyyy-MM') + `-${dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth}`);

            newArray.push({
                name: format(currentDate, 'EEEE', { locale: arSA }),
                date: dateStr,
                id: index + 1
            });
        }
        return newArray;
    };

    const toggleYom = (val) => {
        setLoadinSpinner(true);
        if (!AedaraDates?.some(item => item?.date === val)) {
            useGetDataByConditionWithoutUseEffect('AedaraMony', 'date', '==', val, (result) => {
                if (Array.isArray(result)) {
                    console.log(result);
                    const sortedResult = result.sort((a, b) => b.idnum - a.idnum);
                    setAedaraDates(prev => {
                        if (Array.isArray(prev)) {
                            return [...prev, sortedResult[0]];  // Add the single object
                        }
                        return [sortedResult[0]];  // Initialize array if prev is not an array
                    });
                } else {
                    console.error('Expected result to be an array, but got:', result);
                }
                setLoadinSpinner(false);
            }, (error) => {
                console.error('Error fetching data:', error);
                setLoadinSpinner(false);
            });
        } else {
            setLoadinSpinner(false);
        }
    };

    return (
        <div dir='rtl'>
            <ShowRoads showMessage={() => {
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 1500);
            }} Roads={Roads} Drivers={Drivers} metadata={metadata} road={roadShow} show={showRoads} disable={() => setShowRoads(false)} />
            <AddDriver showMessage={() => {
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 1500);
            }} metadata={metadata} Drivers={Drivers} show={showAddDriver} disable={() => setShowAddDriver(false)} />
            <AddRoad showMessage={() => {
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 1500);
            }} Roads={Roads} metadata={metadata} Drivers={Drivers} show={showAddRoad} disable={() => setShowAddRoad(false)} />
            <AddTajer showMessage={() => {
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 1500);
            }} Tojar={Tojar} Roads={Roads} metadata={metadata} Drivers={Drivers} show={showAddTajer} disable={() => setShowAddTajer(false)} />
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
                            <div className='w-1/3'>
                                <Card className='h-full pt-16 pb-16'>
                                    <CardBody>
                                        <div className="h-full flex items-center flex-wrap w-full justify-center border-b-1">
                                            <Button variant='flat' color={type === 'الارشيف' ? 'primary' : 'default'} className='w-full' onClick={() => setType('الارشيف')}>
                                                <RiArchiveStackFill className='text-xl w-full text-right' />
                                                <div className='w-full text-right'>الارشيف</div>
                                            </Button>
                                        </div>
                                        <div className="h-full flex items-center flex-wrap w-full justify-center border-b-1">
                                            <Button variant='flat' color={type === 'السائقين' ? 'primary' : 'default'} className='w-full' onClick={() => setType('السائقين')}>
                                                <FaUserAlt className='text-xl w-full text-right' />
                                                <div className='w-full text-right'>السائقين</div>
                                            </Button>
                                        </div>
                                        <div className="h-full flex items-center flex-wrap w-full justify-center">
                                            <Button variant='flat' color={type === 'التجار' ? 'primary' : 'default'} className='w-full' onClick={() => setType('التجار')}>
                                                <FcManager className='text-xl w-full text-right' />
                                                <div className='w-full text-right'>التجار</div>
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
                                    </CardBody>
                                </Card>
                            </div>
                            <div className='w-full'>
                                <Card className='mr-5 h-full'>
                                    <CardBody>
                                        <div className='w-full flex justify-center items-center p-3 border-b-1'>
                                            <div className='flex items-center'>
                                                {
                                                    type === 'الارشيف' && <RiArchiveStackFill className='text-xl ml-2' />
                                                }
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
                                                <div className='text-xl w-[200px] text-right'>{type}</div>
                                            </div>
                                            <div className='w-full'>
                                                {
                                                    type === 'السائقين' && <Button size="sm" color="primary" variant="flat" onClick={() => setShowAddDriver(true)}>
                                                        <div>اضافة</div>
                                                        <FaPlus />
                                                    </Button>
                                                }
                                                {
                                                    type === 'الخطوط' && <>
                                                        <Button size="sm" color="primary" variant="flat" onClick={() => setShowAddRoad(true)}>
                                                            <div>اضافة</div>
                                                            <FaPlus />
                                                        </Button>
                                                    </>
                                                }
                                                {
                                                    type === 'التقارير المالية' && <Button size="sm" color="primary" variant="flat" onClick={() => setShowAddDriver(true)}>
                                                        <div>اضافة</div>
                                                        <FaPlus />
                                                    </Button>
                                                }
                                                {
                                                    type === 'التجار' && <Button size="sm" color="primary" variant="flat" onClick={() => setShowAddTajer(true)}>
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
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Drivers?.map((driver, index) => {
                                                                return <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"></td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{driver.name}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{driver.number}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{driver.AvgOrders}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><FaEdit onClick={() => { setShowRoads(true); setRoadShow(road); }} className="text-xl text-primary cursor-pointer" /></div></td>
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        }
                                        {
                                            type === 'التجار' && <div>
                                                <table className="w-full table-auto border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs"></th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">اسم التاجر</th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs">رقم التاجر</th>
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Tojar?.map((item, index) => {
                                                                return <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"></td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{item.name}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{item.number}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><FaEdit onClick={() => { setShowRoads(true); setRoadShow(road); }} className="text-xl text-primary cursor-pointer" /></div></td>
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
                                                            <th className="px-4 py-2 text-center  font-extrabold text-black text-xs"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Roads?.map((road, index) => {
                                                                return <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"></td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.name}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.driver}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.orderPrice}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road.avgOrders}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs">{road?.towns?.length}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 text-xs"><div className="flex justify-center"><FaEdit onClick={() => { setShowRoads(true); setRoadShow(road); }} className="text-xl text-primary cursor-pointer" /></div></td>
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        }
                                        {
                                            type === 'الارشيف' && <div className="flex items-center">
                                                <div className="w-full">
                                                    <Accordion selectionMode='multiple' className="w-full">
                                                        {
                                                            GetHodshem()?.map((hodesh, index1) => {
                                                                return <AccordionItem title={<div className="flex items-center "><div className="w-[200px]">{hodesh.name}</div><div>{hodesh.dateShow}</div></div>} key={index1}>
                                                                    <div className="mr-5 ml-5">
                                                                        <Accordion selectionMode='multiple' className="w-full">
                                                                            {
                                                                                GetYmem(hodesh.date)?.map((Yom, index2) => {
                                                                                    return <AccordionItem onClick={() => { toggleYom(Yom.date); setClickedYom(Yom.date) }} title={<div className="flex items-center "><div className="w-[200px]">{Yom.name}</div><div>{Yom.date}</div></div>} key={index2}>
                                                                                        {
                                                                                            clickedYom === Yom.date && loadingSpinner && <Spinner className="z-50 flex justify-center m-5" />
                                                                                        }
                                                                                        {
                                                                                            AedaraDates?.map((aed, index3) => {
                                                                                                return aed?.date === Yom.date && <>
                                                                                                    <Table aria-label="Example static collection table">
                                                                                                        <TableHeader>
                                                                                                            <TableColumn>اسم الخط</TableColumn>
                                                                                                            <TableColumn>اسم السائق</TableColumn>
                                                                                                            <TableColumn>الطرود المسلمة</TableColumn>
                                                                                                            <TableColumn>التحصيل الكلي</TableColumn>
                                                                                                            <TableColumn>تكلفة السائق</TableColumn>
                                                                                                            <TableColumn>ربح التوصيل</TableColumn>
                                                                                                        </TableHeader>
                                                                                                        <TableBody>
                                                                                                            {
                                                                                                                aed?.aedartMoney?.map((khat, index4) => {
                                                                                                                    return khat.driverName && <TableRow key={index4}>
                                                                                                                        <TableCell>{khat?.name}</TableCell>
                                                                                                                        <TableCell>{khat?.driverName}</TableCell>
                                                                                                                        <TableCell>{khat?.takedOrders}</TableCell>
                                                                                                                        <TableCell>{khat?.sumOrders}</TableCell>
                                                                                                                        <TableCell>{parseFloat(khat?.takedOrders) * parseFloat(khat?.orderPrice)}</TableCell>
                                                                                                                        <TableCell>{parseFloat(khat?.valueOrders) - (parseFloat(khat?.takedOrders) * parseFloat(khat?.orderPrice))}</TableCell>
                                                                                                                    </TableRow>
                                                                                                                })
                                                                                                            }
                                                                                                        </TableBody>
                                                                                                    </Table>
                                                                                                    <Table className="mt-5">
                                                                                                        <TableHeader>
                                                                                                            <TableColumn>اسم التاجر</TableColumn>
                                                                                                            <TableColumn>الرقم التسلسلي</TableColumn>
                                                                                                            <TableColumn>التحصيل</TableColumn>
                                                                                                        </TableHeader>
                                                                                                        <TableBody>
                                                                                                            {
                                                                                                                aed?.aedaraTojar?.map((taj, index5) => {
                                                                                                                    return taj?.sum && <TableRow key={index5}>
                                                                                                                        <TableCell>{taj?.name}</TableCell>
                                                                                                                        <TableCell>{taj?.serialNumber}</TableCell>
                                                                                                                        <TableCell>{taj?.sum}</TableCell>
                                                                                                                    </TableRow>
                                                                                                                })
                                                                                                            }
                                                                                                        </TableBody>
                                                                                                    </Table>
                                                                                                </>
                                                                                            })
                                                                                        }
                                                                                    </AccordionItem>
                                                                                })
                                                                            }
                                                                        </Accordion>
                                                                    </div>
                                                                </AccordionItem>
                                                            })
                                                        }
                                                    </Accordion>
                                                </div>
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