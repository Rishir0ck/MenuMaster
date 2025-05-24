import { AppShell } from '@/components/layout/AppShell';
import { PricingManagementClient } from '@/components/pricing/PricingManagementClient';
import { placeholderPricingRules, placeholderSkus } from '@/lib/placeholder-data';
import type { PricingRule, SkuItem } from '@/lib/types';

async function getPricingRules(): Promise<PricingRule[]> {
  return placeholderPricingRules;
}

async function getSkus(): Promise<SkuItem[]> {
  return placeholderSkus;
}

export default async function PricingPage() {
  const pricingRules = await getPricingRules();
  const skus = await getSkus();

  return (
    <AppShell pageTitle="Pricing Management">
      <PricingManagementClient initialRules={pricingRules} availableSkus={skus} />
    </AppShell>
  );
}
