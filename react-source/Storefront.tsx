import type { CSSProperties } from 'react';
import { useShop } from './store';
import {
  ShopHeader, ShopTabs, HeroBanner,
  CategoryGrid, ProductGrid, ShopFooter,
} from './components';

const brand = {
  "name": "TechZone",
  "color": "#0066ff"
};

export default function Storefront() {
  const shop = useShop();
  const theme = {
  "--brand": "#0066ff",
  "--bg": "#ffffff",
  "--surface": "#f5f6fa",
  "--ink": "#10141e",
  "--muted": "#6f7480",
  "--line": "#e5e6ec",
  "--button-ink": "#fff"
} as CSSProperties;

  return (
    <main dir="rtl" style={theme}
      className="min-h-screen bg-[var(--bg)] font-sans text-[var(--ink)]">
      <ShopHeader name={brand.name} shop={shop} />

      <ShopTabs shop={shop} />

      <HeroBanner />

      <CategoryGrid shop={shop} />

      <ProductGrid shop={shop} />

      <ShopFooter name={brand.name} />

    </main>
  );
}
