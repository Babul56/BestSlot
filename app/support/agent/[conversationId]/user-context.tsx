import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock, Trophy, Wallet } from 'lucide-react';

export function UserContext() {
  return (
    <div className='hidden h-full w-72 flex-col border-l border-border bg-card/50 xl:flex'>
      <div className='p-4 border-b border-border'>
        <h2 className='text-sm font-semibold mb-4'>Customer Intelligence</h2>
        <div className='space-y-4'>
          <div className='flex justify-between items-center text-xs'>
            <span className='text-muted-foreground'>Account Age</span>
            <span className='font-medium'>2.4 Years</span>
          </div>
          <div className='flex justify-between items-center text-xs'>
            <span className='text-muted-foreground'>Loyalty Tier</span>
            <Badge className='bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] h-5'>
              Platinum
            </Badge>
          </div>
        </div>
      </div>

      <div className='p-4 space-y-4 flex-1 overflow-auto'>
        <div className='space-y-2'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
            Financial Overview
          </span>
          <div className='grid grid-cols-2 gap-2'>
            <Card className='bg-background border-none shadow-none'>
              <CardContent className='p-3'>
                <Wallet className='h-3 w-3 text-primary mb-1' />
                <p className='text-[10px] text-muted-foreground'>Balance</p>
                <p className='text-xs font-bold'>$4,820.50</p>
              </CardContent>
            </Card>
            <Card className='bg-background border-none shadow-none'>
              <CardContent className='p-3'>
                <Trophy className='h-3 w-3 text-amber-500 mb-1' />
                <p className='text-[10px] text-muted-foreground'>Total Wins</p>
                <p className='text-xs font-bold'>$12.4k</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='space-y-3 pt-4'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
            Recent Activity
          </span>
          {[1, 2, 3].map((i) => (
            <div key={i} className='flex gap-3 text-xs'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted'>
                <Clock className='h-4 w-4 text-muted-foreground' />
              </div>
              <div className='space-y-0.5'>
                <p className='font-medium'>Withdrawal $1,250</p>
                <p className='text-[10px] text-muted-foreground'>
                  Pending • 2h ago
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className='rounded-lg bg-destructive/5 border border-destructive/10 p-3 mt-4'>
          <div className='flex items-center gap-2 text-destructive mb-1'>
            <AlertCircle className='h-3 w-3' />
            <span className='text-[10px] font-bold'>Fraud Alert</span>
          </div>
          <p className='text-[10px] text-muted-foreground leading-tight'>
            User accessing from a new IP range in last 24h. No previous flags.
          </p>
        </div>
      </div>
    </div>
  );
}
