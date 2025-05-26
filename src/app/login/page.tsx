
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for modals
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // State for forgot password modal
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // State for sign up modal
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);


  useEffect(() => {
    if (!authIsLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, authIsLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    const mockUserName = email.split('@')[0] || "Admin User";
    login(mockUserName);
  };

  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSendingOtp(true);
    // Mock OTP sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("OTP sent to:", forgotPasswordEmail); // Placeholder
    alert("OTP has been sent to your email (mock).");
    setIsSendingOtp(false);
    setShowForgotPasswordModal(false);
  };

  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (signUpPassword !== signUpConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsSigningUp(true);
    // Mock sign up
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Signing up user:", { name: signUpName, email: signUpEmail }); // Placeholder
    alert("Account created successfully (mock)! Please log in.");
    setIsSigningUp(false);
    setShowSignUpModal(false);
  };


  if (authIsLoading || (!authIsLoading && isAuthenticated)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4">
            {/* Replaced Logo */}
            <ShieldCheck className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">MenuMaster Admin</CardTitle>
          <CardDescription>Welcome back! Please sign in to your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="text-base"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-sm h-auto"
                  onClick={() => setShowForgotPasswordModal(true)}
                  disabled={isSubmitting}
                >
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="text-base"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full text-base py-3" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
             <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button
                type="button"
                variant="link"
                className="px-0 text-sm h-auto font-semibold text-primary"
                onClick={() => setShowSignUpModal(true)}
                disabled={isSubmitting}
              >
                Sign up
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPasswordModal} onOpenChange={setShowForgotPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you an OTP to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPasswordSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  disabled={isSendingOtp}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForgotPasswordModal(false)} disabled={isSendingOtp}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSendingOtp}>
                {isSendingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={showSignUpModal} onOpenChange={setShowSignUpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create Account</DialogTitle>
            <DialogDescription>
              Fill in the details below to create your MenuMaster admin account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignUpSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  placeholder="John Doe"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  required
                  disabled={isSigningUp}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                  disabled={isSigningUp}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                  disabled={isSigningUp}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  required
                  disabled={isSigningUp}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowSignUpModal(false)} disabled={isSigningUp}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSigningUp}>
                {isSigningUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSigningUp ? 'Creating Account...' : 'Create Account'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
