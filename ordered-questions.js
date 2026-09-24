(()=>{
  const questionButton=document.getElementById('drawQuestion');
  if(!questionButton)return;
  function spinToItem(reelId,items,target,onDone){
    const reel=document.getElementById(reelId),targetIndex=items.indexOf(target);if(!reel||targetIndex<0){onDone(target);return}
    renderVerticalWheel(reelId,items);
    wheelSound('start');
    const startIndex=items.length*10+Math.floor(Math.random()*items.length),finalIndex=startIndex+items.length*4+targetIndex,start=performance.now(),duration=4200;let last=-1;
    function frame(now){const p=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-p,4),current=startIndex+(finalIndex-startIndex)*ease;reel.style.transform=`translateY(${-(current*70)+140}px)`;const tick=Math.floor(current);if(tick!==last){wheelSound();last=tick}if(p<1)requestAnimationFrame(frame);else{wheelSound('win');onDone(target)}}
    requestAnimationFrame(frame);
  }
  function prepareInOrder(){
    const group=document.getElementById('axisPicker').value,list=availableQuestions(group);
    if(!list.length){toast('Não há perguntas disponíveis neste eixo');return}
    const button=document.getElementById('drawQuestion');button.disabled=true;const nextQuestion=list[0];
    spinToItem('questionReel',list,nextQuestion,item=>{pendingQuestion={g:group,item};result('#questionResult',item);showZoom(item);button.disabled=false;button.innerHTML='Confirmar pergunta';button.onclick=confirmQuestion;document.getElementById('questionResult').insertAdjacentHTML('beforeend','<button class="mini-btn" id="redoQuestion">Refazer sorteio</button>');document.getElementById('redoQuestion').onclick=prepareInOrder});
  }
  questionButton.onclick=prepareInOrder;
})();
