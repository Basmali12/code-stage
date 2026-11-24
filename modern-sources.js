'use strict';
function createBaseModernSources(config) {
 const parts=[
  '      <ShopHeader name={brand.name} shop={shop} />',
  '      <ShopTabs shop={shop} />',
  '      <HeroBanner />',
  '      <CategoryGrid shop={shop} />',
  '      <ProductGrid shop={shop} />',
  '      <ShopFooter name={brand.name} />'
 ];
 let page=`import type { CSSProperties } from 'react';
import { useShop } from './store';
import {
  ShopHeader, ShopTabs, HeroBanner,
  CategoryGrid, ProductGrid, ShopFooter,
} from './components';

const brand = ${JSON.stringify({name:config.name,color:config.color},null,2)};

export default function Storefront() {
  const shop = useShop();
  const theme = { '--brand': brand.color } as CSSProperties;

  return (
    <main dir="rtl" style={theme}
      className="min-h-screen bg-stone-50 font-sans text-stone-800">
`;
 const milestones=[];
 parts.forEach(part=>{page+=part+'\n\n';milestones.push(page.length);});
 page+=`    </main>
  );
}
`;
 const components=`import { useState } from 'react';
import type { ShopState } from './store';
import { categories } from './store';

type ShopProps = { shop: ShopState };
type HeaderProps = ShopProps & { name: string };

export function ShopHeader({ name, shop }: HeaderProps) {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <>
      <header className="flex items-center justify-between gap-3 bg-white px-[6%] py-5">
        <a href="#" className="text-2xl font-extrabold tracking-widest">
          {name}
          <small className="block text-xs font-normal tracking-normal text-stone-500">
            متجرك لكل يوم
          </small>
        </a>
        <input type="search" value={shop.query}
          onChange={event => shop.setQuery(event.target.value)}
          placeholder="ابحث عن منتجك المفضل…" aria-label="بحث المنتجات"
          className="min-w-0 flex-1 rounded-lg bg-stone-100 px-3 py-2 text-xs outline-offset-2" />
        <button onClick={() => setCartOpen(true)}
          className="shrink-0 rounded-lg border border-stone-200 px-3 py-2 text-xs">
          السلة <span className="ms-1 rounded-full bg-[var(--brand)] px-2 py-1 text-white">
            {shop.cart.length}
          </span>
        </button>
      </header>
      {cartOpen && (
        <div role="dialog" aria-modal="true" aria-label="سلة التسوق"
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5">
          <section className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold">سلة التسوق</h2>
            <p className="my-4">{shop.cart.length} منتجات في سلتك التجريبية</p>
            <button onClick={() => setCartOpen(false)}
              className="rounded-lg bg-[var(--brand)] px-4 py-2 text-white">
              متابعة التسوق
            </button>
          </section>
        </div>
      )}
    </>
  );
}

export function ShopTabs({ shop }: ShopProps) {
  return (
    <nav aria-label="تبويبات المتجر"
      className="flex gap-5 overflow-x-auto whitespace-nowrap border-y border-stone-200 bg-white px-[6%]">
      {categories.map(category => (
        <button key={category.id} onClick={() => shop.selectCategory(category.id)}
          aria-pressed={shop.category === category.id}
          className={shop.category === category.id
            ? 'border-b-2 border-[var(--brand)] py-3 text-xs font-bold text-[var(--brand)]'
            : 'border-b-2 border-transparent py-3 text-xs text-stone-600'}>
          {category.id === 'all' ? 'الرئيسية' : category.label}
        </button>
      ))}
      <a href="#offers" className="py-3 text-xs">العروض</a>
    </nav>
  );
}

export function HeroBanner() {
  return (
    <section className="relative grid aspect-[2.35/1] grid-cols-[1.15fr_1fr] overflow-hidden bg-lime-50">
      <div className="z-10 self-center pe-2 ps-[12%]">
        <span className="text-[10px] text-stone-500">مجموعة الموسم الجديد</span>
        <h1 className="my-2 text-xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          تفاصيل صغيرة.<br />
          <span className="text-[var(--brand)]">تجربة استثنائية.</span>
        </h1>
        <p className="mb-3 text-[10px] text-stone-500 sm:text-sm">
          اكتشف اختياراتنا من التقنية والإكسسوارات.
        </p>
        <a href="#collection"
          className="inline-block rounded bg-[var(--brand)] px-3 py-2 text-xs text-white">
          تسوّق المجموعة
        </a>
      </div>
      <div aria-hidden="true" className="relative grid place-items-center bg-lime-100/50">
        <div className="aspect-square w-3/4 rounded-full bg-gradient-to-br from-white to-lime-200 shadow-xl" />
        <span className="absolute -rotate-12 text-[120px] text-[var(--brand)] drop-shadow-xl sm:text-[200px]">◖</span>
      </div>
    </section>
  );
}

export function CategoryGrid({ shop }: ShopProps) {
  return (
    <section className="px-[6%] py-7">
      <h2 className="mb-5 text-lg font-bold">تسوّق حسب القسم</h2>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {categories.map(category => (
          <button key={category.id} onClick={() => shop.selectCategory(category.id)}
            className="grid justify-items-center gap-2 rounded-xl border border-stone-200 bg-white px-1 py-4 hover:border-[var(--brand)]">
            <span className="text-3xl text-[var(--brand)]">{category.icon}</span>
            <span className="text-[10px] font-semibold sm:text-sm">{category.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function ProductGrid({ shop }: ShopProps) {
  return (
    <section id="collection" className="scroll-mt-4 px-[6%] py-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold">منتجات مختارة إلك</h2>
        <span className="text-xs text-stone-500">{shop.filteredProducts.length} منتجات</span>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {shop.filteredProducts.map(product => (
          <article key={product.id}>
            <div className="relative mb-3 grid h-36 place-items-center overflow-hidden rounded-xl bg-stone-100">
              <span className="-rotate-12 text-8xl text-[var(--brand)] drop-shadow-lg">{product.icon}</span>
              <span className="absolute end-2 top-2 rounded bg-white px-2 py-1 text-[10px]">جديد</span>
            </div>
            <small className="text-xs text-stone-500">{product.label}</small>
            <h3 className="my-2 text-sm font-semibold">{product.name}</h3>
            <div className="flex items-center justify-between gap-2">
              <strong className="text-xs">{product.price.toLocaleString('ar-IQ')} د.ع</strong>
              <button onClick={() => shop.addToCart(product)}
                aria-label={'إضافة ' + product.name + ' إلى السلة'}
                className="grid size-8 place-items-center rounded-full bg-[var(--brand)] text-xl text-white">+</button>
            </div>
          </article>
        ))}
      </div>
      {shop.filteredProducts.length === 0 && <p className="py-6 text-center">ماكو منتجات تطابق بحثك.</p>}
    </section>
  );
}

export function ShopFooter({ name }: { name: string }) {
  return (
    <>
      <section id="offers" className="mx-[6%] my-6 flex items-center justify-between gap-3 rounded-xl bg-[var(--brand)] p-6 text-white">
        <div><small>عروض محدودة</small><h2 className="mt-2 text-2xl font-bold">اختيارات تحبها.<br />بأسعار تناسبك.</h2></div>
        <a href="#collection" className="shrink-0 rounded bg-white px-3 py-2 text-xs text-[var(--brand)]">اكتشف المنتجات</a>
      </section>
      <div className="flex justify-around gap-2 border-y border-stone-200 p-4 text-[10px]">
        <span>◈ توصيل لكل المحافظات</span><span>✓ جودة مختارة</span><span>◇ دعم ومتابعة</span>
      </div>
      <footer className="flex items-center justify-between gap-3 px-[6%] py-6">
        <strong className="text-xl tracking-widest">{name}</strong>
        <small className="text-stone-500">اختيارات مدروسة لحياة أجمل</small>
      </footer>
    </>
  );
}
`;
 const store=`import { useMemo, useState } from 'react';

export type CategoryId = 'all' | 'audio' | 'camera' | 'watch';
export interface Product {
  id: number;
  name: string;
  category: Exclude<CategoryId, 'all'>;
  price: number;
  icon: string;
  label: string;
}

export const categories: { id: CategoryId; label: string; icon: string }[] = [
  { id: 'all', label: 'كل المنتجات', icon: '▦' },
  { id: 'audio', label: 'الصوتيات', icon: '◖' },
  { id: 'camera', label: 'الكاميرات', icon: '▣' },
  { id: 'watch', label: 'الساعات', icon: '◷' },
];

export const products: Product[] = [
  { id: 1, name: 'سماعات لاسلكية', category: 'audio', price: 89000, icon: '◖', label: 'صوتيات' },
  { id: 2, name: 'كاميرا ذكية', category: 'camera', price: 149000, icon: '▣', label: 'كاميرات' },
  { id: 3, name: 'ساعة يومية', category: 'watch', price: 65000, icon: '◷', label: 'ساعات' },
  { id: 4, name: 'مكبر صوت محمول', category: 'audio', price: 49000, icon: '▥', label: 'صوتيات' },
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
`;
 return {sources:[page,components,store],milestones};
}
function createModernSources(config){
 const result=createBaseModernSources(config),t=selectedStoreTheme(config);
 let [page,components,store]=result.sources;
 const oldTheme="const theme = { '--brand': brand.color } as CSSProperties;";
 const newTheme=`const theme = ${JSON.stringify({'--brand':config.color,'--bg':t.bg,'--surface':t.surface,'--ink':t.ink,'--muted':t.muted,'--line':t.line,'--button-ink':[2,6].includes(t.id)?'#111':'#fff'},null,2)} as CSSProperties;`;
 page=page.replace(oldTheme,newTheme).replace('bg-stone-50 font-sans text-stone-800','bg-[var(--bg)] font-sans text-[var(--ink)]');
 const milestones=[];
 ['ShopHeader','ShopTabs','HeroBanner','CategoryGrid','ProductGrid','ShopFooter'].forEach(name=>{
  const start=page.indexOf('<'+name+' '),fallback=page.indexOf('<'+name+' />');
  milestones.push(page.indexOf('\n\n',start>=0?start:fallback)+2);
 });
 components=components.replace("import { useState } from 'react';","import { useEffect, useState } from 'react';");
 components=components.replace(/bg-white/g,'bg-[var(--bg)]').replace(/bg-stone-100/g,'bg-[var(--surface)]').replace(/border-stone-200/g,'border-[var(--line)]').replace(/text-stone-500/g,'text-[var(--muted)]').replace(/text-stone-600/g,'text-[var(--muted)]');
 const bannerStart=components.indexOf('export function HeroBanner()');
 const bannerEnd=components.indexOf('export function CategoryGrid',bannerStart);
 const heroComponent=`export function HeroBanner() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive(index => (index + 1) % 3), 4000);
    return () => window.clearInterval(timer);
  }, []);
  const slides = [
    { title: ${JSON.stringify(t.heading.replace('<br>',' '))}, subtitle: ${JSON.stringify(t.sub)}, image: -1 },
    { title: 'وقت الترقية لساعة أذكى', subtitle: 'اختيارات تجمع الأناقة والتقنية', image: 2 },
    { title: 'التقط التفاصيل واحتفظ باللحظة', subtitle: 'كاميرات تستحق التجربة', image: 1 },
  ];
  return (
    <section aria-label="عروض المتجر" className="mx-2 mb-4">
      <div dir="ltr" className="relative isolate aspect-[2.35/1] overflow-hidden rounded-xl bg-[var(--surface)]">
        {slides.map((slide, index) => {
          const distance = (index - active + slides.length) % slides.length;
          const x = distance === 0 ? 0 : distance === 1 ? -100 : 100;
          return (
            <div key={index} aria-hidden={index !== active}
              className="absolute inset-0 bg-[var(--surface)] transition-transform duration-700"
              style={{ transform: 'translateX(' + x + '%)', zIndex: index === active ? 2 : 1 }}>
              {slide.image === -1
                ? <div className="absolute inset-0 bg-no-repeat" style={{
                    backgroundImage: 'url(./assets/banners.png)',
                    backgroundSize: '200% 300%', backgroundPosition: '${bannerPosition(t.id-1)}',
                  }} />
                : <div className="absolute inset-y-0 right-0 grid w-1/2 place-items-center rounded-s-full bg-[var(--brand)]">
                    <ProductPhoto image={slide.image} className="w-4/5 rounded-full" />
                  </div>}
              <div dir="rtl" className="absolute left-[6%] top-1/2 w-[46%] -translate-y-1/2 text-right"
                style={{ color: slide.image === -1 ? '${t.heroInk}' : 'var(--ink)' }}>
                <h1 className="text-base font-extrabold leading-tight sm:text-3xl">{slide.title}</h1>
                <p className="my-2 text-[9px] sm:text-sm">{slide.subtitle}</p>
                <a href="#collection" className="inline-block rounded-full bg-[var(--brand)] px-3 py-1.5 text-[10px] text-[var(--button-ink)]">تسوق الآن</a>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-center gap-1" dir="ltr">
        {slides.map((_, index) => <button key={index} aria-label={'البنر ' + (index + 1)}
          onClick={() => setActive(index)} className="size-1.5 rounded-full"
          style={{ background: index === active ? 'var(--brand)' : 'var(--muted)' }} />)}
      </div>
    </section>
  );
}

export function ProductPhoto({ image, className = '' }: { image: number; className?: string }) {
  const position = (image % 3) * 50 + '% ' + Math.floor(image / 3) * 100 + '%';
  return <span role="img" aria-label="صورة المنتج" className={'block aspect-square bg-white bg-no-repeat ' + className}
    style={{ backgroundImage: 'url(./assets/products.png)', backgroundSize: '300% 200%', backgroundPosition: position }} />;
}

`;
 components=components.slice(0,bannerStart)+heroComponent+components.slice(bannerEnd);
 components=components.replace('<span className="text-3xl text-[var(--brand)]">{category.icon}</span>', '<ProductPhoto image={category.image} className="w-10 rounded-full" />');
 components=components.replace('<span className="-rotate-12 text-8xl text-[var(--brand)] drop-shadow-lg">{product.icon}</span>', '<ProductPhoto image={product.image} className="w-full" />');
 components=components.replace('منتجات مختارة إلك',t.title).replace(/text-white/g,'text-[var(--button-ink)]');
 store=store.replace("'watch';","'watch' | 'speaker';").replace('  icon: string;','  icon: string;\n  image: number;');
 const ca=store.indexOf('export const categories:'),cb=store.indexOf('export function useShop()',ca);
 const categories=[{id:'all',label:'الرئيسية',icon:'▦',image:0},...storeCategories.map(c=>({id:c.id,label:c.name,icon:'◇',image:c.image}))];
 const products=t.order.map(i=>({...storeCatalog[i],icon:'◇'}));
 store=store.slice(0,ca)+`export const categories: { id: CategoryId; label: string; icon: string; image: number }[] = ${JSON.stringify(categories,null,2)};

export const products: Product[] = ${JSON.stringify(products,null,2)};

`+store.slice(cb);
 return {sources:[page,components,store],milestones};
}
