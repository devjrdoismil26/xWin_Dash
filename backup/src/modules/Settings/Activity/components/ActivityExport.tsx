import React from 'react';
export function ActivityExport({ activities = [] }) {
  const exportToCSV = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Description', 'IP'];
    const rows = activities.map((a) => [
      a.created_at || '',
      a.user?.name || 'Sistema',
      a.action || '',
      a.description || '',
      a.ip || '',
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  const exportToJSON = () => {
    const jsonContent = JSON.stringify(activities, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-log-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };
  return (
    <div className="flex gap-2">
      <button onClick={exportToCSV} className="px-3 py-2 border rounded">Export CSV</button>
      <button onClick={exportToJSON} className="px-3 py-2 border rounded">Export JSON</button>
    </div>
  );
}
export default ActivityExport;
