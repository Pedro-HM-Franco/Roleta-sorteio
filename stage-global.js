(()=>{
  const $=s=>document.querySelector(s),stage=$('#stageMode'),open=$('#openStage'),close=$('#closeStage'),draw=$('#stageDraw'),reel=$('#stageReel'),out=$('#stageResult'),title=$('#stageTitle');
  if(!stage||!open||!draw||!reel)return;
  let kind='candidate',pending=null,axis=$('#stageAxis');
  if(!axis){axis=document.createElement('select');axis.id='stageAxis';axis.className='stage-axis';const main=stage.querySelector('.stage-main');main.insertBefore(axis,main.querySelector('.stage-wheel')||reel)}
  const zoom=document.createElement('div');zoom.id='stageZoom';zoom.className='stage-zoom hidden';zoom.setAttribute('role','dialog');zoom.setAttribute('aria-modal','true');zoom.innerHTML='<div class="stage-zoom-card"><span class="stage-zoom-kicker">RESULTADO DO SORTEIO</span><strong id="stageZoomText"></strong><button class="stage-zoom-close">× Fechar</button></div>';stage.append(zoom);
  const zoomText=zoom.querySelector('strong'),closeZoom=zoom.querySelector('.stage-zoom-close');
  const hideZoom=()=>zoom.classList.add('hidden');const showZoom=text=>{zoomText.textContent=text;zoom.classList.remove('hidden')};closeZoom.onclick=hideZoom;zoom.onclick=e=>{if(e.target===zoom)hideZoom()};
  const data=()=>JSON.parse(localStorage.getItem('debate-wheel-v1')||'null');
  const list=()=>{const s=data();if(!s?.roletas)return[];if(kind==='candidate')return s.roletas.candidates.items;if(kind==='axis')return s.roletas.axes.items;const used=(s.draws||[]).filter(d=>d.type==='question'&&d.group===axis.value).map(d=>d.item);return(s.roletas.questions.groups[axis.value]||[]).filter(x=>!used.includes(x))};
  const refresh=()=>{const s=data();if(!s?.roletas)return;hideZoom();const current=axis.value;axis.innerHTML=Object.keys(s.roletas.questions.groups).map(x=>`<option value="${x}">${x}</option>`).join('');if(current&&Object.keys(s.roletas.questions.groups).includes(current))axis.value=current;axis.style.display=kind==='question'?'block':'none';pending=null;draw.disabled=false;draw.textContent=kind==='question'?'Sortear pergunta':'Sortear';title.textContent=kind==='candidate'?'Candidatos':kind==='axis'?'Eixos temáticos':'Perguntas';out.textContent='Pronto para sortear';renderVerticalWheel('stageReel',list())};
  const sort=()=>{const items=list();if(!items.length){out.textContent='Nenhuma opção disponível';return}if(kind==='question'&&pending){addDraw('question',`Perguntas / ${axis.value}`,pending,axis.value);out.textContent=pending;pending=null;draw.textContent='Sortear pergunta';refresh();return}draw.disabled=true;spinVertical('stageReel',items,item=>{out.textContent=item;showZoom(item);if(kind==='candidate')addDraw('candidate','Candidatos',item);if(kind==='axis')addDraw('axis','Eixos temáticos',item);if(kind==='question'){pending=item;draw.textContent='Confirmar pergunta'}draw.disabled=false})};
  open.onclick=e=>{e.preventDefault();stage.classList.remove('hidden');document.documentElement.classList.add('telão-open');refresh()};
  if(close)close.onclick=e=>{e.preventDefault();hideZoom();stage.classList.add('hidden');document.documentElement.classList.remove('telão-open')};
  document.querySelectorAll('.stage-tab').forEach(b=>b.onclick=()=>{kind=b.dataset.stage;document.querySelectorAll('.stage-tab').forEach(x=>x.classList.toggle('active',x===b));refresh()});
  axis.onchange=refresh;draw.onclick=sort;
})();
