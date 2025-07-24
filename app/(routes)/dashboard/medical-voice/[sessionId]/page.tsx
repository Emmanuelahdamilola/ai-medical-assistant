'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AiDoctorAgent } from '../../_components/AiDoctorAgentCard';
import Image from 'next/image';
import { Circle, Loader, PhoneCall, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';

type SessionParams = {
  id: number,
  note: string,
  sessionId: string,
  selectedDoctor: AiDoctorAgent,
  report: JSON,
  createdOn: string,
  status: string,

};

type messages = {
  role: string,
  text: string,
};

export default function MedicalVoice() {
  const { sessionId } = useParams();
  const [sessionParams, setSessionParams] = useState<SessionParams>();
  const [startCall, setStartCall] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [speaking, setSpeaking] = useState<string | null>();
  const [transcript, setTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [voiceAnimating, setVoiceAnimating] = useState(false);

  useEffect(() => {
    if (sessionId) fetchSessionDetails();
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    const result = await axios.get(`/api/chat-session?sessionId=` + sessionId);
    // console.log("Fetched Session Data:", result.data);
    setSessionParams(result.data);
  };

  const handleCallStart = () => setStartCall(true);
  const handleCallEnd = () => setStartCall(false);

  const handleMessage = (message: any) => {
    if (message.type === 'transcript') {
      const { role, transcriptType, transcript } = message;
      console.log("Vapi Message:", message);
      if (transcriptType === 'partial') {
        setTranscript(transcript);
        setSpeaking(role);
        setVoiceAnimating(true);
      } else if (transcriptType === 'final' && transcript?.trim()) {
        setMessages(prev => [...prev, { role, text: transcript }]);
        setTranscript('');
        setSpeaking(null);
        setVoiceAnimating(false);
      }
    }
  };

  const StartCall = () => {
    setLoading(true);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_API_KEY!);
    setVapiInstance(vapi);

    // customize Vapi voice configuration logic
    const VapiVoiceConfig = {
      name: "AI Medical Assistant agent",
      firstMessage:
        "Hello, I’m your AI Medical Assistant. I’m here to listen, support, and guide you with your health concerns. What would you like to talk about today?",
      transcriber: {
        provider: 'assembly-ai',
        language: 'en'

      },
      voice: {
        provider: 'playht',
        voiceId: sessionParams?.selectedDoctor?.doctorVoiceId
      },
      model: {
        provider: 'openai',
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: sessionParams?.selectedDoctor?.agentPrompt
          }
        ]
      }
    }

    // @ts-ignore
    vapi.start(VapiVoiceConfig);
    vapi.on('call-start', () => {
      console.log('Call started');
      handleCallStart();
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
      handleCallEnd();
    });

    vapi.on('message', (message) => {
      console.log("Vapi Message:", message);
      handleMessage(message);
    });

    vapi.on('speech-start', () => {
      console.log('Speech started');
      setSpeaking('Assistant');
    });

    vapi.on('speech-end', () => {
      console.log('Speech ended');
      setSpeaking('user');
    });

    // vapi.on('call-start', handleCallStart);
    // vapi.on('call-end', handleCallEnd);
    // vapi.on('message', handleMessage);
    // vapi.on('speech-start', () => setSpeaking('Assistant'));
    // vapi.on('speech-end', () => setSpeaking('user'));
    vapi.on('error', (error: any) => {
      console.error("Vapi error:", error);
    });

    setLoading(false);
  };

  const endCall = () => {
    if (!vapiInstance) return;
    vapiInstance.stop();
    vapiInstance.off('call-start', handleCallStart);
    vapiInstance.off('call-end', handleCallEnd);
    vapiInstance.off('message', handleMessage);
    setStartCall(false);
    setVapiInstance(null);
  };

  const exportTranscriptAsPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(14);
    pdf.text('Consultation Transcript', 10, 10);
    messages.forEach((msg, index) => {
      pdf.text(`${msg.role.toUpperCase()}: ${msg.text}`, 10, 20 + index * 10);
    });
    pdf.save('consultation_transcript.pdf');
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-3xl font-bold mb-8 text-center bg-gradient-to-br from-purple-100 to-blue-200 bg-clip-text text-transparent"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Voice Consultation Interface
      </motion.h2>

      {sessionParams && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col items-center"
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src={sessionParams.selectedDoctor.image}
              alt={sessionParams.selectedDoctor.name}
              width={90}
              height={90}
              className="rounded-full border-4 border-blue-400 shadow-lg"
            />
            <h3 className="text-xl font-semibold mt-4 text-center">
              {sessionParams.selectedDoctor.name}
            </h3>
            <p className="text-sm text-gray-400">Specialty: {sessionParams.selectedDoctor.specialty}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-gray-400 text-sm">
                Created: {new Date(sessionParams.createdOn).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 text-sm">
                <Circle className={`w-3 h-3 ${startCall ? 'text-green-400' : 'text-red-400'}`} />
                {startCall ? 'Online' : 'Offline'}
              </span>
            </div>
          </motion.div>

          <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
            <h4 className="text-lg font-semibold mb-3">Consultation Transcript</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {messages.slice(-6).map((msg, idx) => (
                <motion.p
                  key={idx}
                  className="text-gray-300 text-sm"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <strong>{msg.role}:</strong> {msg.text}
                </motion.p>
              ))}
              {transcript && (
                <motion.p className="text-blue-400 font-medium">
                  {speaking}: {transcript}
                </motion.p>
              )}
            </div>

            {voiceAnimating && (
              <div className="w-8 h-8 rounded-full border-4 border-blue-400 animate-ping mx-auto my-4"></div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              {!startCall ? (
                <Button onClick={StartCall} disabled={loading}>
                  {loading ? <Loader className="animate-spin" /> : <PhoneCall />} Start Consultation
                </Button>
              ) : (
                <Button variant="destructive" onClick={endCall} disabled={loading}>
                  {loading ? <Loader className="animate-spin" /> : <PhoneOff />} End Consultation
                </Button>
              )}

              <Button variant="outline" onClick={exportTranscriptAsPDF} className="mt-2 text-gray-600">
                Export as PDF
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
