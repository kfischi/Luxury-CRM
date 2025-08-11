// Simple modal
window.CRM = window.CRM || {};
(function(){
  const root = document.getElementById('modalRoot');
  function open(html){
    const overlay = document.createElement('div');
    overlay.style.position='fixed'; overlay.style.inset='0';
    overlay.style.background='rgba(5,8,16,.55)'; overlay.style.backdropFilter='blur(8px)';
    overlay.style.display='grid'; overlay.style.placeItems='center'; overlay.style.padding='20px';
    overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
    const box = document.createElement('div');
    box.className='glass'; box.style.maxWidth='560px'; box.style.width='100%'; box.style.padding='16px';
    box.innerHTML = html;
    overlay.appendChild(box);
    root.replaceChildren(overlay);
  }
  function close(){ root.replaceChildren(); }
  window.CRM.modal = { open, close };
})();

