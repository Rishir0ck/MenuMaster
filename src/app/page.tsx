
import { redirect } from 'next/navigation';

// This page will redirect to /login.
// The LoginPage component will then handle redirection to /dashboard if already authenticated.
export default function HomePage() {
  redirect('/login');
}
