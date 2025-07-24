import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export type AiDoctorAgent = {

  id: number,
  name: string,
  specialty: string,
  description: string,
  image: string,
  agentPrompt: string,
  doctorVoiceId?:string
}


type props = {
  AiDoctorAgent: AiDoctorAgent,
}

export default function AiDoctorAgentCard({ AiDoctorAgent }: props) {
  return (
    <div className='w-full rounded-xl bg-gray-50 shadow-md' >
      <Image src={AiDoctorAgent.image} alt={AiDoctorAgent.name} width={200} height={200} className='bg-gray-200 w-full h-[300px] object-cover' />
      <div className='p-3'>
        <div className='flex items-center justify-between'>
          <h2 className='font-bold'>{AiDoctorAgent.name}</h2>
          <p className='text-sm border border-gray-500 rounded-lg px-1'>{AiDoctorAgent.specialty}</p>
        </div>
        <p className='line-clamp-2 text-gray-500 mt-3 '>{AiDoctorAgent.description}</p>
        <div className='flex justify-center items-center mt-5'>
          <Button>Start Consultation <IconArrowRight /></Button>
        </div>


      </div>

    </div>
  )
}
