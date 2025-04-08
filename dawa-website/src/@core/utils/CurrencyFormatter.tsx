import mainConfig from '@/@core/configs/mainConfigs';
import React from 'react';

// Define the props interface
interface CurrencyFormatterProps {
  price: number;
  currency?: string;
  locale?: string;
  className?: string;
}

// CurrencyFormatter component with TypeScript
export const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({
  price,
  currency = mainConfig.usedCurrency,
  locale = mainConfig.usedLocale,
  className = '',
}) => {
  return (
    <span className={className}>
      {new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
        price,
      )}
    </span>
  );
};

// similar function but for it just formats the value entered
export const formatCurrency = (
  price: number,
  currency: string = mainConfig.usedCurrency,
  locale: string = mainConfig.usedLocale,
): string => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    price,
  );
};
