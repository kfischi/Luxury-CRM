// Utils: CSV export + storage
window.CRM = window.CRM || {};
(function(){
  const KEY = 'luxury_clients';

  function toCSV(rows){
    if(!rows?.length) return '';
    const headers = Object.keys(rows[0]);
    const esc = v => ('"'+ String(v ?? '').replace(/"/g, '""') + '"');
    const lines = [headers.map(esc).join(',')];
    for(const r of rows){ lines.push(headers.map(h=>esc(r[h])).join(',')); }
    return lines.join('\n');
  }

  function saveLocal(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
  function loadLocal(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(e){ return []; } }

  function exportCSV(rows){
    const csv = toCSV(rows || loadLocal());
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'clients.csv';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  window.CRM.toCSV = toCSV;
  window.CRM.saveLocal = saveLocal;
  window.CRM.loadLocal = loadLocal;
  window.CRM.exportCSV = exportCSV;
})();
