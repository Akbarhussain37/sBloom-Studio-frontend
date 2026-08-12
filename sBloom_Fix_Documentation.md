**sBloom Studio**

**Pre-Healthcare Fix Documentation**

What must be fixed in the existing/shared codebase before starting the
public /healthcare page

  -----------------------------------------------------------------------
  **Scope**\
  This document intentionally excludes Healthcare-page design and feature
  implementation. It focuses only on baseline build stability, shared UX,
  existing pages, accessibility, assets, code quality, performance,
  routing, and release readiness.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

Prepared for Antigravity implementation • Version 1.0 • August 2026

# 1. Executive Summary

**Objective.** Create a stable, honest, accessible, responsive, and
maintainable baseline before adding the third audience experience. The
current repository already has a Creators page and Kids Zone, but
several shared issues can create build failures, dead interactions,
inconsistent assets, mobile-navigation gaps, and misleading user states.

**Recommended rule.** Do not begin Healthcare implementation until all
P0 items and the shared P1 items marked as release-critical are resolved
or explicitly documented as accepted debt.

## Priority Definitions

  ----------------------------------------------------------------------------
  **Priority**   **Meaning**       **Rule**
  -------------- ----------------- -------------------------------------------
  **P0**         Blocker           Fix before any new feature work. Build
                                   reliability or source-of-truth issue.

  **P1**         Shared release    Fix before publishing or integrating
                 issue             another audience page.

  **P2**         Quality /         Fix during baseline cleanup or immediately
                 maintainability   after P0/P1 if not release-blocking.
  ----------------------------------------------------------------------------

## Recommended Fix Order

-   Phase 0 --- Establish a clean baseline: install dependencies, lint,
    TypeScript-check, build, and record every failure.

-   Phase 1 --- Remove build blockers and duplicate/dead code.

-   Phase 2 --- Standardize assets, fonts, links, navigation, and
    truthful user actions.

-   Phase 3 --- Fix shared accessibility and responsive behavior.

-   Phase 4 --- Complete performance, SEO, and documentation cleanup.

-   Phase 5 --- Run the full baseline release gate. Only then start
    /healthcare.

# 2. Detailed Issue Register

## 2.1 Build & Source-of-Truth Stability

**1. Build baseline is not formally verified \[P0\]**

**Observed in:** package.json, tsconfig.app.json, full src/ tree

**Problem:** The repository should not be assumed healthy until the
exact current branch passes linting, TypeScript compilation, and the
production build.

**Why it matters:** Starting a new page on an unstable baseline makes it
difficult to tell whether failures are new or pre-existing.

**Recommended fix:** Create a baseline verification run and treat every
current error as pre-existing debt that must be resolved or documented.

**Implementation steps**

1.  Run npm install using the committed lockfile.

2.  Run npm run lint.

3.  Run npm run build.

4.  Record every error with file path and message.

5.  Fix P0 failures without weakening TypeScript or lint rules.

**Verification:** npm run lint and npm run build both complete
successfully with zero blocking errors.

**2. Unused handleVideoClick in Marketing.tsx \[P0\]**

**Observed in:** src/components/Marketing.tsx

**Problem:** Marketing.tsx declares handleVideoClick but does not use it
while TypeScript is configured with noUnusedLocals.

**Why it matters:** This can fail the tsc -b stage before Vite bundles
the application.

**Recommended fix:** Remove the unused handler or connect it to a real
UI action if the video interaction is actually required.

**Implementation steps**

6.  Search Marketing.tsx for handleVideoClick usage.

7.  If no UI uses it, delete the function.

8.  If a real video control exists, wire the function to a semantic
    button.

9.  Re-run the build.

**Verification:** No unused-local error remains and Marketing.tsx
compiles cleanly.

**3. Duplicate SocialFlipButton implementations \[P0\]**

**Observed in:** src/components/SocialFlipButton.tsx and
src/components/ui/social-flip-button.tsx

**Problem:** Two separate implementations solve the same UI problem. The
ui/ version depends on @/lib/utils and contains extra unused theme
logic.

**Why it matters:** Duplicate components increase maintenance cost and
the unused variant can still break compilation because src is included
by TypeScript.

**Recommended fix:** Keep one canonical SocialFlipButton implementation.
Remove the unused duplicate unless it has a verified reuse case.

**Implementation steps**

10. Use code search to identify imports of both files.

11. Keep the version used by Footer unless the other version is
    demonstrably required.

12. Delete the unused duplicate.

13. Remove now-unused imports/dependencies if any.

14. Re-run lint and build.

**Verification:** Only one SocialFlipButton implementation remains and
all imports resolve.

**4. Missing @/lib/utils dependency in unused UI component \[P0\]**

**Observed in:** src/components/ui/social-flip-button.tsx

**Problem:** The duplicate UI component imports cn from @/lib/utils, but
the required utility/alias setup is not present in the active project
structure.

**Why it matters:** An unresolved module import is build-blocking even
if the component is never rendered.

**Recommended fix:** Prefer deleting the unused duplicate. Only add an
alias and utility if there is a real project-wide reuse requirement.

**Implementation steps**

15. Confirm the file is unused.

16. If unused, delete it instead of adding new architecture.

17. If required, create the utility intentionally and configure matching
    TypeScript/Vite aliases.

18. Verify module resolution.

**Verification:** No unresolved @/lib/utils import exists anywhere in
src/.

**5. StudioSpecs/Vibe naming conflict \[P0\]**

**Observed in:** src/components/StudioSpecs.tsx and
src/components/Vibe.tsx

**Problem:** StudioSpecs.tsx exports a function named Vibe while
Vibe.tsx also defines Vibe.

**Why it matters:** Misnamed components create source-of-truth confusion
and can lead to accidental imports or duplicate behavior.

**Recommended fix:** Determine whether StudioSpecs is used. Delete it if
dead; otherwise rename the exported component and file responsibility
clearly.

**Implementation steps**

19. Search all imports for StudioSpecs and Vibe.

20. If StudioSpecs is unused, delete it.

21. If used, rename the function to StudioSpecs and update imports.

22. Run build and check routes.

**Verification:** No duplicate/conflicting component identity remains.

**6. Legacy static implementation remains beside React app \[P0\]**

**Observed in:** legacy/index.html, legacy/style.css, legacy/script.js

**Problem:** The repository contains a full older static implementation
in addition to the active React application.

**Why it matters:** Antigravity and developers may edit or reference the
wrong source, and code searches become noisy.

**Recommended fix:** Confirm React is the production source of truth,
then remove or archive legacy code outside the active application.

**Implementation steps**

23. Compare legacy content against the active React implementation for
    any unique required content.

24. Migrate only genuinely missing content.

25. Delete legacy/ from the active codebase or move it to an explicit
    archive outside production source.

26. Document React as the source of truth in README.

**Verification:** Only one production frontend implementation is treated
as active.

**7. Unused starter/template assets and styles \[P1\]**

**Observed in:** src/assets/react.svg, src/assets/vite.svg, src/App.css
and similar template leftovers

**Problem:** Starter Vite/React files appear to remain after the
application moved to custom Tailwind-based design.

**Why it matters:** Dead files increase cognitive load and may be
mistaken for active design assets.

**Recommended fix:** Remove unused starter files after verifying there
are no imports.

**Implementation steps**

27. Search the repository for each suspected file name.

28. Delete files with zero active references.

29. Confirm no missing-asset errors in the browser.

**Verification:** No unused template assets remain in src/.

**8. Package metadata still identifies the app as temp-app \[P2\]**

**Observed in:** package.json

**Problem:** The project package name is still temp-app.

**Why it matters:** This is confusing in CI logs, tooling, deployment
metadata, and handoff documentation.

**Recommended fix:** Rename the package to a stable project identifier
such as sbloom-studio without changing dependency behavior.

**Implementation steps**

30. Update package.json name.

31. Run npm install only if the lockfile requires metadata sync.

32. Verify build scripts still work.

**Verification:** Package metadata clearly identifies the sBloom
project.

## 2.2 Assets, Fonts & Performance

**9. Asset storage conventions are inconsistent \[P1\]**

**Observed in:** root assets/images/, public/assets/images/, src/assets/

**Problem:** Images are spread across multiple locations while
components frequently reference /assets/images/\... paths.

**Why it matters:** Inconsistent conventions create broken production
paths, duplication, and uncertainty about bundling behavior.

**Recommended fix:** Adopt one documented rule: public/ for
URL-addressed static assets; src/assets for imported/bundled assets.

**Implementation steps**

33. Inventory all image references.

34. Map each reference to its real file location.

35. Move static URL assets under public/assets/images.

36. Use imports for bundled component assets where appropriate.

37. Update paths and verify both routes.

**Verification:** Every referenced asset resolves in development and
production build output.

**10. Large PNGs and below-the-fold images are not systematically
optimized \[P1\]**

**Observed in:** landing page and Kids Zone image assets

**Problem:** Many visual assets are large PNGs and not all
below-the-fold images use lazy loading.

**Why it matters:** This can increase initial download size and hurt
mobile performance and Core Web Vitals.

**Recommended fix:** Convert appropriate photography to WebP/AVIF,
preserve quality, and lazy-load non-critical images.

**Implementation steps**

38. Identify the hero/LCP asset and keep it eager.

39. Convert large photography to WebP or AVIF.

40. Add loading=\"lazy\" to below-the-fold images.

41. Keep width/height or stable aspect ratios to reduce layout shift.

42. Compare visual quality after conversion.

**Verification:** Initial page weight is reduced and no important image
appears degraded or delayed.

**11. Remote Unsplash images create external dependency \[P2\]**

**Observed in:** src/components/Vibe.tsx

**Problem:** The infrastructure section depends on remote Unsplash URLs.

**Why it matters:** External assets can change, fail, slow the page, and
reduce control over privacy/performance.

**Recommended fix:** Replace them with approved local assets when final
photography is available.

**Implementation steps**

43. Download or source approved brand-owned/licensed images.

44. Optimize them locally.

45. Update Vibe.tsx to use project assets.

46. Remove unused remote URLs.

**Verification:** Infrastructure visuals load from controlled project
assets.

**12. Outfit and Inter are declared but not reliably loaded \[P1\]**

**Observed in:** src/index.css and active index.html

**Problem:** The design tokens specify Outfit and Inter, but the active
Vite page does not clearly load those font resources.

**Why it matters:** Users may see fallback fonts, changing spacing,
hierarchy, and brand consistency.

**Recommended fix:** Load the approved fonts explicitly, preferably in a
controlled and performant way.

**Implementation steps**

47. Choose Google-hosted or self-hosted delivery.

48. Load only required weights.

49. Confirm font-family tokens map correctly.

50. Inspect computed styles in the browser.

**Verification:** Headings render in Outfit and body copy in Inter on
supported browsers.

**13. Desktop navigation disappears on mobile \[P1\]**

**Observed in:** src/components/Header.tsx

**Problem:** The navigation uses hidden lg:flex without an equivalent
mobile menu.

**Why it matters:** Mobile users lose core navigation and the main CTA.

**Recommended fix:** Implement an accessible mobile menu/drawer using
the existing stack.

**Implementation steps**

51. Add a semantic menu button.

52. Track open/closed state locally.

53. Render Creators, Kids Zone, and the main action in a mobile panel.

54. Support Escape, focus visibility, and aria-expanded.

55. Close on navigation.

**Verification:** At 390px and 768px, all essential navigation remains
usable by touch and keyboard.

## 2.3 Shared Navigation & Functional UX

**14. Navigation taxonomy is not yet structured for three audience
experiences \[P1\]**

**Observed in:** src/components/Header.tsx and shared navigation content

**Problem:** The shared header primarily reflects Creators and Kids
Zone, while the product model is now multi-audience.

**Why it matters:** Adding future pages without a clear navigation model
will create inconsistent labels and CTA behavior.

**Recommended fix:** Define a shared audience navigation structure now,
without implementing Healthcare content yet.

**Implementation steps**

56. Document audience labels: Creators, Kids Zone, Healthcare.

57. Keep /healthcare unlinked until the route exists if needed.

58. Ensure the mobile and desktop menus share the same source/order.

59. Keep one visually dominant CTA.

**Verification:** Navigation structure is ready to add the third route
without redesigning the header.

**15. Broken/inconsistent #book anchors \[P1\]**

**Observed in:** Header.tsx, Footer.tsx, KidsZone.tsx, Marketing.tsx

**Problem:** Multiple links point to #book or /#book, while the visible
form section uses id=\"marketing\".

**Why it matters:** Users click high-value CTAs and may land nowhere.

**Recommended fix:** Create one canonical booking/contact anchor or
change CTA destinations to the real target.

**Implementation steps**

60. Search for all #book references.

61. Choose the canonical section ID.

62. Update the section and every incoming link.

63. Test navigation from / and /kids-zone.

**Verification:** Every booking/contact CTA lands on the intended
visible section.

**16. Audience card "Learn more" actions are non-functional \[P1\]**

**Observed in:** src/components/Audience.tsx

**Problem:** Several cards render buttons that do not navigate or
trigger an action.

**Why it matters:** Interactive-looking controls that do nothing damage
trust and usability.

**Recommended fix:** Replace placeholder buttons with meaningful
navigation or remove them until a destination exists.

**Implementation steps**

64. Map each audience card to a real destination or action.

65. Use React Router Link for navigation.

66. Use semantic button only for real in-page actions.

67. Remove generic Learn more where no action exists.

**Verification:** Every visible interactive control produces an expected
result.

**17. Kids Zone "Upload Raw Footage" is only visual \[P1\]**

**Observed in:** src/pages/KidsZone.tsx

**Problem:** The page presents an upload CTA without an implemented
upload workflow.

**Why it matters:** It implies a capability the product does not
currently provide.

**Recommended fix:** Until uploads are built, use a truthful
lower-commitment action such as Request Editing, Join Waitlist, or See
How It Works.

**Implementation steps**

68. Confirm whether any upload flow exists elsewhere.

69. If not, replace the CTA label/action with a truthful current
    capability.

70. Do not build backend upload architecture as part of this cleanup.

**Verification:** No CTA promises an unavailable upload flow.

**Scope note:** Actual upload infrastructure can remain deferred until
the product workflow is validated.

**18. Marketing form reports a false reservation success \[P1\]**

**Observed in:** src/components/Marketing.tsx

**Problem:** The form prevents default submission, resets the fields,
and shows a success message without persisting or sending the data.

**Why it matters:** This is a trust and data-loss issue: users believe a
reservation exists when it does not.

**Recommended fix:** Either connect the form to a real endpoint or
change/remove the success claim until a backend exists.

**Implementation steps**

71. Confirm whether a backend endpoint exists.

72. If none exists, remove the "reserved" claim and use truthful copy.

73. If an endpoint exists, add loading, success, and error states based
    on the actual response.

74. Prevent duplicate submissions during loading.

**Verification:** Success is shown only after a real successful
operation, or the form clearly states its non-live status.

**Scope note:** Do not build a full backend solely for this
pre-Healthcare frontend cleanup unless already planned.

**19. Social media icons use placeholder \# URLs \[P1\]**

**Observed in:** src/components/SocialFlipButton.tsx

**Problem:** Instagram, Twitter/X, YouTube, GitHub, and LinkedIn links
point to #.

**Why it matters:** Users can click apparently real social links that go
nowhere.

**Recommended fix:** Use approved real URLs or hide channels that are
not active.

**Implementation steps**

75. Collect approved social URLs.

76. Replace each placeholder href.

77. Remove inactive channels.

78. Verify external links use appropriate target/rel behavior.

**Verification:** Every rendered social icon opens the correct official
destination.

**20. Privacy Policy and Terms links are placeholders \[P1\]**

**Observed in:** src/components/Footer.tsx

**Problem:** Legal links point to \# rather than real content.

**Why it matters:** Placeholder legal links undermine trust and become
more problematic as forms and healthcare-related experiences expand.

**Recommended fix:** Create valid routes/pages when content is approved,
or remove the links until they exist.

**Implementation steps**

79. Confirm whether approved legal content exists.

80. If yes, add /privacy and /terms routes/pages.

81. If no, remove placeholder links temporarily.

82. Do not publish fake legal destinations.

**Verification:** Footer legal links either resolve to real content or
are not shown.

**21. Clickable divs are used for actions \[P1\]**

**Observed in:** Audience.tsx and other interactive sections

**Problem:** Some interactions rely on div elements with
onClick/onMouseEnter rather than semantic controls.

**Why it matters:** Keyboard and assistive-technology users may not be
able to discover or activate them.

**Recommended fix:** Use button for actions and Link/a for navigation.

**Implementation steps**

83. Identify elements with onClick that are not semantic controls.

84. Replace action containers with button where appropriate.

85. Keep layout wrappers non-interactive.

86. Retest pointer and keyboard behavior.

**Verification:** All interactive elements have correct semantic HTML
and can be reached by keyboard.

## 2.4 Accessibility & Interaction Quality

**22. Hover-dependent interactions do not translate well to touch
\[P1\]**

**Observed in:** BeforeAfter.tsx, Audience.tsx, animated cards

**Problem:** Important content changes on hover or mouse enter.

**Why it matters:** Mobile users do not have reliable hover and may miss
information.

**Recommended fix:** Ensure every hover interaction also has a tap/click
and keyboard equivalent.

**Implementation steps**

87. List hover-triggered interactions.

88. Add click/tap activation where needed.

89. Add focus-visible behavior.

90. Verify no essential information is hover-only.

**Verification:** All essential interactive content is usable on touch
and keyboard devices.

**23. Visible keyboard focus and expanded-state semantics need a
consistent standard \[P1\]**

**Observed in:** shared buttons, links, accordions/cards

**Problem:** The current code does not consistently expose focus or
aria-expanded behavior for expandable controls.

**Why it matters:** Users navigating by keyboard may lose context or be
unable to understand state.

**Recommended fix:** Standardize focus-visible styling and accessible
state attributes.

**Implementation steps**

91. Add visible focus-visible classes to interactive controls.

92. Use aria-expanded on expandable buttons.

93. Use aria-controls where helpful.

94. Verify Tab order is logical.

**Verification:** All primary controls show visible focus and state is
conveyed programmatically.

**24. Reduced-motion support is missing \[P1\]**

**Observed in:** Reveal.tsx, Hero.tsx, Framer Motion components, CSS
animations

**Problem:** The site uses reveals, parallax, slow zoom, animated
borders, and other motion without a reduced-motion fallback.

**Why it matters:** Users who request reduced motion can experience
discomfort; unnecessary motion also conflicts with the new frontend
rules.

**Recommended fix:** Respect prefers-reduced-motion across CSS and
JS/Framer Motion behavior.

**Implementation steps**

95. Add reduced-motion CSS overrides.

96. Disable or greatly simplify parallax/continuous animation when
    reduced motion is requested.

97. Make Reveal immediately visible or minimally animated.

98. Test the OS/browser reduced-motion setting.

**Verification:** The site remains fully understandable and usable with
reduced motion enabled.

**25. Comparison slider needs explicit accessibility labeling \[P1\]**

**Observed in:** src/components/BeforeAfter.tsx

**Problem:** The range input is visually usable but needs a clear
accessible name and keyboard verification.

**Why it matters:** Screen-reader users may not know what the slider
changes.

**Recommended fix:** Add an aria-label or associated label and verify
arrow-key operation.

**Implementation steps**

99. Add a meaningful accessible label.

100. Confirm min/max/value are appropriate.

101. Test Left/Right arrow keys.

102. Ensure focus is visible.

**Verification:** The slider is announced clearly and works from the
keyboard.

**26. Scroll-driven parallax updates React state continuously \[P2\]**

**Observed in:** src/components/Hero.tsx

**Problem:** Hero sets React state on scroll to calculate parallax
offset.

**Why it matters:** This can cause unnecessary renders and jank on
lower-powered devices.

**Recommended fix:** Simplify the effect or use a more efficient
scroll-motion technique; performance outranks decorative motion.

**Implementation steps**

103. Profile current behavior in DevTools.

104. Prefer CSS or a motion value/requestAnimationFrame approach.

105. Disable the effect for reduced motion and possibly small devices.

106. Compare smoothness after change.

**Verification:** Scrolling remains smooth and the hero does not trigger
excessive React renders.

**27. Product/content entities are embedded directly in JSX \[P2\]**

**Observed in:** Audience.tsx, Vibe.tsx and similar components

**Problem:** Structured content arrays live inside UI components.

**Why it matters:** As the product grows, UI files can become the source
of truth for business content and harder to reuse.

**Recommended fix:** Move stable product entities to typed data modules
when there is a real reuse or maintenance benefit.

**Implementation steps**

107. Identify structured datasets that are true product content.

108. Move them to src/data/\*.ts.

109. Define TypeScript interfaces/types.

110. Keep purely local presentation constants local.

**Verification:** Reusable product data is typed and separated from
presentation where justified.

## 2.5 Architecture, Documentation & Release Quality

**28. Large page/components need responsibility review \[P2\]**

**Observed in:** src/pages/KidsZone.tsx, src/components/Roadmap.tsx

**Problem:** Some files are already very large and contain multiple
distinct sections.

**Why it matters:** Future changes become risky and diffs harder to
review.

**Recommended fix:** Refactor only along meaningful responsibilities,
not merely by line count.

**Implementation steps**

111. Identify real section boundaries.

112. Extract only cohesive sections with clear names.

113. Keep data and local state close to where they are used.

114. Avoid generic UniversalSection abstractions.

**Verification:** Large files are easier to navigate without creating
unnecessary abstraction.

**29. README is still starter-level documentation \[P2\]**

**Observed in:** README.md

**Problem:** The repository documentation still resembles the default
React/Vite starter guidance.

**Why it matters:** New developers and Antigravity lack a reliable
source of truth for routes, architecture, commands, and design rules.

**Recommended fix:** Replace it with sBloom-specific project
documentation.

**Implementation steps**

115. Document purpose and audiences.

116. Document routes and current scope.

117. Document stack and install/build commands.

118. Document folder conventions and asset rules.

119. Point to .agents/AGENTS.md for frontend standards.

**Verification:** A new developer can run and understand the project
from README without guessing.

**30. Responsive QA is not yet a formal release gate \[P1\]**

**Observed in:** all current public pages

**Problem:** Existing pages need systematic visual verification across
the required breakpoints.

**Why it matters:** A page can compile yet still have overflow, broken
grids, unreadable typography, or hidden navigation.

**Recommended fix:** Make responsive QA part of baseline completion.

**Implementation steps**

120. Inspect 390px, 768px, 1280px, 1440px, and 1920px.

121. Check header, hero, cards, slider, roadmap, Kids Zone, forms, and
     footer.

122. Fix horizontal overflow and awkward image crops.

123. Retest after each shared-layout change.

**Verification:** No unintended horizontal scroll, clipped content, or
missing primary actions at required widths.

**31. Page-specific SEO metadata is incomplete \[P2\]**

**Observed in:** index.html and route-level page handling

**Problem:** The active app has basic global metadata but the public
routes represent different audience experiences.

**Why it matters:** Search and social sharing quality is reduced when
all routes share generic metadata.

**Recommended fix:** Implement route-appropriate title/description and
plan canonical/Open Graph metadata without keyword stuffing.

**Implementation steps**

124. Confirm current metadata strategy.

125. Set accurate root and Kids Zone metadata.

126. Add canonical and Open Graph values as supported by the
     architecture.

127. Keep metadata content human-readable and truthful.

**Verification:** Public routes expose accurate, audience-specific
metadata.

# 3. Antigravity Execution Plan

**Goal:** Stabilize the existing shared frontend without implementing
the Healthcare page yet.

**Phase A --- Baseline verification**

-   Run install, lint, and build.

-   Capture all current failures before editing.

-   Fix only baseline/shared problems.

**Phase B --- Build cleanup**

-   Resolve unused code and unresolved imports.

-   Remove duplicate/dead components and legacy ambiguity.

-   Re-run lint/build after each coherent batch.

**Phase C --- Shared UX cleanup**

-   Fix mobile navigation.

-   Fix broken anchors and dead CTAs.

-   Make forms and links truthful.

-   Standardize semantic interactions.

**Phase D --- Asset/accessibility/performance cleanup**

-   Standardize image locations and fonts.

-   Add reduced-motion and keyboard support.

-   Optimize heavy images and hover-only interactions.

**Phase E --- Release gate**

-   Run lint and production build.

-   Visually QA required breakpoints.

-   Keyboard-test current routes.

-   Check console for errors.

-   Document accepted remaining P2 debt.

# 4. Baseline Definition of Done

**☐** npm run lint passes.

**☐** npm run build passes.

**☐** No unresolved imports or TypeScript suppressions are introduced.

**☐** Only one production frontend implementation is treated as source
of truth.

**☐** No duplicate SocialFlipButton or confusing StudioSpecs/Vibe
component remains.

**☐** All current asset paths work in production build output.

**☐** Outfit/Inter render as intended.

**☐** Desktop and mobile navigation both work.

**☐** All current high-value CTAs lead somewhere real and truthful.

**☐** The current form does not claim success unless an actual operation
succeeds.

**☐** No placeholder social/legal links are published.

**☐** Interactive controls are semantic, keyboard reachable, and visibly
focusable.

**☐** Reduced-motion preference is respected.

**☐** 390px, 768px, 1280px, 1440px, and 1920px layouts are visually
checked.

**☐** No obvious console errors are present on / and /kids-zone.

**☐** README describes the real sBloom application and development
workflow.

**☐** Any remaining P2 debt is explicitly listed and does not block the
next feature.

# 5. What Not to Build During This Cleanup

-   Do not build the Healthcare landing page yet.

-   Do not add FastAPI, OAuth, billing, databases, upload storage, or
    production queues solely for this cleanup.

-   Do not redesign Creators or Kids Zone unless a shared issue requires
    a targeted correction.

-   Do not replace the current React/Vite/Tailwind architecture.

-   Do not install new UI libraries when the current stack can solve the
    problem.

-   Do not weaken TypeScript or lint rules just to make the build pass.

-   Do not create speculative abstractions for future features.

# 6. Final Handoff to Healthcare Work

**Healthcare development may begin when the baseline Definition of Done
is satisfied.** At that point, Antigravity can treat the existing shared
header, footer, responsive behavior, accessibility foundation, asset
conventions, and build pipeline as stable dependencies rather than
re-solving them inside /healthcare.
