import { NextResponse } from 'next/server';
import { summarizeNotes } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const { notes } = await req.json();

    if (!Array.isArray(notes) || notes.length === 0) {
      return NextResponse.json(
        { error: 'Invalid notes format' },
        { status: 400 }
      );
    }

    const summary = await summarizeNotes(notes);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error summarizing notes:', error);
    return NextResponse.json(
      { error: 'Failed to summarize notes' },
      { status: 500 }
    );
  }
}