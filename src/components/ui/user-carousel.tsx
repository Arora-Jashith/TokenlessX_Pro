import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { User } from '@/types/user';
import { CanvasRevealEffect } from './canvas-reveal-effect';

interface UserCarouselProps {
  users: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }[];
  onPayClick: (user: any) => void;
}

export function UserCarousel({ users, onPayClick }: UserCarouselProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomColor = (email: string) => {
    const colors = [
      'bg-green-900/30 text-green-light',
      'bg-blue-900/30 text-blue-400',
      'bg-purple-900/30 text-purple-400',
      'bg-red-900/30 text-red-400',
      'bg-orange-900/30 text-orange-400'
    ];
    
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Add hover state for each card
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {users.map((user, idx) => (
          <CarouselItem key={user.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
            <div
              className="glass-card p-1 relative overflow-hidden"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Canvas Reveal Effect on hover */}
              {hoveredIndex === idx && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <CanvasRevealEffect animationSpeed={3.5} containerClassName="bg-transparent" />
                </div>
              )}
              <div className="flex flex-col items-center p-4 space-y-3 relative z-20">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getRandomColor(user.email)}`}>
                  {user.avatar ? 
                    <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" /> : 
                    <span className="text-xl font-semibold">{getInitials(user.name)}</span>
                  }
                </div>
                <div className="text-center">
                  <h4 className="font-medium truncate">{user.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Button 
                  onClick={() => onPayClick(user)} 
                  size="sm"
                  className="w-full bg-green-light/20 hover:bg-green-light/30 text-green-light border border-green-light/30"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Send Money
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-4 space-x-2">
        <CarouselPrevious className="static transform-none bg-green-light/20 hover:bg-green-light/30 text-green-light border-green-light/30" />
        <CarouselNext className="static transform-none bg-green-light/20 hover:bg-green-light/30 text-green-light border-green-light/30" />
      </div>
    </Carousel>
  );
}
