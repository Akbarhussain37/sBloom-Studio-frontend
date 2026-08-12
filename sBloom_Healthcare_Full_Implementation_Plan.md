sBloom Studio

# Healthcare Experience
Full Product, UX & Frontend Implementation Plan

Public route: /healthcare

| Core product idea<br>Doctors and healthcare teams should not have to invent every video from scratch. sBloom provides structured video templates, recording guidance and professional production so the customer can choose a proven format, record, upload and receive publish-ready content. |
| --- |

Prepared for Antigravity-led implementation

Version 1.0 • August 2026 • Public landing-page MVP

# Executive Summary

The Healthcare experience is the third audience-specific public experience in sBloom Studio, alongside Creators and Kids / Parents. The objective is not to build a healthcare dashboard yet. The objective is to validate a clear, premium public experience that explains the template-driven production model and moves healthcare visitors toward exploring and selecting a video template.

| Primary user objective<br>Explore a healthcare video template that makes content creation feel simple, predictable and professionally managed. |
| --- |

The Healthcare landing page must answer five questions quickly:

1. Who is this for? — Doctors, clinics, hospitals and healthcare professionals.

1. What problem does it solve? — Repeated content planning, scripting and production coordination consume time.

1. How does it work? — Choose a proven template, follow a simple recording guide, submit footage, and sBloom handles production.

1. Why trust sBloom? — Clear process, predictable output, brand consistency and professional production.

1. What should I do next? — Explore Video Templates.

The public MVP intentionally excludes authentication, FastAPI, Google OAuth, billing, upload storage, production queues and fully automated AI editing. Those capabilities belong to a later authenticated product phase after the public workflow and template model are validated.

## Document Map

| Section | Purpose |
| --- | --- |
| 1. Product Direction | Defines the healthcare proposition, audience and MVP boundaries. |
| 2. User & Problem Model | Clarifies user jobs, pain points, decision friction and trust needs. |
| 3. Page Information Architecture | Defines the public /healthcare story from hero to final CTA. |
| 4. Section Specifications | Gives implementation-ready requirements for each landing-page section. |
| 5. Template Repository | Defines the ten initial healthcare content templates. |
| 6. Template Interaction | Defines cards, filters, preview drawer/modal and CTA behavior. |
| 7. Frontend Architecture | Defines routes, files, components, data structures and shared reuse. |
| 8. Visual & Interaction System | Defines healthcare visual tone, animation, responsive and accessibility rules. |
| 9. SEO, Performance & Analytics | Defines public-page technical quality requirements. |
| 10. Antigravity Execution Plan | Provides a phased implementation sequence and verification gates. |
| 11. QA & Definition of Done | Defines test matrix, readiness gate and handoff criteria. |
| 12. Future Product Roadmap | Separates validated landing-page work from later authenticated product capabilities. |

# 1. Product Direction

sBloom Healthcare is a template-driven content production service for healthcare professionals. The product reduces decision friction: users should not have to decide every production detail, write a new content framework every time, or coordinate editing from scratch.

## 1.1 Product Promise

| Recommended positioning<br>Professional healthcare content without planning every video from scratch. |
| --- |

Supporting proposition: Choose a proven format. Record your content. Let sBloom handle the production.

## 1.2 Underlying Product Model

| Stage | Customer does | sBloom does |
| --- | --- | --- |
| Select | Chooses a relevant healthcare content template. | Provides structured choices instead of open-ended production decisions. |
| Record | Uses provided talking points and recording guidance. | Provides script framework, duration, framing and B-roll guidance. |
| Upload | Submits recorded content in the later product flow. | Receives files securely in the future authenticated experience. |
| Produce | Waits for production. | Edits, cleans audio, adds branding, captions and graphics. |
| Review | Reviews the output and requests permitted revisions. | Presents a predictable review workflow in the future product. |
| Publish | Downloads and publishes approved content. | Provides delivery-ready formats for intended channels. |

## 1.3 MVP Scope

- Public /healthcare landing page.

- Healthcare-specific hero, problem, solution, template repository, workflow, production-services, trust, commercial positioning and final CTA.

- Ten structured healthcare video templates rendered from data.

- Template preview interaction using a drawer or modal.

- Responsive navigation and shared sBloom brand consistency.

- Accessibility, SEO, performance and production-build verification.

## 1.4 Explicitly Out of Scope for This Phase

- FastAPI backend or API endpoints.

- Google OAuth or role-based authentication.

- Actual upload storage or video processing.

- Subscription checkout or recurring billing.

- Healthcare dashboard, production queue or order tracking.

- Patient data collection or patient-record workflows.

- Fully automated AI editing claims or implementation.

| Scope guardrail<br>The landing page should validate comprehension and intent. Do not turn the public page into a premature application architecture project. |
| --- |

# 2. User & Problem Model

## 2.1 Primary Audiences

| Audience | Typical need | What matters most |
| --- | --- | --- |
| Individual doctors | Consistent educational/promotional content without spending time on production planning. | Speed, clarity, professional appearance, low decision effort. |
| Clinics | Repeatable branded content across doctors, treatments and channels. | Brand consistency, reusable formats, reliable turnaround. |
| Hospitals | Standardized content programs that multiple departments can understand and repeat. | Governance, consistency, scalable process, clear deliverables. |
| Healthcare educators | Clear educational formats that can be recorded and repurposed consistently. | Structure, readability, repeatability, multi-format delivery. |

## 2.2 Core Problems to Communicate

- Content creation starts with a blank page too often.

- Doctors do not want to repeatedly brainstorm topics, scripts, shots and editing requirements.

- Inconsistent production can make a healthcare brand look inconsistent or less professional.

- Coordinating writers, editors, filming and social formats creates operational overhead.

- Generic video agencies can require the customer to explain the structure every time.

- Healthcare professionals need predictable processes and clear expectations before committing time.

## 2.3 Jobs To Be Done

| Job | User thought |
| --- | --- |
| Find a content idea quickly | Show me useful formats instead of asking me to invent one. |
| Understand what to record | Tell me what to say, how long it should be and how to frame it. |
| Know what sBloom will handle | Make the production responsibilities obvious before I start. |
| Assess whether the service feels professional | I need a calm, credible experience—not a gimmicky creator tool. |
| Start with low commitment | Let me test the service without a heavy contract. |

## 2.4 Trust Requirements

- Avoid unsupported medical, compliance or outcome claims.

- Do not imply that sBloom medically validates scripts unless a real review process exists.

- Use professional healthcare contexts and predictable language rather than exaggerated marketing.

- Be explicit that sBloom handles production quality and structure—not clinical accuracy unless separately contracted and implemented.

- Do not casually collect patient information in the public MVP.

# 3. Page Information Architecture

The Healthcare page should follow a decision-reduction narrative. Each section answers the next question a healthcare visitor is likely to have.

| Order | Section | User question answered | Primary outcome |
| --- | --- | --- | --- |
| 1 | Navigation | Where am I, and what other sBloom experiences exist? | Orient the visitor without distracting from the page objective. |
| 2 | Hero | What is this and why should I care? | Understand the offer in five seconds; click Explore Video Templates. |
| 3 | Problem | Does sBloom understand my workload? | Recognize planning and production friction. |
| 4 | Solution | What is different about this service? | Understand the template-driven model. |
| 5 | Template Repository | What can I actually create? | Browse and compare ten structured healthcare formats. |
| 6 | Template Preview | What will I have to do if I choose one? | See purpose, duration, structure, recording guidance and output. |
| 7 | Workflow | What happens after I choose? | Understand Choose → Record → Upload → Produce → Review → Publish. |
| 8 | What sBloom Handles | What production work is included? | Understand editing, audio, captions, branding and formatting. |
| 9 | Trust / Professionalism | Can I rely on the process? | Increase confidence through clarity and boundaries. |
| 10 | Commercial Model | Is this low risk to try? | Understand subscription/no-lock-in direction without unapproved pricing. |
| 11 | Final CTA | What should I do now? | Return the user to template exploration/start-intent. |
| 12 | Footer | Where can I find platform/legal/contact navigation? | Close with consistent platform navigation. |

| Primary conversion path<br>Hero CTA → Template Repository → Select Template → Preview Details → Start Project intent. |
| --- |

# 4. Section-by-Section UX & Content Specification

## 4.1 Shared Navigation

Keep shared sBloom identity while supporting the three public audience experiences.

- Logo routes to /.

- Desktop nav: Creators, Kids Zone, Healthcare.

- Healthcare item has a clear current-page state.

- Primary navigation CTA should not overpower the page-specific Explore Video Templates CTA.

- Mobile must use an accessible menu button and navigation panel; navigation must never simply disappear.

| Implementation note<br>Mobile menu must support keyboard focus, Escape close and visible focus states. |
| --- |

## 4.2 Healthcare Hero

Explain the Healthcare offer in approximately five seconds.

- Suggested headline: “Professional healthcare videos—without planning every one from scratch.”

- Supporting copy: explain that the visitor chooses a proven video format, follows simple recording guidance, and sBloom handles production.

- Primary CTA: Explore Video Templates.

- Secondary CTA: See How It Works.

- Use authentic professional healthcare/recording imagery or a product-relevant template preview—not decorative stock imagery.

- Avoid multiple competing CTA styles, heavy animation and AI-first language.

| Implementation note<br>Primary CTA scrolls/focuses the template repository. Secondary CTA scrolls to workflow. |
| --- |

## 4.3 Problem Section

Make the visitor feel understood without overstating pain.

- Use 3–4 concise problems: blank-page content planning, scripting time, inconsistent production, repeated coordination.

- Prefer editorial statements or simple split layout over a dense icon-card grid.

- Keep copy factual and operational; do not imply clinical outcomes.

| Implementation note<br>The section should be scannable from headings alone. |
| --- |

## 4.4 Solution Section

Explain why templates reduce production friction.

- Introduce the standardized content infrastructure.

- Explain what is provided: format, purpose, duration, talking-point structure, recording guidance and production rules.

- Use a visual sequence or example template anatomy.

- State “Standardize first → automate later” internally, but do not make AI the customer-facing promise.

| Implementation note<br>The user should understand the difference between a template and a finished video service. |
| --- |

## 4.5 Healthcare Template Repository

Make the core product tangible and easy to scan.

- Render ten templates from structured data, not ten manually written JSX blocks.

- Each card shows: name, one-line purpose, duration, category, visual preview and one primary action.

- Primary card action: Preview Template.

- Optional filters may include Introduction, Education, Treatment, Trust/Social Proof, Patient Guidance.

- Avoid overwhelming cards with script details; use progressive disclosure.

| Implementation note<br>Repository must be usable with mouse, keyboard and touch. |
| --- |

## 4.6 Template Preview Drawer / Modal

Let users understand one template deeply without losing comparison context.

- Show: template name, purpose, recommended duration, who it is for, script structure, recording guidance, suggested B-roll, expected output.

- Primary CTA: Start With This Template or Start Project.

- Secondary action: close/back to templates.

- Use a drawer on desktop if it preserves browsing context; use full-height modal/sheet pattern on small screens.

- Do not navigate to a separate route unless later analytics/product needs justify it.

| Implementation note<br>Must trap focus, close on Escape, restore focus to triggering card, and expose accessible dialog labeling. |
| --- |

## 4.7 Workflow

Make the operational process feel predictable.

- Use the shared product model: Select → Record → Upload → Produce → Review → Publish.

- For the public MVP, Upload/Review/Publish are explanatory only; do not create fake application states.

- Each step should explain one customer responsibility and one sBloom responsibility.

- Avoid decorative timeline animations that slow comprehension.

| Implementation note<br>On mobile, stack steps vertically with clear numbering rather than compressing a horizontal timeline. |
| --- |

## 4.8 What sBloom Handles

Clarify the production service so the customer knows what they are paying for.

- Editing and pacing

- Audio cleanup and leveling

- Color correction / grading

- Captions / subtitles

- Branding and graphic overlays

- B-roll placement where applicable

- Output sizing for relevant social channels

| Implementation note<br>Only claim capabilities the team can actually deliver. |
| --- |

## 4.9 Trust & Professionalism

Increase confidence without unsupported compliance or medical claims.

- Emphasize predictable process, brand consistency, production standards and clear deliverables.

- Use restrained visual tone and authentic healthcare environments.

- If testimonials, logos or case studies do not exist, do not fabricate them.

- Add a concise content-responsibility boundary: medical accuracy remains with the healthcare professional unless a separate review service exists.

| Implementation note<br>Trust must come from clarity and process—not invented badges. |
| --- |

## 4.10 Commercial / Subscription Positioning

Communicate low commitment while avoiding unapproved pricing.

- Message: monthly, no long-term lock-in, start small, continue if useful.

- Do not hard-code $10/$20 or rupee amounts until business approval.

- Use plan placeholders or “Simple monthly plans” content if exact pricing is unresolved.

- If tiers are shown later, differentiate by video volume, turnaround, revisions and brand/customization—not vague feature counts.

| Implementation note<br>Commercial CTA should return to template selection/start-intent rather than introducing a disconnected flow. |
| --- |

## 4.11 Final CTA

Close the page with one obvious next action.

- Headline should restate outcome, not invent a new value proposition.

- Primary CTA: Explore Video Templates or Choose a Template.

- Optional secondary CTA: See How It Works.

- Do not add “Book a Demo,” “Contact Sales,” and “Get Started” with equal visual weight unless the business model changes.

| Implementation note<br>The final CTA should feel like a continuation of the page, not a new funnel. |
| --- |

# 5. Initial Healthcare Template Repository

The first ten templates are product entities. They should live in structured data so the same definitions can later support the landing page, authenticated portal, production workflow, editor tooling and analytics.

| # | Template | Category | Duration | Primary purpose |
| --- | --- | --- | --- | --- |
| 1 | Doctor Introduction | Introduction | 45–60 sec | Introduce the doctor, specialty and approach in a concise professional format. |
| 2 | Clinic / Hospital Introduction | Introduction | 60–90 sec | Present the facility, services and patient experience in a structured overview. |
| 3 | Treatment Explanation | Treatment | 60–120 sec | Explain what a treatment is, who it may be for and what the process generally involves. |
| 4 | Patient Education | Education | 45–90 sec | Teach one health concept in an accessible, structured way. |
| 5 | Myth vs Fact | Education | 30–60 sec | Correct a common misconception using a quick, repeatable format. |
| 6 | Frequently Asked Questions | Education | 45–90 sec | Answer one recurring patient question clearly and consistently. |
| 7 | Procedure Preparation | Patient Guidance | 60–90 sec | Prepare patients for a procedure with a clear pre-visit checklist-style explanation. |
| 8 | Post-Treatment Instructions | Patient Guidance | 60–120 sec | Reinforce provider-approved aftercare information in a clear video format. |
| 9 | Patient Success Story | Trust / Story | 60–120 sec | Present a patient experience or outcome story when consent and appropriate approvals exist. |
| 10 | Health Awareness / Quick Tips | Education | 30–60 sec | Deliver concise provider-approved awareness or prevention tips in a repeatable social format. |

## 5.1 Detailed Template Content Requirements

### 01. Doctor Introduction

Category: Introduction | Recommended duration: 45–60 sec

Introduce the doctor, specialty and approach in a concise professional format.

| Script structure<br>Hook / name + specialty<br>Who you help<br>What patients can expect<br>Simple closing CTA | Recording guidance<br>Chest-up framing<br>Quiet clinic background<br>Direct-to-camera delivery<br>Natural conversational tone | Suggested B-roll<br>Clinic exterior/interior<br>Consultation environment<br>Relevant equipment/details |
| --- | --- | --- |

### 02. Clinic / Hospital Introduction

Category: Introduction | Recommended duration: 60–90 sec

Present the facility, services and patient experience in a structured overview.

| Script structure<br>Facility introduction<br>Key services<br>Team / capability highlights<br>Patient experience<br>Closing CTA | Recording guidance<br>Mix direct-to-camera + facility shots<br>Keep messaging benefit-focused<br>Record short modular segments | Suggested B-roll<br>Reception<br>Treatment rooms<br>Team at work<br>Facility signage |
| --- | --- | --- |

### 03. Treatment Explanation

Category: Treatment | Recommended duration: 60–120 sec

Explain what a treatment is, who it may be for and what the process generally involves.

| Script structure<br>What it is<br>Why it may be recommended<br>What happens<br>Common preparation / recovery notes<br>Professional caveat / CTA | Recording guidance<br>Use plain language<br>Avoid guaranteed outcomes<br>Record in logical short sections | Suggested B-roll<br>Treatment environment<br>Equipment close-ups<br>Simple diagrams/graphics where appropriate |
| --- | --- | --- |

### 04. Patient Education

Category: Education | Recommended duration: 45–90 sec

Teach one health concept in an accessible, structured way.

| Script structure<br>Question / problem<br>Core explanation<br>Key points<br>What patients should remember<br>Closing guidance | Recording guidance<br>One topic per video<br>Use short sentences<br>Avoid jargon or define it quickly | Suggested B-roll<br>Relevant diagrams<br>Safe illustrative footage<br>On-screen key terms |
| --- | --- | --- |

### 05. Myth vs Fact

Category: Education | Recommended duration: 30–60 sec

Correct a common misconception using a quick, repeatable format.

| Script structure<br>State myth<br>State fact<br>Brief explanation<br>When to seek professional advice | Recording guidance<br>High-energy but professional delivery<br>One myth per clip<br>Keep claims precise | Suggested B-roll<br>Text overlays<br>Simple supporting visuals<br>Relevant environment |
| --- | --- | --- |

### 06. Frequently Asked Questions

Category: Education | Recommended duration: 45–90 sec

Answer one recurring patient question clearly and consistently.

| Script structure<br>Question on screen<br>Short direct answer<br>Context / exceptions<br>Action or next step | Recording guidance<br>Record answers as standalone clips<br>Maintain eye contact<br>Avoid overlong explanations | Suggested B-roll<br>Question text graphic<br>Clinic B-roll<br>Procedure/equipment details if relevant |
| --- | --- | --- |

### 07. Procedure Preparation

Category: Patient Guidance | Recommended duration: 60–90 sec

Prepare patients for a procedure with a clear pre-visit checklist-style explanation.

| Script structure<br>What to expect<br>Before-arrival steps<br>What to bring / avoid<br>Arrival/process notes<br>When to contact the clinic | Recording guidance<br>Use ordered steps<br>Keep instructions specific to provider-approved guidance<br>Avoid generic medical advice | Suggested B-roll<br>Check-in area<br>Preparation materials<br>On-screen checklist |
| --- | --- | --- |

### 08. Post-Treatment Instructions

Category: Patient Guidance | Recommended duration: 60–120 sec

Reinforce provider-approved aftercare information in a clear video format.

| Script structure<br>Immediate aftercare<br>Expected normal experience<br>What to avoid<br>When to contact provider<br>Follow-up reminder | Recording guidance<br>Use only approved clinical instructions<br>Speak slowly and clearly<br>Separate urgent guidance visually if applicable | Suggested B-roll<br>Aftercare materials<br>Follow-up setting<br>On-screen reminder graphics |
| --- | --- | --- |

### 09. Patient Success Story

Category: Trust / Story | Recommended duration: 60–120 sec

Present a patient experience or outcome story when consent and appropriate approvals exist.

| Script structure<br>Context<br>Challenge / goal<br>Experience with care<br>Outcome / reflection<br>Closing note | Recording guidance<br>Use written consent<br>Avoid exaggerated or guaranteed-result framing<br>Prioritize authentic voice | Suggested B-roll<br>Patient interview<br>Facility context<br>Non-sensitive supporting footage |
| --- | --- | --- |

### 10. Health Awareness / Quick Tips

Category: Education | Recommended duration: 30–60 sec

Deliver concise provider-approved awareness or prevention tips in a repeatable social format.

| Script structure<br>Topic hook<br>3 concise points<br>When to seek professional help<br>Closing reminder | Recording guidance<br>Keep to one topic<br>Use approved language<br>Make points visually scannable | Suggested B-roll<br>Text callouts<br>Simple illustrative B-roll<br>Brand end card |
| --- | --- | --- |

# 6. Template Repository Interaction Design

## 6.1 Template Card

| Element | Requirement |
| --- | --- |
| Visual preview | Relevant, professional healthcare image or controlled illustration. Image supports recognition; it must not become decorative noise. |
| Name | Short, specific template name. |
| Purpose | One sentence describing what the format helps the doctor communicate. |
| Duration | Compact metadata such as “45–60 sec”. |
| Category | Short label with restrained treatment. |
| Primary action | Preview Template. |
| States | Default, hover, focus-visible, active/selected, disabled only if a real reason exists. |

## 6.2 Filtering

Filtering is optional in the first coherent version. Ten cards are still scannable without filters. If filters improve comprehension rather than decorate the page, use a small set of categories: All, Introduction, Education, Treatment, Patient Guidance, Trust / Story.

| Do not overbuild search<br>Do not add fuzzy search, complex taxonomy, URL query-state or a state-management library for ten templates unless a real use case emerges. |
| --- |

## 6.3 Preview Drawer / Modal

| Area | Content |
| --- | --- |
| Header | Template name, category, duration, close control. |
| Purpose | Plain-language explanation of what the template is for. |
| Best for | Doctor / clinic / hospital context where relevant. |
| Script structure | Ordered list of the expected talking-point flow. |
| Recording guide | Framing, environment, delivery and recording notes. |
| B-roll suggestions | Short list of useful supporting visuals. |
| What sBloom delivers | Editing, captions, brand treatment and relevant export formats. |
| Primary CTA | Start With This Template / Start Project. |

## 6.4 Public-MVP CTA Behavior

Because authenticated project creation is out of scope, the final action must be truthful. Choose one of the following based on what the team can support at launch:

- Scroll to an enquiry form that actually submits to an implemented endpoint/workflow.

- Open a simple contact/request form that stores or sends the request.

- Route to a clearly labeled “Coming soon / Request early access” flow if no backend exists yet.

| Never fake success<br>Do not show “project created,” “slot reserved,” or “upload received” unless the application actually performed that action. |
| --- |

# 7. Frontend Architecture

The current application uses React, TypeScript, Vite, React Router, Tailwind CSS, Framer Motion and React Icons. The Healthcare page should extend this architecture rather than introduce a parallel system.

## 7.1 Route

| Required route<br>/healthcare — public, no authentication requirement. |
| --- |

## 7.2 Proposed File Structure

Recommended structure (adjust only after Antigravity inspects the actual repository):

src/

├── pages/

│ └── HealthcarePage.tsx

├── components/

│ └── healthcare/

│ ├── HealthcareHero.tsx

│ ├── HealthcareProblem.tsx

│ ├── HealthcareSolution.tsx

│ ├── HealthcareTemplates.tsx

│ ├── HealthcareTemplateCard.tsx

│ ├── HealthcareTemplateDrawer.tsx

│ ├── HealthcareWorkflow.tsx

│ ├── HealthcareServices.tsx

│ ├── HealthcareTrust.tsx

│ ├── HealthcareCommercial.tsx

│ └── HealthcareCTA.tsx

├── data/

│ └── healthcareTemplates.ts

└── types/

└── healthcare.ts (only if shared type location is useful)

## 7.3 Proposed Component Tree

HealthcarePage

├── Shared Header

├── HealthcareHero

├── HealthcareProblem

├── HealthcareSolution

├── HealthcareTemplates

│ ├── Template filters (optional)

│ ├── HealthcareTemplateCard × 10

│ └── HealthcareTemplateDrawer

├── HealthcareWorkflow

├── HealthcareServices

├── HealthcareTrust

├── HealthcareCommercial

├── HealthcareCTA

└── Shared Footer

## 7.4 Template Type / Data Model

export interface HealthcareTemplate {

id: string;

name: string;

category: HealthcareTemplateCategory;

duration: string;

shortDescription: string;

purpose: string;

bestFor?: string[];

scriptStructure: string[];

recordingGuidance: string[];

suggestedBroll: string[];

deliverables: string[];

previewImage: string;

}

## 7.5 State Management

- Use local state for selected template, drawer/modal visibility and optional filter state.

- Do not introduce Redux, Zustand or another global-state library for this page.

- Do not create application-wide abstractions before a real cross-page need exists.

## 7.6 Existing Shared Components to Reuse

- Shared Header / navigation after pre-Healthcare cleanup is complete.

- Shared Footer.

- Existing Reveal component where a reveal genuinely helps continuity.

- Existing Tailwind design tokens for navy, brand red/pink, typography and spacing.

- React Router conventions already used by the app.

| Do not clone Kids Zone<br>Healthcare may share infrastructure and brand tokens, but its section layouts, imagery, color balance and interaction tone should be designed specifically for healthcare professionals. |
| --- |

# 8. Healthcare Visual & Interaction System

## 8.1 Visual Direction

| Dimension | Healthcare direction | Avoid |
| --- | --- | --- |
| Tone | Calm, professional, clinical, trustworthy, modern. | Childlike energy, gaming aesthetics, over-futuristic AI look. |
| Base palette | White / off-white, dark navy, brand red/pink accents. | A new unrelated brand palette. |
| Supporting color | Restrained medical blue / teal / soft cyan. | Neon cyan everywhere or gradient-heavy surfaces. |
| Typography | Outfit for headings, Inter for body once correctly loaded. | Random font changes or oversized display type in every section. |
| Cards | Purpose-driven cards with restrained borders/shadows. | Cards for every piece of content. |
| Imagery | Doctors, clinics, recording context, actual output examples. | Generic stock imagery unrelated to the service. |
| Motion | Fast, subtle reveals and state transitions. | Bounce loops, heavy 3D, cursor effects, slow blocking transitions. |

## 8.2 Suggested Color Roles

| Role | Suggested token/direction |
| --- | --- |
| Primary dark | Existing sBloom navy / navy-dark. |
| Brand accent | Existing sBloom red / pink. |
| Healthcare support | Restrained teal / medical blue. |
| Primary background | White / off-white. |
| Secondary surface | Very light neutral or soft cyan-tinted neutral. |
| Primary text | Dark navy / near-black. |
| Secondary text | Muted slate/gray. |
| Border | Low-contrast cool gray. |
| Success / error | Semantic green / red; never use healthcare accent as an error color. |

## 8.3 Animation

- Reuse Reveal where it helps section continuity; do not animate every child element independently.

- Template drawer/modal should use a short, clear enter/exit transition.

- Hover effects must have equivalent focus/tap feedback.

- No constant background motion is required.

- Respect prefers-reduced-motion and reduce/disable non-essential transitions.

# 9. Responsive & Accessibility Plan

## 9.1 Required Viewport QA

| Viewport | Expected behavior |
| --- | --- |
| 390px | Single-column content; intentional mobile navigation; template cards stacked; preview as mobile-friendly sheet/modal; no horizontal overflow. |
| 768px | Tablet spacing; two-column card layouts only where comfortable; CTA sizing remains touch friendly. |
| 1280px | Primary desktop layout; controlled content width; template grid and drawer fit without crowding. |
| 1440px | Spacing should remain balanced; content should not stretch excessively. |
| 1920px | Use constrained max-width containers; avoid giant text lines or over-wide grids. |

## 9.2 Accessibility Requirements

- Semantic heading hierarchy with one page H1.

- Buttons use <button>; navigation uses links / React Router links.

- No arbitrary clickable <div> elements.

- Visible focus states on all interactive controls.

- Template cards must be reachable and operable by keyboard.

- Preview drawer/modal must support focus trap, Escape close and focus return.

- Use aria-expanded only for controls that actually expand content; use accessible dialog labels for modal/drawer.

- Images require meaningful alt text; decorative images use empty alt text.

- Text/background contrast must meet accessible contrast expectations.

- Touch targets should be comfortably sized on mobile.

- Respect reduced motion preferences.

## 9.3 Interaction States Checklist

| Element | Required states |
| --- | --- |
| Primary CTA | Default, hover, focus-visible, active, disabled/loading only if real async behavior exists. |
| Template card action | Default, hover, focus-visible, selected/open. |
| Filter control | Default, hover, focus-visible, active. |
| Drawer/modal | Opening, open, closing; close button focus; keyboard Escape. |
| Form if added | Default, focus, validation error, submitting, success, submission failure. |
| Mobile menu | Closed, open, focus-visible, Escape close, route change close. |

# 10. SEO, Performance & Measurement

## 10.1 Healthcare SEO Requirements

- Unique healthcare page title.

- Healthcare-specific meta description written naturally.

- Canonical URL for /healthcare.

- Open Graph title, description and representative image.

- Semantic headings and meaningful visible content; no keyword stuffing.

- Template names should appear in meaningful page content because they are actual product offerings, not SEO filler.

| Suggested metadata direction<br>Title: sBloom Healthcare — Professional Video Templates for Doctors & Clinics. Meta description: Choose structured healthcare video templates, follow simple recording guidance and let sBloom handle professional editing and production. |
| --- |

## 10.2 Performance Requirements

- Optimize template and hero imagery; prefer WebP/AVIF where appropriate.

- Lazy-load below-the-fold images.

- Do not autoplay large video in the initial viewport.

- Avoid unnecessary JavaScript-heavy animation.

- Avoid new dependencies unless the current stack cannot implement the requirement cleanly.

- Keep template data local/static in the MVP rather than adding an API request for static content.

## 10.3 Recommended Analytics Events

Instrumentation can be added only if an analytics solution already exists or is explicitly approved. Event naming should focus on behavior, not sensitive healthcare data.

| Privacy rule<br>Do not send patient names, medical conditions, uploaded file names or other sensitive healthcare information into general analytics events. |
| --- |

| Event | Trigger | Purpose |
| --- | --- | --- |
| healthcare_page_view | /healthcare loaded | Measure page reach. |
| healthcare_templates_viewed | Template repository enters viewport | Measure exposure to the core product. |
| healthcare_template_previewed | User opens a template preview | Measure template interest. |
| healthcare_template_selected | User clicks Start With This Template | Measure high-intent action. |
| healthcare_workflow_viewed | Workflow enters viewport | Measure comprehension exposure. |
| healthcare_final_cta_clicked | Final CTA clicked | Measure end-of-page intent. |

# 11. Antigravity Implementation Plan

Antigravity should work in planning mode for the Healthcare feature. It must inspect the repository and the .agents/AGENTS.md rules before modifying code. The sequence below intentionally keeps changes coherent and verifiable.

## Phase 0 — Preflight & Baseline Gate

- Confirm the pre-Healthcare cleanup document has been completed or identify remaining blockers.

- Inspect App.tsx, main.tsx, index.css, Header, Footer, Reveal, current page structure and asset locations.

- Run the current TypeScript/lint/build checks before Healthcare changes so existing failures are separated from new failures.

- Confirm / and /kids-zone still work.

- Create implementation_plan.md and wait for approval before code changes.

| Completion gate<br>Gate: baseline build status and reusable shared components are known. |
| --- |

## Phase 1 — Healthcare Foundation

- Add /healthcare route using existing React Router conventions.

- Create HealthcarePage composition file.

- Create healthcare-specific component directory.

- Create structured healthcareTemplates.ts data with the ten templates.

- Create TypeScript types/interfaces without any any escape hatches.

- Add Healthcare to shared navigation only when the route exists.

| Completion gate<br>Gate: /healthcare renders a simple shell, routing works, build passes. |
| --- |

## Phase 2 — Core Story Sections

- Implement HealthcareHero.

- Implement HealthcareProblem.

- Implement HealthcareSolution.

- Implement HealthcareWorkflow.

- Implement HealthcareServices.

- Implement HealthcareTrust.

- Implement HealthcareCommercial and final CTA with placeholder/approved commercial wording.

| Completion gate<br>Gate: visitor can understand the offer, workflow and trust model without template interaction. |
| --- |

## Phase 3 — Template Repository

- Implement data-driven HealthcareTemplates list.

- Implement HealthcareTemplateCard.

- Add optional lightweight category filters only if useful.

- Implement HealthcareTemplateDrawer/modal.

- Add keyboard/focus behavior and mobile adaptation.

- Ensure card details come from data rather than duplicated JSX.

| Completion gate<br>Gate: all ten templates are scannable, previewable and accessible. |
| --- |

## Phase 4 — Visual System & Content Polish

- Apply healthcare color balance within the shared sBloom system.

- Use final/approved healthcare imagery and optimize assets.

- Refine spacing, typography, section transitions and CTA hierarchy.

- Ensure Healthcare does not visually copy Kids Zone or become a generic SaaS page.

- Add reduced-motion behavior.

| Completion gate<br>Gate: page looks intentional at all required viewport sizes. |
| --- |

## Phase 5 — SEO, Measurement & Technical QA

- Add route-specific metadata using the project’s chosen approach.

- Add analytics events only if an approved analytics system exists.

- Run TypeScript validation, lint and production build.

- Check browser console.

- Test keyboard navigation and interactive states.

- Perform visual QA at 390, 768, 1280, 1440 and 1920px.

- Re-test / and /kids-zone for regressions.

| Completion gate<br>Gate: definition of done is satisfied. |
| --- |

## 11.1 Expected Existing Files to Modify

| File / area | Expected change |
| --- | --- |
| src/App.tsx | Add the /healthcare route and HealthcarePage import. |
| src/components/Header.tsx | Add Healthcare navigation item and ensure active/mobile behavior is correct. |
| src/index.css | Only add shared healthcare design tokens/utilities if repeated values justify it; avoid one-off CSS dumping. |
| public/assets or src/assets | Add optimized healthcare imagery following the project’s chosen asset convention. |
| Metadata mechanism | Add healthcare-specific title/description/OG metadata using the project’s existing or approved approach. |

## 11.2 Expected New Files

- src/pages/HealthcarePage.tsx

- src/components/healthcare/HealthcareHero.tsx

- src/components/healthcare/HealthcareProblem.tsx

- src/components/healthcare/HealthcareSolution.tsx

- src/components/healthcare/HealthcareTemplates.tsx

- src/components/healthcare/HealthcareTemplateCard.tsx

- src/components/healthcare/HealthcareTemplateDrawer.tsx

- src/components/healthcare/HealthcareWorkflow.tsx

- src/components/healthcare/HealthcareServices.tsx

- src/components/healthcare/HealthcareTrust.tsx

- src/components/healthcare/HealthcareCommercial.tsx

- src/components/healthcare/HealthcareCTA.tsx

- src/data/healthcareTemplates.ts

Antigravity may merge or omit small components if the repository structure shows that a simpler composition is cleaner. It should not split components mechanically just to match this list.

# 12. Verification & QA Plan

## 12.1 Automated / Build Verification

- TypeScript validation passes with no suppression added to hide real errors.

- Linting passes.

- Production build passes.

- No new missing-module, unused-variable or unresolved asset errors.

## 12.2 Route Regression

| Route | Expected result |
| --- | --- |
| / | Existing Creators experience remains functional and visually unchanged except intentional shared-nav fixes. |
| /kids-zone | Existing Kids Zone remains functional and visually unchanged except intentional shared-nav fixes. |
| /healthcare | New Healthcare experience loads correctly and is independently accessible. |
| Unknown route | Current app behavior remains unchanged unless a 404 route is separately approved. |

## 12.3 UX QA Checklist

- A new visitor can identify healthcare audience, product function and next action within approximately five seconds.

- Explore Video Templates is the obvious primary CTA.

- The ten templates are scannable without opening each one.

- Opening a preview does not make the user lose browsing context.

- Workflow responsibilities are clear: what the customer does vs what sBloom does.

- No section exists only to make the page longer.

- Commercial messaging does not invent pricing or contract terms beyond approved direction.

- The page does not claim medical validation or clinical outcomes.

## 12.4 Accessibility QA Checklist

- Keyboard can reach navigation, template actions, filters, modal/drawer controls and final CTA.

- Focus is visible at all times.

- Modal/drawer focus behavior is correct.

- Heading hierarchy is logical.

- Images have correct alt treatment.

- Reduced motion is respected.

- No important meaning relies on color alone.

## 12.5 Visual QA Checklist

- Check 390px, 768px, 1280px, 1440px and 1920px.

- No horizontal overflow.

- Template cards maintain clear hierarchy and proportions.

- Hero image/content cropping remains intentional.

- Navigation and footer remain balanced.

- Drawer/modal fits viewport without clipped controls.

- CTA hierarchy is obvious on mobile and desktop.

- Healthcare visual tone is distinct from Kids Zone while retaining sBloom identity.

# 13. Decisions Required Before Final Content Lock

| Decision | Why it matters | Default planning assumption |
| --- | --- | --- |
| Exact pricing | Cannot publish unapproved monetary claims. | Use low-commitment monthly-plan messaging without amounts. |
| Public CTA destination | A CTA must perform a real, truthful action. | Use an implemented enquiry/request flow or early-access intent. |
| Healthcare imagery | Trust depends heavily on visual authenticity. | Use professional healthcare + recording environments; avoid generic hero stock. |
| Template final naming | Names become reusable product data. | Use the ten names in this document unless business review changes them. |
| Medical content responsibility statement | Prevents false impression that sBloom validates clinical advice. | State production responsibility clearly and avoid validation claims. |
| Testimonials / logos | Fabricated proof is unacceptable. | Omit until real approved proof exists. |

# 14. Future Product Roadmap After Landing-Page Validation

The following capabilities are intentionally deferred. They should only be designed once the public template proposition and user workflow are validated.

| Future phase | Capabilities |
| --- | --- |
| Phase A — Authenticated project start | Google OAuth / FastAPI pipeline, shared user profile, healthcare role routing, template selection persistence. |
| Phase B — Secure upload | Private file uploads, type/size validation, signed URLs, explicit rules against patient-identifiable content unless a compliant process exists. |
| Phase C — Production workflow | Project/order status, editor handoff, revision states, delivery tracking, notifications. |
| Phase D — Subscription | Approved plans, recurring billing, monthly usage/entitlement tracking, cancel/upgrade experience. |
| Phase E — Content operations | Template management, script frameworks, brand kits, repeatable production rules, editor tooling. |
| Phase F — Assisted automation | Use standardized templates/rules to introduce bounded AI assistance where reliable; do not promise full automation by default. |

## 14.1 Future Security & Privacy Gates

- Private uploads must never be exposed through public URLs by default.

- Authorization must be enforced server-side, not only in React.

- File type and size must be validated.

- Patient-identifiable information must not be casually collected or stored.

- Analytics must avoid sensitive healthcare content.

- Any regulatory/compliance claims require separate legal/technical validation before publication.

# 15. Healthcare Landing Page — Definition of Done

- ☐ The /healthcare route exists and is public.

- ☐ The hero clearly identifies audience, product value and primary action.

- ☐ Explore Video Templates is the clear primary CTA.

- ☐ All ten healthcare templates render from structured data.

- ☐ Each template communicates name, purpose, duration, category, preview and action.

- ☐ Template preview reveals detailed structure without unnecessary navigation loss.

- ☐ Workflow clearly explains Select → Record → Upload → Produce → Review → Publish.

- ☐ What sBloom handles is explicit and realistic.

- ☐ Commercial messaging reflects low commitment without unapproved hard-coded pricing.

- ☐ No unsupported medical, compliance or outcome claims appear.

- ☐ Healthcare is visually distinct from Kids Zone and still recognizably sBloom.

- ☐ Mobile navigation works.

- ☐ Required responsive viewports pass visual QA.

- ☐ Keyboard navigation and focus behavior work.

- ☐ Reduced motion is respected.

- ☐ TypeScript passes.

- ☐ Linting passes.

- ☐ Production build passes.

- ☐ No obvious console errors remain.

- ☐ Existing / and /kids-zone routes still work.

- ☐ No backend, authentication, upload, billing or AI architecture was added unnecessarily.

# 16. One-Page Execution Summary

| Step | What to do | Do not do |
| --- | --- | --- |
| 1. Baseline | Confirm existing repo is stable and build status is known. | Do not hide existing build errors. |
| 2. Route & data | Create /healthcare, page shell and healthcareTemplates.ts. | Do not hardcode ten full template cards in JSX. |
| 3. Story | Build Hero → Problem → Solution → Workflow → Services → Trust. | Do not lead with infrastructure or AI. |
| 4. Core product | Build template grid + accessible preview interaction. | Do not overbuild search or global state. |
| 5. Commercial | Add low-risk monthly positioning with truthful CTA. | Do not invent pricing or fake success. |
| 6. Visual polish | Apply calm healthcare visual language within sBloom brand. | Do not copy Kids Zone or create neon SaaS styling. |
| 7. QA | Run type/lint/build, responsive, keyboard, console and regression tests. | Do not call the page complete because it merely compiles. |

| Antigravity working rule<br>Research the repository first → create implementation_plan.md → obtain approval → implement the smallest coherent version → verify → visually inspect → document changes. |
| --- |
