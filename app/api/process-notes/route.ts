import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const apiKey = cookieStore.get('api-key')?.value;
  
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('sk-')) {
    return NextResponse.json(
      { error: 'Invalid or missing API key. Please add a valid OpenAI API key in settings.' },
      { status: 400 }
    );
  }

  try {
    const { notes, mode } = await req.json();

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const systemMessage = mode === 'summarize' 
      ? 'You are a professional meeting notes summarizer. Create a clear, concise summary of the provided notes. Maintain the original language.'
      : 'You are a professional notes organizer. Reorganize the provided notes to be clear and consistent, maintaining all important content but improving structure and readability. Do not summarize or remove content.';

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: notes.join('\n\n') }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = response.choices[0]?.message?.content || '';
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process notes' },
      { status: 500 }
    );
  }
}
