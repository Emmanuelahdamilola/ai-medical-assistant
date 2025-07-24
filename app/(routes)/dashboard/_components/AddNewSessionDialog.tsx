'use client';
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@tabler/icons-react';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { AiDoctorAgent } from './AiDoctorAgentCard';
import { RecommendedDoctorCard } from './RecommendedDoctorCard';
import { useRouter } from 'next/navigation';

export default function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [aiDoctors, setAiDoctors] = useState<AiDoctorAgent[]>();
  const [selectedDoctor, setSelectedDoctor] = useState<AiDoctorAgent>();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  const handleNext = async () => {
    try {
      setLoading(true);
      const result = await axios.post('/api/suggested-ai-doctors', { notes: note });
      setAiDoctors(result.data);
      console.log("AI Doctors Response:", result.data);
    } catch (error) {
      console.error("Error fetching AI doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async () => {
    if (!selectedDoctor) {
      alert("Please select a doctor to start the consultation.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/chat-session', {
        notes: note,
        selectedDoctor: selectedDoctor
      });
      console.log("Consultation started:", response.data);
      setNote("");

      const sessionId = response.data?.sessionId;
      if (!sessionId) {
        alert("Session ID not returned. Something went wrong.");
        return;
      }

      // Close the dialog
      closeRef.current?.click();

      // Navigate to the session page
      router.push(`/dashboard/medical-voice/${sessionId}`);
    } catch (error) {
      console.error("Error starting consultation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Start Consultation <IconArrowRight /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Session</DialogTitle>
          <DialogDescription asChild>
            {!aiDoctors ? (
              <div>
                <p>Please provide the necessary details or symptoms to start a new session.</p>
                <Textarea
                  placeholder="Describe your symptoms..."
                  className="mt-2 h-[200px]"
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-3'>
                {aiDoctors.map((doctor, index) => (
                  <RecommendedDoctorCard
                    key={index}
                    doctor={doctor}
                    setSelectedDoctor={setSelectedDoctor}
                    selectedDoctor={selectedDoctor}
                  />
                ))}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex justify-end mt-4'>
          {/* Hidden button to manually close dialog */}
          <DialogClose asChild>
            <button ref={closeRef} className="hidden" />
          </DialogClose>

          <DialogClose asChild>
            <Button variant="outline" className="mr-2">Cancel</Button>
          </DialogClose>

          {!aiDoctors ? (
            <Button onClick={handleNext} disabled={!note || loading}>
              {loading ? 'Processing...' : <>Next <IconArrowRight /></>}
            </Button>
          ) : (
            <Button onClick={handleStartConsultation} disabled={loading}>
              {loading ? 'Processing...' : <>Start Consultation <IconArrowRight /></>}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
