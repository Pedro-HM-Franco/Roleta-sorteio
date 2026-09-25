(()=>{
  const presets={response:{label:'Resposta',seconds:180},reply:{label:'Réplica',seconds:60}};
  const timer={mode:'response',remaining:180,running:false,interval:null};
  const format=seconds=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  function makePanel(stage=false){
    const panel=document.createElement('section');panel.className=stage?'debate-timer debate-timer-stage':'debate-timer';panel.setAttribute('aria-label','Cronômetro do debate');
    panel.innerHTML=`<div class="timer-heading"><span class="timer-kicker">TEMPO DE ${stage?'FALA':'DEBATE'}</span><strong class="timer-context">${stage?'Controle manual':'Use durante a resposta e a réplica'}</strong></div><div class="timer-display">03:00</div><div class="timer-presets"><label class="timer-preset active" data-timer-mode="response"><span>Resposta</span><input class="timer-minute" data-minute-mode="response" type="number" min="1" max="60" value="3" aria-label="Minutos da resposta"><small>min</small></label><label class="timer-preset" data-timer-mode="reply"><span>Réplica</span><input class="timer-minute" data-minute-mode="reply" type="number" min="1" max="60" value="1" aria-label="Minutos da réplica"><small>min</small></label></div><div class="timer-actions"><button class="timer-start primary">Iniciar</button><button class="timer-pause secondary">Pausar</button><button class="timer-reset secondary">Zerar</button></div>`;
    bindPanel(panel);return panel;
  }
  function bindPanel(panel){
    panel.querySelectorAll('[data-timer-mode]').forEach(button=>button.onclick=()=>{if(timer.running)return;timer.mode=button.dataset.timerMode;timer.remaining=presets[timer.mode].seconds;update()});
    panel.querySelectorAll('[data-minute-mode]').forEach(input=>input.onchange=()=>{const mode=input.dataset.minuteMode,value=Math.max(1,Math.min(60,Number(input.value)||1));input.value=value;presets[mode].seconds=value*60;if(!timer.running&&timer.mode===mode)timer.remaining=presets[mode].seconds;update()});
    panel.querySelector('.timer-start').onclick=()=>start();panel.querySelector('.timer-pause').onclick=()=>pause();panel.querySelector('.timer-reset').onclick=()=>reset();panel._timerBound=true;
  }
  function update(){document.querySelectorAll('.debate-timer').forEach(panel=>{panel.querySelector('.timer-display').textContent=format(timer.remaining);panel.querySelectorAll('[data-timer-mode]').forEach(button=>button.classList.toggle('active',button.dataset.timerMode===timer.mode));panel.querySelectorAll('[data-minute-mode]').forEach(input=>{input.value=Math.round(presets[input.dataset.minuteMode].seconds/60);input.disabled=timer.running});panel.classList.toggle('is-running',timer.running);panel.classList.toggle('is-finished',timer.remaining===0);const start=panel.querySelector('.timer-start');start.textContent=timer.running?'Rodando':'Iniciar';start.disabled=timer.running;panel.querySelector('.timer-pause').disabled=!timer.running})}
  function start(){if(timer.running||timer.remaining<=0)return;timer.running=true;timer.interval=setInterval(()=>{timer.remaining=Math.max(0,timer.remaining-1);if(timer.remaining===0){pause();if(typeof wheelSound==='function'){wheelSound('win');setTimeout(()=>wheelSound('win'),220);setTimeout(()=>wheelSound('win'),440)}}update()},1000);update()}
  function pause(){timer.running=false;if(timer.interval){clearInterval(timer.interval);timer.interval=null}update()}
  function reset(){pause();timer.remaining=presets[timer.mode].seconds;update()}
  const main=document.querySelector('#presentView .stats-row');if(main)main.after(makePanel(false));
  const stage=document.getElementById('stageMode');if(stage){const stageMain=stage.querySelector('.stage-main');const panel=makePanel(true);stageMain.append(panel);const observer=new MutationObserver(()=>{if(!panel.isConnected)stageMain.append(panel)});observer.observe(stage,{childList:true,subtree:true})}
  update();
})();
