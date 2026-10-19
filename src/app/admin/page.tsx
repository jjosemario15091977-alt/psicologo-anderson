'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Trash2, Eye, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

export default function AdminPage() {
  // Estado de Autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estados do Painel Administrativo
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('07:00 - 08:00');
  const [agendas, setAgendas] = useState<Array<{ date: string; slots: string[] }>>([
    { date: '22/10/2026', slots: ['09:00 - 10:00', '14:00 - 15:00'] },
    { date: '23/10/2026', slots: ['10:00 - 11:00'] }
  ]);
  const [activeTab, setActiveTab] = useState<'cadastrar' | 'preagendamentos'>('cadastrar');

  // Função de Login simples (Senha padrão: admin123 ou configurada)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Você pode alterar 'admin123' para a senha que preferir ou usar variável de ambiente
    if (passwordInput === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Senha incorreta. Tente novamente.');
    }
  };

  // Geração da grade de horários de 1 em 1 hora, das 07:00 às 22:00
  const timeSlots = [];
  for (let h = 7; h < 22; h++) {
    const inicio = String(h).padStart(2, '0') + ':00';
    const fim = String(h + 1).padStart(2, '0') + ':00';
    const turno = h < 12 ? 'Manhã' : h < 18 ? 'Tarde' : 'Noite';
    timeSlots.push(`${inicio} - ${fim} (${turno})`);
  }

  const handleAddAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    // Formata a data de YYYY-MM-DD para DD/MM/YYYY se necessário
    let formattedDate = selectedDate;
    if (selectedDate.includes('-')) {
      const [ano, mes, dia] = selectedDate.split('-');
      formattedDate = `${dia}/${mes}/${ano}`;
    }

    const existingIndex = agendas.findIndex(a => a.date === formattedDate);
    if (existingIndex >= 0) {
      const updated = [...agendas];
      if (!updated[existingIndex].slots.includes(selectedTimeSlot)) {
        updated[existingIndex].slots.push(selectedTimeSlot);
      }
      setAgendas(updated);
    } else {
      setAgendas([...agendas, { date: formattedDate, slots: [selectedTimeSlot] }]);
    }
    setSelectedDate('');
  };

  const handleDeleteAgenda = (dateToRemove: string) => {
    setAgendas(agendas.filter(a => a.date !== dateToRemove));
  };

  // Se não estiver autenticado, exibe a tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-slate-800">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-emerald-50 text-emerald-800 rounded-full mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold">Área do Profissional</h1>
            <p className="text-xs text-slate-500 mt-1">Insira sua senha para acessar o painel administrativo.</p>
          </div>

          {loginError && (
            <div className="bg-rose-50 text-rose-800 border border-rose-200 p-3 rounded-xl text-xs mb-4 font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Senha de Acesso</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                placeholder="Digite a senha..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-md"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o site principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Painel Administrativo Protegido
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-slate-900">Painel do Profissional</h1>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">Sessão Autenticada</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-800 font-medium transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Ver Site
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 bg-rose-50 rounded-lg transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex border-b border-slate-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab('cadastrar')}
            className={`pb-3 text-sm font-semibold transition border-b-2 -mb-px ${
              activeTab === 'cadastrar' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Cadastrar Dias Disponíveis ({agendas.length})
          </button>
          <button
            onClick={() => setActiveTab('preagendamentos')}
            className={`pb-3 text-sm font-semibold transition border-b-2 -mb-px ${
              activeTab === 'preagendamentos' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Pré-agendamentos Recebidos
          </button>
        </div>

        {activeTab === 'cadastrar' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" /> Cadastrar Janelas de Atendimento
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Selecione a data e escolha o horário na lista (das 07:00 às 22:00) para compor os horários livres.
              </p>

              <form onSubmit={handleAddAgenda} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Data Disponível *</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Horários Disponíveis *</label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none bg-white"
                  >
                    {timeSlots.map((slot, index) => (
                      <option key={index} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-2.5 rounded-xl transition text-xs shadow-sm"
                >
                  Adicionar Horário
                </button>
              </form>
            </div>

            <div className="md:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" /> Agenda Cadastrada
              </h2>

              {agendas.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">Nenhuma data cadastrada no momento.</p>
              ) : (
                <div className="space-y-3">
                  {agendas.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">{item.date}</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Ativo</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{item.slots.length} horário(s) selecionado(s)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert(`Horários para ${item.date}:\n- ${item.slots.join('\n- ')}`)}
                          className="p-2 text-slate-600 hover:text-emerald-700 transition rounded-lg hover:bg-slate-200"
                          title="Consultar Horários"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAgenda(item.date)}
                          className="p-2 text-rose-600 hover:text-rose-700 transition rounded-lg hover:bg-rose-50"
                          title="Remover Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center py-12">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h2 className="text-base font-bold text-slate-800">Pré-agendamentos Recebidos</h2>
            <p className="text-xs text-slate-500 mt-1">Os pedidos de pré-agendamento submetidos no site são enviados diretamente para o seu e-mail institucional.</p>
          </div>
        )}
      </main>
    </div>
  );
}