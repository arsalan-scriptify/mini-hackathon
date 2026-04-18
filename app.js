
// ── State ──────────────────────────────────────────────────
const state = {
  currentPage:'home',
  currentUser:null,
  loggedIn:false,
  messages:[
    {from:'Ayesha Khan',to:'Sara Noor',text:'I checked your portfolio request. Share the breakpoint screenshots and I can suggest fixes.',time:'09:45 AM'},
    {from:'Hassan Ali',to:'Ayesha Khan',text:'Your event poster concept is solid. I would tighten the CTA and reduce the background texture.',time:'11:10 AM'}
  ],
  requests:[
    {id:1,category:'Web Development',urgency:'High',status:'Solved',title:'Need help',desc:'helpn needed',author:'Ayesha Khan',location:'Karachi',helpers:1,tags:[]},
    {id:2,category:'Web Development',urgency:'High',status:'Solved',title:'Need help making my portfolio responsive before demo day',desc:'My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.',author:'Sara Noor',location:'Karachi',helpers:1,tags:['HTML/CSS','Responsive','Portfolio']},
    {id:3,category:'Design',urgency:'Medium',status:'Open',title:'Looking for Figma feedback on a volunteer event poster',desc:'I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.',author:'Ayesha Khan',location:'Lahore',helpers:1,tags:['Figma','Poster','Design Review']},
    {id:4,category:'Career',urgency:'Low',status:'Solved',title:'Need mock interview support for internship applications',desc:'Applying to frontend internships and need someone to practice behavioral and technical interview questions with me.',author:'Sara Noor',location:'Remote',helpers:2,tags:['Interview Prep','Career','Frontend']}
  ],
  notifications:[
    {title:'"Need help" was marked as solved',meta:'Status • Just now',read:false},
    {title:'Ayesha Khan offered help on "Need help"',meta:'Match • Just now',read:false},
    {title:'Your request "Need help" is now live in the community feed',meta:'Request • Just now',read:false},
    {title:'"Need help making my portfolio responsive before demo day" was marked as solved',meta:'Status • Just now',read:false},
    {title:'"Need help making my portfolio responsive before demo day" was marked as solved',meta:'Status • Just now',read:false},
    {title:'"Need help making my portfolio responsive before demo day" was marked as solved',meta:'Status • Just now',read:false},
    {title:'New helper matched to your responsive portfolio request',meta:'Match • 12 min ago',read:false},
    {title:'Your trust score increased after a solved request',meta:'Reputation • 1 hr ago',read:false},
    {title:'AI Center detected rising demand for interview prep',meta:'Insight • Today',read:true}
  ],
  leaderboard:[
    {rank:1,name:'Ayesha Khan',initials:'AK',color:'teal',skills:'Figma, UI/UX, HTML/CSS',score:100,contribs:35,badges:['Design Ally','Fast Responder','Top Mentor'],barWidth:100},
    {rank:2,name:'Hassan Ali',initials:'HA',color:'dark',skills:'JavaScript, React, Git/GitHub',score:88,contribs:24,badges:['Code Rescuer','Bug Hunter'],barWidth:78},
    {rank:3,name:'Sara Noor',initials:'SN',color:'orange',skills:'Python, Data Analysis',score:74,contribs:11,badges:['Community Voice'],barWidth:55}
  ]
};

// ── Router ─────────────────────────────────────────────────
function navigateTo(page, data={}) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const target=document.getElementById('page-'+page);
  if(target){target.classList.add('active');state.currentPage=page;window.scrollTo(0,0);}
  updateNavActive(page);
  if(page==='detail'&&data.requestId!==undefined)renderDetailPage(data.requestId);
  if(page==='explore')renderExplorePage();
}

function updateNavActive(page) {
  document.querySelectorAll('.navbar__link,.mobile-nav__link').forEach(l=>{
    l.classList.toggle('active',l.dataset.page===page);
  });
}

// ── Toast ──────────────────────────────────────────────────
function showToast(msg) {
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// ── Build Request Card ─────────────────────────────────────
function buildRequestCard(r,showAction=false) {
  const catClass=r.category==='Web Development'?'web':r.category==='Design'?'design':'career';
  return `<div class="req-card" data-id="${r.id}">
    <div class="req-card__tags">
      <span class="tag tag--${catClass}">${r.category}</span>
      <span class="tag tag--${r.urgency.toLowerCase()}">${r.urgency}</span>
      <span class="tag tag--${r.status.toLowerCase()}">${r.status}</span>
    </div>
    <div class="req-card__title">${r.title}</div>
    ${r.desc?`<div class="req-card__desc">${r.desc}</div>`:''}
    ${r.tags&&r.tags.length?`<div class="req-card__sub-tags">${r.tags.map(t=>`<span class="tag tag--generic">${t}</span>`).join('')}</div>`:''}
    <div class="req-card__footer">
      <div class="req-card__meta"><strong>${r.author}</strong>${r.location} • ${r.helpers} helper${r.helpers!==1?'s':''} interested</div>
      ${showAction?'<span class="req-card__action">Open details →</span>':''}
    </div>
  </div>`;
}

function attachCards(container) {
  container.querySelectorAll('.req-card').forEach(card=>{
    card.addEventListener('click',()=>{
      const id=parseInt(card.dataset.id);
      navigateTo('detail',{requestId:id});
    });
  });
}

// ── Render Pages ───────────────────────────────────────────
function renderHomeRequests() {
  const g=document.getElementById('home-featured-grid');
  if(!g)return;
  g.innerHTML=state.requests.slice(0,3).map(r=>buildRequestCard(r,true)).join('');
  attachCards(g);
}

function renderDashboard() {
  const g=document.getElementById('dashboard-req-grid');
  if(!g)return;
  g.innerHTML=state.requests.slice(0,3).map(r=>buildRequestCard(r,true)).join('');
  attachCards(g);
}

function renderExplorePage() {
  const feed=document.getElementById('explore-feed');
  if(!feed)return;
  const cat=document.getElementById('filter-category');
  const urg=document.getElementById('filter-urgency');
  const loc=document.getElementById('filter-location');
  const catV=cat?cat.value:'';
  const urgV=urg?urg.value:'';
  const locV=loc?loc.value.toLowerCase():'';
  let filtered=state.requests.filter(r=>{
    if(catV&&r.category!==catV)return false;
    if(urgV&&r.urgency!==urgV)return false;
    if(locV&&!r.location.toLowerCase().includes(locV))return false;
    return true;
  });
  feed.innerHTML=filtered.length?filtered.map(r=>buildRequestCard(r,true)).join(''):'<p style="color:var(--color-text-muted);padding:20px 0;font-size:14px">No requests match your filters.</p>';
  attachCards(feed);
}

function renderAICenter() {
  const list=document.getElementById('ai-rec-list');
  if(!list)return;
  const recs=[
    {title:'Need help',desc:'Web Development request with high urgency. Best suited for members with relevant expertise.',tags:[{t:'Web Development',c:'web'},{t:'High',c:'high'}]},
    {title:'Need help making my portfolio responsive before demo day',desc:'Responsive layout issue with a short deadline. Best helpers are frontend mentors comfortable with CSS grids and media queries.',tags:[{t:'Web Development',c:'web'},{t:'High',c:'high'}]},
    {title:'Looking for Figma feedback on a volunteer event poster',desc:'A visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value.',tags:[{t:'Design',c:'design'},{t:'Medium',c:'medium'}]},
    {title:'Need mock interview support for internship applications',desc:'Career coaching request focused on confidence-building, behavioral answers, and entry-level frontend interviews.',tags:[{t:'Career',c:'career'},{t:'Low',c:'low'}]}
  ];
  list.innerHTML=recs.map(r=>`<div class="ai-rec-item"><div class="ai-rec-item__title">${r.title}</div><div class="ai-rec-item__desc">${r.desc}</div><div class="ai-rec-item__tags">${r.tags.map(t=>`<span class="tag tag--${t.c}">${t.t}</span>`).join('')}</div></div>`).join('');
}

function renderNotifications() {
  const feed=document.getElementById('notif-feed');
  if(!feed)return;
  feed.innerHTML=state.notifications.map((n,i)=>`
    <div class="notif-item" data-index="${i}">
      <div class="notif-item__body"><div class="notif-item__title">${n.title}</div><div class="notif-item__meta">${n.meta}</div></div>
      <span class="notif-badge ${n.read?'notif-badge--read':'notif-badge--unread'}">${n.read?'Read':'Unread'}</span>
    </div>`).join('');
  feed.querySelectorAll('.notif-item').forEach(item=>{
    item.addEventListener('click',()=>{
      state.notifications[parseInt(item.dataset.index)].read=true;
      renderNotifications();
    });
  });
}

function renderLeaderboard() {
  const rl=document.getElementById('rank-list');
  const bl=document.getElementById('badge-list');
  if(!rl||!bl)return;
  rl.innerHTML=state.leaderboard.map(m=>`
    <div class="rank-item">
      <div class="avatar avatar--${m.color}">${m.initials}</div>
      <div class="rank-item__info"><div class="rank-item__name">#${m.rank} ${m.name}</div><div class="rank-item__skills">${m.skills}</div></div>
      <div class="rank-item__stats"><div class="rank-item__score">${m.score}%</div><div class="rank-item__contribs">${m.contribs} contributions</div></div>
    </div>`).join('');
  bl.innerHTML=state.leaderboard.map(m=>`
    <div class="badge-item">
      <div class="badge-item__name">${m.name}</div>
      <div class="badge-item__badges">${m.badges.join(' • ')}</div>
      <div class="badge-bar"><div class="badge-bar__fill" style="width:${m.barWidth}%"></div></div>
    </div>`).join('');
}

function renderMessageStream() {
  const stream=document.getElementById('message-stream');
  if(!stream)return;
  stream.innerHTML=state.messages.map(m=>`
    <div class="message-item">
      <div class="message-item__body"><div class="message-item__from">${m.from} → ${m.to}</div><div class="message-item__text">${m.text}</div></div>
      <div class="message-item__time">${m.time}</div>
    </div>`).join('');
}

function renderDetailPage(id) {
  const req=state.requests.find(r=>r.id===id);
  if(!req)return;
  const catClass=req.category==='Web Development'?'web':req.category==='Design'?'design':'career';
  document.getElementById('detail-hero-tags').innerHTML=
    `<span class="tag tag--${catClass}">${req.category}</span>
     <span class="tag tag--${req.urgency.toLowerCase()}">${req.urgency}</span>
     <span class="tag tag--${req.status.toLowerCase()}">${req.status}</span>`;
  document.getElementById('detail-hero-title').textContent=req.title;
  document.getElementById('detail-hero-desc').textContent=req.desc;
  const summaries={
    1:'Web Development request with high urgency. Best suited for members with relevant expertise.',
    2:'Responsive layout issue with a short deadline. Best helpers are frontend mentors comfortable with CSS grids and media queries.',
    3:'A visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value.',
    4:'Career coaching request focused on confidence-building, behavioral answers, and entry-level frontend interviews.'
  };
  document.getElementById('detail-ai').textContent=summaries[req.id]||'AI analysis in progress...';
  document.getElementById('detail-helpers').innerHTML=state.leaderboard.slice(0,2).map(m=>`
    <div class="helper-card">
      <div class="avatar avatar--${m.color}">${m.initials}</div>
      <div class="helper-card__info"><div class="helper-card__name">${m.name}</div><div class="helper-card__skills">${m.skills}</div></div>
      <span class="trust-badge trust-badge--green">Trust ${m.score}%</span>
    </div>`).join('');
  document.getElementById('detail-can-help').onclick=()=>showToast('You offered to help! The requester will be notified.');
  document.getElementById('detail-solved').onclick=()=>{req.status='Solved';showToast('Request marked as solved!');navigateTo('explore');};
}

// ── Nav login swap ─────────────────────────────────────────
function swapNavToApp(user) {
  document.getElementById('nav-links').innerHTML=`
    <span class="navbar__link active" data-page="dashboard">Dashboard</span>
    <span class="navbar__link" data-page="explore">Explore</span>
    <span class="navbar__link" data-page="messages">Messages</span>
    <span class="navbar__link" data-page="notifications">Notifications</span>
    <span class="navbar__link" data-page="leaderboard">Leaderboard</span>
    <span class="navbar__link" data-page="ai-center">AI Center</span>
    <span class="navbar__link" data-page="profile">Profile</span>
    <span class="navbar__link" data-page="create">+ Request</span>`;
  document.getElementById('mobile-nav').innerHTML=`
    <span class="mobile-nav__link" data-page="dashboard">Dashboard</span>
    <span class="mobile-nav__link" data-page="explore">Explore</span>
    <span class="mobile-nav__link" data-page="messages">Messages</span>
    <span class="mobile-nav__link" data-page="notifications">Notifications</span>
    <span class="mobile-nav__link" data-page="leaderboard">Leaderboard</span>
    <span class="mobile-nav__link" data-page="ai-center">AI Center</span>
    <span class="mobile-nav__link" data-page="profile">Profile</span>
    <span class="mobile-nav__link" data-page="create">+ Request</span>`;
  document.getElementById('nav-actions').innerHTML=`
    <span style="font-size:14px;font-weight:600;color:var(--color-text-muted)">👋 ${user}</span>
    <button class="btn btn--outline" onclick="navigateTo('home')">← Home</button>`;
  attachNavListeners();
}

function attachNavListeners() {
  const mobileNav=document.getElementById('mobile-nav');
  document.querySelectorAll('.navbar__link,.mobile-nav__link').forEach(link=>{
    link.addEventListener('click',()=>{
      const page=link.dataset.page;
      if(page){navigateTo(page);mobileNav.classList.remove('open');}
    });
  });
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  // Hamburger
  const hamburger=document.getElementById('hamburger');
  const mobileNav=document.getElementById('mobile-nav');
  hamburger.addEventListener('click',()=>mobileNav.classList.toggle('open'));

  // Nav listeners
  attachNavListeners();

  // Logo
  document.querySelector('.navbar__brand').addEventListener('click',()=>navigateTo('home'));

  // Login
  document.getElementById('login-btn').addEventListener('click',()=>{
    const user=document.getElementById('login-user').value;
    state.currentUser=user;
    state.loggedIn=true;
    swapNavToApp(user);
    showToast('Welcome, '+user+'!');
    renderDashboard();
    navigateTo('dashboard');
  });

  // Send message
  document.getElementById('send-msg-btn').addEventListener('click',()=>{
    const text=document.getElementById('msg-input').value.trim();
    const to=document.getElementById('msg-to').value;
    if(!text){showToast('Please enter a message.');return;}
    const now=new Date();
    const time=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    state.messages.push({from:'You',to,text,time});
    renderMessageStream();
    document.getElementById('msg-input').value='';
    showToast('Message sent!');
  });

  // AI suggestions
  document.getElementById('cr-ai-btn').addEventListener('click',()=>{
    const ti=document.getElementById('cr-title');
    if(!ti.value)ti.value='Need help with my JavaScript project';
    document.getElementById('cr-category').value='Web Development';
    document.getElementById('cr-urgency').value='High';
    document.getElementById('hint-category').textContent='Web Development';
    document.getElementById('hint-urgency').textContent='High';
    showToast('AI suggestions applied!');
  });

  // Category/urgency sync
  document.getElementById('cr-category').addEventListener('change',e=>{document.getElementById('hint-category').textContent=e.target.value||'Community';});
  document.getElementById('cr-urgency').addEventListener('change',e=>{document.getElementById('hint-urgency').textContent=e.target.value||'Low';});

  // Publish request
  document.getElementById('cr-publish-btn').addEventListener('click',()=>{
    const title=document.getElementById('cr-title').value.trim();
    const desc=document.getElementById('cr-desc').value.trim();
    const category=document.getElementById('cr-category').value;
    const urgency=document.getElementById('cr-urgency').value;
    if(!title){showToast('Please add a title.');return;}
    state.requests.unshift({id:state.requests.length+1,category:category||'General',urgency,status:'Open',title,desc:desc||'No description provided.',author:state.currentUser||'You',location:'Islamabad',helpers:0,tags:[]});
    showToast('Request published successfully!');
    navigateTo('explore');
  });

  // Explore filters
  ['filter-category','filter-urgency'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.addEventListener('change',renderExplorePage);
  });
  ['filter-location','filter-skills'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.addEventListener('input',renderExplorePage);
  });

  // Render all
  renderHomeRequests();
  renderExplorePage();
  renderAICenter();
  renderNotifications();
  renderLeaderboard();
  renderMessageStream();
});
