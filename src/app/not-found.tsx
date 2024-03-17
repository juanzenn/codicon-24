import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='w-4/5 mx-auto h-screen'>
            <div>
                <h2 className='font-bold text-6xl'>Nothing here sweetheart...</h2>
                <p>Maybe they sent you a wrong link or the album doesn't exist? Either way, remember there is always a way <Link href="/">Home</Link></p>
            </div>
        </div>
    )
}