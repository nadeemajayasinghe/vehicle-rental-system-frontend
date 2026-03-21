import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'VehicleRent – Premium Vehicle Rental',
  description: 'Discover, reserve, and manage premium vehicles with ease. Book your perfect ride today.',
  keywords: 'vehicle rental, car rental, premium cars, book vehicle',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}