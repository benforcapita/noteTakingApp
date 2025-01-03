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
          content: `Please provide a clear and concise summary of these meeting notes, highlighting:
1. Key decisions made
2. Action items or tasks assigned
3. Important discussion points
4. Next steps or follow-ups

Please provide the summary in the same language(s) as the input notes.

Notes to summarize:
${notes.join('\n\n')}`,
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