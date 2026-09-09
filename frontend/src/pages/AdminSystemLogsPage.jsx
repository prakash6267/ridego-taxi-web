import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle2, ShieldAlert, Filter, Search, 
  Trash2, RefreshCw, Eye, MessageSquare, Check, X, ShieldCheck, Loader2 
} from 'lucide-react';
import { adminApi } from '../api/adminApi';

const AdminSystemLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [resolvedFilter, setResolvedFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Resolve Modal
  const [selectedLog, setSelectedLog] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (severityFilter !== 'ALL') params.severity = severityFilter;
      if (moduleFilter !== 'ALL') params.module = moduleFilter;
      if (resolvedFilter === 'RESOLVED') params.is_resolved = true;
      if (resolvedFilter === 'UNRESOLVED') params.is_resolved = false;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const [logsData, statsData] = await Promise.all([
        adminApi.getSystemLogs(params),
        adminApi.getLogStats()
      ]);
      setLogs(logsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching system logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [severityFilter, moduleFilter, resolvedFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleOpenResolveModal = (log) => {
    setSelectedLog(log);
    setAdminNote(log.admin_notes || '');
  };

  const handleSaveResolution = async (isResolved) => {
    if (!selectedLog) return;
    setUpdating(true);
    try {
      await adminApi.resolveLog(selectedLog.id, {
        is_resolved: isResolved,
        admin_notes: adminNote
      });
      setSelectedLog(null);
      fetchLogs();
    } catch (err) {
      alert('Error updating log: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleArchive = async () => {
    if (!window.confirm('Clear and archive all resolved logs from the database?')) return;
    try {
      const res = await adminApi.archiveLogs();
      alert(res.message);
      fetchLogs();
    } catch (err) {
      alert('Archive failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">System Logs & Problem Tracker</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time backend exception logs, request correlation IDs, and issue resolution
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLogs}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleArchive}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Archive Resolved</span>
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Captured</span>
          <p className="text-2xl font-black text-slate-900">{stats?.total_logs || 0}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-2xl border border-red-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-red-500">Unresolved Issues</span>
          <p className="text-2xl font-black text-red-600">{stats?.unresolved_errors || 0}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-amber-600">Critical Alerts</span>
          <p className="text-2xl font-black text-amber-700">{stats?.critical_errors || 0}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-blue-500">Warnings</span>
          <p className="text-2xl font-black text-blue-600">{stats?.warning_count || 0}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Severity:</span>
            {['ALL', 'CRITICAL', 'ERROR', 'WARNING', 'INFO'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                  severityFilter === sev
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <select
              value={resolvedFilter}
              onChange={(e) => setResolvedFilter(e.target.value)}
              className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
            >
              <option value="ALL">All Status</option>
              <option value="UNRESOLVED">Unresolved Only</option>
              <option value="RESOLVED">Resolved Only</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 pt-2 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search error message, endpoint, or Correlation ID..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Timestamp & ID</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Module & Endpoint</th>
                <th className="p-4">Error Summary</th>
                <th className="p-4">Resolution Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    <span>Loading system logs...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    No system logs found matching criteria. System is operating normally.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono">
                      <span className="font-bold text-slate-900 block text-xs">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-slate-400" title={log.correlation_id}>
                        {log.correlation_id?.substring(0, 16)}...
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        log.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                        log.severity === 'ERROR' ? 'bg-red-100 text-red-700' :
                        log.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 uppercase text-[10px] block">{log.module}</span>
                      <span className="font-mono text-slate-500 text-[11px] truncate max-w-xs block">
                        {log.endpoint || '-'} {log.http_status && `(${log.http_status})`}
                      </span>
                    </td>
                    <td className="p-4 max-w-md">
                      <p className="font-medium text-slate-800 line-clamp-2" title={log.error_message}>
                        {log.error_message}
                      </p>
                      {log.admin_notes && (
                        <p className="text-[10px] text-emerald-700 mt-1 font-semibold">
                          Note: {log.admin_notes}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      {log.is_resolved ? (
                        <span className="flex items-center text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" /> Resolved
                        </span>
                      ) : (
                        <span className="flex items-center text-xs font-bold text-red-600">
                          <AlertTriangle className="w-4 h-4 mr-1 text-red-500" /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenResolveModal(log)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-400 hover:text-slate-950 text-slate-700 font-bold text-xs transition-colors"
                      >
                        Inspect / Resolve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect & Resolve Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <span>Log Details (Correlation ID: {selectedLog.correlation_id || 'N/A'})</span>
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl">
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Module & Endpoint:</span>
                  <span className="font-semibold text-slate-800">{selectedLog.module} → {selectedLog.endpoint}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Timestamp & Status:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedLog.timestamp).toLocaleString()} (HTTP {selectedLog.http_status || 'N/A'})
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block font-bold uppercase text-[10px] mb-1">Sanitized Error Message:</span>
                <div className="p-3 bg-red-50 text-red-900 font-mono text-xs rounded-xl border border-red-100 whitespace-pre-wrap">
                  {selectedLog.error_message}
                </div>
              </div>

              {selectedLog.stack_trace && (
                <div>
                  <span className="text-slate-500 block font-bold uppercase text-[10px] mb-1">Stack Trace:</span>
                  <pre className="p-3 bg-slate-900 text-slate-200 font-mono text-[10px] rounded-xl overflow-x-auto max-h-40">
                    {selectedLog.stack_trace}
                  </pre>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1.5">
                  Resolution Notes (Admin Audit):
                </label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. OSRM routing timeout resolved by fallback calculation / database restarted..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleSaveResolution(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                  >
                    Mark Unresolved
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleSaveResolution(true)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md"
                  >
                    {updating ? 'Saving...' : 'Mark as Resolved'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSystemLogsPage;
