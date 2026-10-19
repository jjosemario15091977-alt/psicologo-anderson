// src/config/therapist.ts

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
  name: "Nome do Profissional",
  title: "Psicólogo(a) Clínico(a) • Atendimento Online",
  crp: "CRP 00/00000",
  avatarUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='350' viewBox='0 0 280 350'%3E%3Crect width='280' height='350' fill='%23e2e8f0'/%3E%3Ccircle cx='140' cy='130' r='50' fill='%2394a3b8'/%3E%3Cpath d='M50 290 C50 210 230 210 230 290 Z' fill='%2394a3b8'/%3E%3Ctext x='50%25' y='320' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2364748b'%3EFoto do Profissional%3C/text%3E%3C/svg%3E",
  videoUrl: "",
  instagramUrl: "https://instagram.com/seu.perfil",
  whatsappNumber: "5575999999999",
  about: {
    summary:
      "Profissional dedicado(a) a auxiliar pessoas no processo de autoconhecimento, gestão da ansiedade e superação de desafios emocionais através do acolhimento sigiloso e humanizado.",
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