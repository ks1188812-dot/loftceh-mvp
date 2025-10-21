
export const metadata = { title: "LOFT ЦЕХ — визуализация мебели" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body style={{fontFamily:"Inter, system-ui, -apple-system, Arial"}}>
        {children}
      </body>
    </html>
  );
}
