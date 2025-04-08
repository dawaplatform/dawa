import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [prevScrollY, setPrevScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < prevScrollY) {
        setScrollDirection('up');
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  return { scrollDirection, pathname };
}
