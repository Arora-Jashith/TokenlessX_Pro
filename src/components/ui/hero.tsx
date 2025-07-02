import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["secure", "trusted", "reliable", "fast", "transparent"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex min-h-[80vh] items-center">
          {/* Left side - Text Content */}
          <div className="flex-1 flex flex-col items-start gap-8">
            <Button variant="secondary" size="sm" className="gap-4">
              Explore our Trust Network <MoveRight className="w-4 h-4" />
            </Button>

            <div className="flex gap-4 flex-col items-start">
              <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-left font-regular">
                <span className="text-white">Tokenless Transactions</span>
                <span className="relative flex w-full justify-start overflow-hidden text-left md:pb-4 md:pt-1">
                  &nbsp;
                  {titles.map((title, index) => (
                    <motion.span
                      key={index}
                      className="absolute font-semibold text-green-light"
                      initial={{ opacity: 0, y: -100 }}
                      transition={{ type: "spring", stiffness: 50 }}
                      animate={
                        titleNumber === index
                          ? {
                              y: 0,
                              opacity: 1,
                            }
                          : {
                              y: titleNumber > index ? -150 : 150,
                              opacity: 0,
                            }
                      }
                    >
                      {title}
                    </motion.span>
                  ))}
                </span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
                TokenlessX uses game theory to build trust networks that secure your transactions, 
                eliminating the need for complicated blockchain technology while maintaining 
                security and transparency.
              </p>
            </div>

            <div className="flex flex-row gap-3">
              <Button size="lg" className="gap-4" variant="outline">
                Learn More <PhoneCall className="w-4 h-4" />
              </Button>
              <Link to="/login">
                <Button size="lg" className="gap-4 bg-green-light text-black hover:bg-green-light/90">
                  Sign in now <MoveRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side will be handled by Index.tsx */}
          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
}

export { Hero };
