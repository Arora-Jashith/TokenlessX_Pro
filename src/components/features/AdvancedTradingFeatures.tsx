import { DisplayCardsDemo } from "@/components/ui/display-cards-demo";
import { features } from "@/config/features";

export default function AdvancedTradingFeatures() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Display Cards Demo */}
          <div className="relative lg:-ml-24 flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <DisplayCardsDemo />
            </div>
          </div>

          {/* Right Column - Text and Features */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
                {features[0].title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 max-w-[600px]">
                {features[0].description}
              </p>
            </div>
            
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1">
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 