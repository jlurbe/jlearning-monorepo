import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs() {
  const location = useLocation();
  // Simple static mapping for now
  const crumbs = [{ label: 'Home', to: '/' }];
  if (location.pathname === '/hiragana') {
    crumbs.push({ label: 'Hiragana', to: '/hiragana' });
  } else if (location.pathname === '/katakana') {
    crumbs.push({ label: 'Katakana', to: '/katakana' });
  } else {
    crumbs.push({ label: 'Vocabulary', to: '/' });
  }
  return (
    <nav
      className="flex items-center text-sm text-muted-foreground mb-6"
      aria-label="Breadcrumb"
    >
      {crumbs.map((crumb, idx) => (
        <span key={crumb.to} className="flex items-center">
          {idx > 0 && <ChevronRight className="mx-1 h-4 w-4" />}
          {idx < crumbs.length - 1 ? (
            <Link to={crumb.to} className="hover:underline">
              {crumb.label}
            </Link>
          ) : (
            <span className="font-semibold text-foreground">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
