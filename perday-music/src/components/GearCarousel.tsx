import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Button } from './ui/button';
import { Settings, Music, Headphones, Mic, Piano, Guitar } from 'lucide-react';

const gears = [
  { name: 'Studio Setup', icon: Settings, description: 'Professional recording gear' },
  { name: 'Audio Interface', icon: Music, description: 'High-quality sound input/output' },
  { name: 'Studio Monitors', icon: Headphones, description: 'Accurate sound reproduction' },
  { name: 'Microphone', icon: Mic, description: 'Crystal clear vocal capture' },
  { name: 'MIDI Controller', icon: Piano, description: 'Digital music creation' },
  { name: 'Guitar', icon: Guitar, description: 'Classic string instrument' },
  { name: 'Drum Machine', icon: Music, description: 'Rhythm and beats' },
  { name: 'Synthesizer', icon: Piano, description: 'Electronic sound design' },
  { name: 'Mixer', icon: Settings, description: 'Audio signal routing' },
  { name: 'Effects Pedals', icon: Music, description: 'Sound modification' },
  { name: 'Cables', icon: Settings, description: 'Professional connections' },
  { name: 'Stand', icon: Settings, description: 'Equipment mounting' }
];

export default function GearCarousel() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-synth-white mb-2">Studio Gear</h3>
        <p className="text-synth-icy">Essential tools for your music production journey</p>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {gears.map((gear, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-4">
                <div className="bg-synth-violet/20 backdrop-blur-xl border border-synth-violet/40 rounded-2xl p-6 h-full hover:bg-synth-violet/30 transition-all duration-300 hover:scale-105 group">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-synth-amber/20 rounded-full mb-4 group-hover:bg-synth-amber/30 transition-colors duration-300">
                      <gear.icon className="h-8 w-8 text-synth-amber" />
                    </div>
                    <h4 className="text-lg font-semibold text-synth-white mb-2">
                      {gear.name}
                    </h4>
                    <p className="text-sm text-synth-icy/80">
                      {gear.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-synth-amber/40 text-synth-amber hover:bg-synth-amber/20 hover:border-synth-amber/60"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="bg-synth-violet/20 border-synth-violet/40 text-synth-white hover:bg-synth-violet/30 hover:border-synth-violet/60" />
        <CarouselNext className="bg-synth-violet/20 border-synth-violet/40 text-synth-white hover:bg-synth-violet/30 hover:border-synth-violet/60" />
      </Carousel>
    </div>
  );
}
