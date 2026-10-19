export function generateWhatsAppLink(
  phone: string,
  patientName: string,
  slotDateDisplay: string,
  patientEmail?: string
): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const baseUrl = process.env.NEXT_PUBLIC_PROPOSAL_URL || 'http://localhost:3000/proposta';
  const proposalUrl = `${baseUrl}?nome=${encodeURIComponent(patientName)}&data=${encodeURIComponent(slotDateDisplay)}`;

  const message = `Olá, ${patientName}! Tudo bem?\n\n` +
    `Tenho a seguinte opção em agenda: ${slotDateDisplay}.\n\n` +
    `Acesse sua proposta no link abaixo:\n${proposalUrl}`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}