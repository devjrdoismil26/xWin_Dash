import React from 'react';

interface Activity {
  created_at?: string;
  user?: { name?: string;
};

  action?: string;
  description?: string;
  ip?: string;
}

interface ActivityExportProps {
  activities?: Activity[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export function ActivityExport({ activities = [] as unknown[] }: ActivityExportProps) {
  const exportToCSV = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Description', 'IP'];
    const rows = (activities || []).map((a: unknown) => [
      a.created_at || '',
      a.user?.name || 'Sistema',
      a.action || '',
      a.description || '',
      a.ip || '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row: unknown) => (row || []).map((field: unknown) => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();};

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(activities, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = `activity-log-${new Date().toISOString().split('T')[0]}.json`;
    link.click();};

  return (
            <div className=" ">$2</div><button onClick={exportToCSV} className="px-3 py-2 border rounded">Export CSV</button>
      <button onClick={exportToJSON} className="px-3 py-2 border rounded">Export JSON</button>
    </div>);

}
export default ActivityExport;
