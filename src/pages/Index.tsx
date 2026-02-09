import ParticleBackground, { setCinematicMode } from '@/components/ParticleBackground';
import CustomCursor from '@/components/CustomCursor';
import FloatingNav from '@/components/FloatingNav';
import MobileDock from '@/components/MobileDock';
import CommandPalette from '@/components/CommandPalette';
import { CommandPaletteProvider } from '@/components/CommandPaletteContext';
import CommandPaletteHint from '@/components/CommandPaletteHint';
import WayfindingRail from '@/components/WayfindingRail';
import { MobileNavProvider, useMobileNav } from '@/components/MobileNavContext';
import HeroScene from '@/components/scenes/HeroScene';
import PhilosophyScene from '@/components/scenes/PhilosophyScene';
import CapabilitiesScene from '@/components/scenes/CapabilitiesScene';
import WorkScene from '@/components/scenes/WorkScene';
import HackathonScene from '@/components/scenes/HackathonScene';
import ExperienceScene from '@/components/scenes/ExperienceScene';
import HumanScene from '@/components/scenes/HumanScene';
import ContactScene from '@/components/scenes/ContactScene';
import CinematicTransition from '@/components/CinematicTransition';
import { useCallback } from 'react';
import { 
  hero, 
  cinematicTransition, 
  philosophy, 
  capabilities, 
  selectedWork, 
  hackathonSpotlight,
  experience, 
  human, 
  contact, 
  links,
  navigation 
} from '@/content';

const IndexContent = () => {
  const { setInCinematicZone } = useMobileNav();
  
  const handleCinematicStateChange = useCallback((isActive: boolean) => {
    setCinematicMode(isActive);
    setInCinematicZone(isActive);
  }, [setInCinematicZone]);

  return (
    <CommandPaletteProvider>
      <div className="relative min-h-screen overflow-x-hidden">
        <ParticleBackground />
        <CustomCursor />
        <FloatingNav links={links} cursorLabels={navigation.cursorLabels} />
        <MobileDock sections={navigation.sections} links={links} />
        <CommandPalette links={links} />
        <CommandPaletteHint />
        <WayfindingRail sections={navigation.sections} />
        
        <main>
          <HeroScene content={hero} />
          <CinematicTransition 
            content={cinematicTransition} 
            onCinematicStateChange={handleCinematicStateChange} 
          />
          <PhilosophyScene content={philosophy} />
          <CapabilitiesScene content={capabilities} />
          <WorkScene content={selectedWork} />
          <HackathonScene content={hackathonSpotlight} />
          <ExperienceScene content={experience} />
          <HumanScene content={human} />
          <ContactScene content={contact} links={links} />
        </main>
      </div>
    </CommandPaletteProvider>
  );
};

const Index = () => {
  return (
    <MobileNavProvider>
      <IndexContent />
    </MobileNavProvider>
  );
};

export default Index;