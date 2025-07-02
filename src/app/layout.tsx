import { SupabaseProvider } from '../providers/SupabaseProvider';
import { AppProvider } from '../contexts/AppContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
} 