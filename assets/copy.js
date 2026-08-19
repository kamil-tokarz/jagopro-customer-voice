(()=>{
  const form=document.getElementById('feedback-form');
  const lang=document.body.dataset.lang;
  if(!form||(lang!=='pl'&&lang!=='en'))return;

  const $=(s)=>document.querySelector(s);
  const setText=(s,text)=>{const el=$(s);if(el)el.textContent=text};
  const setPlaceholder=(id,text)=>{const el=document.getElementById(id);if(el)el.placeholder=text};
  const setLead=(el,text)=>{
    if(!el)return;
    const node=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
    if(node)node.nodeValue=text+' ';
    else el.insertBefore(document.createTextNode(text+' '),el.firstChild);
  };
  const labelFor=(id)=>document.querySelector(`label[for="${id}"]`);
  const questionLabel=(id)=>document.getElementById(id)?.closest('.question')?.querySelector('.q-label');

  const copy={
    pl:{
      heroTitle:'Pomóż nam jeszcze lepiej współpracować.',
      heroText:'Ta krótka ankieta zajmie około 3 minut. Chcemy lepiej zrozumieć, co działa dobrze, a co możemy poprawić. Twoja opinia pomoże nam skupić się na tym, co najważniejsze.',
      steps:['O Tobie','Ogólna ocena','Obszary współpracy','Co poprawić','Co działa dobrze'],
      cardHint:'JagoPro · Customer Voice 2026',
      role:'Który obszar najlepiej opisuje Twoją rolę we współpracy z JagoPro?',
      contact:'Podanie danych kontaktowych jest dobrowolne. W razie potrzeby pozwolą nam dopytać o Twoją opinię.',
      nps:'Na ile prawdopodobne jest, że polecisz JagoPro jako partnera w produkcji kontraktowej?',
      npsReason:'Co miało największy wpływ na tę ocenę?',
      npsPlaceholder:'Wystarczy krótka odpowiedź.',
      matrix:'Oceń każdy obszar w skali 5–1, gdzie 5 oznacza „bardzo dobrze”, 3 „neutralnie”, a 1 „bardzo źle”. Jeśli dany obszar Cię nie dotyczy albo trudno Ci go ocenić, wybierz „—”.',
      improvement:'Jeśli mielibyśmy poprawić jeden element współpracy, na czym powinniśmy skupić się w pierwszej kolejności?',
      improvementPlaceholder:'Jeśli możesz, podaj przykład lub krótko opisz, co powinniśmy zmienić.',
      keep:'Co działa szczególnie dobrze we współpracy z JagoPro i nie powinno się zmieniać?',
      additionalPlaceholder:'Możesz dodać inną uwagę, sugestię lub dodatkowy kontekst.',
      cmp3:'Podobnie',
      cmpNa:'Trudno mi porównać',
      matrixValidation:'Oceń każdy obszar w skali 5–1 lub wybierz „—”, jeśli trudno Ci go ocenić.',
      thanksTitle:'Dziękujemy za poświęcony czas.',
      thanksText:'Twoja opinia pomoże nam lepiej współpracować z Tobą i innymi klientami.'
    },
    en:{
      heroTitle:'Help us make working with JagoPro even better.',
      heroText:'This short survey takes about 3 minutes. We want to understand what works well and where we can improve. Your feedback will help us focus on what matters most.',
      steps:['About you','Overall rating','Key areas','What to improve','What works well'],
      cardHint:'JagoPro · Customer Voice 2026',
      role:'Which area best describes your role in working with JagoPro?',
      contact:'Contact details are optional. They allow us to follow up if we have a question about your feedback.',
      nps:'How likely are you to recommend JagoPro as a contract manufacturing partner?',
      npsReason:'What was the main reason for your score?',
      npsPlaceholder:'A short answer is fine.',
      matrix:'Rate each area from 5 to 1, where 5 means “very good”, 3 “neutral” and 1 “very poor”. If an area is not relevant to your work with JagoPro or you cannot rate it, choose “—”.',
      improvement:'If we could improve one aspect of working with JagoPro, what should we focus on first?',
      improvementPlaceholder:'If you can, share an example or briefly describe what you would like us to change.',
      keep:'What works especially well when you work with JagoPro and should stay as it is?',
      additionalPlaceholder:'Add any other comment, suggestion or context you would like us to know.',
      cmp3:'About the same',
      cmpNa:'I don’t have enough experience to compare',
      matrixValidation:'Please rate each area from 5 to 1, or choose “—” if you cannot rate it.',
      thanksTitle:'Thank you for your time.',
      thanksText:'Your feedback will help us work better with you and other customers.'
    }
  }[lang];

  setText('.hero h1',copy.heroTitle);
  setText('.hero p',copy.heroText);
  document.querySelectorAll('.steps li').forEach((el,i)=>{if(copy.steps[i])el.textContent=copy.steps[i]});
  setText('.card-head .hint',copy.cardHint);
  setText('footer.footer span:first-child','JagoPro');
  setLead(labelFor('role'),copy.role);
  setText('.section:first-of-type .privacy-note',copy.contact);
  setLead(questionLabel('nps-grid'),copy.nps);
  setLead(labelFor('nps_reason'),copy.npsReason);
  setPlaceholder('nps_reason',copy.npsPlaceholder);
  setText('.matrix-help',copy.matrix);
  setLead(labelFor('improvement_priority'),copy.improvement);
  setPlaceholder('improvement_reason',copy.improvementPlaceholder);
  setLead(labelFor('keep_comment'),copy.keep);
  setPlaceholder('additional_comment',copy.additionalPlaceholder);

  const cmp3=document.querySelector('label[for="cmp3"]');
  const cmpNa=document.querySelector('label[for="cmpna"]');
  if(cmp3)cmp3.textContent=copy.cmp3;
  if(cmpNa)cmpNa.textContent=copy.cmpNa;

  const validation=document.getElementById('validation');
  if(validation){
    const syncValidation=()=>{
      const text=validation.textContent||'';
      if(text.includes('rzetelnie ocenić')||text.includes('assess it fairly'))validation.textContent=copy.matrixValidation;
    };
    new MutationObserver(syncValidation).observe(validation,{childList:true,characterData:true,subtree:true});
    syncValidation();
  }

  const success=document.getElementById('success');
  if(success){
    const syncSuccess=()=>{
      if(!success.classList.contains('active'))return;
      const h2=success.querySelector('h2');
      const p=success.querySelector('p');
      if(h2&&h2.textContent!==copy.thanksTitle)h2.textContent=copy.thanksTitle;
      if(p&&p.textContent!==copy.thanksText)p.textContent=copy.thanksText;
    };
    new MutationObserver(syncSuccess).observe(success,{attributes:true,attributeFilter:['class']});
    syncSuccess();
  }
})();
