import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createCalendarEvent } from '../../../../lib/googleCalendar';

export async function GET(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY não está definida nas variáveis de ambiente!');
    return NextResponse.json({ error: 'Configuração de e-mail ausente no servidor.' }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const { searchParams } = new URL(request.url);
  const nome = searchParams.get('nome') || 'Paciente';
  const rawEmail = searchParams.get('email') || '';
  const email = decodeURIComponent(rawEmail).trim();
  const whatsapp = searchParams.get('whatsapp') || '';
  const plano = searchParams.get('plano') || 'Atendimento Psicológico';
  const data = searchParams.get('data') || '';

  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    let meetLink = '';

    if (calendarId) {
      try {
        meetLink = await createCalendarEvent(calendarId, nome, email, data, plano);
      } catch (calErr) {
        console.error('Erro ao criar evento no Google Calendar:', calErr);
      }
    }

    const professionalEmail = process.env.PROFESSIONAL_EMAIL || 'jjosemario15091977@gmail.com';

    // Conteúdo formatado para o Profissional
    const professionalHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; background-color: #ffffff;">
        <h2 style="color: #0d9488; margin-top: 0; font-size: 20px;">[PROFISSIONAL] Consulta Confirmada!</h2>
        <p style="color: #334155; font-size: 14px;">Você confirmou o agendamento da seguinte sessão:</p>
        
        <div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #f1f5f9;">
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Paciente:</strong> ${nome}</p>
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Data e Horário:</strong> ${data}</p>
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Plano:</strong> ${plano}</p>
          ${whatsapp ? `<p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>WhatsApp:</strong> ${whatsapp}</p>` : ''}
          ${email ? `<p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>E-mail do Paciente:</strong> ${email}</p>` : ''}
          ${meetLink ? `<p style="margin: 14px 0 6px 0; color: #0d9488; font-size: 15px;"><strong>Link da Videochamada (Google Meet):</strong> <a href="${meetLink}" target="_blank">${meetLink}</a></p>` : ''}
        </div>
      </div>
    `;

    // Conteúdo formatado para o Paciente
    const patientHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; background-color: #ffffff;">
        <h2 style="color: #0d9488; margin-top: 0; font-size: 20px;">Sua Consulta foi Confirmada!</h2>
        <p style="color: #334155; font-size: 14px;">Olá, <strong>${nome}</strong>! O seu agendamento foi concluído com sucesso.</p>
        
        <div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #f1f5f9;">
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Data e Horário:</strong> ${data}</p>
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Plano:</strong> ${plano}</p>
          ${meetLink ? `<p style="margin: 14px 0 6px 0; color: #0d9488; font-size: 15px;"><strong>Acesse sua consulta no Google Meet:</strong> <a href="${meetLink}" target="_blank">${meetLink}</a></p>` : ''}
        </div>
        <p style="color: #64748b; font-size: 13px;">No dia e horário agendados, clique no link acima para entrar na sala virtual.</p>
      </div>
    `;

    // 1. Envio Obrigatório ao Profissional
    await resend.emails.send({
      from: 'Atendimento Psicoterápico <contato@atendimentovirtual.site>',
      to: professionalEmail,
      subject: `[PROFISSIONAL] Agendamento Confirmado: ${nome} - ${data}`,
      html: professionalHtml,
    });

    // 2. Envio Obrigatório ao Paciente
    const targetPatientEmail = email || professionalEmail;
    try {
      await resend.emails.send({
        from: 'Atendimento Psicoterápico <contato@atendimentovirtual.site>',
        to: targetPatientEmail,
        subject: `Sua Consulta está Confirmada! - ${data}`,
        html: patientHtml,
      });
    } catch (pErr) {
      console.error('Erro ao enviar e-mail ao paciente:', pErr);
    }

    return new Response(`
      <html>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #f8fafc; margin: 0;">
          <div style="background: white; padding: 40px; border-radius: 16px; text-align: center; border: 1px solid #e2e8f0; max-width: 440px;">
            <div style="width: 50px; height: 50px; background-color: #dcfce7; color: #15803d; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 24px; font-weight: bold;">✓</div>
            <h1 style="color: #15803d; font-size: 22px; margin-bottom: 12px;">Agendamento Confirmado!</h1>
            <p style="color: #475569; font-size: 14px; line-height: 1.5;">O evento foi registrado e a confirmação com o link do Google Meet foi enviada com sucesso para o paciente (${targetPatientEmail}) e para o profissional.</p>
          </div>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  } catch (error: any) {
    console.error('Erro ao finalizar agendamento:', error);
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 });
  }
}