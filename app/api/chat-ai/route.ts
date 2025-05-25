import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { message, selectedOption } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    let modelName: string;
    switch (selectedOption) {
      case 'Gemini 1.0':
        modelName = "gemini-pro";
        break;
      case 'Gemini 2.0':
        modelName = "gemini-1.5-pro";
        break;
      case 'Gemini 3.0':
        modelName = "gemini-1.5-flash";
        break;
      case 'Gemini 4.0':
        modelName = "gemini-1.5-flash";
        break;
      default:
        modelName = "gemini-pro";
    }

    const model: GenerativeModel = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text, modelName: modelName });
  } catch (error: unknown) {
    console.error('Error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}

export async function GET() {
  return NextResponse.json({ status: 'OK', message: `AI is running on`, modelName: "gemini-pro" });
}