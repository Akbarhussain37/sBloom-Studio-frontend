export type HealthcareTemplateCategory = 
  | 'Introduction' 
  | 'Treatment' 
  | 'Education' 
  | 'Patient Guidance' 
  | 'Trust / Story';

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

export const healthcareTemplates: HealthcareTemplate[] = [
  {
    id: "dr-intro",
    name: "Doctor Introduction",
    category: "Introduction",
    duration: "45–60 sec",
    shortDescription: "Introduce the doctor, specialty and approach in a concise professional format.",
    purpose: "Introduce the doctor, specialty and approach in a concise professional format.",
    scriptStructure: [
      "Hook / name + specialty",
      "Who you help",
      "What patients can expect",
      "Simple closing CTA"
    ],
    recordingGuidance: [
      "Chest-up framing",
      "Quiet clinic background",
      "Direct-to-camera delivery",
      "Natural conversational tone"
    ],
    suggestedBroll: [
      "Clinic exterior/interior",
      "Consultation environment",
      "Relevant equipment/details"
    ],
    deliverables: ["16:9 Landscape Video", "9:16 Vertical Video", "Captions", "Brand Outro"],
    previewImage: "/assets/images/placeholder_doctor.png"
  },
  {
    id: "clinic-intro",
    name: "Clinic / Hospital Introduction",
    category: "Introduction",
    duration: "60–90 sec",
    shortDescription: "Present the facility, services and patient experience in a structured overview.",
    purpose: "Present the facility, services and patient experience in a structured overview.",
    scriptStructure: [
      "Facility introduction",
      "Key services",
      "Team / capability highlights",
      "Patient experience",
      "Closing CTA"
    ],
    recordingGuidance: [
      "Mix direct-to-camera + facility shots",
      "Keep messaging benefit-focused",
      "Record short modular segments"
    ],
    suggestedBroll: [
      "Reception",
      "Treatment rooms",
      "Team at work",
      "Facility signage"
    ],
    deliverables: ["16:9 Landscape Video", "9:16 Vertical Video", "Captions", "Brand Outro"],
    previewImage: "/assets/images/placeholder_clinic.png"
  },
  {
    id: "treatment-exp",
    name: "Treatment Explanation",
    category: "Treatment",
    duration: "60–120 sec",
    shortDescription: "Explain what a treatment is, who it may be for and what the process generally involves.",
    purpose: "Explain what a treatment is, who it may be for and what the process generally involves.",
    scriptStructure: [
      "What it is",
      "Why it may be recommended",
      "What happens",
      "Common preparation / recovery notes",
      "Professional caveat / CTA"
    ],
    recordingGuidance: [
      "Use plain language",
      "Avoid guaranteed outcomes",
      "Record in logical short sections"
    ],
    suggestedBroll: [
      "Treatment environment",
      "Equipment close-ups",
      "Simple diagrams/graphics where appropriate"
    ],
    deliverables: ["16:9 Landscape Video", "9:16 Vertical Video", "Captions", "Brand Outro"],
    previewImage: "/assets/images/placeholder_treatment.png"
  },
  {
    id: "patient-edu",
    name: "Patient Education",
    category: "Education",
    duration: "45–90 sec",
    shortDescription: "Teach one health concept in an accessible, structured way.",
    purpose: "Teach one health concept in an accessible, structured way.",
    scriptStructure: [
      "Question / problem",
      "Core explanation",
      "Key points",
      "What patients should remember",
      "Closing guidance"
    ],
    recordingGuidance: [
      "One topic per video",
      "Use short sentences",
      "Avoid jargon or define it quickly"
    ],
    suggestedBroll: [
      "Relevant diagrams",
      "Safe illustrative footage",
      "On-screen key terms"
    ],
    deliverables: ["9:16 Vertical Video", "Captions", "Text Overlays"],
    previewImage: "/assets/images/placeholder_education.png"
  },
  {
    id: "myth-fact",
    name: "Myth vs Fact",
    category: "Education",
    duration: "30–60 sec",
    shortDescription: "Correct a common misconception using a quick, repeatable format.",
    purpose: "Correct a common misconception using a quick, repeatable format.",
    scriptStructure: [
      "State myth",
      "State fact",
      "Brief explanation",
      "When to seek professional advice"
    ],
    recordingGuidance: [
      "High-energy but professional delivery",
      "One myth per clip",
      "Keep claims precise"
    ],
    suggestedBroll: [
      "Text overlays",
      "Simple supporting visuals",
      "Relevant environment"
    ],
    deliverables: ["9:16 Vertical Video", "Dynamic Captions", "Sound Effects"],
    previewImage: "/assets/images/placeholder_myth.png"
  },
  {
    id: "faq",
    name: "Frequently Asked Questions",
    category: "Education",
    duration: "45–90 sec",
    shortDescription: "Answer one recurring patient question clearly and consistently.",
    purpose: "Answer one recurring patient question clearly and consistently.",
    scriptStructure: [
      "Question on screen",
      "Short direct answer",
      "Context / exceptions",
      "Action or next step"
    ],
    recordingGuidance: [
      "Record answers as standalone clips",
      "Maintain eye contact",
      "Avoid overlong explanations"
    ],
    suggestedBroll: [
      "Question text graphic",
      "Clinic B-roll",
      "Procedure/equipment details if relevant"
    ],
    deliverables: ["9:16 Vertical Video", "Captions", "Question Graphic"],
    previewImage: "/assets/images/placeholder_faq.png"
  },
  {
    id: "prep",
    name: "Procedure Preparation",
    category: "Patient Guidance",
    duration: "60–90 sec",
    shortDescription: "Prepare patients for a procedure with a clear pre-visit checklist-style explanation.",
    purpose: "Prepare patients for a procedure with a clear pre-visit checklist-style explanation.",
    scriptStructure: [
      "What to expect",
      "Before-arrival steps",
      "What to bring / avoid",
      "Arrival/process notes",
      "When to contact the clinic"
    ],
    recordingGuidance: [
      "Use ordered steps",
      "Keep instructions specific to provider-approved guidance",
      "Avoid generic medical advice"
    ],
    suggestedBroll: [
      "Check-in area",
      "Preparation materials",
      "On-screen checklist"
    ],
    deliverables: ["16:9 Landscape Video", "Captions", "Checklist Overlays"],
    previewImage: "/assets/images/placeholder_prep.png"
  },
  {
    id: "post-care",
    name: "Post-Treatment Instructions",
    category: "Patient Guidance",
    duration: "60–120 sec",
    shortDescription: "Reinforce provider-approved aftercare information in a clear video format.",
    purpose: "Reinforce provider-approved aftercare information in a clear video format.",
    scriptStructure: [
      "Immediate aftercare",
      "Expected normal experience",
      "What to avoid",
      "When to contact provider",
      "Follow-up reminder"
    ],
    recordingGuidance: [
      "Use only approved clinical instructions",
      "Speak slowly and clearly",
      "Separate urgent guidance visually if applicable"
    ],
    suggestedBroll: [
      "Aftercare materials",
      "Follow-up setting",
      "On-screen reminder graphics"
    ],
    deliverables: ["16:9 Landscape Video", "9:16 Vertical Video", "Captions"],
    previewImage: "/assets/images/placeholder_care.png"
  },
  {
    id: "success-story",
    name: "Patient Success Story",
    category: "Trust / Story",
    duration: "60–120 sec",
    shortDescription: "Present a patient experience or outcome story when consent and appropriate approvals exist.",
    purpose: "Present a patient experience or outcome story when consent and appropriate approvals exist.",
    scriptStructure: [
      "Context",
      "Challenge / goal",
      "Experience with care",
      "Outcome / reflection",
      "Closing note"
    ],
    recordingGuidance: [
      "Use written consent",
      "Avoid exaggerated or guaranteed-result framing",
      "Prioritize authentic voice"
    ],
    suggestedBroll: [
      "Patient interview",
      "Facility context",
      "Non-sensitive supporting footage"
    ],
    deliverables: ["16:9 Landscape Video", "9:16 Vertical Video", "Captions", "Music Bed"],
    previewImage: "/assets/images/placeholder_success.png"
  },
  {
    id: "health-tips",
    name: "Health Awareness / Quick Tips",
    category: "Education",
    duration: "30–60 sec",
    shortDescription: "Deliver concise provider-approved awareness or prevention tips in a repeatable social format.",
    purpose: "Deliver concise provider-approved awareness or prevention tips in a repeatable social format.",
    scriptStructure: [
      "Topic hook",
      "3 concise points",
      "When to seek professional help",
      "Closing reminder"
    ],
    recordingGuidance: [
      "Keep to one topic",
      "Use approved language",
      "Make points visually scannable"
    ],
    suggestedBroll: [
      "Text callouts",
      "Simple illustrative B-roll",
      "Brand end card"
    ],
    deliverables: ["9:16 Vertical Video", "Captions", "Text Callouts"],
    previewImage: "/assets/images/placeholder_tips.png"
  }
];
