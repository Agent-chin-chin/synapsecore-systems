'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  const hideNavbarRoutes = ['/login', '/admin/login', '/client/login', '/learner/login'];
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  if (shouldHideNavbar) {
    return null;
  }

  return <Navbar />;
}
