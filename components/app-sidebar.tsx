'use client';

import {
  IconArrowDownCircle,
  IconArrowUpCircle,
  IconCash,
  IconChartBar,
  IconDashboard,
  IconFileText,
  IconGift,
  IconHelp,
  IconListDetails,
  IconMail,
  IconSearch,
  IconSettings,
  IconUserCog,
  IconUsersPlus,
} from '@tabler/icons-react';
import { Dices } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
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
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
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
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
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
                <span className='text-base font-semibold'>Best Slot</span>
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
