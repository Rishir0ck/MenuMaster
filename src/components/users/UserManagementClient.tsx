
"use client";

import type { AdminUser, UserRole } from '@/lib/types';
import { useState, type FormEvent } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from "@/hooks/use-toast";

interface UserManagementClientProps {
  initialUsers: AdminUser[];
}

const defaultUser: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'> = {
  name: '',
  email: '',
  role: 'Maker',
  isActive: true,
};

// Placeholder server actions
async function addUserAction(user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>): Promise<{ success: boolean; message: string; user?: AdminUser }> {
  console.log("Adding User:", user);
  await new Promise(resolve => setTimeout(resolve, 500));
  const newUser: AdminUser = { ...user, id: `user${Date.now()}`, createdAt: new Date().toISOString() };
  return { success: true, message: "User added successfully.", user: newUser };
}

async function updateUserAction(user: AdminUser): Promise<{ success: boolean; message: string; user?: AdminUser }> {
  console.log("Updating User:", user);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: "User updated successfully.", user };
}

async function deleteUserAction(userId: string): Promise<{ success: boolean; message: string }> {
  console.log("Deleting User:", userId);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: "User deleted successfully." };
}


export function UserManagementClient({ initialUsers }: UserManagementClientProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<AdminUser>>(defaultUser);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenModal = (user?: AdminUser) => {
    if (user) {
      setCurrentUser({...user});
      setIsEditing(true);
    } else {
      setCurrentUser({...defaultUser});
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setCurrentUser(prev => ({ ...prev, role: value }));
  };

  const handleStatusChange = (checked: boolean) => {
    setCurrentUser(prev => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser.name || !currentUser.email) {
      toast({ title: "Error", description: "Name and email are required.", variant: "destructive"});
      return;
    }
    
    let result;
    if (isEditing && currentUser.id) {
      result = await updateUserAction(currentUser as AdminUser);
      if (result.success && result.user) {
        setUsers(prevUsers => prevUsers.map(u => u.id === result.user!.id ? result.user! : u));
      }
    } else {
      const { id, createdAt, lastLogin, ...newUserData } = currentUser;
      result = await addUserAction(newUserData as Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>);
      if (result.success && result.user) {
        setUsers(prevUsers => [...prevUsers, result.user!]);
      }
    }

    if (result.success) {
      toast({ title: "Success", description: result.message });
      handleCloseModal();
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };
  
  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const result = await deleteUserAction(userId);
    if (result.success) {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      toast({ title: "Success", description: result.message });
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Admin Users</CardTitle>
          <CardDescription>Onboard and manage internal admin users and their roles.</CardDescription>
        </div>
        <Button onClick={() => handleOpenModal()} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Add User
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenModal(user)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {users.length === 0 && <p className="text-center text-muted-foreground py-4">No users found.</p>}
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1">
                <Label htmlFor="name" className="sm:text-right">Name</Label>
                <Input id="name" name="name" value={currentUser.name || ''} onChange={handleChange} className="sm:col-span-3 w-full" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1">
                <Label htmlFor="email" className="sm:text-right">Email</Label>
                <Input id="email" name="email" type="email" value={currentUser.email || ''} onChange={handleChange} className="sm:col-span-3 w-full" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1">
                <Label htmlFor="role" className="sm:text-right">Role</Label>
                <Select value={currentUser.role || 'Maker'} onValueChange={handleRoleChange}>
                  <SelectTrigger className="sm:col-span-3 w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {(['Admin', 'Maker', 'Checker'] as UserRole[]).map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1">
                <Label htmlFor="isActive" className="sm:text-right self-center sm:self-auto">Active</Label> {/* Adjusted self-center for label alignment with switch */}
                <div className="sm:col-span-3 flex items-center">
                    <Switch id="isActive" checked={!!currentUser.isActive} onCheckedChange={handleStatusChange} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Add User'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
