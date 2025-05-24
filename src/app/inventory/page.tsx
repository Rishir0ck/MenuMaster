import { AppShell } from '@/components/layout/AppShell';
import { SkuManagementClient } from '@/components/inventory/SkuManagementClient';
import { placeholderSkus } from '@/lib/placeholder-data';
import type { SkuItem } from '@/lib/types';

async function getSkus(): Promise<SkuItem[]> {
  // In a real app, fetch this from your backend
  return placeholderSkus;
}

export default async function InventoryPage() {
  const skus = await getSkus();

  return (
    <AppShell pageTitle="Inventory Management">
      <SkuManagementClient initialSkus={skus} />
    </AppShell>
  );
}
