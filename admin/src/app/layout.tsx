import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Rental Service | Admin Panel",
  description: "Premium admin panel for rental service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}

              setTimeout(() => {
                console.log("%cОСТОРОЖНО!", "color: #ef4444; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0px rgba(0,0,0,0.2);");
                console.log("%cWhoa, look at you! 🕵️‍♂️ You seem to have discovered the secret console! 🔍\\nWant to see some magic? ✨ Just type my first name and hit enter! 🎩🐇", "color: #ef4444; font-size: 16px; font-weight: bold; line-height: 1.5;");
                console.log("%cПожалуйста, закройте эту вкладку, если вы не разработчик. Злоумышленники могут обманом заставить вас вставить сюда код для кражи данных.", "color: #64748b; font-size: 12px;");
                
                const magicTrigger = function() {
                  console.log("%c✨ ТАДАААА! ✨", "color: #0ea5e9; font-size: 40px; font-weight: bold; text-shadow: 2px 2px 0px rgba(0,0,0,0.2);");
                  console.log("%cВы взломали эту админку (шутка). Добро пожаловать в клуб! 🚀", "color: #10b981; font-size: 16px; font-weight: bold;");
                  return "🎩🐇";
                };
                
                Object.defineProperty(window, 'yulii', { get: magicTrigger });
                Object.defineProperty(window, 'iulian', { get: magicTrigger });
              }, 1000);
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
