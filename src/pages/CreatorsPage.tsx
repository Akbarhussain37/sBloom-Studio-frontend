import '../components/creators/creators.css';
import CreatorsProgressNav from '../components/creators/CreatorsProgressNav';
import Scene01_Hero from '../components/creators/scenes/Scene01_Hero';
import Scene02_Chaos from '../components/creators/scenes/Scene02_Chaos';
import Scene03_Script from '../components/creators/scenes/Scene03_Script';

export default function CreatorsPage() {
  return (
    <main className="creators-page" id="creators-page">
      {/* Desktop-only left story progress indicator */}
      <CreatorsProgressNav />

      {/* Phase 2 — Scenes 01–03 */}
      <Scene01_Hero />
      <Scene02_Chaos />
      <Scene03_Script />

      {/* Scenes 04–13 will be added in subsequent phases */}
    </main>
  );
}
