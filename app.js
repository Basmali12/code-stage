'use strict';
const $ = id => document.getElementById(id);
const names = ['Storefront.tsx','components.tsx','store.ts'];
let milestones=[];
const stageLabels=['تجهيز الملفات','التبويبات','أول بطاقتين للمنتجات','الأقسام والمزيد من المنتجات','البنر الرئيسي · 2.35:1','هوية المتجر والبحث والسلة','اكتمال المنتجات والعروض','التنقل السفلي','تفعيل المتجر'];
let config = {theme:1,name:'TechZone',color:'#0066ff',pressesPerWord:2};
let draftTheme=1;
let pendingWord=null;
let previewFile=null;
let active=0, positions=[0,0,0], sources=[], lastStage=-1, lastStamp=0;
try { const saved=JSON.parse(localStorage.getItem('codestage-config')); if(saved && typeof saved==='object') config={...config,...saved}; } catch {}
if(!Number.isInteger(config.theme)||config.theme<1||config.theme>6){config.theme=1;config.name='TechZone';config.color='#0066ff';}
config.pressesPerWord=Number(config.pressesPerWord)===1?1:2;
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function documentHTML(stage){return createStoreHTML(config,stage);}
function buildSources(){
 const modern=createModernSources(config);
 sources=modern.sources;
 milestones=modern.milestones;
}
function highlight(s){return escape(s).replace(/(&lt;\/?[\w-]+|&gt;)/g,'<span class="tag">$1</span>').replace(/(&quot;.*?&quot;)/g,'<span class="string">$1</span>');}
function stage(){
 if(sources.every((source,i)=>positions[i]===source.length))return 8;
 const lines=sources.reduce((total,source,i)=>total+(source.slice(0,positions[i]).match(/\n/g)||[]).length,0);
 return [19,34,59,94,139,209,280].filter(threshold=>lines>=threshold).length;
}
function followCaret(){
 const area=$('codeArea'),caret=area.querySelector('.caret');
 if(!caret)return;
 const bounds=area.getBoundingClientRect(),point=caret.getBoundingClientRect();
 const inset=Math.min(90,area.clientHeight/3);
 if(point.bottom>bounds.bottom-inset)area.scrollTop+=point.bottom-bounds.bottom+inset;
 else if(point.top<bounds.top+24)area.scrollTop-=bounds.top+24-point.top;
}
function render(){
 const file=previewFile?explorerFile(previewFile,sources):null;
 const visible=file?(file.code||''):sources[active].slice(0,positions[active]),lines=visible.split('\n');
 $('code').innerHTML=file?.image?`<div class="asset-view"><img src="${file.image}" alt="${escape(file.name)}"><span>${escape(file.name)}</span></div>`:lines.map((line,i)=>`<div class="row"><span class="number">${i+1}</span><span class="source">${highlight(line)}${!file&&i===lines.length-1?'<i class="caret"></i>':''}</span></div>`).join('');
 $('filename').textContent=file?file.name:names[active];
 $('codeArea').setAttribute('aria-readonly',String(Boolean(file)));
 $('previewTab').hidden=!file;$('previewTab').textContent=file?file.name.split('/').at(-1):'';
 document.querySelectorAll('[data-file]').forEach(b=>b.classList.toggle('active',!file&&+b.dataset.file===active));
 document.querySelectorAll('[data-explorer]').forEach(b=>b.classList.toggle('active',b.dataset.explorer===previewFile));
 const total=sources.reduce((a,s)=>a+s.length,0),done=positions.reduce((a,b)=>a+b,0),pct=Math.floor(done/total*100);
 $('percent').textContent=pct+'%';$('bar').style.width=pct+'%';
 $('cursor').textContent=file?`Preview · ${file.image?'PNG':file.name.endsWith('.tsx')?'TypeScript React':'TypeScript'}`:`Ln ${lines.length}, Col ${lines.at(-1).length+1}  UTF-8  ${['TypeScript React','TypeScript React','TypeScript'][active]}`;
 const next=stage();if(next!==lastStage){lastStage=next;$('preview').srcdoc=documentHTML(next).replace('<title>','<base href="about:srcdoc"><title>');$('log').textContent=next===0?'Waiting for keyboard input...':next===8?'✓ Build complete · storefront ready':`✓ ${stageLabels[next]}`;}
 $('hint').hidden=Boolean(file)||done>0;if(!file)requestAnimationFrame(followCaret);
}
function selectFile(i){active=i;previewFile=null;pendingWord=null;render();$('codeArea').focus({preventScroll:true});}
function typeWordStep(){
 if(positions[active]===sources[active].length){if(active===2)return;active++;pendingWord=null;}
 if(!pendingWord||pendingWord.file!==active){
  const remaining=sources[active].slice(positions[active]);
  const token=remaining.match(/^[^\p{L}\p{N}_$]*[\p{L}\p{N}_$]+/u);
  pendingWord={file:active,end:positions[active]+(token?token[0].length:remaining.length),presses:config.pressesPerWord};
 }
 const step=Math.ceil((pendingWord.end-positions[active])/pendingWord.presses);
 positions[active]=Math.min(pendingWord.end,positions[active]+step);
 pendingWord.presses--;
 if(positions[active]===pendingWord.end)pendingWord=null;
}
document.querySelectorAll('[data-file]').forEach(b=>b.onclick=()=>selectFile(+b.dataset.file));
document.querySelectorAll('[data-explorer]').forEach(b=>b.onclick=()=>{previewFile=b.dataset.explorer;render();$('codeArea').scrollTop=0;});
$('codeArea').addEventListener('keydown',e=>{
 if(e.ctrlKey||e.metaKey||e.altKey||e.key==='F8'||e.key==='Escape'||e.key==='Tab'||e.key.startsWith('Arrow'))return;
 if(e.key.length!==1&&!['Enter','Backspace','Delete'].includes(e.key))return;
 e.preventDefault();
 if(previewFile)return;
 if(e.key==='Backspace'||e.key==='Delete'){pendingWord=null;positions[active]=Math.max(0,positions[active]-1);}
 else typeWordStep();
 lastStamp=Date.now();render();
});
$('reset').onclick=()=>{positions=[0,0,0];active=0;previewFile=null;pendingWord=null;lastStage=-1;render();$('codeArea').focus({preventScroll:true});};
async function recordMode(){document.body.classList.toggle('recording');if(document.body.classList.contains('recording')){try{await document.documentElement.requestFullscreen();}catch{}}else if(document.fullscreenElement){await document.exitFullscreen();}$('codeArea').focus({preventScroll:true});}
$('record').onclick=recordMode;
document.addEventListener('keydown',e=>{if(e.key==='F8'){e.preventDefault();recordMode();}if(e.key==='Escape'){document.body.classList.remove('recording');$('settings').hidden=true;}});
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)document.body.classList.remove('recording');});
for(const type of ['desktop','mobile'])$(type).onclick=()=>{document.querySelector('.layout').classList.toggle('phone-preview',type==='mobile');$('preview').classList.toggle('mobile',type==='mobile');$('desktop').classList.toggle('active',type==='desktop');$('mobile').classList.toggle('active',type==='mobile');};
$('settingsBtn').onclick=()=>{draftTheme=config.theme;paintThemePicker();$('storeName').value=config.name;$('speed').value=config.pressesPerWord;$('themeColor').value=config.color;$('settings').hidden=false;$('storeName').focus({preventScroll:true});};
$('closeSettings').onclick=()=>{$('settings').hidden=true;$('codeArea').focus({preventScroll:true});};
$('saveSettings').onclick=()=>{const changed=draftTheme!==config.theme;config={theme:draftTheme,name:$('storeName').value.trim()||selectedStoreTheme({theme:draftTheme}).name,pressesPerWord:Number($('speed').value)===1?1:2,color:$('themeColor').value};pendingWord=null;try{localStorage.setItem('codestage-config',JSON.stringify(config));}catch{}buildSources();positions=changed?[0,0,0]:positions.map((p,i)=>Math.min(p,sources[i].length));if(changed)active=0;lastStage=-1;render();$('settings').hidden=true;$('codeArea').focus({preventScroll:true});};
$('export').onclick=()=>{const url=URL.createObjectURL(new Blob([documentHTML(8)],{type:'text/html;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='storefront.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
buildSources();render();


function paintThemePicker(){
  $('themePicker').innerHTML=storeThemes.map((theme,index)=>`<button type="button" class="theme-choice ${draftTheme===theme.id?'chosen':''}" data-theme="${theme.id}" aria-pressed="${draftTheme===theme.id}"><span class="theme-thumb" style="background-position:${(index%3)*50}% ${Math.floor(index/3)*100}%"></span><strong>${theme.id}. ${theme.name}</strong><small>${theme.label}</small></button>`).join('');
  $('themePicker').querySelectorAll('[data-theme]').forEach(button=>button.onclick=()=>{draftTheme=Number(button.dataset.theme);const theme=selectedStoreTheme({theme:draftTheme});$('storeName').value=theme.name;$('themeColor').value=theme.accent;paintThemePicker();});
}
