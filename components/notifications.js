// Toast notifications
window.CRM = window.CRM || {};
(function(){
  const root = document.getElementById('toasts');
  function show(msg, type='success', timeout=3200){
    const el = document.createElement('div');
    el.className = 'toast ' + (type||'success');
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; setTimeout(()=>el.remove(), 350); }, timeout);
  }
  window.CRM.notify = {
    success: (m)=>show(m,'success'),
    error: (m)=>show(m,'error'),
    info: (m)=>show(m,'info')
  };
})();
