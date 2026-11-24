import { useEffect, useState } from 'react';
import type { ShopState } from './store';
import { categories } from './store';

type ShopProps = { shop: ShopState };
type HeaderProps = ShopProps & { name: string };

export function ShopHeader({ name, shop }: HeaderProps) {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <>
      <header className="flex items-center justify-between gap-3 bg-[var(--bg)] px-[6%] py-5">
        <a href="#" className="text-2xl font-extrabold tracking-widest">
          {name}
          <small className="block text-xs font-normal tracking-normal text-[var(--muted)]">
            متجرك لكل يوم
          </small>
        </a>
        <input type="search" value={shop.query}
          onChange={event => shop.setQuery(event.target.value)}
          placeholder="ابحث عن منتجك المفضل…" aria-label="بحث المنتجات"
          className="min-w-0 flex-1 rounded-lg bg-[var(--surface)] px-3 py-2 text-xs outline-offset-2" />
        <button onClick={() => setCartOpen(true)}
          className="shrink-0 rounded-lg border border-[var(--line)] px-3 py-2 text-xs">
          السلة <span className="ms-1 rounded-full bg-[var(--brand)] px-2 py-1 text-[var(--button-ink)]">
            {shop.cart.length}
          </span>
        </button>
      </header>
      {cartOpen && (
        <div role="dialog" aria-modal="true" aria-label="سلة التسوق"
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5">
          <section className="w-full max-w-sm rounded-2xl bg-[var(--bg)] p-6 shadow-xl">
            <h2 className="text-lg font-bold">سلة التسوق</h2>
            <p className="my-4">{shop.cart.length} منتجات في سلتك التجريبية</p>
            <button onClick={() => setCartOpen(false)}
              className="rounded-lg bg-[var(--brand)] px-4 py-2 text-[var(--button-ink)]">
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
      className="flex gap-5 overflow-x-auto whitespace-nowrap border-y border-[var(--line)] bg-[var(--bg)] px-[6%]">
      {categories.map(category => (
        <button key={category.id} onClick={() => shop.selectCategory(category.id)}
          aria-pressed={shop.category === category.id}
          className={shop.category === category.id
            ? 'border-b-2 border-[var(--brand)] py-3 text-xs font-bold text-[var(--brand)]'
            : 'border-b-2 border-transparent py-3 text-xs text-[var(--muted)]'}>
          {category.id === 'all' ? 'الرئيسية' : category.label}
        </button>
      ))}
      <a href="#offers" className="py-3 text-xs">العروض</a>
    </nav>
  );
}

export function HeroBanner() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive(index => (index + 1) % 3), 4000);
    return () => window.clearInterval(timer);
  }, []);
  const slides = [
    { title: "سماعات بجودة احترافية", subtitle: "صوت نقي وتجربة غامرة", image: -1 },
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
                    backgroundSize: '200% 300%', backgroundPosition: '0% 0%',
                  }} />
                : <div className="absolute inset-y-0 right-0 grid w-1/2 place-items-center rounded-s-full bg-[var(--brand)]">
                    <ProductPhoto image={slide.image} className="w-4/5 rounded-full" />
                  </div>}
              <div dir="rtl" className="absolute left-[6%] top-1/2 w-[46%] -translate-y-1/2 text-right"
                style={{ color: slide.image === -1 ? '#ffffff' : 'var(--ink)' }}>
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

export function CategoryGrid({ shop }: ShopProps) {
  return (
    <section className="px-[6%] py-7">
      <h2 className="mb-5 text-lg font-bold">تسوّق حسب القسم</h2>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {categories.map(category => (
          <button key={category.id} onClick={() => shop.selectCategory(category.id)}
            className="grid justify-items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-1 py-4 hover:border-[var(--brand)]">
            <ProductPhoto image={category.image} className="w-10 rounded-full" />
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
        <h2 className="text-lg font-bold">الأكثر مبيعاً</h2>
        <span className="text-xs text-[var(--muted)]">{shop.filteredProducts.length} منتجات</span>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {shop.filteredProducts.map(product => (
          <article key={product.id}>
            <div className="relative mb-3 grid h-36 place-items-center overflow-hidden rounded-xl bg-[var(--surface)]">
              <ProductPhoto image={product.image} className="w-full" />
              <span className="absolute end-2 top-2 rounded bg-[var(--bg)] px-2 py-1 text-[10px]">جديد</span>
            </div>
            <small className="text-xs text-[var(--muted)]">{product.label}</small>
            <h3 className="my-2 text-sm font-semibold">{product.name}</h3>
            <div className="flex items-center justify-between gap-2">
              <strong className="text-xs">{product.price.toLocaleString('ar-IQ')} د.ع</strong>
              <button onClick={() => shop.addToCart(product)}
                aria-label={'إضافة ' + product.name + ' إلى السلة'}
                className="grid size-8 place-items-center rounded-full bg-[var(--brand)] text-xl text-[var(--button-ink)]">+</button>
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
      <section id="offers" className="mx-[6%] my-6 flex items-center justify-between gap-3 rounded-xl bg-[var(--brand)] p-6 text-[var(--button-ink)]">
        <div><small>عروض محدودة</small><h2 className="mt-2 text-2xl font-bold">اختيارات تحبها.<br />بأسعار تناسبك.</h2></div>
        <a href="#collection" className="shrink-0 rounded bg-[var(--bg)] px-3 py-2 text-xs text-[var(--brand)]">اكتشف المنتجات</a>
      </section>
      <div className="flex justify-around gap-2 border-y border-[var(--line)] p-4 text-[10px]">
        <span>◈ توصيل لكل المحافظات</span><span>✓ جودة مختارة</span><span>◇ دعم ومتابعة</span>
      </div>
      <footer className="flex items-center justify-between gap-3 px-[6%] py-6">
        <strong className="text-xl tracking-widest">{name}</strong>
        <small className="text-[var(--muted)]">اختيارات مدروسة لحياة أجمل</small>
      </footer>
    </>
  );
}
