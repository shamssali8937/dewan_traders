import type { Metadata } from 'next';
import VerifyEmailClient from './VerifyEmailClient';

export const metadata: Metadata = {
  title: 'Email Verification | Dewan Traders',
  description: 'Verify your email address to complete registration and log in to Dewan Traders B2B export portal.',
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  params: Promise<{}>;
}

export default function VerifyEmailPage({ params }: Props) {
  return <VerifyEmailClient params={params} />;
}
