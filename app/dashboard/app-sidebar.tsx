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

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: IconDashboard,
    },
    {
      title: 'My Account',
      url: '#',
      icon: IconUserCog,
    },
    {
      title: 'Deposit',
      url: '#',
      icon: IconArrowDownCircle,
    },
    {
      title: 'Withdrawal',
      url: '#',
      icon: IconArrowUpCircle,
    },
    {
      title: 'Betting Records',
      url: '#',
      icon: IconListDetails,
    },
    {
      title: 'Account Records',
      url: '#',
      icon: IconFileText,
    },
    {
      title: 'Profits & Losses',
      url: '#',
      icon: IconChartBar,
    },
    {
      title: 'Rewards Center',
      url: '#',
      icon: IconGift,
    },
    {
      title: 'Invite Friends',
      url: '#',
      icon: IconUsersPlus,
    },
    {
      title: 'Internal Messages',
      url: '#',
      icon: IconMail,
    },
    {
      title: 'Manual Rebate',
      url: '#',
      icon: IconCash,
    },
  ],

  navSecondary: [
    {
      title: 'Customer Support',
      url: '#',
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
                <span className='text-base font-semibold'>BestSlot</span>
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
