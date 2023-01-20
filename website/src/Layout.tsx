import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'

const Layout = () => {
    const location = useLocation()

    useEffect(() => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }, [location])

    return (
        <div id="app" className="flex-col w-full bg-zinc-900 text-zinc-200">
            <Header />
            <div id="content" className="flex-1">
                <div className='flex-1 min-h-[calc(100vh-65px)]'>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Layout