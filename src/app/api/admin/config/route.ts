import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const configFilePath = path.join(process.cwd(), 'src', 'data', 'schedule-config.json');

const defaultConfig = {
  weeklySchedule: {
    '1': [8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    '2': [8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    '3': [8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    '4': [8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    '5': [8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    '6': [],
    '0': [],
  },
  sessionDurationMinutes: 50,
};

export async function GET() {
  try {
    if (!fs.existsSync(configFilePath)) {
      fs.mkdirSync(path.dirname(configFilePath), { recursive: true });
      fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2));
      return NextResponse.json(defaultConfig);
    }

    const fileData = fs.readFileSync(configFilePath, 'utf8');
    const config = JSON.parse(fileData);
    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { weeklySchedule, sessionDurationMinutes } = body;

    const newConfig = {
      weeklySchedule: weeklySchedule || defaultConfig.weeklySchedule,
      sessionDurationMinutes: sessionDurationMinutes || 50,
    };

    fs.mkdirSync(path.dirname(configFilePath), { recursive: true });
    fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2));

    return NextResponse.json({ success: true, config: newConfig });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}