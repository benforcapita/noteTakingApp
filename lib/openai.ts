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
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional meeting notes summarizer. Create a clear, concise summary of the provided notes. Maintain the original language.',
        },
        {
          role: 'user',
          content: `Please summarize these notes:\n\n${notes.join('\n\n')}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
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