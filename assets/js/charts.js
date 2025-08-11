// Charts: render KPI bar by statuses
window.CRM = window.CRM || {};
(function(){
  let chart;
  function renderChart(stats){
    const ctx = document.getElementById('kpiChart');
    if(!ctx) return;
    const labels = ['ליד חדש','משא ומתן','מחכה לאישור','הזמנה פעילה','הושלם','בוטל'];
    const data = [stats.new_lead, stats.negotiation, stats.pending, stats.booked, stats.completed, stats.cancelled];
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type:'bar',
      data:{ labels, datasets:[{ label:'לידים לפי סטטוס', data }]},
      options:{ responsive:true, plugins:{ legend:{ display:false }}, scales:{ y:{ beginAtZero:true } } }
    });
  }
  window.CRM.renderChart = renderChart;
})();
