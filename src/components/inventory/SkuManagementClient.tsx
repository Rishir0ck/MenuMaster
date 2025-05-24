
"use client";

import type { SkuItem } from '@/lib/types';
import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from "@/hooks/use-toast";

interface SkuManagementClientProps {
  initialSkus: SkuItem[];
}

const defaultSku: SkuItem = {
  id: '',
  name: '',
  description: '',
  price: 0,
  category: '',
  imageUrl: '',
  isOutOfStock: false,
  visibility: [],
};

// Placeholder server actions
async function addSkuAction(sku: Omit<SkuItem, 'id'>): Promise<{ success: boolean; message: string; sku?: SkuItem }> {
  console.log("Adding SKU:", sku);
  await new Promise(resolve => setTimeout(resolve, 500));
  const newSku = { ...sku, id: `sku${Date.now()}` };
  return { success: true, message: "SKU added successfully.", sku: newSku };
}

async function updateSkuAction(sku: SkuItem): Promise<{ success: boolean; message: string; sku?: SkuItem }> {
  console.log("Updating SKU:", sku);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: "SKU updated successfully.", sku };
}

async function deleteSkuAction(skuId: string): Promise<{ success: boolean; message: string }> {
  console.log("Deleting SKU:", skuId);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: "SKU deleted successfully." };
}


export function SkuManagementClient({ initialSkus }: SkuManagementClientProps) {
  const [skus, setSkus] = useState<SkuItem[]>(initialSkus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSku, setCurrentSku] = useState<SkuItem>(defaultSku);
  const [isEditing, setIsEditing] = useState(false);
  const [visibilityInput, setVisibilityInput] = useState('');


  const handleOpenModal = (sku?: SkuItem) => {
    if (sku) {
      setCurrentSku(sku);
      setVisibilityInput(sku.visibility.join(', '));
      setIsEditing(true);
    } else {
      setCurrentSku(defaultSku);
      setVisibilityInput('');
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSku(defaultSku);
    setVisibilityInput('');
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setCurrentSku(prev => ({ ...prev, [name]: e.target.checked }));
    } else {
      setCurrentSku(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
    }
  };
  
  const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisibilityInput(e.target.value);
    setCurrentSku(prev => ({ ...prev, visibility: e.target.value.split(',').map(city => city.trim()).filter(city => city) }));
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let result;
    if (isEditing) {
      result = await updateSkuAction(currentSku);
      if (result.success && result.sku) {
        setSkus(prevSkus => prevSkus.map(s => s.id === result.sku!.id ? result.sku! : s));
      }
    } else {
      const { id, ...newSkuData } = currentSku; // remove id for new SKU
      result = await addSkuAction(newSkuData);
      if (result.success && result.sku) {
        setSkus(prevSkus => [...prevSkus, result.sku!]);
      }
    }

    if (result.success) {
      toast({ title: "Success", description: result.message });
      handleCloseModal();
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };
  
  const handleDelete = async (skuId: string) => {
     if (!confirm("Are you sure you want to delete this SKU?")) return;
    const result = await deleteSkuAction(skuId);
    if (result.success) {
      setSkus(prevSkus => prevSkus.filter(s => s.id !== skuId));
      toast({ title: "Success", description: result.message });
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Manage SKUs</CardTitle>
          <CardDescription>Add, update, or delete stock keeping units.</CardDescription>
        </div>
        <Button onClick={() => handleOpenModal()} size="sm" className="w-full md:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add SKU
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skus.map((sku) => (
                <TableRow key={sku.id}>
                  <TableCell>
                    <Image 
                      src={sku.imageUrl || "https://placehold.co/60x40.png"} 
                      alt={sku.name} 
                      width={60} 
                      height={40} 
                      className="rounded-md object-cover"
                      data-ai-hint="product item"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{sku.name}</TableCell>
                  <TableCell>₹{sku.price.toFixed(2)}</TableCell>
                  <TableCell>{sku.category}</TableCell>
                  <TableCell>
                    <Badge variant={sku.isOutOfStock ? "destructive" : "default"}>
                      {sku.isOutOfStock ? "Out of Stock" : "In Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>{sku.visibility.join(', ') || 'All'}</TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenModal(sku)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(sku.id)} className="text-destructive">
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
        {skus.length === 0 && <p className="text-center text-muted-foreground py-4">No SKUs found.</p>}
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit SKU' : 'Add New SKU'}</DialogTitle>
            <DialogDescription>
              {isEditing ? `Update details for ${currentSku.name}.` : 'Enter details for the new SKU.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1.5">
                <Label htmlFor="name" className="sm:text-right">Name</Label>
                <Input id="name" name="name" value={currentSku.name} onChange={handleChange} className="sm:col-span-3 w-full" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-start gap-x-4 gap-y-1.5"> {/* sm:items-start for textarea label */}
                <Label htmlFor="description" className="sm:text-right">Description</Label>
                <Textarea id="description" name="description" value={currentSku.description} onChange={handleChange} className="sm:col-span-3 w-full" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1.5">
                <Label htmlFor="price" className="sm:text-right">Price (₹)</Label>
                <Input id="price" name="price" type="number" step="0.01" value={currentSku.price} onChange={handleChange} className="sm:col-span-3 w-full" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1.5">
                <Label htmlFor="category" className="sm:text-right">Category</Label>
                <Input id="category" name="category" value={currentSku.category} onChange={handleChange} className="sm:col-span-3 w-full" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1.5">
                <Label htmlFor="imageUrl" className="sm:text-right">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" value={currentSku.imageUrl || ''} onChange={handleChange} className="sm:col-span-3 w-full" placeholder="https://placehold.co/300x200.png"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-x-4 gap-y-1.5">
                <Label htmlFor="visibility" className="sm:text-right">Visibility (Cities)</Label>
                <Input id="visibility" name="visibility" value={visibilityInput} onChange={handleVisibilityChange} className="sm:col-span-3 w-full" placeholder="e.g., New York, London"/>
              </div>
              <div className="flex items-center space-x-2 sm:col-start-2 sm:col-span-3 mt-2">
                <Checkbox id="isOutOfStock" name="isOutOfStock" checked={currentSku.isOutOfStock} onCheckedChange={(checked) => setCurrentSku(prev => ({...prev, isOutOfStock: !!checked}))} />
                <Label htmlFor="isOutOfStock">Mark as Out of Stock</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Add SKU'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
