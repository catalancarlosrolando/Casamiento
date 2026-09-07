
import { HeroSection } from '../components/HeroSection';
import { SaveTheDateSection } from '../components/SaveTheDateSection';
import { ItinerarySection } from '../components/ItinerarySection';
import { DressCodeSection } from '../components/DressCodeSection';
import { VenueSection } from '../components/VenueSection';
import { RsvpSection } from '../components/RsvpSection';

const Home = () => {


  return (
    <div className="w-full">
      <HeroSection />
      <SaveTheDateSection />
      <ItinerarySection />
      <DressCodeSection />
      <VenueSection />
      <RsvpSection />
    </div>
  );
};

export default Home;