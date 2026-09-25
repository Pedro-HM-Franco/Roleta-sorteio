(()=>{
  const MIN_SIZE=18;
  function fit(element){
    if(!element||!element.textContent.trim())return;
    element.style.overflow='hidden';
    element.style.fontSize='';
    const computed=getComputedStyle(element);
    let size=parseFloat(computed.fontSize);
    const min=element.closest('.stage-zoom-card')?30:24;
    let guard=0;
    while(guard++<80 && size>min && (element.scrollHeight>element.clientHeight+1 || element.scrollWidth>element.clientWidth+1)){
      size=Math.max(min,size-1);
      element.style.fontSize=`${size}px`;
    }
  }
  function fitAll(){
    document.querySelectorAll('#zoomText,#stageZoomText,.result-box strong,.stage-result').forEach(fit);
  }
  window.fitDebateText=fit;
  new MutationObserver(fitAll).observe(document.body,{subtree:true,childList:true,characterData:true});
  window.addEventListener('resize',fitAll);
  if(document.fonts?.ready)document.fonts.ready.then(fitAll);
  requestAnimationFrame(fitAll);
})();
