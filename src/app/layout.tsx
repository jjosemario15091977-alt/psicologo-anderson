import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atendimento Psicoterapêutico Online',
  description: 'Agende sua sessão de psicoterapia de forma simples e segura.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
