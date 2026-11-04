(function(){
  'use strict';
  let installPrompt=null;
  const standalone=()=>window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true;
  const ios=()=>/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  function ready(){
    const install=document.getElementById('pwa-install');
    const offline=document.getElementById('pwa-offline');
    const help=document.getElementById('pwa-help');
    function availability(){install.hidden=standalone() || (!installPrompt && !ios());}
    let networkCheck=0;
    async function network(){
      const check=++networkCheck;
      if(!navigator.onLine){offline.hidden=false;return;}
      try{
        const controller=new AbortController();
        const timer=setTimeout(()=>controller.abort(),5000);
        try{const response=await fetch(new URL('manifest.webmanifest?pwa_connection=1',document.baseURI),{method:'HEAD',cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error('unavailable');}
        finally{clearTimeout(timer);}
        if(check===networkCheck)offline.hidden=true;
      }catch(e){if(check===networkCheck)offline.hidden=false;}
    }
    availability();network();
    window.addEventListener('online',network);window.addEventListener('offline',network);
    install.addEventListener('click',async()=>{
      if(installPrompt){const prompt=installPrompt;installPrompt=null;availability();await prompt.prompt();await prompt.userChoice;}
      else if(ios()){if(typeof help.showModal==='function')help.showModal();else help.setAttribute('open','');}
    });
    document.getElementById('pwa-help-close').addEventListener('click',()=>{if(typeof help.close==='function')help.close();else help.removeAttribute('open')});
    help.addEventListener('click',event=>{if(event.target===help&&typeof help.close==='function')help.close()});
    window.addEventListener('appinstalled',()=>{installPrompt=null;availability()});
  }
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;if(document.readyState!=='loading'){const el=document.getElementById('pwa-install');if(el&&!standalone())el.hidden=false;}});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
  if('serviceWorker' in navigator && window.isSecureContext){window.addEventListener('load',()=>navigator.serviceWorker.register(new URL('sw.js',document.baseURI)).catch(()=>{}));}
})();
