'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TermsSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

const TermsSection: React.FC<TermsSectionProps> = ({ id, title, children }) => {
  return (
    <motion.section
      id={id}
      className="mb-12 scroll-mt-20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-semibold text-primary mb-4">{title}</h2>
      {children}
    </motion.section>
  );
};

export default TermsSection;
