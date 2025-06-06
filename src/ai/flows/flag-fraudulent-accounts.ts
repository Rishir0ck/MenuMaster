// This is an autogenerated file from Firebase Studio.
'use server';

/**
 * @fileOverview An AI agent that flags potentially fraudulent restaurant accounts.
 *
 * - flagFraudulentAccounts - A function that flags fraudulent accounts.
 * - FlagFraudulentAccountsInput - The input type for the flagFraudulentAccounts function.
 * - FlagFraudulentAccountsOutput - The return type for the flagFraudulentAccounts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagFraudulentAccountsInputSchema = z.object({
  kycInfo: z.string().describe('KYC information of the restaurant.'),
  transactionHistory: z
    .string()
    .describe('Transaction history of the restaurant.'),
});
export type FlagFraudulentAccountsInput = z.infer<
  typeof FlagFraudulentAccountsInputSchema
>;

const FlagFraudulentAccountsOutputSchema = z.object({
  isFraudulent: z
    .boolean()
    .describe('Whether the account is potentially fraudulent.'),
  fraudulentReason: z.string().describe('The reason for flagging as fraudulent.'),
});
export type FlagFraudulentAccountsOutput = z.infer<
  typeof FlagFraudulentAccountsOutputSchema
>;

export async function flagFraudulentAccounts(
  input: FlagFraudulentAccountsInput
): Promise<FlagFraudulentAccountsOutput> {
  return flagFraudulentAccountsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flagFraudulentAccountsPrompt',
  input: {schema: FlagFraudulentAccountsInputSchema},
  output: {schema: FlagFraudulentAccountsOutputSchema},
  prompt: `You are an expert fraud detection system for restaurants.

You will use the KYC information and transaction history to determine if the account is potentially fraudulent.

KYC Information: {{{kycInfo}}}
Transaction History: {{{transactionHistory}}}

Based on this information, determine if the account is fraudulent and provide a reason.
Set the isFraudulent output field appropriately.`,
});

const flagFraudulentAccountsFlow = ai.defineFlow(
  {
    name: 'flagFraudulentAccountsFlow',
    inputSchema: FlagFraudulentAccountsInputSchema,
    outputSchema: FlagFraudulentAccountsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
