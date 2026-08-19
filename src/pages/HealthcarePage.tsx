import { useEffect } from 'react';
import HealthcareHero from '../components/healthcare/HealthcareHero';
import HealthcareProblem from '../components/healthcare/HealthcareProblem';
import HealthcareSolution from '../components/healthcare/HealthcareSolution';
import HealthcareTemplates from '../components/healthcare/HealthcareTemplates';
import HealthcareWorkflow from '../components/healthcare/HealthcareWorkflow';
import HealthcareServices from '../components/healthcare/HealthcareServices';
import HealthcareTrust from '../components/healthcare/HealthcareTrust';
import HealthcareCommercial from '../components/healthcare/HealthcareCommercial';

export default function HealthcarePage() {
  useEffect(() => {
    // Scroll to top on load, or handle hash links if needed
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-white font-body selection:bg-teal-500/30">
      <HealthcareHero />
      <HealthcareProblem />
      <HealthcareSolution />
      <HealthcareTemplates />
      <HealthcareWorkflow />
      <HealthcareServices />
      <HealthcareTrust />
      <HealthcareCommercial />
    </main>
  );
}
