"use client";

import type { PricingRule, SkuItem } from '@/lib/types';
import { useState, type FormEvent } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit2, Trash2, CheckCircle, XCircle, Eye, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from "@/hooks/use-toast";

interface PricingManagementClientProps {
  initialRules: PricingRule[];
  availableSkus: SkuItem[];
}

const defaultRule: Omit<PricingRule, 'id' | 'status' | 'createdBy' | 'createdAt'> = {
  name: '',
  skuId: undefined,
  basePrice: undefined,
  slabs: [{ from: 1, to: 0, pricePerUnit: 0 }], // Initial slab
};

// Placeholder server actions
async function addPricingRuleAction(rule: Omit<PricingRule, 'id' | 'status' | 'createdBy' | 'createdAt' | 'approvedBy'>): Promise<{ success: boolean; message: string; rule?: PricingRule }> {
  console.log("Adding Pricing Rule:", rule);
  await new Promise(resolve => setTimeout(resolve, 500));
  const newRule: PricingRule = { 
    ...rule, 
    id: `price${Date.now()}`, 
    status: 'Pending', 
    createdBy: 'Current User (Maker)', 
    createdAt: new Date().toISOString() 
  };
  return { success: true, message: "Pricing rule submitted for approval.", rule: newRule };
}

async function updatePricingRuleAction(rule: PricingRule): Promise<{ success: boolean; message: string; rule?: PricingRule }> {
  console.log("Updating Pricing Rule:", rule);
  await new Promise(resolve => setTimeout(resolve, 500));
  const updatedRule = { ...rule, status: 'Pending' as 'Pending' }; // Resubmit for approval
  return { success: true, message: "Pricing rule updated and submitted for approval.", rule: updatedRule };
}

async function approvePricingRuleAction(ruleId: string): Promise<{ success: boolean; message: string }> {
  console.log("Approving Pricing Rule:", ruleId);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: "Pricing rule approved." };
}

async function rejectPricingRuleAction(ruleId: string): Promise<{ success: boolean; message: string }> {
  console.log("Rejecting Pricing Rule:", ruleId);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: "Pricing rule rejected." };
}


export function PricingManagementClient({ initialRules, availableSkus }: PricingManagementClientProps) {
  const [rules, setRules] = useState<PricingRule[]>(initialRules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<Partial<PricingRule>>(defaultRule);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenModal = (rule?: PricingRule) => {
    if (rule) {
      setCurrentRule({...rule});
      setIsEditing(true);
    } else {
      setCurrentRule({...defaultRule, slabs: [{ from: 1, to: 0, pricePerUnit: 0 }]});
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentRule(prev => ({ ...prev, [name]: name === 'basePrice' ? parseFloat(value) : value }));
  };
  
  const handleSkuChange = (value: string) => {
     setCurrentRule(prev => ({ ...prev, skuId: value }));
  };

  const handleSlabChange = (index: number, field: keyof PricingRule['slabs'][0], value: string) => {
    const updatedSlabs = [...(currentRule.slabs || [])];
    updatedSlabs[index] = { ...updatedSlabs[index], [field]: parseFloat(value) || 0 };
    setCurrentRule(prev => ({ ...prev, slabs: updatedSlabs }));
  };

  const addSlab = () => {
    setCurrentRule(prev => ({ ...prev, slabs: [...(prev.slabs || []), { from: 0, to: 0, pricePerUnit: 0 }] }));
  };
  
  const removeSlab = (index: number) => {
    setCurrentRule(prev => ({ ...prev, slabs: (prev.slabs || []).filter((_, i) => i !== index) }));
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentRule.name || !currentRule.slabs || currentRule.slabs.length === 0) {
      toast({ title: "Error", description: "Rule name and at least one slab are required.", variant: "destructive"});
      return;
    }

    let result;
    if (isEditing && currentRule.id) {
      result = await updatePricingRuleAction(currentRule as PricingRule);
       if (result.success && result.rule) {
        setRules(prevRules => prevRules.map(r => r.id === result.rule!.id ? result.rule! : r));
      }
    } else {
      const { id, status, createdBy, createdAt, approvedBy, ...newRuleData } = currentRule;
      result = await addPricingRuleAction(newRuleData as Omit<PricingRule, 'id' | 'status' | 'createdBy' | 'createdAt' | 'approvedBy'>);
      if (result.success && result.rule) {
        setRules(prevRules => [...prevRules, result.rule!]);
      }
    }
    
    if (result.success) {
      toast({ title: "Success", description: result.message });
      handleCloseModal();
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };
  
  const handleApprove = async (ruleId: string) => {
    const result = await approvePricingRuleAction(ruleId);
    if (result.success) {
      setRules(prev => prev.map(r => r.id === ruleId ? {...r, status: 'Approved', approvedBy: 'Current User (Checker)'} : r));
      toast({title: "Success", description: result.message });
    } else {
      toast({title: "Error", description: result.message, variant: "destructive"});
    }
  };

  const handleReject = async (ruleId: string) => {
    const result = await rejectPricingRuleAction(ruleId);
     if (result.success) {
      setRules(prev => prev.map(r => r.id === ruleId ? {...r, status: 'Rejected', approvedBy: 'Current User (Checker)'} : r));
      toast({title: "Success", description: result.message });
    } else {
      toast({title: "Error", description: result.message, variant: "destructive"});
    }
  };
  
  const getStatusBadgeVariant = (status: PricingRule['status']) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Approved': return 'default';
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Pricing Rules</CardTitle>
          <CardDescription>Define base and slab-wise pricing. Requires approval.</CardDescription>
        </div>
        <Button onClick={() => handleOpenModal()} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.skuId ? availableSkus.find(s=>s.id === rule.skuId)?.name || 'Specific SKU' : 'All SKUs / Category'}</TableCell>
                  <TableCell>{rule.basePrice ? `$${rule.basePrice.toFixed(2)}` : 'N/A'}</TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(rule.status)}>{rule.status}</Badge></TableCell>
                  <TableCell>{rule.createdBy}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenModal(rule)}>
                           <Eye className="mr-2 h-4 w-4" /> View / Edit
                        </DropdownMenuItem>
                        {rule.status === 'Pending' && ( // Assuming current user is a checker
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(rule.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(rule.id)} className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rules.length === 0 && <p className="text-center text-muted-foreground py-4">No pricing rules found.</p>}
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Rule Name</Label>
                <Input id="name" name="name" value={currentRule.name || ''} onChange={handleChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skuId" className="text-right">Apply to SKU</Label>
                <Select value={currentRule.skuId || ''} onValueChange={handleSkuChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select SKU (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Global/Category Rule)</SelectItem>
                    {availableSkus.map(sku => (
                      <SelectItem key={sku.id} value={sku.id}>{sku.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="basePrice" className="text-right">Base Price</Label>
                <Input id="basePrice" name="basePrice" type="number" step="0.01" value={currentRule.basePrice || ''} onChange={handleChange} className="col-span-3" placeholder="Optional" />
              </div>
              
              <h4 className="col-span-4 font-medium mt-2">Slab Pricing</h4>
              {(currentRule.slabs || []).map((slab, index) => (
                <div key={index} className="col-span-4 grid grid-cols-11 items-center gap-2 border p-2 rounded-md">
                  <Label htmlFor={`slabFrom-${index}`} className="text-right col-span-2">From</Label>
                  <Input id={`slabFrom-${index}`} type="number" value={slab.from} onChange={(e) => handleSlabChange(index, 'from', e.target.value)} className="col-span-2" required />
                  <Label htmlFor={`slabTo-${index}`} className="text-right col-span-1">To</Label>
                  <Input id={`slabTo-${index}`} type="number" value={slab.to} onChange={(e) => handleSlabChange(index, 'to', e.target.value)} className="col-span-2" placeholder="Optional" />
                  <Label htmlFor={`slabPrice-${index}`} className="text-right col-span-1">Price</Label>
                  <Input id={`slabPrice-${index}`} type="number" step="0.01" value={slab.pricePerUnit} onChange={(e) => handleSlabChange(index, 'pricePerUnit', e.target.value)} className="col-span-2" required />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSlab(index)} className="col-span-1 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addSlab} className="col-span-4">Add Slab</Button>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Submit for Approval'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
