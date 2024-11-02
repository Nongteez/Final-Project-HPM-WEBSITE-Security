import { Inter } from "next/font/google";
import "./globals.css";
import  SessionProvider  from './components/SessionProvider';
import { getServerSession } from "next-auth";
import { UserProvider } from "./context/UsersContext";
import { Kanit } from "next/font/google";
import { Prompt } from "next/font/google";


const prompt = Prompt({ subsets: ["latin"],display: "swap", weight: ["300"] });

const kanit = Kanit({ subsets: ["latin"],display: "swap", weight: ["300"] });

const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "HappyMind",
  description: "Mental Health",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en" className={kanit.className}  >
      <head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
<link rel="manifest" href="/site.webmanifest"/>
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
<meta name="msapplication-TileColor" content="#da532c"/>
<meta name="theme-color" content="#ffffff"/>
      </head>
      <body >
      
        <SessionProvider session={session}>
          <UserProvider>
            {children}
          </UserProvider>
        </SessionProvider>
        </body>
        
    </html>
  );
}
