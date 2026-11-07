'use client';

import { useTrendingProducts } from '@/@core/hooks/useProductData';
import { CurrencyFormatter } from '@/@core/utils/CurrencyFormatter';
import { normalizeProducts, type NormalizedProduct } from '@/@core/utils/normalizeProductData';
import { slugify } from '@/@core/utils/slugify';
import CustomImage from '@/components/shared/CustomImage';
import { Skeleton } from '@/components/ui/skeleton';
import { useDispatch } from '@/redux-store/hooks';
import { setSelectedProduct } from '@redux-store/slices/products/productSlice';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion';
import { Flame, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';

const STRIP_SIZE = 12;
const SPEED_PX_PER_SECOND = 40;

function StripCard({ product, duplicate = false }: { product: NormalizedProduct; duplicate?: boolean }) {
  const dispatch = useDispatch();
  const location = /[A-Za-z]/.test(product.item_location) ? product.item_location : null;

  return (
    <Link
      href={`/prod/${slugify(product.item_name)}`}
      onClick={() => dispatch(setSelectedProduct(product.id as any))}
      tabIndex={duplicate ? -1 : undefined}
      className="group block w-40 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary_1 sm:w-44"
    >
      <div className="relative aspect-square w-full bg-primary_2/40">
        <CustomImage
          src={product.images[0]?.image_url}
          alt={duplicate ? '' : product.item_name}
          fill
          sizes="176px"
          className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
          containerClassName="rounded-none"
        />
      </div>
      <div className="space-y-0.5 p-2">
        <h3 className="line-clamp-1 text-sm font-medium text-gray-900">{product.item_name}</h3>
        <p className="text-sm font-semibold text-primary_1">
          {product.item_price ? <CurrencyFormatter price={Number(product.item_price)} /> : 'Price not set'}
        </p>
        {location && (
          <p className="flex items-center gap-1 truncate text-xs text-gray-500">
            <MapPin className="h-3 w-3 shrink-0" />
            {location}
          </p>
        )}
      </div>
    </Link>
  );
}

function Marquee({ children }: { children: (duplicate: boolean) => ReactNode }) {
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const period = useRef(0);
  const paused = useRef(false);

  // The track holds two identical sets, so one set's width is the loop distance.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      period.current = track.scrollWidth / 2;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (paused.current || !period.current) return;
    const next = x.get() - (SPEED_PX_PER_SECOND * delta) / 1000;
    x.set(next <= -period.current ? next + period.current : next);
  });

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };

  return (
    <div
      className="overflow-hidden"
      onPointerEnter={pause}
      onPointerLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      <motion.div ref={trackRef} style={{ x }} className="flex w-max">
        <div className="flex shrink-0 gap-3 pr-3">{children(false)}</div>
        <div className="flex shrink-0 gap-3 pr-3" aria-hidden="true">
          {children(true)}
        </div>
      </motion.div>
    </div>
  );
}

export default function TrendingStrip() {
  const { productsData, isLoading, isError } = useTrendingProducts();
  const reduceMotion = useReducedMotion();
  const products = normalizeProducts(productsData).slice(0, STRIP_SIZE);

  if (isError || (!isLoading && products.length === 0)) return null;

  return (
    <section aria-labelledby="trending-strip-title" className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-primary_2 p-2 text-primary_1">
          <Flame className="h-5 w-5" />
        </span>
        <div>
          <h2 id="trending-strip-title" className="text-lg font-bold leading-tight text-gray-900">
            Trending now
          </h2>
          <p className="text-xs text-gray-500">Most viewed this week</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-40 shrink-0 sm:w-44" />
          ))}
        </div>
      ) : reduceMotion ? (
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {products.map((product) => (
            <div key={product.id} className="snap-start">
              <StripCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <Marquee>
          {(duplicate) =>
            products.map((product) => (
              <StripCard key={`${duplicate ? 'copy' : 'main'}-${product.id}`} product={product} duplicate={duplicate} />
            ))
          }
        </Marquee>
      )}
    </section>
  );
}
