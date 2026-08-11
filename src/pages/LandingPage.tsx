import Hero from '../components/Hero';
import BeforeAfter from '../components/BeforeAfter';
import Audience from '../components/Audience';
import Roadmap from '../components/Roadmap';
import Vibe from '../components/Vibe';
import Marketing from '../components/Marketing';

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <BeforeAfter />
      <Audience />
      <Roadmap />
      <Vibe />
      <Marketing />
    </main>
  );
}
