blog-ai-ads-v25.js
/* ==========================================================
 🧠 Blogger Smart Monetization Suite v2.5
 Author: OnionBoy Labs | Blogstudy Project
 Optimized for Blogger 1001 Skin Series
========================================================== */

/* ---- Style Injection (once) ---- */
(function(){
  if(document.getElementById('aiads-style')) return;
  const s=document.createElement('style');
  s.id='aiads-style';
  s.textContent=`
  .adsbygoogle{opacity:0.55;transition:opacity 0.8s ease;}
  .adsbygoogle.active{opacity:1;}
  .click-heat{position:absolute;width:8px;height:8px;
  background:rgba(66,133,244,0.25);border-radius:50%;
  pointer-events:none;transform:translate(-50%,-50%);
  animation:fadeOut 1s ease forwards;}
  @keyframes fadeOut{to{opacity:0;transform:translate(-50%,-50%) scale(2);opacity:0;}}
  `;
  document.head.appendChild(s);
})();

/* ---- 1. 광고 페이드인 ---- */
document.addEventListener('scroll', ()=>{
  const ads=document.querySelectorAll('.adsbygoogle');
  const ratio=(window.scrollY+window.innerHeight)/document.body.scrollHeight;
  if(ratio>0.7){ads.forEach(a=>a.classList.add('active'));}
});

/* ---- 2. GA4 이벤트 추적 ---- */
document.addEventListener('click',e=>{
  const a=e.target.closest('a');
  if(!a) return;
  if(a.href.includes('#ads-opt')) gtag?.('event','cta_click',{event_category:'engagement',event_label:'ads_opt_section'});
  if(a.hostname!==location.hostname) gtag?.('event','outbound_click',{event_category:'navigation',event_label:a.href});
  if(a.href.includes('/20')) gtag?.('event','internal_post_click',{event_category:'navigation',event_label:a.href});
});

/* ---- 3. Heatmap + 클릭 로그 ---- */
document.addEventListener('click',e=>{
  const dot=document.createElement('div');
  dot.className='click-heat';
  dot.style.left=e.pageX+'px';
  dot.style.top=e.pageY+'px';
  document.body.appendChild(dot);
  setTimeout(()=>dot.remove(),1000);
  const log=JSON.parse(localStorage.getItem('clickLog')||'[]');
  log.push({x:e.pageX,y:e.pageY,t:Date.now()});
  if(log.length>100) log.shift();
  localStorage.setItem('clickLog',JSON.stringify(log));
});

/* ---- 4. AI 광고 위치 재배치 ---- */
window.addEventListener('DOMContentLoaded',()=>{
  try{
    const logs=JSON.parse(localStorage.getItem('clickLog')||'[]');
    if(logs.length<20)return;
    const avgY=logs.reduce((s,l)=>s+l.y,0)/logs.length;
    const pos=avgY/document.body.scrollHeight;
    const ads=document.querySelectorAll('.adsbygoogle');
    if(ads.length){
      const ad=ads[0];
      ad.style.position='relative';
      ad.style.top=(pos*80)+'vh';
      ad.style.transition='top 1s ease';
      console.log(`📈 Smart AI Placement: ${(pos*100).toFixed(1)}%`);
    }
  }catch(err){console.warn('AI Placement error:',err);}
});

/* ---- 5. Lazy Load 최신글 ---- */
(function(){
  let loaded=false;
  window.addEventListener('scroll',()=>{
    if(loaded)return;
    if(window.scrollY+window.innerHeight>=document.body.scrollHeight-300){
      loaded=true;
      const s=document.createElement('script');
      s.src='https://blogstudy.onionboy100.com/feeds/posts/default?alt=json-in-script&callback=loadLatestPosts';
      document.body.appendChild(s);
    }
  });
})();

/* ---- 6. 고단가 키워드 자동삽입 ---- */
const highCPC=[
  '애드센스 수익','SEO 최적화','구글 광고','GA4 분석','콘텐츠 마케팅',
  '디지털 비즈니스','검색엔진 노출','자동화 수익 시스템','트래픽 성장','CTR 향상'
];
window.addEventListener('DOMContentLoaded',()=>{
  const p=document.createElement('p');
  p.style.margin='24px 0';
  p.style.color='#1a73e8';
  p.style.fontWeight='600';
  p.textContent='💎 고단가 키워드: '+highCPC.sort(()=>0.5-Math.random()).slice(0,5).join(', ');
  (document.querySelector('.post-body')||document.body).appendChild(p);
});

/* ---- 7. 스크롤 깊이 추적 ---- */
(function(){
  let checkpoints=[25,50,75,90];
  window.addEventListener('scroll',()=>{
    const percent=(window.scrollY+window.innerHeight)/document.body.scrollHeight*100;
    for(let i=0;i<checkpoints.length;i++){
      if(percent>checkpoints[i]){
        gtag?.('event','scroll_depth',{
          event_category:'engagement',
          event_label:checkpoints[i]+'%',
          value:checkpoints[i]
        });
        checkpoints.splice(i,1);break;
      }
    }
  });
})();

/* ---- 8. 이탈 방지 ---- */
window.addEventListener('beforeunload',e=>{
  if(document.visibilityState==='visible'){
    e.preventDefault();
    e.returnValue='👋 다른 인기 글도 보고 가시겠어요?';
  }
});
