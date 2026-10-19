'use client';

// Atualizado para garantir o deploy limpo na Vercel
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProposalContent() {
  const searchParams = useSearchParams();

  const nome = searchParams.get('nome') || 'Paciente';
  const whatsapp = searchParams.get('whatsapp') || '';
  const email = searchParams.get('email') || '';
  const dataAgendada = searchParams.get('data') || 'A definir';

  const [selectedPlan, setSelectedPlan] = useState<string>('mensal');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const plans = [
    {
      id: 'avulsa',
      title: 'Sessão Avulsa',
      description: 'Consulta individual de 50 min',
      price: 'R$ 350,00',
      recommended: false,
    },
    {
      id: 'mensal',
      title: 'Plano Mensal (4 Sessões)',
      description: '4 sessões individuais de 50 min',
      price: 'R$ 1.200,00',
      recommended: true,
    },
    {
      id: 'quinzenal',
      title: 'Plano Quinzenal (2 Sessões)',
      description: '2 sessões individuais de 50 min',
      price: 'R$ 640,00',
      recommended: false,
    },
  ];

  const handleConfirmPayment = async () => {
    if (!acceptedTerms) {
      alert('Por favor, aceite os termos de atendimento para continuar.');
      return;
    }

    setLoading(true);

    const chosenPlanObj = plans.find((p) => p.id === selectedPlan);
    const planTitle = chosenPlanObj ? chosenPlanObj.title : 'Plano de Atendimento';
    const planPrice = chosenPlanObj ? chosenPlanObj.price : '';

    try {
      await fetch('/api/proposta/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          whatsapp,
          email,
          plano: planTitle,
          preco: planPrice,
          dataAgendada,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Erro ao registrar intenção de pagamento:', err);
      alert('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-teal-800 mb-2">Solicitação Enviada!</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Obrigado, <strong>{nome}</strong>. O seu plano foi registrado com sucesso. Assim que a confirmação financeira for concluída, você receberá o e-mail de confirmação com o link da sua consulta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-teal-800 tracking-tight">
            Proposta de Atendimento Psicológico
          </h1>
          <p className="text-slate-500 text-sm md:text-base mt-2">
            Selecione o plano ideal para dar início ao seu processo terapêutico
          </p>

          <div className="inline-block bg-teal-50 text-teal-700 text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full border border-teal-200 mt-4">
            Plano para Novos Pacientes • Sessões de 50 minutos
          </div>

          {dataAgendada !== 'A definir' && (
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-700 font-medium">
              Horário selecionado: <span className="text-teal-800 font-bold">{dataAgendada}</span>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-8">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-5 md:p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/10 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 right-6 bg-teal-800 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                    Recomendado
                  </span>
                )}

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800">{plan.title}</h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-0.5">{plan.description}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xl md:text-2xl font-extrabold text-teal-800">
                      {plan.price}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
            <span className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Estou ciente da política de remarcação com até 24h de antecedência e declaro aceite
              aos termos do atendimento online, sigilo ético e pontualidade.
            </span>
          </label>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleConfirmPayment}
          className="w-full bg-teal-700 hover:bg-teal-800 active:scale-[0.99] disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl shadow-md transition-all text-base md:text-lg"
        >
          {loading ? 'A processar...' : 'Informar Pagamento via PIX / Cartão'}
        </button>
      </div>
    </div>
  );
}

export default function PropostaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">A carregar proposta...</div>}>
      <ProposalContent />
    </Suspense>
  );
}