(()=>{
  const form=document.getElementById('feedback-form');
  if(!form)return;
  const lang=document.body.dataset.lang||'pl';
  const sections=[...form.querySelectorAll('.section')];
  const stepButtons=[...document.querySelectorAll('.step-button')];
  const next=document.getElementById('next-btn'),prev=document.getElementById('prev-btn');
  const progress=document.getElementById('progress-fill'),count=document.getElementById('step-count');
  const mobileCount=document.getElementById('mobile-step-count'),mobileTitle=document.getElementById('mobile-step-title');
  const dots=[...document.querySelectorAll('.mobile-dots i')],validation=document.getElementById('validation');
  const body=document.getElementById('form-body-wrap'),success=document.getElementById('success');
  const contactFields=document.getElementById('contact-fields'),email=document.getElementById('email');
  const referralWrap=document.getElementById('referral-source-wrap'),referralInput=document.getElementById('referral_source');
  let current=0,furthest=0,submitted=false;
  const copy=lang==='pl'
    ?{back:'Wstecz',next:'Dalej',send:'Wyślij opinię',sending:'Wysyłanie…',required:'Uzupełnij wymagane odpowiedzi w tej części.',tooMany:'Możesz wybrać maksymalnie 3 cechy.',invalidEmail:'Podaj poprawny adres e-mail albo wybierz „Nie” przy zgodzie na kontakt.',saveFail:'Nie udało się zapisać odpowiedzi. Spróbuj ponownie.',step:(n,total)=>`${n} z ${total}`}
    :{back:'Back',next:'Next',send:'Submit feedback',sending:'Submitting…',required:'Please complete the required questions in this section.',tooMany:'You can select up to 3 features.',invalidEmail:'Enter a valid e-mail address or choose “No” for follow-up contact.',saveFail:'We couldn’t save your response. Please try again.',step:(n,total)=>`${n} of ${total}`};
  const reduceMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  function showError(message,focusTarget){validation.textContent=message;validation.classList.add('show');if(focusTarget)focusTarget.focus({preventScroll:true});validation.scrollIntoView({behavior:reduceMotion()?'auto':'smooth',block:'nearest'})}
  function clearError(){validation.textContent='';validation.classList.remove('show')}
  function sectionValid(index=current){
    const section=sections[index];clearError();
    for(const group of section.querySelectorAll('[data-required-group]')){
      const name=group.dataset.requiredGroup;
      const checked=[...group.querySelectorAll(`input[name="${CSS.escape(name)}"]:checked`)];
      if(!checked.length){showError(copy.required,group.querySelector('input'));return false}
      const max=Number(group.dataset.maxChoices||0);
      if(max&&checked.length>max){showError(copy.tooMany,checked[max]);return false}
    }
    for(const field of section.querySelectorAll('input[required],select[required],textarea[required]')){
      if(field.closest('[hidden]'))continue;
      if(!String(field.value||'').trim()){showError(copy.required,field);return false}
      if(field.type==='email'&&!field.validity.valid){showError(copy.invalidEmail,field);return false}
    }
    return true
  }
  function syncSteps(){
    sections.forEach((section,index)=>section.classList.toggle('active',index===current));
    stepButtons.forEach((button,index)=>{
      const done=index<current||(index<furthest&&index!==current);
      button.classList.toggle('active',index===current);button.classList.toggle('done',done);
      button.disabled=submitted||index>furthest;
      if(index===current&&!submitted)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')
    });
    dots.forEach((dot,index)=>{dot.classList.toggle('active',index===current);dot.classList.toggle('done',index<current)});
    const title=sections[current].dataset.title||'';
    progress.style.width=`${((current+1)/sections.length)*100}%`;
    count.textContent=`${current+1}/${sections.length}`;
    mobileCount.textContent=copy.step(current+1,sections.length);
    mobileTitle.textContent=title;
    prev.disabled=current===0||submitted;
    prev.textContent=copy.back;
    next.textContent=current===sections.length-1?copy.send:copy.next
  }
  function scrollCard(){document.querySelector('.survey-card-v2')?.scrollIntoView({behavior:reduceMotion()?'auto':'smooth',block:'start'})}
  function goTo(index,{validateForward=true,scroll=true}={}){
    if(submitted||index<0||index>=sections.length||index>furthest)return;
    if(validateForward&&index>current&&!sectionValid(current))return;
    current=index;syncSteps();clearError();if(scroll)scrollCard()
  }
  stepButtons.forEach((button,index)=>button.addEventListener('click',()=>goTo(index,{validateForward:index>current})));
  prev.addEventListener('click',()=>{if(current>0)goTo(current-1,{validateForward:false})});
  function payload(){
    const data={};
    const multi={};
    new FormData(form).forEach((value,key)=>{
      if(Object.prototype.hasOwnProperty.call(data,key)){
        if(!multi[key])multi[key]=[data[key]];
        multi[key].push(value);data[key]=multi[key]
      }else data[key]=value
    });
    return{id:crypto.randomUUID?crypto.randomUUID():`fb-${Date.now()}`,submittedAt:new Date().toISOString(),language:lang,surveyVersion:(window.JagoProFeedbackConfig||{}).surveyVersion||'2.0',...data}
  }
  async function save(data){
    const cfg=window.JagoProFeedbackConfig||{};
    if(cfg.storageMode==='api'&&cfg.submitEndpoint){
      const response=await fetch(cfg.submitEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);return
    }
    const key='jagopro_feedback_v1';
    const rows=JSON.parse(localStorage.getItem(key)||'[]');rows.push(data);localStorage.setItem(key,JSON.stringify(rows))
  }
  next.addEventListener('click',async()=>{
    if(submitted||!sectionValid())return;
    if(current<sections.length-1){current++;furthest=Math.max(furthest,current);syncSteps();clearError();scrollCard();return}
    next.disabled=true;prev.disabled=true;next.textContent=copy.sending;
    try{
      await save(payload());submitted=true;
      stepButtons.forEach(button=>{button.disabled=true;button.classList.remove('active');button.classList.add('done');button.removeAttribute('aria-current')});
      dots.forEach(dot=>{dot.classList.remove('active');dot.classList.add('done')});
      progress.style.width='100%';body.style.display='none';success.classList.add('active');success.querySelector('h2')?.focus({preventScroll:true});
      success.scrollIntoView({behavior:reduceMotion()?'auto':'smooth',block:'center'})
    }catch(error){next.disabled=false;prev.disabled=false;next.textContent=copy.send;showError(copy.saveFail)}
  });
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('change',event=>{
    if(event.target.matches('input[name="valued_features"]')){
      const group=event.target.closest('[data-max-choices]');
      const checked=[...group.querySelectorAll('input[name="valued_features"]:checked')];
      if(checked.length>Number(group.dataset.maxChoices||3)){event.target.checked=false;showError(copy.tooMany,event.target);return}
    }
    if(event.target.matches('input[name="source"]')){
      const referral=event.target.value==='referral';
      referralWrap.hidden=!referral;
      if(!referral&&referralInput)referralInput.value=''
    }
    if(event.target.matches('input[name="contact_permission"]')){
      const yes=event.target.value==='yes';contactFields.hidden=!yes;email.required=yes;
      if(!yes){document.getElementById('name').value='';email.value=''}
    }
    clearError()
  });
  syncSteps();
})();