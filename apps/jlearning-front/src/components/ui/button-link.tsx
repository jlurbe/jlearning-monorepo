import { Link, LinkProps } from 'react-router-dom';
import { Button } from './button';
import React from 'react';

interface ButtonLinkProps extends LinkProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      variant = 'default',
      size = 'default',
      className = '',
      ...props
    },
    ref
  ) => (
    <Button asChild variant={variant} size={size} className={className}>
      <Link ref={ref} {...props}>
        {children}
      </Link>
    </Button>
  )
);
ButtonLink.displayName = 'ButtonLink';
