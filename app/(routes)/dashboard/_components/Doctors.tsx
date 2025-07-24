import { AiDoctorList } from '@/shared/doctorList'
import React from 'react'
import AiDoctorAgentCard from './AiDoctorAgentCard'

export default function AIDoctors() {
  return (
    <div className='mt-10'>
      <h2 className='text-center font-bold text-2xl pt-5 pb-3 '>Consult with AI Doctors</h2>
      <p className='text-center text-lg italic mb-5'>Select a doctor to get started</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6'>
    {
      AiDoctorList.map((doctor, index) => (
        <div key={index}>
         <AiDoctorAgentCard AiDoctorAgent={doctor}/>
        </div>
      ))
    }
      </div>
    
    </div>
  )
}
