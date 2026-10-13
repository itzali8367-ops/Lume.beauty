import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function NotFoundPage() {
  return (
    <div className="container-wide flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-semibold text-primary">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">
        This page went off-routine
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist. Let's get you back to your glow.
      </p>
      <Link to="/" className="mt-7">
        <Button size="lg">Back to home</Button>
      </Link>
    </div>
  );
}
