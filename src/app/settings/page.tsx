
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AppShell pageTitle="User Settings">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Settings</CardTitle>
          </div>
          <CardDescription>Manage your account preferences and application settings here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-60 border-2 border-dashed border-muted rounded-lg">
            <p className="text-lg font-medium text-muted-foreground">Settings page is under construction.</p>
            <p className="text-sm text-muted-foreground">More options will be available soon!</p>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
