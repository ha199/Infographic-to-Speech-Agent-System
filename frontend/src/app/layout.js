import '../styles/globals.css';

export const metadata = {
  title: 'InfroSpeak — Infographic to Speech AI Agent',
  description: 'Upload any infographic and get a presentation-ready speech using a 4-agent AI pipeline.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
