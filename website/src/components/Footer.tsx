import { Link } from 'react-router-dom'
import React from 'react'

export const Footer = () => {
    return (
        <footer className="bg-zinc-800 border-t border-zinc-700 bottom-0">
            <div className="lg:container mx-auto w-full">
                {/* <div className="flex justify-between items-start border-b border-zinc-700 py-16 ">
                    <div className="flex flex-col justify-start items-start gap-4 max-w-md px-4">
                        <div className="flex-col justify-start items-start">
                            <img src="/Faasly.svg" loading="lazy" alt="Faasly logo" className="h-10" />
                        </div>
                        <div className="text-zinc-400">
                            Faasly helps engineering teams to develop and deploy scalable backend applications faster and cheaper.
                            <br />
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-4  px-4">
                        <span className="text-white font-semibold text-lg">Company</span>
                        <div className="flex flex-col justify-start items-start gap-2">
                            <Link className="text-zinc-400 hover:underline hover:text-white text-sm" to="/">Home</Link>
                            <a className="text-zinc-400 hover:underline hover:text-white text-sm" href="/community">Community</a>
                            <a className="text-zinc-400 hover:underline hover:text-white text-sm" href="/changelog">Changelog</a>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-4  px-4">
                        <span className="text-white font-semibold text-lg">Resources</span>
                        <div className="flex flex-col justify-start items-start gap-2">
                            <a className="text-zinc-400 hover:underline hover:text-white text-sm" href="https://developer.Faasly.com">Developers</a>
                            <a className="text-zinc-400 hover:underline hover:text-white text-sm" href="https://github.com/Faasly">Github Org</a>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-4  px-4">
                        <span className="text-white font-semibold text-lg">Legal</span>
                        <div className="flex flex-col justify-start items-start gap-2">
                            <a className="text-zinc-400 hover:underline hover:text-white text-sm" href="/privacy-policy">Privacy Policy</a>
                            <a className="text-zinc-400 hover:underline hover:text-white text-sm" href="/terms-of-service">Term of Service</a>
                        </div>
                    </div>
                </div> */}
                <div className="flex justify-between items-center py-8 px-4 text-zinc-400">
                    <div className="text-block-17">Copyright © 2022 Faasly. All rights reserved.</div>
                    <div className="text-block-17">support@faasly.dev</div>
                </div>
            </div>
        </footer>
    )
}
