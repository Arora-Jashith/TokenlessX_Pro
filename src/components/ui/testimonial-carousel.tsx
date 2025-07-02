
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface Testimonial {
  id?: string;
  name: string;
  avatar?: string;
  email?: string;
  amount?: number;
  role?: string;
}

interface UserCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  users: Testimonial[];
  onPayClick?: (user: Testimonial) => void;
  avatarPath?: string;
}

export const UserCarousel = React.forwardRef<HTMLDivElement, UserCarouselProps>(
  ({ className, users, onPayClick, avatarPath = "", ...props }, ref) => {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
      if (!api) return;
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    }, [api]);

    return (
      <div ref={ref} className={cn("py-8", className)} {...props}>
        <Carousel
          setApi={setApi}
          className="max-w-screen-xl mx-auto px-4 lg:px-8"
        >
          <CarouselContent>
            {users.map((user) => (
              <CarouselItem
                key={user.name}
                className="flex flex-col items-center cursor-pointer md:basis-1/3 lg:basis-1/4"
              >
                <div className="mt-5 relative size-16 rounded-full overflow-hidden bg-green-900/20 mb-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-green-900/30 text-green-light">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <h5 className="font-medium text-foreground text-lg">
                  {user.name}
                </h5>
                <p className="mt-1 text-muted-foreground">
                  {user.email}
                </p>
                <Button 
                  onClick={() => onPayClick && onPayClick(user)} 
                  className="mt-4 bg-green-light/20 hover:bg-green-light/30 text-green-light border border-green-light/30"
                  variant="outline"
                  size="sm"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2">
            {users.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  index === current ? "bg-green-light" : "bg-green-light/35"
                )}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

UserCarousel.displayName = "UserCarousel";
