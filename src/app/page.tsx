
import { redirect } from 'next/navigation';

// This page will redirect to /dashboard. 
// The AuthProvider and AppShell will then handle redirection to /login if not authenticated.
export default function HomePage() {
  redirect('/dashboard');
}
