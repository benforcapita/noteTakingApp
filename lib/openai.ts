import OpenAI from 'openai';
import { cookies } from 'next/headers';

export async function summarizeNotes(notes: string[]): Promise<string> {
  const cookieStore = cookies();
  const apiKey = cookieStore.get('api-key')?.value;
  
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('sk-')) {
    throw new Error('Invalid or missing API key. Please add a valid OpenAI API key in settings.');
  }

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional meeting notes summarizer. Create a clear, concise, and well-structured summary of the provided meeting notes. Important: Maintain the same language as the input notes - if the notes are in Hebrew, summarize in Hebrew, if in English, summarize in English, etc.',
        },
        {
          role: 'user',
          content: `Please summarize these meeting notes in a professional format, maintaining the same language as the original notes:\n\n${notes.join('\n\n')}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!response.choices[0].message.content) {
      throw new Error('No summary generated');
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}