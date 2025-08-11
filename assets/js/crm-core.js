// CRM Core with Hybrid Smart Mode (Supabase auto-detect), demo data, DnD fix, revenue stats
window.CRM = window.CRM || {};
(function(){
  const ns = window.CRM;
  ns.state = { clients: [], filters:{ text:'', region:'', source:'', status:'' } };

  // --- Smart Supabase configuration (per spec) ---
  const SUPABASE_URL = 'https://jwgumccuvvvqzskqutmg.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3Z3VtY2N1dnZ2cXpza3F1dG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTc1NDQsImV4cCI6MjA3MDM3MzU0NH0.pypaRytqdgp7OOp4KC1b36bDUOvl5btkOZr0aH6uFLw';

  const isDemoCredentials = SUPABASE_URL.includes('jwgumccuvvvqzskqutmg') || SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE';
  const useSupabase = !isDemoCredentials && SUPABASE_URL && SUPABASE_KEY && typeof window.supabase !== 'undefined';

  let supabase = null;
  if (useSupabase) {
    try {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('🌟 Supabase connected - Production mode');
    } catch (error) {
      console.warn('⚠️ Supabase connection failed, falling back to localStorage'); supabase = null;
    }
  } else {
    console.log('📦 Demo mode - Using localStorage');
    console.log('💡 To enable Supabase: Replace SUPABASE_URL and SUPABASE_KEY with your credentials');
  }

  // --- Storage helpers ---
  const loadLocal = window.CRM.loadLocal;
  const saveLocal = window.CRM.saveLocal;

  // --- Source save (Supabase or local) ---
  async function saveClientToSource(client){
    client.updated_at = new Date().toISOString();
    if (supabase){
      try{
        const { error } = await supabase.from('clients').upsert(client);
        if (error) throw error;
      }catch(e){
        console.warn('Supabase save failed, local fallback', e.message);
      }
    }
    // Always mirror local for demo friendliness
    const list = ns.state.clients.slice();
    const idx = list.findIndex(c=>c.id===client.id);
    if (idx>=0) list[idx]=client; else list.unshift(client);
    ns.state.clients = list;
    saveLocal(list);
    return true;
  }
  ns.saveClientToSource = saveClientToSource;

  // --- Demo Data (per spec) ---
  async function addDemoData() {
    const demoClients = [
      { id:'demo1', name:'יוסי ומירי כהן', phone:'050-1234567', email:'yossi.cohen@example.com', city:'תל אביב', event_type:'wedding', event_date:'2024-06-15', guests:120, preferred_region:'center', budget:'35000-50000', status:'new_lead', priority:'high', source:'facebook', notes:'מעוניינים בוילה עם בריכה לחתונה אינטימית. התקשרו 3 פעמים השבוע.', follow_up:new Date(Date.now()+2*24*60*60*1000).toISOString(), created_at:new Date(Date.now()-2*24*60*60*1000).toISOString(), updated_at:new Date().toISOString() },
      { id:'demo2', name:'משפחת לוי', phone:'052-7654321', email:'levi.family@example.com', city:'חיפה', event_type:'bar_mitzvah', event_date:'2024-05-20', guests:80, preferred_region:'north', budget:'20000-35000', status:'negotiation', priority:'medium', source:'website', notes:'בר מצווה לבן. מחפשים מקום עם חדר אוכל גדול. שלחנו הצעת מחיר.', created_at:new Date(Date.now()-5*24*60*60*1000).toISOString(), updated_at:new Date().toISOString() },
      { id:'demo3', name:'שרה גולדשטיין', phone:'054-9876543', email:'sarah.gold@example.com', city:'ירושלים', event_type:'birthday', event_date:'2024-04-10', guests:50, preferred_region:'jerusalem', budget:'10000-20000', status:'booked', priority:'low', source:'referral', notes:'יום הולדת 50 - הזמינה וילה בירושלים. שולמה מקדמה.', created_at:new Date(Date.now()-10*24*60*60*1000).toISOString(), updated_at:new Date().toISOString() },
      { id:'demo4', name:'אבי ורונית דוד', phone:'053-5555555', email:'avi.david@example.com', city:'הרצליה', event_type:'corporate', event_date:'2024-07-25', guests:200, preferred_region:'center', budget:'50000+', status:'pending', priority:'high', source:'google', notes:'אירוע חברה שנתי. מחכים לאישור דירקטוריון.', created_at:new Date(Date.now()-1*24*60*60*1000).toISOString(), updated_at:new Date().toISOString() },
      { id:'demo5', name:'משפחת רוזנברג', phone:'058-1111111', email:'rosenberg@example.com', city:'בת ים', event_type:'family', event_date:'2024-03-15', guests:30, preferred_region:'center', budget:'5000-10000', status:'completed', priority:'low', source:'referral', notes:'אירוע משפחתי - התקיים בהצלחה! לקוחות מרוצים מאוד.', created_at:new Date(Date.now()-20*24*60*60*1000).toISOString(), updated_at:new Date().toISOString() },
      { id:'demo6', name:'דניאל ושירה מזרחי', phone:'050-8888888', email:'mizrahi@example.com', city:'רעננה', event_type:'vacation', event_date:'2024-09-01', guests:15, preferred_region:'north', budget:'25000-35000', status:'cancelled', priority:'medium', source:'instagram', notes:'בוטל בגלל נסיבות משפחתיות. לשמור על קשר.', created_at:new Date(Date.now()-7*24*60*60*1000).toISOString(), updated_at:new Date().toISOString() }
    ];
    for (const client of demoClients) { await saveClientToSource(client); }
    ns.state.clients = demoClients;
    console.log('✅ Demo data loaded:', ns.state.clients.length, 'clients');
  }

  // --- Revenue & currency (per spec) ---
  function calculateRevenue() {
    return ns.state.clients
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => {
        const budgetStr = c.budget?.split('-')[0]?.replace(/[^\d]/g, '') || '0';
        const budgetNum = parseInt(budgetStr) || 0;
        return sum + (budgetNum * 0.15); // 15% commission
      }, 0);
  }
  function formatCurrency(amount) {
    if (!amount || isNaN(amount)) return '₪0';
    return new Intl.NumberFormat('he-IL', { style:'currency', currency:'ILS', minimumFractionDigits:0, maximumFractionDigits:0 }).format(amount);
  }
  ns.calculateRevenue = calculateRevenue;
  ns.formatCurrency = formatCurrency;

  // --- Kanban rendering ---
  function columnTemplate(key, title){
    return `<div class="kanban-column" data-status="${key}" ondragover="event.preventDefault()" ondrop="window.CRM.onDrop(event, '${key}')">
      <div class="kanban-title"><strong>${title}</strong> <span class="badge" id="count-${key}">0</span></div>
      <div class="kanban-list" data-list="${key}"></div>
    </div>`;
  }
  function cardTemplate(c){
    const dateStr = c.event_date ? new Date(c.event_date).toLocaleDateString('he-IL') : '—';
    return `<article class="card" draggable="true" data-id="${c.id}">
      <div class="name">${c.name || 'ללא שם'} <span class="badge">${c.priority || 'medium'}</span></div>
      <div class="meta">
        ${c.phone ? `<span>📞 ${c.phone}</span>`:''}
        ${c.email ? `<span>✉ ${c.email}</span>`:''}
        ${c.preferred_region ? `<span>📍 ${c.preferred_region}</span>`:''}
        <span>📅 ${dateStr}</span>
      </div>
      ${c.notes ? `<div class="notes">${c.notes}</div>`:''}
      <div class="meta">
        <button class="btn mini" data-action="whatsapp">WhatsApp</button>
        <button class="btn mini" data-action="email">Email</button>
        <button class="btn mini" data-action="call">טלפון</button>
        <button class="btn mini" data-action="edit">עריכה</button>
      </div>
    </article>`;
  }
  function renderColumns(){
    const statuses = window.CRM_SETTINGS.CLIENT_STATUSES;
    const wrap = document.getElementById('kanban');
    wrap.innerHTML = Object.entries(statuses).map(([k,v])=>columnTemplate(k,v)).join('');
  }
  function renderCards(){
    document.querySelectorAll('.kanban-list').forEach(n=>n.innerHTML='');
    const list = filterClients();
    const counts = {};
    for(const c of list){
      const container = document.querySelector(`[data-list="${c.status}"]`);
      if (!container) continue;
      container.insertAdjacentHTML('beforeend', cardTemplate(c));
      counts[c.status] = (counts[c.status]||0)+1;
    }
    bindCardEvents();
    // update counters
    for(const [k] of Object.entries(window.CRM_SETTINGS.CLIENT_STATUSES)){
      const el = document.getElementById('count-'+k);
      if (el) el.textContent = counts[k]||0;
    }
  }
  function bindCardEvents(){
    document.querySelectorAll('.card').forEach(card=>{
      card.addEventListener('dragstart', e=> e.dataTransfer.setData('text/plain', card.dataset.id));
      card.querySelector('[data-action="whatsapp"]').onclick = (e)=>{
        const c = getClientById(e.target.closest('.card').dataset.id);
        ns.comms.openWhatsApp(c.phone);
      };
      card.querySelector('[data-action="email"]').onclick = (e)=>{
        const c = getClientById(e.target.closest('.card').dataset.id);
        ns.comms.sendEmail(c.email, c.name);
      };
      card.querySelector('[data-action="call"]').onclick = (e)=>{
        const c = getClientById(e.target.closest('.card').dataset.id);
        ns.comms.makeCall(c.phone);
      };
      card.querySelector('[data-action="edit"]').onclick = (e)=>{
        const id = e.target.closest('.card').dataset.id;
        openEditModal(id);
      };
    });
  }

  // --- Drag & Drop fix (per spec) ---
  async function onDrop(ev, newStatus) {
    ev.preventDefault();
    try {
      const clientId = ev.dataTransfer.getData('text/plain');
      if (!clientId) { console.warn('No client ID in drag data'); return; }
      const idx = ns.state.clients.findIndex(c => c.id === clientId);
      if (idx < 0) { console.warn('Client not found:', clientId); return; }
      const oldStatus = ns.state.clients[idx].status;
      ns.state.clients[idx].status = newStatus;
      ns.state.clients[idx].updated_at = new Date().toISOString();
      await saveClientToSource(ns.state.clients[idx]);
      localStorage.setItem('luxury_clients', JSON.stringify(ns.state.clients));
      renderAll();
      showToast(`סטטוס עודכן מ"${getStatusLabel(oldStatus)}" ל"${getStatusLabel(newStatus)}"`);
    } catch (error) {
      console.error('Error in drag and drop:', error);
      showToast('שגיאה בעדכון הסטטוס', 'error');
    }
  }
  ns.onDrop = onDrop;

  function getStatusLabel(status) {
    const labels = {
      new_lead: 'ליד חדש', negotiation: 'משא ומתן', pending: 'מחכה לאישור',
      booked: 'הזמנה פעילה', completed: 'הושלם', cancelled: 'בוטל'
    };
    return labels[status] || status;
  }
  function showToast(msg, type){ if (ns.notify) (ns.notify[type||'success']||ns.notify.success)(msg); }

  // --- Filters & search ---
  function filterClients(){
    const { text, region, source, status } = ns.state.filters;
    return ns.state.clients.filter(c=>{
      const t = ((c.name||'')+' '+(c.phone||'')+' '+(c.email||'')+' '+(c.city||'')+' '+(c.notes||'')).toLowerCase();
      return (!text || t.includes(text.toLowerCase())) &&
             (!region || c.preferred_region===region) &&
             (!source || c.source===source) &&
             (!status || c.status===status);
    });
  }

  // --- Stats (per spec, includes revenue) ---
  function renderStats() {
    const stats = {
      new_lead: ns.state.clients.filter(c => c.status === 'new_lead').length,
      negotiation: ns.state.clients.filter(c => c.status === 'negotiation').length,
      pending: ns.state.clients.filter(c => c.status === 'pending').length,
      booked: ns.state.clients.filter(c => c.status === 'booked').length,
      completed: ns.state.clients.filter(c => c.status === 'completed').length,
      cancelled: ns.state.clients.filter(c => c.status === 'cancelled').length
    };
    const revenue = calculateRevenue();
    // Update DOM
    const byId = (id,val)=>{ const el = document.getElementById(id); if (el) el.textContent = val; };
    byId('statNewLeads', stats.new_lead);
    byId('statNegotiation', stats.negotiation);
    byId('statPending', stats.pending);
    byId('statBooked', stats.booked);
    byId('statCompleted', stats.completed);
    byId('statRevenue', formatCurrency(revenue));
    // Update Kanban counters (also done in renderCards)
    Object.keys(stats).forEach(status=>{
      const counter = document.getElementById(`count-${status}`);
      if (counter) counter.textContent = stats[status];
    });
    // Chart
    if (window.CRM.renderChart) window.CRM.renderChart(stats);
  }
  ns.renderStats = renderStats;

  function renderAll(){
    renderStats();
    renderColumns();
    renderCards();
  }

  // --- Modal edit/add ---
  function openEditModal(id){
    const c = getClientById(id);
    const html = `<h3 style="margin:0 0 8px">עריכת לקוח</h3>
      <div class="grid-2">
        <label>שם<input value="${c.name||''}" id="f_name" class="input glass"></label>
        <label>טלפון<input value="${c.phone||''}" id="f_phone" class="input glass"></label>
        <label>אימייל<input value="${c.email||''}" id="f_email" class="input glass"></label>
        <label>אזור מועדף<input value="${c.preferred_region||''}" id="f_region" class="input glass"></label>
        <label>סטטוס
          <select id="f_status" class="input glass">
            ${Object.entries(window.CRM_SETTINGS.CLIENT_STATUSES).map(([k,v])=>`<option ${c.status===k?'selected':''} value="${k}">${v}</option>`).join('')}
          </select>
        </label>
        <label>עדיפות
          <select id="f_priority" class="input glass">
            ${['low','medium','high','vip'].map(p=>`<option ${c.priority===p?'selected':''}>${p}</option>`).join('')}
          </select>
        </label>
      </div>
      <label>הערות<textarea id="f_notes" rows="4" class="input glass">${c.notes||''}</textarea></label>
      <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:10px">
        <button class="btn" id="btnClose">ביטול</button>
        <button class="btn primary" id="btnSave">שמירה</button>
      </div>`;
    ns.modal.open(html);
    document.getElementById('btnClose').onclick = ns.modal.close;
    document.getElementById('btnSave').onclick = async ()=>{
      const patch = {
        name: document.getElementById('f_name').value,
        phone: document.getElementById('f_phone').value,
        email: document.getElementById('f_email').value,
        preferred_region: document.getElementById('f_region').value,
        status: document.getElementById('f_status').value,
        priority: document.getElementById('f_priority').value,
        notes: document.getElementById('f_notes').value,
        updated_at: new Date().toISOString()
      };
      await saveClientToSource({ ...c, ...patch });
      ns.modal.close();
      renderAll();
      ns.notify.success('עודכן בהצלחה');
    };
  }
  function openAddModal(){
    const html = `<h3 style="margin:0 0 8px">לקוח חדש</h3>
      <div class="grid-2">
        <label>שם<input id="a_name" class="input glass"></label>
        <label>טלפון<input id="a_phone" class="input glass"></label>
        <label>אימייל<input id="a_email" class="input glass"></label>
        <label>אזור מועדף<input id="a_region" class="input glass"></label>
        <label>סטטוס
          <select id="a_status" class="input glass">
            ${Object.entries(window.CRM_SETTINGS.CLIENT_STATUSES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
          </select>
        </label>
        <label>עדיפות
          <select id="a_priority" class="input glass">
            <option>low</option><option selected>medium</option><option>high</option><option>vip</option>
          </select>
        </label>
      </div>
      <label>הערות<textarea id="a_notes" rows="4" class="input glass"></textarea></label>
      <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:10px">
        <button class="btn" id="btnClose">ביטול</button>
        <button class="btn primary" id="btnSave">הוספה</button>
      </div>`;
    ns.modal.open(html);
    document.getElementById('btnClose').onclick = ns.modal.close;
    document.getElementById('btnSave').onclick = async ()=>{
      const payload = {
        id: crypto.randomUUID(),
        name: document.getElementById('a_name').value,
        phone: document.getElementById('a_phone').value,
        email: document.getElementById('a_email').value,
        preferred_region: document.getElementById('a_region').value,
        status: document.getElementById('a_status').value,
        priority: document.getElementById('a_priority').value,
        created_at: new Date().toISOString()
      };
      await saveClientToSource(payload);
      ns.modal.close();
      renderAll();
      ns.notify.success('נוסף!');
    };
  }

  function getClientById(id){ return ns.state.clients.find(x=>x.id===id); }

  // --- Bind UI ---
  function bindUI(){
    const q = document.getElementById('globalSearch');
    const region = document.getElementById('regionFilter');
    const source = document.getElementById('sourceFilter');
    const btnAdd = document.getElementById('btnAddClient');
    const btnExport = document.getElementById('btnExport');
    const fab = document.getElementById('fabQuickActions');
    const fabWrap = document.querySelector('.fab-wrap');
    const fabMenu = document.getElementById('fabMenu');

    q.addEventListener('input', ()=>{ ns.state.filters.text = q.value; renderAll(); });
    region.addEventListener('change', ()=>{ ns.state.filters.region = region.value; renderAll(); });
    source.addEventListener('change', ()=>{ ns.state.filters.source = source.value; renderAll(); });

    document.querySelectorAll('.stat-card').forEach(card=>{
      card.addEventListener('click', ()=>{
        const s = card.dataset.filter || '';
        ns.state.filters.status = s;
        renderAll();
      });
    });

    btnAdd.addEventListener('click', openAddModal);
    btnExport.addEventListener('click', ()=> window.CRM.exportCSV(filterClients()));

    fab.addEventListener('click', ()=>{ fabWrap.classList.toggle('open'); });
    fabMenu.querySelector('[data-action="quick-whatsapp"]').onclick = ()=>{
      const c = ns.state.clients[0]; if (!c) return;
      ns.comms.openWhatsApp(c.phone);
    };
    fabMenu.querySelector('[data-action="quick-email"]').onclick = ()=>{
      const c = ns.state.clients[0]; if (!c) return;
      ns.comms.sendEmail(c.email, c.name);
    };
    fabMenu.querySelector('[data-action="quick-call"]').onclick = ()=>{
      const c = ns.state.clients[0]; if (!c) return;
      ns.comms.makeCall(c.phone);
    };

    // PWA install
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e)=>{
      e.preventDefault();
      deferredPrompt = e;
      const btn = document.getElementById('btnInstallPWA');
      btn.hidden = false;
      btn.onclick = async ()=>{
        btn.hidden = true; deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        ns.notify.info(outcome === 'accepted' ? 'הותקנה בהצלחה' : 'בוטל');
        deferredPrompt = null;
      };
    });
  }

  // --- Boot ---
  window.addEventListener('DOMContentLoaded', async ()=>{
    bindUI();
    renderColumns();
    // load local or add demo
    const local = loadLocal();
    ns.state.clients = local.length ? local : [];
    if (!local.length) { await addDemoData(); }
    renderAll();
  });
})();
