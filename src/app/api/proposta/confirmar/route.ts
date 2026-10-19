import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY não está definida nas variáveis de ambiente!');
    return NextResponse.json({ error: 'Configuração de e-mail ausente no servidor.' }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const body = await request.json();
    const nome = body.nome || 'Paciente';
    const email = body.email || '';
    const whatsapp = body.whatsapp || '';
    const plano = body.plano || 'Plano de Atendimento';
    const preco = body.preco || '';
    const dataAgendada = body.dataAgendada || 'A definir';

    const professionalEmail = process.env.PROFESSIONAL_EMAIL || 'jjosemario15091977@gmail.com';

    // URL base corrigida para o domínio ativo na Vercel
    const baseUrl = 'https://atendimento-psicoterapico-online.vercel.app';

    // Link de confirmação final apontando para o domínio correto
    const confirmFinalUrl = `${baseUrl}/api/agendamento/finalizar?nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(email)}&whatsapp=${encodeURIComponent(whatsapp)}&plano=${encodeURIComponent(`${plano} (${preco})`)}&data=${encodeURIComponent(dataAgendada)}`;

    const professionalHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; background-color: #ffffff;">
        <h2 style="color: #0d9488; margin-top: 0; font-size: 20px;">🎉 Aceite de Proposta Recebido</h2>
        <p style="color: #334155; font-size: 14px;">O paciente aceitou os termos e escolheu um plano no site:</p>
        
        <div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #f1f5f9;">
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Paciente:</strong> ${nome}</p>
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>E-mail:</strong> ${email || 'Não informado'}</p>
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Horário Escolhido:</strong> ${dataAgendada}</p>
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Plano Selecionado:</strong> ${plano} ${preco ? `(${preco})` : ''}</p>
        </div>

        <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
          Após conferir a entrada do pagamento/crédito na sua conta bancária, clique no botão abaixo para confirmar o agendamento, criar a consulta no Google Calendar (com Google Meet) e enviar a confirmação por e-mail:
        </p>

        <div style="text-align: center;">
          <a href="${confirmFinalUrl}" target="_blank" style="background-color: #15803d; color: #ffffff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ✓ Confirmar Agendamento & Criar Evento no Calendar
          </a>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Atendimento Psicoterápico <onboarding@resend.dev>',
      to: professionalEmail,
      subject: `Proposta Aceita: ${nome} - ${plano}`,
      html: professionalHtml,
    });

    return NextResponse.json({ success: true, message: 'Aceite de proposta registrado com sucesso!' });
  } catch (error: any) {
    console.error('Erro ao processar aceite de proposta:', error);
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 });
  }
}