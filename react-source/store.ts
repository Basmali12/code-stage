import { useMemo, useState } from 'react';

export type CategoryId = 'all' | 'audio' | 'camera' | 'watch' | 'speaker';
export interface Product {
  id: number;
  name: string;
  category: Exclude<CategoryId, 'all'>;
  price: number;
  icon: string;
  image: number;
  label: string;
}

export const categories: { id: CategoryId; label: string; icon: string; image: number }[] = [
  {
    "id": "all",
    "label": "الرئيسية",
    "icon": "▦",
    "image": 0
  },
  {
    "id": "audio",
    "label": "سماعات",
    "icon": "◇",
    "image": 0
  },
  {
    "id": "watch",
    "label": "ساعات ذكية",
    "icon": "◇",
    "image": 2
  },
  {
    "id": "camera",
    "label": "كاميرات",
    "icon": "◇",
    "image": 1
  },
  {
    "id": "speaker",
    "label": "مكبرات صوت",
    "icon": "◇",
    "image": 3
  }
];

export const products: Product[] = [
  {
    "id": 2,
    "name": "كاميرا احترافية",
    "category": "camera",
    "price": 750000,
    "image": 1,
    "label": "كاميرات",
    "icon": "◇"
  },
  {
    "id": 3,
    "name": "ساعة ذكية متعددة المزايا",
    "category": "watch",
    "price": 165000,
    "image": 2,
    "label": "ساعات ذكية",
    "icon": "◇"
  },
  {
    "id": 1,
    "name": "سماعات لاسلكية فضية",
    "category": "audio",
    "price": 135000,
    "image": 0,
    "label": "سماعات",
    "icon": "◇"
  },
  {
    "id": 4,
    "name": "مكبر صوت محمول",
    "category": "speaker",
    "price": 180000,
    "image": 3,
    "label": "مكبرات صوت",
    "icon": "◇"
  },
  {
    "id": 5,
    "name": "سماعات بتصميم راقٍ",
    "category": "audio",
    "price": 195000,
    "image": 4,
    "label": "سماعات",
    "icon": "◇"
  },
  {
    "id": 6,
    "name": "سماعات ألعاب احترافية",
    "category": "audio",
    "price": 320000,
    "image": 5,
    "label": "سماعات",
    "icon": "◇"
  }
];

export function useShop() {
  const [category, setCategory] = useState<CategoryId>('all');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);

  const filteredProducts = useMemo(() => products.filter(product => {
    const categoryMatches = category === 'all' || product.category === category;
    return categoryMatches && product.name.includes(query.trim());
  }), [category, query]);

  const addToCart = (product: Product) => {
    setCart(previous => [...previous, product]);
  };

  const selectCategory = (next: CategoryId) => {
    setCategory(next);
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return { category, query, setQuery, cart, filteredProducts, addToCart, selectCategory };
}

export type ShopState = ReturnType<typeof useShop>;
