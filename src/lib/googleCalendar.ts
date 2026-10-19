import { google, calendar_v3 } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function getCalendarClient(): calendar_v3.Calendar {
  const credentialsPath = path.join(process.cwd(), 'service-account.json');

  if (!fs.existsSync(credentialsPath)) {
    throw new Error('Arquivo service-account.json não encontrado na raiz do projeto.');
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: SCOPES,
  });

  return google.calendar({ version: 'v3', auth });
}

export async function getAvailableSlots(calendarId: string, requestedDateTime: string, maxSlots = 5) {
  const calendar = getCalendarClient();

  const configPath = path.join(process.cwd(), 'src', 'data', 'schedule-config.json');
  let weeklySchedule: Record<string, number[]> = {};

  if (fs.existsSync(configPath)) {
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    weeklySchedule = configData.weeklySchedule || {};
  }

  const now = new Date();
  const timeMin = now.toISOString();
  const timeMax = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const eventsResponse = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const busyEvents = eventsResponse.data.items || [];
  const availableSlots: { start: string; displayStart: string }[] = [];

  for (let i = 0; i < 14; i++) {
    const currentDate = new Date(now);
    currentDate.setDate(now.getDate() + i);

    const dayOfWeek = currentDate.getDay().toString();
    const allowedHours = weeklySchedule[dayOfWeek] || [];

    for (const hour of allowedHours) {
      const slotStart = new Date(currentDate);
      slotStart.setHours(hour, 0, 0, 0);

      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(50);

      if (slotStart < now) continue;

      const isBusy = busyEvents.some((event) => {
        const eventStart = new Date(event.start?.dateTime || event.start?.date || '');
        const eventEnd = new Date(event.end?.dateTime || event.end?.date || '');

        return slotStart < eventEnd && slotEnd > eventStart;
      });

      if (!isBusy) {
        const displayStart = slotStart.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });

        availableSlots.push({
          start: slotStart.toISOString(),
          displayStart,
        });

        if (availableSlots.length >= maxSlots) {
          return availableSlots;
        }
      }
    }
  }

  return availableSlots;
}

export async function createCalendarEvent(
  calendarId: string,
  patientName: string,
  patientEmail: string,
  dateDisplay: string,
  planName: string
): Promise<string> {
  const calendar = getCalendarClient();

  // Função auxiliar para converter "qui., 15/10, 14:00" em objeto Date
  const parseDisplayDate = (text: string): { start: Date; end: Date } => {
    const currentYear = new Date().getFullYear();
    const match = text.match(/(\d{1,2})\/(\d{1,2})[^\d]*(\d{1,2}):(\d{2})/);

    let start = new Date();
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const hour = parseInt(match[3], 10);
      const minute = parseInt(match[4], 10);

      start = new Date(currentYear, month, day, hour, minute, 0);
      // Se a data calculada já passou no ano atual, ajusta para o próximo
      if (start < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
        start.setFullYear(currentYear + 1);
      }
    } else {
      // Fallback para o dia seguinte no mesmo horário se não conseguir ler
      start = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    const end = new Date(start.getTime() + 50 * 60 * 1000); // Exatos 50 minutos de duração
    return { start, end };
  };

  const { start: startTime, end: endTime } = parseDisplayDate(dateDisplay);
  const meetUrl = process.env.NEXT_PUBLIC_MEET_URL || 'https://meet.google.com/zum-zjbz-dsu';

  const event: calendar_v3.Schema$Event = {
    summary: `Sessão: ${patientName} (${planName})`,
    description: `Atendimento psicoterapêutico online.\n\nPaciente: ${patientName}\nE-mail: ${patientEmail}\nHorário Agendado: ${dateDisplay}\n\nLink da Reunião: ${meetUrl}`,
    start: { dateTime: startTime.toISOString() },
    end: { dateTime: endTime.toISOString() },
    location: meetUrl,
  };

  await calendar.events.insert({
    calendarId,
    requestBody: event,
  });

  return meetUrl;
}