import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    
    const nome = body.nome;
    const email = body.email;
    const whatsapp = body.telefone || body.whatsapp;
    const vinculo = body.vinculo;
    const turno = body.turno;
    const dataHorario = body.dataHorario;
    const observacoes = body.observacoes;

    if (!nome || !whatsapp || !dataHorario) {
      return NextResponse.json({ error: 'Preencha os campos obrigatórios.' }, { status: 400 });
    }

    // Formatação da data principal solicitada pelo paciente
    let dataFormatada = dataHorario;
    let dataApenasDia = '';
    let dataPacienteObj = new Date();
    try {
      const dateObj = new Date(dataHorario);
      if (!isNaN(dateObj.getTime())) {
        dataPacienteObj = dateObj;
        const dia = String(dateObj.getDate()).padStart(2, '0');
        const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
        const ano = dateObj.getFullYear();
        const hora = String(dateObj.getHours()).padStart(2, '0');
        const minuto = String(dateObj.getMinutes()).padStart(2, '0');
        dataFormatada = `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
        dataApenasDia = `${dia}/${mes}/${ano}`;
      }
    } catch (e) {
      dataApenasDia = dataHorario.split('T')[0];
    }

    // E-mail de destino forçado para você durante a fase de testes
    const professionalEmail = 'jjosemario15091977@gmail.com';
    
    // URL base oficial configurada com o seu domínio profissional
    const baseUrl = 'https://atendimentovirtual.site';

    // Lê a configuração semanal e filtra a partir da data escolhida pelo paciente (e dias subsequentes)
    let horariosDisponiveis: Array<{ label: string; textDate: string }> = [];
    try {
      const configFilePath = path.join(process.cwd(), 'src/data/schedule-config.json');
      if (fs.existsSync(configFilePath)) {
        const fileContent = fs.readFileSync(configFilePath, 'utf8');
        const config = JSON.parse(fileContent);
        const weeklySchedule = config.weeklySchedule || {};

        const diasSemanaNomes = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];

        // Gera os horários a partir da data solicitada pelo paciente e os próximos 7 dias subsequentes
        for (let i = 0; i < 7; i++) {
          const d = new Date(dataPacienteObj);
          d.setDate(dataPacienteObj.getDate() + i);
          const dayOfWeek = String(d.getDay()); // '0' a '6'

          if (weeklySchedule[dayOfWeek] && Array.isArray(weeklySchedule[dayOfWeek])) {
            const horasPermitidas = weeklySchedule[dayOfWeek];
            horasPermitidas.forEach((hora: number) => {
              const diaStr = String(d.getDate()).padStart(2, '0');
              const mesStr = String(d.getMonth() + 1).padStart(2, '0');
              const horaStr = String(hora).padStart(2, '0') + ':00';
              const nomeDia = diasSemanaNomes[d.getDay()];

              const labelSlot = `${nomeDia}, ${diaStr}/${mesStr}, ${horaStr}`;
              const textSlot = `${diaStr}/${mesStr}/${d.getFullYear()} ${horaStr}`;

              horariosDisponiveis.push({
                label: labelSlot,
                textDate: textSlot
              });
            });
          }
        }
      }
    } catch (err) {
      console.error('Erro ao ler schedule-config.json para o e-mail:', err);
    }

    // Fallback caso a lista fique vazia
    if (horariosDisponiveis.length === 0) {
      horariosDisponiveis.push({ label: dataFormatada, textDate: dataFormatada });
    }

    // Gera os cards HTML para cada horário disponível com o link direto para o WhatsApp otimizado
    const cardsHtml = horariosDisponiveis.map(slot => {
      const proposalLink = `${baseUrl}/proposta?nome=${encodeURIComponent(nome)}&data=${encodeURIComponent(slot.textDate)}&email=${encodeURIComponent(email || '')}&whatsapp=${encodeURIComponent(whatsapp)}`;
      
      const whatsAppText = `Olá ${nome}! Aqui estão os detalhes da proposta para a sua sessão de psicoterapia agendada para ${slot.textDate}.\n\nAcesse o link abaixo para escolher seu plano e prosseguir:\n${proposalLink}`;
      
      const cleanPhone = whatsapp.replace(/\D/g, '');
      const whatsAppUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(whatsAppText)}`;

      return `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 14px; font-weight: bold; color: #1e293b;">📅 ${slot.label}</span>
          <a href="${whatsAppUrl}" target="_blank" style="background-color: #25d366; color: #ffffff; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: bold;">
            💬 Enviar Proposta via WhatsApp
          </a>
        </div>
      `;
    }).join('');

    const subject = `[PRÉ-AGENDAMENTO] Novo pedido de agendamento do paciente: ${nome} - ${dataApenasDia}`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; background-color: #ffffff;">
        <h2 style="color: #0d9488; margin-top: 0; font-size: 20px;">Nova Solicitação de Pré-agendamento</h2>
        <p style="color: #334155; font-size: 14px;">Um paciente preencheu o formulário no site:</p>
        
        <div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #f1f5f9;">
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Paciente:</strong> ${nome}</p>
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>E-mail:</strong> ${email || 'Não informado'}</p>
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Vínculo:</strong> ${vinculo}</p>
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Turno Preferencial:</strong> ${turno}</p>
          <p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Data/Horário Solicitado:</strong> ${dataFormatada}</p>
          ${observacoes ? `<p style="margin: 6px 0; color: #1e293b; font-size: 14px;"><strong>Motivo:</strong> ${observacoes}</p>` : ''}
        </div>

        <p style="color: #334155; font-size: 14px; font-weight: bold; margin-bottom: 12px;">Horários Disponíveis (A partir da data solicitada):</p>
        
        <div style="margin-bottom: 24px;">
          ${cardsHtml}
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Atendimento Psicoterápico <onboarding@resend.dev>',
      to: professionalEmail,
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Pré-agendamento processado com sucesso!' });
  } catch (error: any) {
    console.error('Erro ao enviar e-mail de pré-agendamento:', error);
    return NextResponse.json({ error: error.message || 'Erro interno ao processar agendamento' }, { status: 500 });
  }
}
