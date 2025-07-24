import React from 'react'
import UserHistory from './_components/UserHistory'
import Doctors from './_components/Doctors'
import AddNewSessionDialog from './_components/AddNewSessionDialog'

export default function Dashboard() {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <h2>My Dashboard</h2>
       <AddNewSessionDialog/>
      </div>
      <div className='mt-5'>
        <UserHistory />
        <Doctors />
      </div>
      </div>
  )
}
