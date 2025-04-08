// VirtualScroll.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface VirtualScrollProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemHeight: number;
  onEndReached?: () => void;
  loadMoreThreshold?: number;
}

export function VirtualScroll<T>({
  items,
  renderItem,
  itemHeight,
  onEndReached,
  loadMoreThreshold = 300,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (
        onEndReached &&
        scrollHeight - scrollTop - clientHeight < loadMoreThreshold
      ) {
        onEndReached();
      }
    }
  }, [onEndReached, loadMoreThreshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const containerHeight = containerRef.current?.clientHeight || 0;
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight),
  );
  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div ref={containerRef} style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
