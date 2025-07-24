'use client'
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AiDoctorAgent } from '../../_components/AiDoctorAgentCard';
import Image from 'next/image';
import { Circle, Loader, PhoneCall, PhoneOff, RollerCoaster } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';


type SessionParams = {
  id: number,
  note: string,
  sessionId: string,
  selectedDoctor: AiDoctorAgent,
  report: JSON,
  createdOn: string,
  status: string,

}

type messages = {
  role: string,
  text: string
}

export default function MedicalVoice() {
  // This is a placeholder for the session page
  const { sessionId } = useParams();
  const [sessionParams, setSessionParams] = useState<SessionParams>();
  const [startCall, setStartCall] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [speaking, setSpeaking] = useState<string | null>()
  const [transcript, setTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [voiceAnimating, setVoiceAnimating] = useState(false);



  useEffect(() => {
    // Fetch session details or perform any necessary actions when the component mounts
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  // You can use sessionId to fetch session details or perform other actions
  const fetchSessionDetails = async () => {
    // Fetch session details from an API or database
    const result = await axios.get(`/api/chat-session?sessionId=` + sessionId);
    console.log(result.data);
    console.log(sessionParams?.selectedDoctor.image);
    setSessionParams(result.data);
    // return result.data;
  }



  const handleCallStart = () => {
    console.log('Call started');
    setStartCall(true);
  };

  const handleCallEnd = () => {
    console.log('Call ended');
    setStartCall(false);
  };

  const handleMessage = (message: any) => {
    if (message.type === 'transcript') {
      const { role, transcriptType, transcript } = message;
      console.log(`${message.role}: ${message.transcript}`);
      if (transcriptType == 'partial') {
        setTranscript(transcript);
        setSpeaking(role);
        setVoiceAnimating(false);
      } else if (transcriptType == 'final' && transcript?.trim()) {
        setMessages((prev: any) => [...prev, { role: role, text: transcript }]);
        // set transcript to empty and speaking to null
        setTranscript("");
        setSpeaking(null);
        setVoiceAnimating(false);

      }

    }
  };


  const StartCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_API_KEY!);
    setVapiInstance(vapi);

    vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);

    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('message', handleMessage);

    // start speak logic
    vapi.on('speech-start', () => {
      console.log('Assistant started speaking');
      setSpeaking('Assistant');
    });

    // end speak logic
    vapi.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setSpeaking('user');
    });
  };

  // const StartCall = () => {
  //   const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_API_KEY!);
  //   setVapiInstance(vapi);

  //   vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);

  //   vapi.on('call-start', handleCallStart);
  //   vapi.on('call-end', handleCallEnd);
  //   vapi.on('message', handleMessage);

  //   // start speak logic
  //   vapiInstance.on('speech-start', () => {
  //     console.log('Assistant started speaking');
  //     setSpeaking('Assistant');
  //   })

  //   // end speak logic
  //   vapiInstance.on('speech-end', () => {
  //     console.log('Assistant stopped speaking');
  //     setSpeaking('user');
  //   })

  // };



  // end call vapi logic
  const endCall = () => {
    if (!vapiInstance) return;
    console.log('Ending the call...');

    vapiInstance.stop();

    vapiInstance.off('call-start', handleCallStart);
    vapiInstance.off('call-end', handleCallEnd);
    vapiInstance.off('message', handleMessage);

    setStartCall(false);
    setVapiInstance(null);
  };

  //  const exportTranscriptAsPDF = () => {
  //   const pdf = new jsPDF();
  //   pdf.setFontSize(14);
  //   pdf.text('Consultation Transcript', 10, 10);
  //   messages.forEach((msg, index) => {
  //     pdf.text(`${msg.role.toUpperCase()}: ${msg.text}`, 10, 20 + index * 10);
  //   });
  //   pdf.save('consultation_transcript.pdf');
  // };

  // const exportTranscriptAsText = () => {
  //   const textData = messages.map((msg) => `${msg.role}: ${msg.text}`).join('\n');
  //   const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = 'consultation_transcript.txt';
  //   link.click();
  // };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h2 className='text-gray-600 font-semibold text-2xl text-center mb-5'>
        Start Voice Consultation with: {sessionParams?.selectedDoctor?.name}
      </h2>

      {sessionParams && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white shadow-md p-4 rounded-lg flex flex-col items-center max-w-md'>
            <Image
              src={sessionParams.selectedDoctor.image}
              alt={sessionParams.selectedDoctor.name}
              width={80}
              height={80}
              className='rounded-full w-24 h-24 object-cover border border-gray-300 mt-2'
            />
            <h3 className='mt-4 font-semibold text-xl text-center text-gray-700'>
              {sessionParams.selectedDoctor.name}
            </h3>
            <p className='text-gray-500 text-sm mt-1'>Specialty: {sessionParams.selectedDoctor.specialty}</p>
            <div className='mt-3 flex gap-4'>
              <span className='text-gray-500 text-sm'>
                Created: {new Date(sessionParams.createdOn).toLocaleDateString()}
              </span>
              <span className='flex items-center gap-2 text-sm'>
                <Circle className={`w-3 h-3 ${startCall ? 'bg-green-500' : 'bg-red-500'}`} />
                {startCall ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className='p-4 max-h-[60vh] overflow-y-auto'>
            <h4 className='font-semibold text-lg mb-3'>Consultation Transcript</h4>
            {messages && messages.slice(-4).map((msg, idx) => (
              <p key={idx} className='text-gray-600 text-sm mb-1'>
                <strong>{msg.role}:</strong> {msg.text}
              </p>
            ))}

            {transcript && (
              <p className='text-blue-600 font-medium'>
                {speaking}: {transcript}
              </p>
            )}

            {voiceAnimating && (
              <div className='w-8 h-8 rounded-full border-4 border-blue-400 animate-ping mx-auto mt-3'></div>
            )}

            <div className='mt-5 flex flex-col gap-3'>
              {!startCall ? (
                <Button onClick={StartCall} disabled={loading}>
                  {loading ? <Loader className='animate-spin' /> : <PhoneCall />} Start Consultation
                </Button>
              ) : (
                <Button variant='destructive' onClick={endCall} disabled={loading}>
                  {loading ? <Loader className='animate-spin' /> : <PhoneOff />} End Consultation
                </Button>
              )}

              {/* <div className='flex gap-3 mt-2'>
                <Button variant='outline' onClick={exportTranscriptAsPDF}>
                  Export PDF
                </Button>
                <Button variant='outline' onClick={exportTranscriptAsText}>
                  Export Text
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
    // <div className='flex flex-col items-center justify-center h-screen'>
    //   <h2 className='text-gray-600 font-semibold text-center text-2xl mb-5'>Start Voice Consultation</h2>

    //   {sessionParams && <div >
    //     <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
    //       <div className='flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-md max-w-md w-full'>
    //         <Image src={sessionParams?.selectedDoctor.image} alt={sessionParams?.selectedDoctor.name} width={80} height={80} className='rounded-full w-25 h-25 object-cover border-2 border-gray-300 shadow-md mt-4 bg-accent' />
    //         <h2 className='text-gray-600 font-semibold text-center text-xl mt-4'>{sessionParams?.selectedDoctor.name}</h2>
    //         <p className='text-gray-500 text-center mt-1'>Specialization: {sessionParams?.selectedDoctor.specialty}</p>

    //         <div className='flex items-center gap-4 rounded-lg max-w-md mx-auto'>

    //           <p className='text-gray-500 text-center mt-1 inline-flex'>Created On: {new Date(sessionParams?.createdOn).toLocaleDateString()}</p>
    //           <p className='text-gray-500 text-center flex items-center gap-1'> Status: {sessionParams?.status}
    //             <span><Circle className={`w-3 h-3 rounded-full ${startCall ? 'text-green-600' : 'text-red-500'}`} /> {startCall ? `Active` : `Inactive`}</span>
    //           </p>
    //         </div>
    //       </div>

    //       <div className='mt-4 '>
    //         <h2>Consultation Dialog</h2>
    //         <p className='text-gray-500 font-medium text-md'>Medical Assistant message</p>
    //         {transcript && transcript?.length > 0 && <h3 className='text-gray-700'>{speaking}:{transcript}</h3>}

    //         {!startCall} ? <Button className='mt-20' onClick={StartCall}>Start Consultation</Button>
    //         :
    //         <Button variant={'destructive'} onClick={endCall}>End Consultation</Button>
    //       </div>
    //     </div>

    //   </div>}
    // </div>
  )
}
