import { useState, useCallback } from 'react';

interface LikeableItem {
  id: number;
  liked?: boolean;
}

export const useLikeableItems = <T extends LikeableItem>(initialItems: T[]) => {
  const [items, setItems] = useState(initialItems);

  const toggleLike = useCallback((id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item,
      ),
    );
  }, []);

  return { items, toggleLike };
};
