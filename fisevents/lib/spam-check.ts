import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const spamSchema = z.object({
  isSpam: z.boolean(),
});

export async function isSpamMessage(text: string, name?: string): Promise<boolean> {
  try {
    const { output } = await generateText({
      model: openai('gpt-4o-mini'),
      output: Output.object({ schema: spamSchema }),
      system:
        'You classify contact form submissions as spam or not, for an event registration platform called FisEvents. ' +
        'Mark as spam: ' +
        '(1) random-looking character strings used as a name or message — mixed-case alphanumeric gibberish with no real words, no spaces, or no coherent meaning (e.g. "eykgveEGfzygdwVBuiQx", "nKwdtwoxhGQBpTff"), even if short; ' +
        '(2) unrelated advertising, SEO/backlink pitches, or promotional offers; ' +
        '(3) phishing links or suspicious URLs; ' +
        '(4) generic bot-generated filler text unrelated to events, registrations, or the platform. ' +
        'Legitimate questions, feedback, or bug reports written in real, readable language (Italian or English) are not spam, even if brief or informal. ' +
        'When the name field alone is random gibberish, treat the whole submission as spam regardless of the message content.',
      prompt: name ? `Name: ${name}\n\nMessage: ${text}` : text,
    });

    return output.isSpam;
  } catch {
    return false;
  }
}
