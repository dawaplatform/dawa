import { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Button as ShadcnButton } from '../ui/button';

const Button: FC<any> = ({
  children,
  icon: Icon,
  iconPosition = 'left',
  className,
  ...props
}) => {
  const isOnlyIcon = !children && Icon;

  return (
    <ShadcnButton
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2 h-10 rounded-md transition-colors',
        isOnlyIcon ? 'p-2' : 'px-4 py-2',
        isOnlyIcon
          ? 'justify-center'
          : iconPosition === 'right'
            ? 'flex-row-reverse'
            : 'flex-row',
        className,
      )}
      {...props}
    >
      {Icon && <Icon className={cn('w-5 h-5', isOnlyIcon && 'mx-auto')} />}
      {!isOnlyIcon && <span className="text-center">{children}</span>}
    </ShadcnButton>
  );
};

export default Button;
