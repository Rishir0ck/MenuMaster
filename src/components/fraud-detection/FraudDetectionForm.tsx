"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { flagFraudulentAccounts, type FlagFraudulentAccountsInput, type FlagFraudulentAccountsOutput } from '@/ai/flows/flag-fraudulent-accounts';
import { toast } from '@/hooks/use-toast';

export function FraudDetectionForm() {
  const [kycInfo, setKycInfo] = useState('');
  const [transactionHistory, setTransactionHistory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FlagFraudulentAccountsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const input: FlagFraudulentAccountsInput = { kycInfo, transactionHistory };

    try {
      const aiResult = await flagFraudulentAccounts(input);
      setResult(aiResult);
    } catch (err) {
      console.error("Error calling AI flow:", err);
      setError("An error occurred while processing the request.");
      toast({
        title: "Error",
        description: "Failed to get fraud assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Assess Account Fraud Risk</CardTitle>
          <CardDescription>
            Enter KYC information and transaction history to get an AI-powered fraud assessment.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kycInfo">KYC Information</Label>
              <Textarea
                id="kycInfo"
                value={kycInfo}
                onChange={(e) => setKycInfo(e.target.value)}
                placeholder="Enter KYC details like business registration, owner ID, address verification, etc."
                rows={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionHistory">Transaction History</Label>
              <Textarea
                id="transactionHistory"
                value={transactionHistory}
                onChange={(e) => setTransactionHistory(e.target.value)}
                placeholder="Provide a summary of transaction patterns, amounts, frequencies, refund rates, chargebacks, etc."
                rows={8}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assessing...
                </>
              ) : (
                "Assess Fraud Risk"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      { (result || error) && (
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Assessment Result</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 <p className="ml-2 text-muted-foreground">Loading assessment...</p>
              </div>
            )}
            {error && !isLoading && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result && !isLoading && (
              <Alert variant={result.isFraudulent ? "destructive" : "default"} className="h-full">
                {result.isFraudulent ? <ShieldAlert className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                <AlertTitle className="text-lg mb-2">
                  {result.isFraudulent ? "Potentially Fraudulent Account" : "Account Appears Legitimate"}
                </AlertTitle>
                <AlertDescription className="text-base">
                  {result.fraudulentReason || (result.isFraudulent ? "Reason not specified by AI." : "No significant fraud indicators found.")}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">This is an AI-generated assessment and should be used as a tool to aid investigation, not as a sole determinant.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
