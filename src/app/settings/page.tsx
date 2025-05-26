
"use client";

import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, User, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { userName } = useAuth();
  
  const [displayName, setDisplayName] = useState(userName || '');
  const [email, setEmail] = useState(''); // Placeholder, as email is not in AuthContext

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    setDisplayName(userName || '');
    // Attempt to derive email if userName looks like one, or use a placeholder
    if (userName && userName.includes('@')) {
      setEmail(userName);
    } else {
      setEmail(userName ? `${userName.toLowerCase().replace(' ', '.')}@example.com` : 'user@example.com');
    }
  }, [userName]);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    // Mock save profile
    console.log("Saving profile:", { displayName });
    toast({
      title: "Profile Updated",
      description: "Your profile information has been (mock) saved.",
    });
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }
    if (!newPassword) {
        toast({
        title: "Password Required",
        description: "New password cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    // Mock change password
    console.log("Changing password for:", userName);
    toast({
      title: "Password Changed",
      description: "Your password has been (mock) updated.",
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <AppShell pageTitle="User Settings">
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <User className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Profile Information</CardTitle>
            </div>
            <CardDescription>Manage your personal details.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSaveProfile}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-x-4 gap-y-2">
                <Label htmlFor="displayName" className="md:text-right">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="md:col-span-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-x-4 gap-y-2">
                <Label htmlFor="email" className="md:text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  readOnly // Email is usually not editable by user directly
                  disabled 
                  className="md:col-span-2 bg-muted/50 cursor-not-allowed"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Save Profile</Button>
            </CardFooter>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <KeyRound className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Change Password</CardTitle>
            </div>
            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>
          <form onSubmit={handleChangePassword}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-x-4 gap-y-2">
                <Label htmlFor="currentPassword" className="md:text-right">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="md:col-span-2"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-x-4 gap-y-2">
                <Label htmlFor="newPassword" className="md:text-right">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="md:col-span-2"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-x-4 gap-y-2">
                <Label htmlFor="confirmNewPassword" className="md:text-right">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="md:col-span-2"
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Change Password</Button>
            </CardFooter>
          </form>
        </Card>

         {/* General Settings Card Placeholder */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <SettingsIcon className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Application Settings</CardTitle>
            </div>
            <CardDescription>Manage general application preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-muted rounded-lg">
              <p className="text-md font-medium text-muted-foreground">Theme and notification settings coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
