// Communication helpers (WhatsApp, Email, Phone) with toasts
window.CRM = window.CRM || {};
(function(){
  function showToast(msg, type='success'){
    if (window.CRM && window.CRM.notify) {
      const fn = window.CRM.notify[type] || window.CRM.notify.success;
      fn(msg);
    } else {
      console[type === 'error' ? 'error' : 'log'](msg);
    }
  }

  function openWhatsApp(phone) {
    if (!phone) { showToast('מספר טלפון חסר', 'error'); return; }
    const cleanPhone = String(phone).replace(/\D/g, '');
    const israelPhone = cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone;
    const message = encodeURIComponent('שלום! אני מתקשר/ת בנוגע לאירוע שלכם. אשמח לדבר איתכם על האפשרויות שלנו.');
    const url = `https://wa.me/972${israelPhone}?text=${message}`;
    window.open(url, '_blank');
    showToast('נפתח WhatsApp');
  }

  function sendEmail(email, clientName='לקוח/ה יקר/ה') {
    if (!email) { showToast('כתובת אימייל חסרה', 'error'); return; }
    const subject = encodeURIComponent(`בנוגע לאירוע שלכם - ${clientName}`);
    const body = encodeURIComponent(`שלום ${clientName},

תודה על פנייתכם אלינו. אנו מתמחים בצימרים ווילות יוקרה לאירועים מיוחדים.

אשמח לספר לכם על האפשרויות המדהימות שלנו ולעזור לכם ליצור אירוע בלתי נשכח.

אנא צרו איתי קשר בטלפון או ענו למייל זה ונקבע פגישה.

בברכה,
צוות LuxuryStays`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
    showToast('נפתח מייל');
  }

  function makeCall(phone) {
    if (!phone) { showToast('מספר טלפון חסר', 'error'); return; }
    window.open(`tel:${phone}`, '_self');
    showToast('מתקשר...');
  }

  window.CRM.comms = { openWhatsApp, sendEmail, makeCall };
})();
