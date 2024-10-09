'use client';
import React, { useContext, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuItem, NavbarMenuToggle, NavbarMenu, Divider } from "@nextui-org/react";
import { useAuth } from "../auth/authContext";
import ContactContext from "../auth/ContactContext";
import { MdExitToApp } from "react-icons/md";
import { GrMoney, GrStorage } from "react-icons/gr";
import { IoMdHome } from "react-icons/io";
import { FaHome, FaProjectDiagram, FaWarehouse } from "react-icons/fa";


export default function NavBar() {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { signUp, signIn, signOutt, currentUser } = useAuth();
    const { contactName, setContactName, customerSet, setCustomerSet, isNehol, setIsNehol } = useContext(ContactContext);
    const menuItems = [
        "الصفحة الرئيسية",
        "المخزون",

    ];

    return (
        <>
            <Navbar className="border-b-1 fixed" dir="rtl" onMenuOpenChange={setIsMenuOpen}>
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarBrand>
                        <div className="font-bold text-inherit"></div>
                    </NavbarBrand>
                </NavbarContent>

                <div className="w-full">
                    <NavbarContent className="hidden sm:flex" justify='center'>
                        <NavbarItem>
                            <Link color="foreground" href="/aedara">
                                <Button variant="flat" color='primary' className="text-lg"><FaProjectDiagram className="text-2xl text-primary" />ادارة الخطوط</Button>
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="/">
                                <Button variant="flat" color='warning' className="text-lg"><GrMoney className="text-2xl text-warning" />الادارة المالية</Button>
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="/beanat">
                                <Button variant="flat" color='success' className="text-lg"><GrStorage className="text-2xl text-success" />البيانات</Button>
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Button onClick={signOutt} color="danger" variant="flat">
                                <MdExitToApp className="text-2xl" />تسجيل خروج
                            </Button>
                        </NavbarItem>
                    </NavbarContent>
                </div>


                <NavbarMenu>
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                className="w-full hover:bg-primary-50"
                                href="#"
                                size="lg"
                            >
                                <div className="text-right w-full">{item}</div>
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>

            </Navbar>
            <div className="mt-20" />
        </>
    )
}