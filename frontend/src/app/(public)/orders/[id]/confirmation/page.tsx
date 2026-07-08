import type { Metadata } from 'next';
import ConfirmationClient from './ConfirmationClient';

export const metadata: Metadata = {
  title: 'Order Confirmed | Dewan Traders',
  description: 'Your trade contract has been generated successfully. Please check payment instructions.',
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderConfirmationPage({ params }: Props) {
  return <ConfirmationClient params={params} />;
}
