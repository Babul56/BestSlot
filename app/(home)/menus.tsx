import {
  Dices,
  Flame,
  Gamepad2,
  Heart,
  Radio,
  Sticker,
  Target,
  Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Menus() {
  const menuItems = [
    { icon: Flame, label: 'HOT GAMES', url: '#' },

    { icon: Heart, label: 'FAVORITES', url: '#' },

    { icon: Gamepad2, label: 'SLOTS', url: '#' },

    { icon: Radio, label: 'LIVE', url: '#' },

    { icon: Zap, label: 'SPORTS', url: '#' },

    { icon: Dices, label: 'E-SPORTS', url: '#' },

    { icon: Sticker, label: 'POKER', url: '#' },

    { icon: Target, label: 'FISH', url: '#' },

    { icon: Target, label: 'LOTTERY', url: '#' },
  ];
  return (
    <Carousel className='w-full'>
      <CarouselContent>
        {menuItems.map((item) => (
          <CarouselItem
            key={item.label}
            className=' sm: basis-1/4 md:basis-1/9'
          >
            <Card className='py-2'>
              <CardContent className='space-y-2 flex items-center p-1 justify-center flex-col'>
                <item.icon />
                <p className=' text-xs text-center'>{item.label}</p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
