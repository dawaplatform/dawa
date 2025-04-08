'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Section {
  id: string;
  title: string;
}

interface SidebarProps {
  sections: Section[];
}

const Sidebar: React.FC<SidebarProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || '',
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (let section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-primary text-white flex justify-between items-center p-4 z-50 shadow-md">
        <h2 className="text-xl font-semibold">Contents</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Sidebar"
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          {isOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-full md:w-[320px] bg-gray-700 text-white h-full sticky top-[80px] p-6">
        <h2 className="text-xl font-semibold mb-6">Contents</h2>
        <nav>
          <ul className="space-y-4">
            {sections.map((section) => (
              <li key={section.id}>
                <Link href={`#${section.id}`}>
                  <span
                    className={`block py-2 px-4 rounded transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-primary_1 text-white font-bold'
                        : 'hover:bg-primary_1 hover:text-white'
                    }`}
                  >
                    {section.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="fixed inset-y-0 left-0 w-64 bg-primary text-white z-40 p-6 overflow-y-auto shadow-lg"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6">Contents</h2>
            <nav>
              <ul className="space-y-4">
                {sections.map((section) => (
                  <li key={section.id}>
                    <Link href={`#${section.id}`}>
                      <span
                        onClick={() => setIsOpen(false)}
                        className={`block py-2 px-4 rounded transition-colors duration-200 ${
                          activeSection === section.id
                            ? 'bg-yellow-500 text-white font-bold'
                            : 'hover:bg-yellow-400 hover:text-white'
                        }`}
                      >
                        {section.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
