'use client';

import {
  BoostPayment,
  ItemAdminSerializer,
  createBoostPayment,
  getBoostPayment,
  useBoostPackages,
} from '@/app/server/admin/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const POLL_MS = 5000;

interface Props {
  item: ItemAdminSerializer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBoosted: () => void;
}

export function BoostPaymentDialog({ item, open, onOpenChange, onBoosted }: Props) {
  const { data: packages, isLoading } = useBoostPackages();
  const [selected, setSelected] = useState<string>('');
  const [payment, setPayment] = useState<BoostPayment | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelected('');
      setPayment(null);
    }
  }, [open]);

  // Poll the backend (which verifies with Pesapal) until the payment settles.
  useEffect(() => {
    if (!open || !payment || payment.status !== 'PENDING') return;
    const timer = setInterval(async () => {
      try {
        const latest = await getBoostPayment(payment.merchant_reference);
        if (latest.status !== 'PENDING') {
          setPayment(latest);
          if (latest.status === 'COMPLETED') {
            toast({ title: 'Boost active', description: `${latest.package} applied to ${item?.item_name}.` });
            onBoosted();
          } else {
            toast({ title: 'Payment not completed', description: `Status: ${latest.status}`, variant: 'destructive' });
          }
        }
      } catch {
        // keep polling; transient network errors are expected while the user pays
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [open, payment, item, onBoosted]);

  const startPayment = async () => {
    if (!item || !selected) return;
    setStarting(true);
    try {
      setPayment(await createBoostPayment(item.id, selected));
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast({ title: 'Could not start payment', description: message || 'Please try again.', variant: 'destructive' });
    } finally {
      setStarting(false);
    }
  };

  const formatAmount = (amount: string, currency: string) => `${currency} ${Number(amount).toLocaleString()}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={payment ? 'max-w-3xl' : 'max-w-md'}>
        <DialogHeader>
          <DialogTitle>Boost listing</DialogTitle>
          <DialogDescription>{item?.item_name}</DialogDescription>
        </DialogHeader>

        {!payment && (
          <div className="space-y-4">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              <div className="grid gap-2">
                {packages?.map((pkg) => (
                  <button
                    key={pkg.package}
                    type="button"
                    onClick={() => setSelected(pkg.package)}
                    className={`flex items-center justify-between rounded-md border p-3 text-left transition ${
                      selected === pkg.package ? 'border-primary ring-2 ring-primary/30' : 'hover:bg-muted'
                    }`}
                  >
                    <span>
                      <span className="font-medium">{pkg.package}</span>
                      <span className="block text-xs text-muted-foreground">{pkg.days} days</span>
                    </span>
                    <span className="font-semibold">{formatAmount(pkg.amount, pkg.currency)}</span>
                  </button>
                ))}
              </div>
            )}
            <Button className="w-full" disabled={!selected || starting} onClick={startPayment}>
              {starting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Pay with Pesapal
            </Button>
          </div>
        )}

        {payment && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>
                {payment.package} &middot; {formatAmount(payment.amount, payment.currency)} &middot; Ref{' '}
                <code>{payment.merchant_reference}</code>
              </span>
              <Badge variant={payment.status === 'COMPLETED' ? 'default' : payment.status === 'PENDING' ? 'secondary' : 'destructive'}>
                {payment.status === 'PENDING' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                {payment.status}
              </Badge>
            </div>

            {payment.status === 'PENDING' && payment.redirect_url && (
              <>
                <iframe
                  src={payment.redirect_url}
                  title="Pesapal checkout"
                  className="h-[560px] w-full rounded-md border"
                />
                <a
                  href={payment.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary underline"
                >
                  Open checkout in a new tab <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </>
            )}

            {payment.status === 'COMPLETED' && (
              <p className="text-sm">
                Boost active until {payment.boost_expires_at ? new Date(payment.boost_expires_at).toLocaleString() : '-'}.
              </p>
            )}

            {payment.status !== 'PENDING' && (
              <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
