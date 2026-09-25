(()=>{
  function nudge(reel,direction){const current=Number((reel.style.transform.match(/-?\d+(?:\.\d+)?/)||['140'])[0]);reel.style.transform=`translateY(${current+(direction==='left'?70:-70)}px)`;if(typeof wheelSound==='function')wheelSound()}
  function bind(){document.querySelectorAll('.vertical-wheel,.stage-wheel').forEach(wheel=>{const reel=wheel.querySelector('.reel');if(!reel)return;wheel.querySelectorAll('.wheel-arrow,.stage-arrow').forEach(button=>{if(button.dataset.bound)return;button.dataset.bound='1';button.addEventListener('click',()=>nudge(reel,button.classList.contains('left')?'left':'right'))})})}
  bind();new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelector('#zoomResult:not(.hidden) #closeZoom')?.click();document.querySelector('#stageZoom:not(.hidden) .stage-zoom-close')?.click()}});
})();
