(()=>{
  const questionButton=document.getElementById('drawQuestion'),axisPicker=document.getElementById('axisPicker'),questionResult=document.getElementById('questionResult');
  if(!questionButton||!axisPicker||!questionResult)return;
  function spinToItem(reelId,items,target,onDone){
    const reel=document.getElementById(reelId),targetIndex=items.indexOf(target);if(!reel||targetIndex<0){onDone(target);return}
    renderVerticalWheel(reelId,items);wheelSound('start');
    const startIndex=items.length*10+Math.floor(Math.random()*items.length),finalIndex=startIndex+items.length*4+targetIndex,start=performance.now(),duration=4200;let last=-1;
    function frame(now){const p=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-p,4),current=startIndex+(finalIndex-startIndex)*ease;reel.style.transform=`translateY(${-(current*70)+140}px)`;const tick=Math.floor(current);if(tick!==last){wheelSound();last=tick}if(p<1)requestAnimationFrame(frame);else{wheelSound('win');onDone(target)}}requestAnimationFrame(frame);
  }
  function resetQuestionButton(){questionButton.disabled=false;questionButton.innerHTML='Sortear pergunta <span>↻</span>';questionButton.onclick=prepareInOrder}
  function confirmInOrder(){
    if(!pendingQuestion)return;
    const selected=pendingQuestion;addDraw('question',`Perguntas / ${selected.g}`,selected.item,selected.g);pendingQuestion=null;questionResult.innerHTML='<span class="result-placeholder">Pronto para sortear</span>';resetQuestionButton();toast('Pergunta confirmada e marcada como utilizada');
  }
  function prepareInOrder(){
    const group=axisPicker.value,list=availableQuestions(group);
    if(!list.length){questionResult.innerHTML='<span class="result-placeholder">Todas as perguntas deste eixo já foram utilizadas</span>';questionButton.disabled=false;return}
    questionButton.disabled=true;const nextQuestion=list[0];
    spinToItem('questionReel',list,nextQuestion,item=>{pendingQuestion={g:group,item};result('#questionResult',item);showZoom(item);questionButton.disabled=false;questionButton.innerHTML='Confirmar pergunta';questionButton.onclick=confirmInOrder;questionResult.insertAdjacentHTML('beforeend','<button class="mini-btn" id="redoQuestion">Refazer sorteio</button>');document.getElementById('redoQuestion').onclick=prepareInOrder});
  }
  axisPicker.addEventListener('change',()=>{pendingQuestion=null;resetQuestionButton()});
  questionButton.onclick=prepareInOrder;
})();
