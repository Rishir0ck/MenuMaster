import { AppShell } from '@/components/layout/AppShell';
import { FraudDetectionForm } from '@/components/fraud-detection/FraudDetectionForm';

export default function FraudDetectionPage() {
  return (
    <AppShell pageTitle="Fraud Detection Tool">
      <FraudDetectionForm />
    </AppShell>
  );
}
