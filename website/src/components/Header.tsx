import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { FiChevronDown, FiCommand, FiHome, FiPackage, FiPlus, FiSearch, FiSettings, FiUser, FiUsers } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export const Header = () => {
    const isAuthenticated = true
    return (
        <div id="header" className="flex sticky top-0 z-50 justify-between border-b border-zinc-700 bg-zinc-800 flex-1">
            <div className="relative mx-auto flex h-16 justify-between lg:container">

                <div className="flex justify-center items-center gap-4">
                    <Link to={"/"}><img className="h-8" src="/faasly.svg" /></Link>
                </div>
                {/* <div className="flex justify-center items-center flex-1 mx-52 py-4">
                    <div className="flex justify-center items-center bg-zinc-700 border-zinc-700 ring-2 focus-within:ring-zinc-600 ring-zinc-700 rounded-md w-full">
                        <div className="flex justify-center items-center bg-zinc-800 focus-within:bg-zinc-900 flex-1 h-full py-2 px-4 rounded-l-md">
                            <input type={"text"} className="text-white focus:ring-0 bg-transparent border-none focus-visible:outline-none h-6 w-full placeholder:text-zinc-500" placeholder="Search functions or applications" />
                        </div>
                        <div className="flex justify-center items-center py-2 px-6">
                            <FiSearch className="text-white text-xl" />
                        </div>
                    </div>
                </div> */}
                <div className="flex justify-center items-center gap-4">
                    <a href="#" className="flex items-center justify-center rounded-md px-4 py-2  bg-zinc-700 font-medium text-white shadow-sm hover:bg-zinc-700">Sign In</a>
                    <a href="#" className="flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-orange-600">Get Started</a>

                </div>
            </div>
        </div>
    )
}
