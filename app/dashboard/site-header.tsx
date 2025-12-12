'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components/layout/header/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { data } from './app-sidebar';

export function SiteHeader() {
  const pathname = usePathname();

  const allNavItems = [...data.navMain, ...data.navSecondary];
  const currentPage = allNavItems.find((item) => item.url === pathname);
  const pageTitle = currentPage ? currentPage.title : 'Dashboard';

  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4 hidden md:block'
        />
        <h1 className='text-base font-medium hidden md:block'>{pageTitle}</h1>
        <Link href='/' className='md:hidden'>
          <h1 className='text-2xl font-bold tracking-tight md:text-2xl md:hidden'>
            <span className='text-primary'>Best</span>
            <span className='font-medium'>Slot</span>
          </h1>
        </Link>
        <div className='ml-auto flex items-center gap-2'>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
