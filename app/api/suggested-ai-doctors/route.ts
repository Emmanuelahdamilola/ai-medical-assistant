import { openai } from '@/config/OpenAiModel';
import { AiDoctorList } from '@/shared/doctorList';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  const {notes} = await req.json();
  console.log("Received notes:", notes);
  console.log("✅ POST /api/suggested-ai-doctors hit");

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        { role: "system", content: JSON.stringify(AiDoctorList) },

        { role: "user", content: "User Notes/Symptoms: " + notes + ", Depends on user notes and symptoms, Please suggest list of doctors, Return the response in JSON format"}

      ],
    });

    const AiResponse = completion.choices[0].message||'';
    //@ts-ignore
    const Resp = AiResponse.content.replace('```json', '').replace('```', '').trim();
    const parsedResponse = JSON.parse(Resp);
    return NextResponse.json(parsedResponse, { status: 200 });

  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

