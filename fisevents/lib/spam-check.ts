import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const spamSchema = z.object({
  isSpam: z.boolean(),
});

export async function isSpamMessage(text: string): Promise<boolean> {
  try {
    const { output } = await generateText({
      model: openai('gpt-4o-mini'),
      output: Output.object({ schema: spamSchema }),
      system:
        'You classify contact form submissions as spam or not. Spam includes gibberish, unrelated advertising, phishing links, and generic bot-generated text unrelated to an event registration platform called FisEvents. Legitimate questions, feedback, or bug reports are not spam.',
      prompt: text,
    });

    return output.isSpam;
  } catch {
    return false;
  }
}
