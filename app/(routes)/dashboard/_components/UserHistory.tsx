"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog';

export default function UserHistory() {
  const [history, setHistory] = useState([]);


  return (
    <div>
      {history.length == 0 ?
      <div className='flex flex-col items-center justify-center h-96'>
        <Image src={'/assistant-doctors.png'} width={200} height={200} alt="No History"/>
        <h2 className='text-lg font-semibold pt-3'>No Consultation History</h2>
        <p className='text-gray-500'>You haven't consulted with any doctor yet.</p>
        <AddNewSessionDialog/>

        <p className='text-gray-500 mt-2'>You can also <Link href="/contact" className='text-blue-500 hover:underline'>contact support</Link> if you have any questions.</p>
      </div>
      :
      <div>History List</div>
      }
    </div>
  )
}
