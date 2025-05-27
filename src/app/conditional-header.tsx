'use client';

import { usePathname } from 'next/navigation';
import Header from '@/features/header/Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const authRoutes = ['/sign-in', '/portfolio'];
  const shouldHideHeader = authRoutes.some(route => pathname.startsWith(route));
  
  if (shouldHideHeader) {
    return null;
  }
  
  return <Header />;
}