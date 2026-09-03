import { useEffect } from 'react';
import HealthcareScrollytellingWrapper from '../components/healthcare/HealthcareScrollytellingWrapper';
import Hero from '../components/healthcare/sections/Hero';
import TheProblem from '../components/healthcare/sections/TheProblem';
import HowItWorks from '../components/healthcare/sections/HowItWorks';
import TheTransformation from '../components/healthcare/sections/TheTransformation';
import OwnershipSplit from '../components/healthcare/sections/OwnershipSplit';
import ReviewLoop from '../components/healthcare/sections/ReviewLoop';
import ResultsGrid from '../components/healthcare/sections/ResultsGrid';
import FinalCTA from '../components/healthcare/sections/FinalCTA';

export default function HealthcarePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="font-body selection:bg-[var(--color-health-coral)] selection:text-white">
      <HealthcareScrollytellingWrapper>
        <Hero />
        <TheProblem />
        <HowItWorks />
        <TheTransformation />
        <OwnershipSplit />
        <ReviewLoop />
        <ResultsGrid />
        <FinalCTA />
      </HealthcareScrollytellingWrapper>
    </main>
  );
}
