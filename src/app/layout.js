import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: "Weather App",
  description: "Weather application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.className}`}>
      <body>
        {children}
      </body>
    </html>
  );
}

