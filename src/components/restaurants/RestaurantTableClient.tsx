
"use client";

import type { Restaurant } from '@/lib/types';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Edit2, Trash2, CheckCircle, XCircle, MoreVertical, ShieldAlert, ToggleLeft, ToggleRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from "@/hooks/use-toast";

interface RestaurantTableClientProps {
  restaurants: Restaurant[];
  title: string;
  description: string;
}

// Placeholder server actions
async function approveRestaurantAction(restaurantId: string) {
  console.log(`Approving restaurant ${restaurantId}`);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: `Restaurant ${restaurantId} approved.` };
}

async function rejectRestaurantAction(restaurantId: string, reason: string) {
  console.log(`Rejecting restaurant ${restaurantId} for reason: ${reason}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: `Restaurant ${restaurantId} rejected.` };
}

async function updateRestaurantStatusAction(restaurantId: string, status: Restaurant['status']) {
  console.log(`Updating restaurant ${restaurantId} status to: ${status}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: `Restaurant ${restaurantId} status updated to ${status}.` };
}


export function RestaurantTableClient({ restaurants: initialRestaurants, title, description }: RestaurantTableClientProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'deactivate' | 'activate' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  const [formData, setFormData] = useState<Partial<Restaurant>>({});


  const handleView = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsViewModalOpen(true);
  };

  const handleEdit = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setFormData({ ...restaurant });
    setIsEditModalOpen(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Restaurant, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveChanges = async () => {
    if (!selectedRestaurant || !formData) return;
    // Placeholder: call actual update action
    console.log("Saving changes for restaurant:", selectedRestaurant.id, formData);
    toast({ title: "Success", description: "Restaurant details updated." });
    
    // Update local state for demo
    setRestaurants(prev => prev.map(r => r.id === selectedRestaurant.id ? {...r, ...formData} : r));
    setIsEditModalOpen(false);
    setSelectedRestaurant(null);
  };


  const openConfirmModal = (restaurant: Restaurant, type: 'approve' | 'reject' | 'deactivate' | 'activate') => {
    setSelectedRestaurant(restaurant);
    setActionType(type);
    setIsConfirmModalOpen(true);
    setRejectionReason('');
  };

  const handleConfirmAction = async () => {
    if (!selectedRestaurant || !actionType) return;

    let result;
    if (actionType === 'approve') {
      result = await approveRestaurantAction(selectedRestaurant.id);
    } else if (actionType === 'reject') {
      result = await rejectRestaurantAction(selectedRestaurant.id, rejectionReason);
    } else if (actionType === 'deactivate') {
      result = await updateRestaurantStatusAction(selectedRestaurant.id, 'Deactivated');
    } else if (actionType === 'activate') {
      result = await updateRestaurantStatusAction(selectedRestaurant.id, 'Active');
    }
    
    if (result?.success) {
      toast({ title: "Success", description: result.message });
      // Refresh data or update local state
      setRestaurants(prev => prev.map(r => 
        r.id === selectedRestaurant.id ? 
        { ...r, status: actionType === 'approve' ? 'Approved' : actionType === 'reject' ? 'Rejected' : actionType === 'deactivate' ? 'Deactivated' : 'Active' } 
        : r
      ));
    } else {
      toast({ title: "Error", description: "Action failed.", variant: "destructive" });
    }

    setIsConfirmModalOpen(false);
    setSelectedRestaurant(null);
    setActionType(null);
  };
  
  const getStatusBadgeVariant = (status: Restaurant['status']) => {
    switch (status) {
      case 'Pending Approval': return 'secondary';
      case 'Approved':
      case 'Active': return 'default';
      case 'Rejected':
      case 'Deactivated':
      case 'Fraudulent': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell className="font-medium">{restaurant.name}</TableCell>
                  <TableCell>{restaurant.email}</TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(restaurant.status)}>{restaurant.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(restaurant)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(restaurant)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                        </DropdownMenuItem>
                        {restaurant.status === 'Pending Approval' && (
                          <>
                            <DropdownMenuItem onClick={() => openConfirmModal(restaurant, 'approve')}>
                              <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openConfirmModal(restaurant, 'reject')}>
                              <XCircle className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {restaurant.status === 'Active' && (
                           <DropdownMenuItem onClick={() => openConfirmModal(restaurant, 'deactivate')}>
                            <ToggleLeft className="mr-2 h-4 w-4" /> Deactivate
                          </DropdownMenuItem>
                        )}
                         {restaurant.status === 'Deactivated' && (
                           <DropdownMenuItem onClick={() => openConfirmModal(restaurant, 'activate')}>
                            <ToggleRight className="mr-2 h-4 w-4" /> Activate
                          </DropdownMenuItem>
                        )}
                        {/* Add fraud flagging option here if needed */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {restaurants.length === 0 && <p className="text-center text-muted-foreground py-4">No restaurants found.</p>}
      </CardContent>

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Restaurant Details: {selectedRestaurant?.name}</DialogTitle>
            <DialogDescription>Viewing information for {selectedRestaurant?.name}.</DialogDescription>
          </DialogHeader>
          {selectedRestaurant && (
            <div className="grid gap-2 py-4 text-sm">
              <div className="grid grid-cols-[auto_1fr] gap-x-2"><span className="font-medium">Name:</span> <span>{selectedRestaurant.name}</span></div>
              <div className="grid grid-cols-[auto_1fr] gap-x-2"><span className="font-medium">Email:</span> <span>{selectedRestaurant.email}</span></div>
              <div className="grid grid-cols-[auto_1fr] gap-x-2"><span className="font-medium">Phone:</span> <span>{selectedRestaurant.phone}</span></div>
              <div className="grid grid-cols-[auto_1fr] gap-x-2"><span className="font-medium">Address:</span> <span>{selectedRestaurant.address}</span></div>
              <div className="grid grid-cols-[auto_1fr] gap-x-2 items-center"><span className="font-medium">Status:</span> <Badge variant={getStatusBadgeVariant(selectedRestaurant.status)}>{selectedRestaurant.status}</Badge></div>
              <div className="grid grid-cols-[auto_1fr] gap-x-2"><span className="font-medium">KYC Submitted:</span> <span>{selectedRestaurant.kycSubmittedAt ? new Date(selectedRestaurant.kycSubmittedAt).toLocaleDateString() : 'N/A'}</span></div>
              <div className="grid grid-cols-[auto_1fr] gap-x-2"><span className="font-medium">Cuisine:</span> <span>{selectedRestaurant.shopInfo?.cuisineType}</span></div>
              <div className="grid grid-cols-[auto_1fr] gap-x-2"><span className="font-medium">Description:</span> <span>{selectedRestaurant.shopInfo?.description}</span></div>
              {selectedRestaurant.kycInfo && <div className="grid grid-cols-[auto_1fr] gap-x-2"><span className="font-medium">KYC Info:</span> <span className="break-all">{selectedRestaurant.kycInfo}</span></div>}
              {selectedRestaurant.transactionHistory && <div className="grid grid-cols-[auto_1fr] gap-x-2"><span className="font-medium">Transaction History:</span> <span className="break-all">{selectedRestaurant.transactionHistory}</span></div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Details Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Restaurant: {selectedRestaurant?.name}</DialogTitle>
          </DialogHeader>
          {selectedRestaurant && (
            <form onSubmit={(e) => {e.preventDefault(); handleSaveChanges();}}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1">
                  <Label htmlFor="edit-name" className="sm:text-right">Name</Label>
                  <Input id="edit-name" name="name" value={formData?.name || ''} onChange={handleFormChange} className="sm:col-span-3 w-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1">
                  <Label htmlFor="edit-email" className="sm:text-right">Email</Label>
                  <Input id="edit-email" name="email" type="email" value={formData?.email || ''} onChange={handleFormChange} className="sm:col-span-3 w-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1">
                  <Label htmlFor="edit-phone" className="sm:text-right">Phone</Label>
                  <Input id="edit-phone" name="phone" value={formData?.phone || ''} onChange={handleFormChange} className="sm:col-span-3 w-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1">
                  <Label htmlFor="edit-address" className="sm:text-right">Address</Label>
                  <Input id="edit-address" name="address" value={formData?.address || ''} onChange={handleFormChange} className="sm:col-span-3 w-full" />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1">
                  <Label htmlFor="edit-status" className="sm:text-right">Status</Label>
                  <Select value={formData?.status} onValueChange={(value) => handleSelectChange('status', value as Restaurant['status'])}>
                    <SelectTrigger className="sm:col-span-3 w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {(['Pending Approval', 'Approved', 'Rejected', 'Active', 'Deactivated', 'Fraudulent'] as Restaurant['status'][]).map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Add more fields for shopInfo, etc. If shopInfo is edited, ensure formData.shopInfo exists */}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType} restaurant "{selectedRestaurant?.name}"?
            </DialogDescription>
          </DialogHeader>
          {actionType === 'reject' && (
            <div className="grid gap-2 py-2">
              <Label htmlFor="rejectionReason">Reason for Rejection</Label>
              <Textarea 
                id="rejectionReason" 
                value={rejectionReason} 
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason..."
              />
            </div>
          )}
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button 
              type="button" 
              variant={actionType === 'reject' || actionType === 'deactivate' ? 'destructive' : 'default'} 
              onClick={handleConfirmAction}
              disabled={actionType === 'reject' && !rejectionReason}
            >
              {actionType ? `Confirm ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}` : 'Confirm Action'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
