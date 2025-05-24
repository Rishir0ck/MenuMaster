import { AppShell } from '@/components/layout/AppShell';
import { RestaurantTableClient } from '@/components/restaurants/RestaurantTableClient';
import { placeholderRestaurants } from '@/lib/placeholder-data';
import type { Restaurant } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function getRestaurants(): Promise<Restaurant[]> {
  // In a real app, fetch this from your backend
  return placeholderRestaurants;
}

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  const pendingRestaurants = restaurants.filter(r => r.status === 'Pending Approval');
  const activeRestaurants = restaurants.filter(r => r.status === 'Active' || r.status === 'Approved');
  const otherRestaurants = restaurants.filter(r => r.status !== 'Pending Approval' && r.status !== 'Active' && r.status !== 'Approved');

  return (
    <AppShell pageTitle="Restaurant Management">
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Requests ({pendingRestaurants.length})</TabsTrigger>
          <TabsTrigger value="active">Active & Approved ({activeRestaurants.length})</TabsTrigger>
          <TabsTrigger value="other">Others ({otherRestaurants.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <RestaurantTableClient 
            restaurants={pendingRestaurants} 
            title="Pending Onboarding Requests" 
            description="Review and approve/reject new restaurant applications."
          />
        </TabsContent>
        <TabsContent value="active">
          <RestaurantTableClient 
            restaurants={activeRestaurants} 
            title="Active & Approved Restaurants"
            description="Manage existing restaurant profiles and view their details."
          />
        </TabsContent>
        <TabsContent value="other">
           <RestaurantTableClient 
            restaurants={otherRestaurants} 
            title="Other Restaurants"
            description="View restaurants with statuses like Rejected or Deactivated."
          />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
