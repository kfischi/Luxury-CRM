# 🏖️ LuxuryStays CRM — Hybrid Smart Mode

פרונטאנד CRM פרימיום (Glass Morphism + Kanban + PWA + Chart.js). עובד מיד ב‑Demo (LocalStorage), ומתחבר אוטומטית ל‑Supabase כשמחליפים Credentials.

## ✨ מה בפנים
- Hybrid Smart Mode ל‑Supabase (זיהוי דמו/פרודקשן אוטומטי)
- Kanban עם Drag & Drop מתוקן
- סטטיסטיקות + הכנסות (עמלה 15%) + גרף Chart.js
- Modal, חיפוש, יצוא CSV, Toasts
- PWA: manifest + service-worker

## ⚙️ שימוש מהיר
פתחו `index.html`. אם אין נתונים — נטען Demo data אוטומטית.
- דמו: רואים בקונסול “Demo mode - Using localStorage”
- פרודקשן: ערכו את ה‑URL/KEY בקובץ `assets/js/crm-core.js` → הכל יעבוד עם Supabase

## 🧠 סטטוסים
`new_lead, negotiation, pending, booked, completed, cancelled`

## 🧪 בדיקות מהירות
- גרירה בין עמודות → סטטוס מתעדכן + טוסט הצלחה
- “＋ לקוח חדש” → פתיחת מודאל, שמירה
- חיפוש/סינון → עידכון כרטיסים וסטטיסטיקות
- “⬇ יצוא CSV” → קובץ נתונים מסוננים

## 📦 פריסה
- GitHub Pages: דחפו את התיקייה / הפעילו Pages. ודאו ש‑`start_url` נכון.
- HTTPS נדרש ל‑PWA מלא.

MIT © 2025
