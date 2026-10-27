export interface TherapistConfig {
  name: string;
  title: string;
  crp: string;
  avatarUrl: string;
  videoUrl?: string;
  instagramUrl: string;
  whatsappNumber: string;
  email: string;
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
  name: "Anderson Kleiton de Oliveira Gaspar",
  title: "Psicólogo Clínico • Atendimento Online",
  crp: "CRP-03/26389",
  avatarUrl: "/images/anderson.jpg",
  videoUrl: "",
  instagramUrl: "https://instagram.com/seu.perfil",
  whatsappNumber: "5575992605090", // Número de contato com DDI e DDD formatados para o WhatsApp
  email: "gaspar.akg@gmail.com",
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
    title: "Abordagem Integrada: TCC, Psicanálise e Técnicas de Regulação",
    description:
      "Uma prática clínica fundamentada na Teoria Cognitivo-Comportamental (TCC) e na Psicanálise (primeira e segunda tópica), associada a intervenções práticas como a TRD (Técnica de Respiração Diafragmática) para regulação ansiosa e a TCM (Técnica de Controle Mental) para o manejo de pensamentos automáticos disfuncionais.",
    topics: [
      "Teoria Cognitivo-Comportamental (TCC) aplicada à reestruturação de padrões de pensamento",
      "Psicanálise (1ª e 2ª tópica) para compreensão profunda do inconsciente e dinâmica psíquica",
      "TRD (Técnica de Respiração Diafragmática) para alívio do estresse e regulação emocional",
      "TCM (Técnica de Controle Mental) voltada ao manejo de pensamentos automáticos disfuncionais",
    ],
  },
};
