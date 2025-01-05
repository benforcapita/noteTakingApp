import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const apiKey = cookieStore.get('api-key')?.value;
    
    if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('sk-')) {
      return NextResponse.json(
        { error: 'Invalid or missing API key. Please add a valid OpenAI API key in settings.' },
        { status: 400 }
      );
    }

    const { notes } = await req.json();

    if (!Array.isArray(notes) || notes.length === 0) {
      return NextResponse.json(
        { error: 'Invalid notes format' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional meeting notes summarizer. Create a clear, concise summary of the provided notes. Maintain the original language.'
        },
        {
          role: 'user',
          content: notes.join('\n\n')
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const summary = response.choices[0]?.message?.content || '';
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error summarizing notes:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to summarize notes' },
      { status: 500 }
    );
  }
}