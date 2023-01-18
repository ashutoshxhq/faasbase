import React from 'react'
import { FiDownload, FiMoreHorizontal, FiStar } from 'react-icons/fi'
import { Link } from 'react-router-dom';

interface FunctionItemProps {
    name: string;
    to: string;
    description: string;
    version: string;
    stars: number;
    installs: number
}

export const FunctionItem = (props: FunctionItemProps) => {
    return (
        <div className='flex-1 p-6 bg-zinc-800 rounded-md flex flex-col gap-1'>
            {/* <div className='w-full h-48 rounded-md bg-zinc-700'>
                <img src="/github.png" className='w-full h-full bg-cover' />
            </div> */}
            <div className="flex justify-between items-center py-2">
                <Link to={props.to} className="text-white font-medium text-lg hover:cursor-pointer">{props.name}</Link>
                <div className="hover:cursor-pointer">
                    <FiMoreHorizontal className="h-6 w-6" />
                </div>
            </div>
            <div className="py-0">
                <span className="text-zinc-500 font-medium text-sm">{props.description}</span>
            </div>
            <div className="flex gap-2 pt-4">
                <div className="p-1 px-4 bg-zinc-700 rounded-full">
                    <span className="text-zinc-400 text-xs">v{props.version}</span>
                </div>
                <div className="p-1 px-4 bg-zinc-700 rounded-full flex justify-center items-center gap-1">
                    <FiStar className="text-zinc-400 text-xs" />
                    <span className="text-zinc-400 text-xs"> {props.stars}</span>
                </div>
                <div className="p-1 px-4 bg-zinc-700 rounded-full  flex justify-center items-center gap-1">
                    <FiDownload className="text-zinc-400 text-xs" />
                    <span className="text-zinc-400 text-xs">{props.installs}</span>
                </div>
            </div>
        </div>
    )
}
