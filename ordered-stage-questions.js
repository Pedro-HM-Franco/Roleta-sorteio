(()=>{
  const button=document.getElementById('stageDraw'),tabs=[...document.querySelectorAll('.stage-tab')],axis=document.getElementById('stageAxis'),result=document.getElementById('stageResult'),zoom=document.getElementById('stageZoom'),zoomText=document.getElementById('stageZoomText');
  if(!button||!axis||!result)return;
  const previous=button.onclick;let pending=null;
  const active=()=>document.querySelector('.stage-tab.active')?.dataset.stage;
  const data=()=>JSON.parse(localStorage.getItem('debate-wheel-v1')||'{}');
  const allQuestions=()=>data().roletas?.questions?.groups?.[axis.value]||[];
  const usedQuestions=()=>new Set((data().draws||[]).filter(d=>d.type==='question'&&d.group===axis.value).map(d=>d.item));
  const available=()=>allQuestions().filter(x=>!usedQuestions().has(x));
  function renderStageQuestions(){const all=allQuestions(),used=usedQuestions();renderVerticalWheel('stageReel',all);document.querySelectorAll('#stageReel .reel-item').forEach(item=>{if(used.has(item.textContent))item.classList.add('used')})}
  function spinToFirst(items,onDone){const reel=document.getElementById('stageReel'),all=allQuestions(),target=items[0],targetIndex=all.indexOf(target);renderStageQuestions();wheelSound('start');const startIndex=all.length*10,finalIndex=startIndex+all.length*4+targetIndex,start=performance.now(),duration=4200;let last=-1;function frame(now){const p=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-p,4),current=startIndex+(finalIndex-startIndex)*ease;reel.style.transform=`translateY(${-(current*70)+140}px)`;const tick=Math.floor(current);if(tick!==last){wheelSound();last=tick}if(p<1)requestAnimationFrame(frame);else{wheelSound('win');onDone(target)}}requestAnimationFrame(frame)}
  const show=text=>{result.textContent=text;if(zoom&&zoomText){zoomText.textContent=text;zoom.classList.remove('hidden')}};
  const orderedClick=e=>{if(active()!=='question'){previous?.(e);return}const items=available();if(pending){addDraw('question',`Perguntas / ${axis.value}`,pending,axis.value);result.textContent=pending;pending=null;button.textContent='Sortear pergunta';renderStageQuestions();return}if(!items.length){result.textContent='Todas as perguntas deste eixo já foram utilizadas';renderStageQuestions();return}button.disabled=true;spinToFirst(items,item=>{pending=item;show(item);button.disabled=false;button.textContent='Confirmar pergunta'})};
  button.onclick=orderedClick;
  tabs.forEach(tab=>tab.addEventListener('click',()=>{if(tab.dataset.stage==='question')setTimeout(renderStageQuestions,0)}));axis.addEventListener('change',()=>{if(active()==='question')renderStageQuestions()});
})();
