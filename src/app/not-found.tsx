import Image from 'next/image'
import Link from 'next/link'
import { Home } from 'lucide-react';
export default function NotFound() {
    return (
        <div className=' w-4/5 grid grid-cols-2 items-center mx-auto h-screen'>
            <div className='flex justify-center'>
                <Image src={'/lisa.png'} alt='lisa' width={250} height={250} />
            </div>
            <div>
                <h2 className='font-bold text-6xl mb-4'>Nothing here sweetheart...</h2>
                <p className='text-xl mb-4'>Maybe they sent you a wrong link doesn't exist?</p>
                <div className='flex gap-2 border-b-primary border-b-2 w-fit'>
                    <Home />
                    <Link href="/" className='text-xl text-primary font-bold'>  Either way, remember there is always a way home</Link>
                </div>
            </div>
        </div>
    )
}