'use strict';
function explorerFile(key,sources){
 const slice=(start,end)=>{const source=sources[1];const a=source.indexOf('export function '+start);const b=end?source.indexOf('export function '+end,a):-1;return source.slice(a,b<0?undefined:b).trim()+'\n';};
 const props="import type { ShopState } from '../store';\n\ntype ShopProps = { shop: ShopState };\n";
 const files={
  header:{name:'components/ShopHeader.tsx',code:"import { useState } from 'react';\n"+props+'type HeaderProps = ShopProps & { name: string };\n\n'+slice('ShopHeader','ShopTabs')},
  banner:{name:'components/HeroBanner.tsx',code:"import { useEffect, useState } from 'react';\n\n"+slice('HeroBanner','CategoryGrid')},
  categories:{name:'components/CategoryGrid.tsx',code:"import { categories } from '../store';\nimport { ProductPhoto } from './HeroBanner';\n"+props+'\n'+slice('CategoryGrid','ProductGrid')},
  products:{name:'components/ProductGrid.tsx',code:"import { ProductPhoto } from './HeroBanner';\n"+props+'\n'+slice('ProductGrid','ShopFooter')},
  types:{name:'types/product.ts',code:sources[2].slice(sources[2].indexOf('export type CategoryId'),sources[2].indexOf('export const categories')).trim()+'\n'},
  productImages:{name:'assets/products.png',image:STORE_ASSETS.products},
  banners:{name:'assets/banners.png',image:STORE_ASSETS.banners}
 };
 return files[key]||null;
}
