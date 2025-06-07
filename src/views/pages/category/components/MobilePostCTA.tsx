import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function MobilePostCTA() {
  return (
    <div className="bg-primary_1/5 rounded-lg p-4">
      <h3 className="text-sm font-medium mb-2">Want to sell something?</h3>
      <Button asChild className="w-full bg-primary_1 text-white hover:bg-primary_1/90">
        <Link href="/post-ad">Post an Ad</Link>
      </Button>
    </div>
  );
} 