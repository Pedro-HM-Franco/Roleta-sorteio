(()=>{
  const stage=document.getElementById('stageMode');
  if(!stage)return;

  function mount(){
    const card=document.querySelector('#stageZoom .stage-zoom-card');
    const source=stage.querySelector('.debate-timer-stage');
    if(!card||!source||card.querySelector('.stage-zoom-timer'))return;

    const dock=document.createElement('div');
    dock.className='stage-zoom-timer';
    dock.setAttribute('aria-label','Controles do cronômetro');
    dock.innerHTML=`<strong class="stage-zoom-timer-display">03:00</strong><div class="stage-zoom-timer-presets"><button type="button" data-proxy-mode="response">Resposta <small>03:00</small></button><button type="button" data-proxy-mode="reply">Réplica <small>01:00</small></button></div><div class="stage-zoom-timer-actions"><button type="button" data-proxy-action="start">Iniciar</button><button type="button" data-proxy-action="pause">Pausar</button><button type="button" data-proxy-action="reset">Zerar</button></div>`;
    card.insertBefore(dock,card.querySelector('.stage-zoom-close'));

    const display=dock.querySelector('.stage-zoom-timer-display');
    const sync=()=>{
      const isQuestion=document.querySelector('#stageMode .stage-tab.active')?.dataset.stage==='question';
      dock.hidden=!isQuestion;
      dock.style.display=isQuestion?'grid':'none';
      const sourceDisplay=source.querySelector('.timer-display');
      if(sourceDisplay)display.textContent=sourceDisplay.textContent;
      dock.querySelectorAll('[data-proxy-mode]').forEach(button=>{
        const mode=button.dataset.proxyMode;
        const original=source.querySelector(`[data-timer-mode="${mode}"]`);
        button.classList.toggle('active',original?.classList.contains('active'));
        const input=source.querySelector(`[data-minute-mode="${mode}"]`);
        const small=button.querySelector('small');
        if(input&&small)small.textContent=`${input.value.padStart(2,'0')}:00`;
      });
      dock.classList.toggle('is-running',source.classList.contains('is-running'));
      dock.classList.toggle('is-finished',source.classList.contains('is-finished'));
      const start=dock.querySelector('[data-proxy-action="start"]');
      const pause=dock.querySelector('[data-proxy-action="pause"]');
      start.disabled=source.querySelector('.timer-start')?.disabled??false;
      pause.disabled=source.querySelector('.timer-pause')?.disabled??true;
      start.textContent=source.querySelector('.timer-start')?.textContent||'Iniciar';
    };
    dock.querySelectorAll('[data-proxy-mode]').forEach(button=>button.onclick=()=>source.querySelector(`[data-timer-mode="${button.dataset.proxyMode}"]`)?.click());
    dock.querySelector('[data-proxy-action="start"]').onclick=()=>source.querySelector('.timer-start')?.click();
    dock.querySelector('[data-proxy-action="pause"]').onclick=()=>source.querySelector('.timer-pause')?.click();
    dock.querySelector('[data-proxy-action="reset"]').onclick=()=>source.querySelector('.timer-reset')?.click();
    sync();
    setInterval(sync,250);
  }
  mount();
  new MutationObserver(mount).observe(stage,{childList:true,subtree:true});
})();
