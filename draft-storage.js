(()=>{
  const KEY='debate-wheel-config-draft-v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}};
  const write=data=>localStorage.setItem(KEY,JSON.stringify(data));
  const fieldKey=field=>field.id==='candidateConfig'?'candidates':field.id==='axisConfig'?'axes':`question:${field.dataset.group||''}`;
  function bind(){
    document.querySelectorAll('#candidateConfig,#axisConfig,.group-config').forEach(field=>{
      const key=fieldKey(field),draft=read();
      if(!field.dataset.draftBound){
        field.dataset.draftBound='1';
        if(Object.prototype.hasOwnProperty.call(draft,key))field.value=draft[key];
        field.addEventListener('input',()=>{const next=read();next[key]=field.value;write(next)});
      }
    });
  }
  document.addEventListener('click',event=>{if(event.target?.id==='saveConfig')localStorage.removeItem(KEY)});
  new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});
  setInterval(bind,500);bind();
})();
