'use strict';
(() => {
 const button=document.getElementById('installApp'),dialog=document.getElementById('installDialog');
 let pending=null;
 const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
 if(isStandalone())button.hidden=true;
 window.addEventListener('beforeinstallprompt',event=>{
  event.preventDefault();pending=event;button.hidden=isStandalone();button.title='تثبيت التطبيق';
 });
 window.addEventListener('appinstalled',()=>{pending=null;button.hidden=true;dialog.close();});
 button.addEventListener('click',async()=>{
  if(!pending){dialog.showModal();return;}
  const prompt=pending;pending=null;button.disabled=true;
  try { await prompt.prompt();const choice=await prompt.userChoice;if(choice.outcome==='accepted')button.hidden=true; }
  catch { dialog.showModal(); }
  finally {button.disabled=false;}
 });
 document.getElementById('closeInstall').addEventListener('click',()=>dialog.close());
 if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
  navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).catch(()=>{
   // Installation through the browser remains available without offline caching.
  });
 }
})();
