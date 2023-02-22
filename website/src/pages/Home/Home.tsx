import React from 'react'
import { FiGlobe, FiTool, FiServer, FiUsers, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { ApplicationItem } from '../../components/ApplicationItem'
import { FunctionItem } from '../../components/FunctionItem'

function Home() {
    return (<>
        <HeroSection />
        <FeaturesSection />
        <OpenSourceSection />
        <CallToActionSection />
    </>
    )
}

const HeroSection = () => {
    return (
        <section className="px-2 py-32 md:px-0 tails-selected-element">
            <div className="container items-center max-w-6xl px-5 mx-auto space-y-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-left text-white sm:text-5xl md:text-6xl md:text-center">
                    <span className="block">Build applications <span className="block mt-1 text-orange-400 lg:inline lg:mt-0" data-primary="orange-500"> blazing fast.</span></span>
                </h1>
                <p className="w-full mx-auto text-base text-left text-zinc-500 sm:text-lg lg:text-xl md:max-w-3xl md:text-center">
                    Develop backend services, data pipelines and business workflows blazing fast using functions as building blocks.
                </p>
                <div className="flex flex-col justify-center md:flex-row md:space-x-4">
                    <a href="#_" className="flex items-center font-medium w-full px-6 py-3 mb-3 text-lg text-white bg-orange-500 rounded-md md:mb-0 hover:bg-orange-600 md:w-auto" data-primary="orange-500" data-rounded="rounded-md">
                        Get Started
                    </a>
                    <a href="#_" className="flex items-center px-6 py-3 font-medium text-black bg-white rounded-md hover:bg-gray-100" data-rounded="rounded-md">
                        Documentation
                        <svg xmlns="http://www.w3.workspace/2000/svg" className="w-5 h-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
            <div className="container items-center max-w-5xl px-5 mx-auto mt-16 text-center">
                <img src="/hero.svg" className="" />
            </div>
        </section>
    )
}

const FeaturesSection = () => {
    const features = [
        {
            name: 'Discover functions & apps from marketplace',
            description:
                'Faasbase has a marketplace of opensoure functions and applications built by our community of developers that will help companies build applications faster and cheaper.',
            icon: FiGlobe,
        },
        {
            name: 'Develop apps using functions as building blocks',
            description:
                'Functions are building blocks of Faasbase, each one solving a unit of problem. These functions can be used to build applications and services by composing and connecting them together.',
            icon: FiTool,
        },
        {
            name: 'Deploy applications to your Cloud Provider',
            description:
                'Faasbase can deploy functions and applications to any cloud providers with automatic deployments based on changes from git or by push of a button from our dashboard.',
            icon: FiServer,
        },
    ]

    return (
        <section className="bg-zinc-800 py-32">
            <div className="">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-lg font-semibold text-orange-600">How it works?</h2>
                        <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-white sm:text-4xl">
                            Discover {"->"} Develop {"->"} Deploy
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-zinc-500 lg:mx-auto">
                            Faasbase helps companies Discover, Develop, and Deploy functions and applications faster and cheaper.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="flex justify-center items-center">
                            <div className="flex-1">
                                <img src="/develop.svg" className="w-full h-full" />
                            </div>
                            <div className="space-y-10 flex-col flex-1 mt-8">
                                {features.map((feature) => (
                                    <div key={feature.name} className="flex justify-start items-start gap-4">
                                        <div className="flex p-2 items-center justify-center rounded-md bg-orange-500 text-white">
                                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <div className="flex-col justify-start items-start gap-8">
                                            <div>
                                                <span className="text-lg font-medium leading-6 text-white">{feature.name}</span>
                                            </div>
                                            <div className="mt-2">
                                                <span className="mt-4 text-zinc-500">{feature.description}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


const OpenSourceSection = () => {
    const features = [
        {
            name: 'Support open source ecosystem',
            description:
                'Faasbase uses a part of its revenue to sponsor open source projects and events, so by using Faasbase, you contribute towards the growth of open source ecosystem.',
            icon: FiGlobe,
        },
        {
            name: 'Request for Functions and Applications',
            description:
                'Faasbase helps companies to ship their products faster and at a lower cost by enabling them to hire developers from the community to build a specific function and application.',
            icon: FiTool,
        },
        {
            name: 'Collaborate with the global community',
            description:
                'Using Faasbase, developers and companies around the world can now collaborate to build functions and applications for the marketplace to make everyone ship and iterate faster.',
            icon: FiUsers,
        },
    ]

    return (
        <section className="bg-zinc-800 py-32">
            <div className="">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-lg font-semibold text-orange-600">Community First</h2>
                        <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-white sm:text-4xl">
                            We love & support open source
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-zinc-500 lg:mx-auto">
                            Faasbase is the perfect way to support the open source ecosystem while getting your products to market faster and at a lower cost.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="flex justify-center items-center">

                            <div className="space-y-10 flex-col flex-1 mt-8">
                                {features.map((feature) => (
                                    <div key={feature.name} className="flex justify-start items-start gap-4">
                                        <div className="flex p-2 items-center justify-center rounded-md bg-orange-500 text-white">
                                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <div className="flex-col justify-start items-start gap-8">
                                            <div>
                                                <span className="text-lg font-medium leading-6 text-white">{feature.name}</span>
                                            </div>
                                            <div className="mt-2">
                                                <span className="mt-4 text-zinc-500">{feature.description}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1">
                                <img src="/collab.svg" className="w-full h-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const CallToActionSection = () => {
    return (
        <section>
            <div className="my-16 container rounded-2xl mx-auto w-full p-16 pt-24">
                <div className="flex flex-col justify-center items-center">
                    <h2 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-white sm:text-4xl">Join our Community</h2>
                    <p className="mt-4 max-w-2xl text-xl text-center text-zinc-500 lg:mx-auto">
                        Join our open community of developers and companies to build functions and applications collaboratively.
                    </p>
                </div>
                <div className="flex justify-around items-center gap-12 p-20">
                    <div className="flex flex-col gap-6 justify-between items-start rounded-md bg-zinc-800 ring-zinc-700 ring-1 p-8 flex-1">
                        <div className="flex justify-center items-center w-16 h-16 bg-white rounded-md p-2">
                            <img src="/discord.svg" className="h-full w-full" />
                        </div>
                        <div className="flex flex-col gap-5">
                            <div> <span className="text-xl font-semibold text-white">Discord Community</span></div>
                            <div> <p className="text-zinc-400 text-sm">Get live support, and stay up to date on product and event announcements.</p> </div>
                            <div> <a href="#" className="flex items-center justify-center rounded-md bg-indigo-400 px-4 py-2 font-medium text-white shadow-sm">Join Server</a></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 justify-between items-start rounded-md bg-zinc-800 ring-zinc-700 ring-1 p-8 flex-1">
                        <div className="flex justify-center items-center w-16 h-16 bg-white rounded-md p-2">
                            <img src="/github.png" className="h-full w-full" />
                        </div>
                        <div className="flex flex-col gap-5">
                            <div> <span className="text-xl font-semibold text-white">Github Workspace</span></div>
                            <div> <p className="text-zinc-400 text-sm">Check out our open source repo, request new features, or contribute.</p> </div>
                            <div> <a href="#" className="flex items-center justify-center rounded-md bg-zinc-500 px-4 py-2 font-medium text-white shadow-sm">Open Source Repos</a></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6  justify-between items-start rounded-md bg-zinc-800 ring-zinc-700 ring-1 p-8 flex-1">
                        <div className="flex justify-center items-center w-16 h-16 bg-white rounded-md p-2">
                            <img src="/twitter.svg" className="h-full w-full" />
                        </div>
                        <div className="flex flex-col gap-5">
                            <div> <span className="text-xl font-semibold text-white">Twitter Account</span></div>
                            <div> <p className="text-zinc-400 text-sm">Follow us on twitter to stay up to date in product and event announcements.</p> </div>
                            <div> <a href="#" className="flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 font-medium text-white shadow-sm">Follow Us</a></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home