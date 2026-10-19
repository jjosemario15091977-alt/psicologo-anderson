'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { defaultTherapistConfig } from '../config/therapist';
import ApproachSection from '../components/ApproachSection';
import { Calendar, CheckCircle2, Play, Lock, Video } from 'lucide-react';

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Home() {
  const therapist = defaultTherapistConfig;

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    vinculo: 'Primeira Consulta (Novo Paciente)',
    turno: 'Manhã',
    dataHorario: '',
    observacoes: '',
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    try {
      const response = await fetch('/api/agendamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar o pré-agendamento.');
      }

      setMensagem({
        tipo: 'sucesso',
        texto: 'Pré-agendamento recebido com sucesso! Em breve entraremos em contato para confirmação.',
      });

      setFormData({
        nome: '',
        email: '',
        telefone: '',
        vinculo: 'Primeira Consulta (Novo Paciente)',
        turno: 'Manhã',
        dataHorario: '',
        observacoes: '',
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Ocorreu um erro inesperado. Tente novamente.';
      setMensagem({
        tipo: 'erro',
        texto: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* 1. HEADER / NAVEGAÇÃO */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {therapist.name}
            </h1>
            <p className="text-[11px] text-emerald-800 font-medium">
              {therapist.title}
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {therapist.instagramUrl && (
              <a
                href={therapist.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition"
                title="Siga no Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            )}

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-800 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full transition font-medium"
              title="Acesso Restrito ao Profissional"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span className="hidden sm:inline">Área do Profissional</span>
              <span className="sm:hidden">Painel</span>
            </Link>

            <a
              href="#agendamento"
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs py-2 px-4 rounded-full transition shadow-sm hover:shadow"
            >
              Agendar Consulta
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION REDIMENSIONADA */}
      <section className="bg-white py-8 md:py-12 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="w-full max-w-[230px] bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200/80 relative">
              <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src={therapist.avatarUrl}
                  alt={therapist.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 230px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="mt-2.5 inline-flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-[11px] font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{therapist.name} - {therapist.crp}</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-3.5">
            <span className="inline-block bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Atendimento Psicológico Individual
            </span>
            
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              Cuidar da sua saúde mental é o primeiro passo para uma vida com mais equilíbrio.
            </h2>

            <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-100 space-y-2.5">
              <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                Sobre {therapist.name}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {therapist.about.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 border-t border-slate-200/60">
                {therapist.about.highlights.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <a
                href="#agendamento"
                className="inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-xl transition shadow-md hover:shadow-lg shrink-0"
              >
                <Calendar className="w-4 h-4" />
                Iniciar Atendimento
              </a>

              <div className="flex-1 bg-slate-900 text-white p-2 rounded-xl border border-slate-800 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-850 transition">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-600 text-white rounded-lg group-hover:scale-105 transition shrink-0">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-100 leading-tight">
                      Vídeo de Apresentação
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Conheça a abordagem em 1 minuto
                    </span>
                  </div>
                </div>
                <Video className="w-3.5 h-3.5 text-slate-500 mr-1" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. SEÇÃO DE ABORDAGEM */}
      <ApproachSection />

      {/* 4. FORMULÁRIO DE PRÉ-AGENDAMENTO */}
      <section id="agendamento" className="py-10 bg-emerald-900 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-5">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">Solicitar Agendamento</h2>
            <p className="text-emerald-100 text-xs">
              Preencha os dados abaixo para verificar a disponibilidade na agenda.
            </p>
          </div>

          <div className="bg-white text-slate-800 rounded-2xl shadow-xl p-5 sm:p-6">
            {mensagem && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium ${
                  mensagem.tipo === 'sucesso'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {mensagem.texto}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail do Paciente *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition"
                    placeholder="seuemail@exemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vínculo / Atendimento *
                  </label>
                  <select
                    value={formData.vinculo}
                    onChange={(e) => setFormData({ ...formData, vinculo: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition bg-white"
                  >
                    <option value="Primeira Consulta (Novo Paciente)">Primeira Consulta (Novo Paciente)</option>
                    <option value="Sessão Contínua / Retorno">Sessão Contínua / Retorno</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Turno Preferencial *
                  </label>
                  <select
                    value={formData.turno}
                    onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition bg-white"
                  >
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Data e Horário Preferencial *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dataHorario}
                  onChange={(e) => setFormData({ ...formData, dataHorario: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motivo do Atendimento (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition"
                  placeholder="Conte sucintamente o que te traz à terapia..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 text-xs sm:text-sm"
              >
                {loading ? 'Consultando disponibilidade...' : 'Solicitar Horários Disponíveis'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 5. RODAPÉ */}
      <footer className="bg-slate-950 text-slate-400 py-6 border-t border-slate-800 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2.5">
          <p className="text-white font-medium text-xs">
            {therapist.name} | Psicologia Clínica
          </p>
          <p className="text-[11px] text-slate-500">
            Atendimentos 100% Online via Google Meet • Sigilo Ético Profissional
          </p>

          <div className="flex justify-center items-center gap-3 pt-1">
            {therapist.instagramUrl && (
              <a
                href={therapist.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                Siga no Instagram
              </a>
            )}
            
            <span className="text-slate-800">•</span>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition"
            >
              <Lock className="w-3 h-3" />
              Área Administrativa
            </Link>
          </div>

          <p className="text-[10px] text-slate-600 pt-2 border-t border-slate-900">
            © {new Date().getFullYear()} {therapist.name}. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}