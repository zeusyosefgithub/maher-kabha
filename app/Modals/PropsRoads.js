'use client';
import { Accordion, AccordionItem, Autocomplete, AutocompleteItem, Avatar, Button, Card, CardBody, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Spinner, Switch, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, Tooltip } from "@nextui-org/react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { FaRegCheckSquare } from "react-icons/fa";
import { firestore } from "../FireBase/firebase";
import GetDocs from "../FireBase/getDocs";
import { IoCloseCircleSharp } from "react-icons/io5";
import DraggableCells from "../Components/DraggableCells";
import { Reorder } from "framer-motion";
import { format, getDaysInMonth } from "date-fns";
import { arSA } from 'date-fns/locale';
import { useGetDataByConditionWithoutUseEffect } from "../FireBase/getDataByCondition";

export default function PropsRoads({ show, disable }) {

    const ResetAll = () => {
        disable();
    }

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

    console.log(AedaraDates);




    return (
        <Modal placement="center" className="test-fontt" backdrop={"blur"} size="5xl" isOpen={show} onClose={ResetAll}>
            <ModalContent>
                <ModalHeader className="flex justify-center border-b-2">
                    تفصيل الخطوط
                </ModalHeader>
                <ModalBody className="border-b-2">
                    <div dir='rtl' className=''>
                        <Card>
                            <CardBody className="h-[400px] overflow-auto">
                                <div className="flex items-center">
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
                            </CardBody>
                        </Card>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="w-full flex justify-end">
                        <Button color="warning" variant="flat" size="" onClick={ResetAll}>
                            اغلاق
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


