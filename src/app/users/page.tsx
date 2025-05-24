import { AppShell } from '@/components/layout/AppShell';
import { UserManagementClient } from '@/components/users/UserManagementClient';
import { placeholderAdminUsers } from '@/lib/placeholder-data';
import type { AdminUser } from '@/lib/types';

async function getAdminUsers(): Promise<AdminUser[]> {
  return placeholderAdminUsers;
}

export default async function UsersPage() {
  const users = await getAdminUsers();

  return (
    <AppShell pageTitle="User Access Management">
      <UserManagementClient initialUsers={users} />
    </AppShell>
  );
}
