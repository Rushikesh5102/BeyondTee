/* eslint-disable */
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center font-outfit">
            <h1 className="text-9xl font-bold text-[#ccff00]">404</h1>
            <h2 className="text-2xl mb-8">Page Not Found</h2>
            <p className="text-zinc-500 mb-8 max-w-md text-center">
                It looks like this design doesn't exist yet.
                Head back to the lab and create something new.
            </p>
            <Link href="/" className="btn-primary px-8 py-3">
                Return Home
            </Link>
        </div>
    )
}
