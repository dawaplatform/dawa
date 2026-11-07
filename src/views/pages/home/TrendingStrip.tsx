'use client';

import { useTrendingProducts } from '@/@core/hooks/useProductData';
import { CurrencyFormatter } from '@/@core/utils/CurrencyFormatter';
import { normalizeProducts, type NormalizedProduct } from '@/@core/utils/normalizeProductData';
import { slugify } from '@/@core/utils/slugify';
import CustomImage from '@/components/shared/CustomImage';
import { Skeleton } from '@/components/ui/skeleton';
import { useDispatch } from '@/redux-store/hooks';
import { setSelectedProduct } from '@redux-store/slices/products/productSlice';
import { animate, motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';

const STRIP_SIZE = 12;
// One set must be wider than the viewport or the loop shows a gap; fewer cards fall back to a plain scrollable row.
const MIN_MARQUEE_ITEMS = 8;
const SPEED_PX_PER_SECOND = 40;
const STEP_PX = 360;
const DRAG_THRESHOLD_PX = 6;
const RESUME_DELAY_MS = 2500;

const ARROW_CLASS =
  'absolute top-[35%] z-10 hidden h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 opacity-0 shadow-md transition-opacity hover:text-primary_1 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary_1 group-hover:opacity-100 md:flex';

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
  const hovering = useRef(false);
  const focused = useRef(false);
  const animating = useRef(false);
  const dragged = useRef(false);
  const resumeAt = useRef(0);

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

  // Keeps x within one set; the second set is identical, so the jump is invisible.
  const wrap = (value: number) => {
    if (!period.current) return value;
    const remainder = value % period.current;
    return remainder > 0 ? remainder - period.current : remainder;
  };
  const holdOff = () => {
    resumeAt.current = performance.now() + RESUME_DELAY_MS;
  };
  const moveBy = (dx: number) => x.set(wrap(x.get() + dx));

  useAnimationFrame((_, delta) => {
    const idle = hovering.current || focused.current || animating.current || performance.now() < resumeAt.current;
    if (idle || !period.current) return;
    x.set(wrap(x.get() - (SPEED_PX_PER_SECOND * delta) / 1000));
  });

  const nudge = (direction: 1 | -1) => {
    holdOff();
    // Stepping back from the start would reveal empty space, so start on the second set.
    if (direction === 1 && x.get() > -STEP_PX) x.set(x.get() - period.current);
    animating.current = true;
    animate(x, x.get() + direction * STEP_PX, {
      duration: 0.4,
      ease: 'easeOut',
      onComplete: () => {
        x.set(wrap(x.get()));
        animating.current = false;
      },
    });
  };

  return (
    <div
      className="group relative"
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
      onFocusCapture={() => (focused.current = true)}
      onBlurCapture={() => (focused.current = false)}
      onClickCapture={(event) => {
        // A drag that ends over a card must not open it.
        if (!dragged.current) return;
        event.preventDefault();
        event.stopPropagation();
        dragged.current = false;
      }}
      onWheel={(event) => {
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
        moveBy(-event.deltaX);
        holdOff();
      }}
    >
      <div className="overflow-hidden overscroll-x-contain">
        <motion.div
          ref={trackRef}
          style={{ x, touchAction: 'pan-y' }}
          className="flex w-max cursor-grab active:cursor-grabbing"
          onPanStart={() => {
            dragged.current = false;
          }}
          onPan={(_, info) => {
            if (Math.abs(info.offset.x) > DRAG_THRESHOLD_PX) dragged.current = true;
            moveBy(info.delta.x);
          }}
          onPanEnd={holdOff}
        >
          <div className="flex shrink-0 gap-3 pr-3">{children(false)}</div>
          <div className="flex shrink-0 gap-3 pr-3" aria-hidden="true">
            {children(true)}
          </div>
        </motion.div>
      </div>

      <button type="button" aria-label="Show earlier trending items" onClick={() => nudge(1)} className={`${ARROW_CLASS} left-2`}>
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button type="button" aria-label="Show more trending items" onClick={() => nudge(-1)} className={`${ARROW_CLASS} right-2`}>
        <ChevronRight className="h-5 w-5" />
      </button>
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
      ) : reduceMotion || products.length < MIN_MARQUEE_ITEMS ? (
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
