import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className='flex min-h-svh items-center justify-center'>{children}</div>;
}
