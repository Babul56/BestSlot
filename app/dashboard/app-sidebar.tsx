'use client';

import {
  IconArrowDownCircle,
  IconArrowUpCircle,
  IconCash,
  IconChartBar,
  IconDashboard,
  IconFileText,
  IconGift,
  IconHelpCircle,
  IconListDetails,
  IconMail,
  IconUserCog,
  IconUsersPlus,
} from '@tabler/icons-react';
import { Dices } from 'lucide-react';
import { NavMain } from '@/app/dashboard/nav-main';
import { NavSecondary } from '@/app/dashboard/nav-secondary';
import { NavUser } from '@/app/dashboard/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'My Account',
      url: '/dashboard/my-account',
      icon: IconUserCog,
    },
    {
      title: 'Deposit',
      url: '/dashboard/deposit',
      icon: IconArrowDownCircle,
    },
    {
      title: 'Withdrawal',
      url: '/dashboard/withdrawal',
      icon: IconArrowUpCircle,
    },
    {
      title: 'Betting Records',
      url: '/dashboard/betting-records',
      icon: IconListDetails,
    },
    {
      title: 'Account Records',
      url: '/dashboard/account-records',
      icon: IconFileText,
    },
    {
      title: 'Profits & Losses',
      url: '/dashboard/profits-losses',
      icon: IconChartBar,
    },
    {
      title: 'Rewards Center',
      url: '/dashboard/rewards-center',
      icon: IconGift,
    },
    {
      title: 'Invite Friends',
      url: '/dashboard/invite-friends',
      icon: IconUsersPlus,
    },
    {
      title: 'Internal Messages',
      url: '/dashboard/internal-messages',
      icon: IconMail,
    },
    {
      title: 'Manual Rebate',
      url: '/dashboard/manual-rebate',
      icon: IconCash,
    },
  ],

  navSecondary: [
    {
      title: 'Customer Support',
      url: '/dashboard/customer-support',
      icon: IconHelpCircle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:p-1.5!'
            >
              <a href='/'>
                <Dices className='size-5!' />
                <h1 className='text-2xl font-bold tracking-tight md:text-2xl'>
                  <span className='text-primary'>Best</span>
                  <span className='font-medium'>Slot</span>
                </h1>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
