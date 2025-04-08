import React, { ReactNode } from 'react';

import ScrollToTopButton from '../shared/ScrollToTopButton';
import Footer from './Footer';
import NavBar from './Navbar';
import { BottomNav } from './Navbar/BottomNav';

interface LayoutProps {
  children: ReactNode;
  addFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, addFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navigation Bar */}
      <NavBar />

      {/* Main Content: add top padding to avoid overlap with fixed Navbar */}
      <main className="flex-grow pt-20 md:pt-28 mb-20">{children}</main>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />

      {/* Bottom Navigation Bar */}
      <BottomNav />

      {/* Footer Section */}
      {addFooter && <Footer />}
    </div>
  );
};

export default Layout;
