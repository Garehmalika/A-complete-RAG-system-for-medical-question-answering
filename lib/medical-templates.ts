// Medical response templates for structured answers

export interface MedicalTemplate {
  name: string;
  systemPrompt: string;
  structure: string[];
}

export const MEDICAL_TEMPLATES: Record<string, MedicalTemplate> = {
  disorder_info: {
    name: 'Information sur les troubles',
    systemPrompt: `Vous êtes un assistant médical spécialisé en santé mentale. 
    Fournissez des informations précises et structurées basées UNIQUEMENT sur le contexte fourni.
    Si l'information n'est pas dans le contexte, indiquez-le clairement.
    Organisez votre réponse selon la structure demandée.`,
    structure: [
      'Définition',
      'Symptômes principaux',
      'Critères diagnostiques',
      'Facteurs de risque',
      'Prévalence'
    ],
  },
  
  treatment: {
    name: 'Traitement',
    systemPrompt: `Vous êtes un assistant médical spécialisé en santé mentale.
    Fournissez des informations sur les traitements basées UNIQUEMENT sur le contexte fourni.
    Incluez les approches thérapeutiques et pharmacologiques si mentionnées.
    Si l'information n'est pas disponible, indiquez-le clairement.`,
    structure: [
      'Approches thérapeutiques',
      'Traitements pharmacologiques',
      'Thérapies recommandées',
      'Durée du traitement',
      'Efficacité'
    ],
  },
  
  diagnosis: {
    name: 'Diagnostic',
    systemPrompt: `Vous êtes un assistant médical spécialisé en santé mentale.
    Fournissez des informations sur le processus diagnostique basées UNIQUEMENT sur le contexte fourni.
    Incluez les critères, outils et méthodes d'évaluation.
    Si l'information n'est pas disponible, indiquez-le clairement.`,
    structure: [
      'Critères diagnostiques',
      'Outils d\'évaluation',
      'Diagnostic différentiel',
      'Comorbidités fréquentes',
      'Démarche clinique'
    ],
  },
  
  general: {
    name: 'Question générale',
    systemPrompt: `Vous êtes un assistant médical spécialisé en santé mentale.
    Répondez à la question de manière claire et précise basée UNIQUEMENT sur le contexte fourni.
    Structurez votre réponse de façon logique et professionnelle.
    Si l'information n'est pas disponible dans le contexte, indiquez-le clairement.
    Ne jamais inventer ou supposer des informations médicales.`,
    structure: [
      'Réponse principale',
      'Détails supplémentaires',
      'Points importants à retenir'
    ],
  },
};

// Detect which template to use based on the question
export function detectTemplate(question: string): MedicalTemplate {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('traitement') || lowerQuestion.includes('thérapie') || 
      lowerQuestion.includes('soigner') || lowerQuestion.includes('médicament')) {
    return MEDICAL_TEMPLATES.treatment;
  }
  
  if (lowerQuestion.includes('diagnostic') || lowerQuestion.includes('diagnostiquer') ||
      lowerQuestion.includes('évaluation') || lowerQuestion.includes('critères')) {
    return MEDICAL_TEMPLATES.diagnosis;
  }
  
  if (lowerQuestion.includes('qu\'est-ce') || lowerQuestion.includes('définition') ||
      lowerQuestion.includes('symptômes') || lowerQuestion.includes('trouble')) {
    return MEDICAL_TEMPLATES.disorder_info;
  }
  
  return MEDICAL_TEMPLATES.general;
}

// Format the prompt with template and context
export function formatPromptWithTemplate(
  question: string,
  context: string[],
  template: MedicalTemplate
): string {
  const contextText = context.join('\n\n---\n\n');
  
  return `${template.systemPrompt}

CONTEXTE MÉDICAL:
${contextText}

STRUCTURE DE RÉPONSE ATTENDUE:
${template.structure.map((s, i) => `${i + 1}. ${s}`).join('\n')}

QUESTION:
${question}

Répondez de manière structurée en suivant la structure attendue. Basez-vous UNIQUEMENT sur le contexte fourni.`;
}
