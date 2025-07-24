import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

export default function Header() {
  const menu = [
    {
      id: 1,
      name: 'Home',
      path: '/home'
    },
    {
      id: 2,
      name: 'About',
      path: '/about'
    },
    {
      id: 3,
      name: 'My History',
      path: '/history'
    },
    {
      id: 4,
      name: 'Features',
      path: '/features'
    },
    {
      id: 5,
      name: 'Contact',
      path: '/contact'
    },
    {
      id: 6,
      name: 'Profile',
      path: '/profile'
    }

  ]
  return (
    <div className='flex items-center justify-between px-10 md:px-20 lg:40 xl:60 bg-gray-50 shadow-lg '>
      <div className='flex items-center gap-2'>
        <Image src={'/logo.png'} alt='logo' width={50} height={50} />
        <h1 className="text-base font-bold md:text-2xl">Health Voice</h1>
      </div>

      <div className='hidden md:flex gap-10 items-center'>
        {menu.map((option, index) => (
          <div key={index} >
            <h2 className='font-semibold cursor-pointer text-purple-800 hover:text-violet-400 transition-all'>{option.name}</h2>
          </div>
        ))}
      </div>
      <UserButton />
    </div>
  )
}
