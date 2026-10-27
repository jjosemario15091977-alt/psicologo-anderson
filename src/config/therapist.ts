export interface TherapistConfig {
  name: string;
  title: string;
  crp: string;
  avatarUrl: string;
  videoUrl?: string;
  instagramUrl: string;
  whatsappNumber: string;
  about: {
    summary: string;
    highlights: string[];
  };
  approach: {
    title: string;
    description: string;
    topics: string[];
  };
}

export const defaultTherapistConfig: TherapistConfig = {
  name: "Anderson [Inserir Sobrenome]", // Substitua pelo nome completo do Anderson
  title: "Psicólogo Clínico • Atendimento Online",
  crp: "CRP 00/00000", // Substitua pelo CRP real
  avatarUrl: "/images/anderson.jpg",
  videoUrl: "",
  instagramUrl: "https://instagram.com/seu.perfil", // Coloque o link do Instagram profissional
  whatsappNumber: "5575999999999", // Coloque o DDD e número do WhatsApp profissional
  about: {
    summary:
      "Profissional dedicado a auxiliar pessoas no processo de autoconhecimento, gestão da ansiedade e superação de desafios emocionais através do acolhimento sigiloso e humanizado.",
    highlights: [
      "Atendimento Online Flexível",
      "Sessões Individuais Personalizadas",
      "Ambientes 100% Seguros e Sigilosos",
      "Atendimento Humanizado e Ético",
    ],
  },
  approach: {
    title: "Terapia Cognitivo-Comportamental (TCC)",
    description:
      "Uma abordagem estruturada, objetiva e focada no presente, voltada para identificar padrões de pensamentos e comportamentos que impactam o bem-estar emocional.",
    topics: [
      "Tratamento focado em ansiedade, estresse e reestruturação cognitiva",
      "Desenvolvimento de estratégias práticas e resolutivas para o dia a dia",
      "Prática baseada em evidências científicas e acolhimento humanizado",
    ],
  },
};
