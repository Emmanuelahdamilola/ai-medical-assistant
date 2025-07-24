
import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default function Navbar() {
  const {user} = useUser();
   return (
    
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        {/* <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" /> */}
       
      </div>
      {!user ?  
      <Link href={'/sign-in'}>
      <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
        Login
      </button>
      </Link>
      :
      <div className='flex items-center gap-4'>
        <UserButton/>
        <Link href={'/dashboard'}><Button>Dashboard</Button></Link>
      </div>
      }
      
    </nav>
  );
}

