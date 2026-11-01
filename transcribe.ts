/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Groq, { toFile } from 'groq-sdk';

export async function transcribeWithGroqNode(audioBuffer: Buffer): Promise<string> {
  // FIXED: Removed process.env.VITE_GROQ_API_KEY to prevent client-side exposure
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in environment variables.');
  }

  const groq = new Groq({ apiKey });
  const file = await toFile(audioBuffer, 'audio.wav', { type: 'audio/wav' });

  const transcription = await groq.audio.transcriptions.create({
    file,
    model: 'whisper-large-v3',
  });

  return transcription.text;
}
