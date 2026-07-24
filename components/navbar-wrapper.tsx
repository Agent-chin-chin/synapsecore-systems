'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();

  const hideNavbarRoutes = ['/login'];
  const hideNavbarPrefixes = ['/admin', '/client', '/learner'];

  const shouldHideNavbar =
    hideNavbarRoutes.includes(pathname) ||
    hideNavbarPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

  if (shouldHideNavbar) {
    return null;
  }

  return <Navbar />;
}
