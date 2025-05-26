
"use client";

import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, User, KeyRound, Palette, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { userName } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [displayName, setDisplayName] = useState(userName || '');
  const [email, setEmail] = useState(''); 

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    setDisplayName(userName || '');
    if (userName && userName.includes('@')) {
      setEmail(userName);
    } else {
      setEmail(userName ? `${userName.toLowerCase().replace(' ', '.')}@example.com` : 'user@example.com');
    }
  }, [userName]);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
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
    console.log("Changing password for:", userName);
    toast({
      title: "Password Changed",
      description: "Your password has been (mock) updated.",
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleEmailNotificationToggle = (checked: boolean) => {
    setEmailNotificationsEnabled(checked);
    toast({
      title: "Notification Settings Updated",
      description: `Email notifications ${checked ? "enabled" : "disabled"}. (This is a mock setting)`,
    });
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch for theme
  }

  return (
    <AppShell pageTitle="User Settings">
      <div className="space-y-8 max-w-3xl mx-auto">
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
                  readOnly 
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

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <SettingsIcon className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Application Settings</CardTitle>
            </div>
            <CardDescription>Manage general application preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium block mb-2 flex items-center gap-2">
                <Palette className="h-5 w-5 text-muted-foreground" />
                Theme
              </Label>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light" className="font-normal">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark" className="font-normal">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="theme-system" />
                  <Label htmlFor="theme-system" className="font-normal">System</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium block mb-2 flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                Notifications
              </Label>
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div>
                  <Label htmlFor="email-notifications" className="font-normal">
                    Enable Email Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receive email updates and alerts from the application.
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotificationsEnabled}
                  onCheckedChange={handleEmailNotificationToggle}
                />
              </div>
            </div>
          </CardContent>
           {/* Optional: Add a footer to this card if there are global save actions for app settings */}
        </Card>
      </div>
    </AppShell>
  );
}
