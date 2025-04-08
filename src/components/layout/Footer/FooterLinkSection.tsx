import type React from 'react';
import Link from 'next/link';

interface LinkProps {
  href: string;
  label: string;
}

interface FooterLinkSectionProps {
  title: string;
  links: LinkProps[];
}

const FooterLinkSection: React.FC<FooterLinkSectionProps> = ({
  title,
  links,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="text-gray-600 hover:text-primary_1 transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinkSection;
