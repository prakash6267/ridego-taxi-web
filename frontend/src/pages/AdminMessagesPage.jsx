import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { adminApi } from '../api/adminApi';

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msgId) => {
    try {
      await adminApi.toggleMessageRead(msgId);
      fetchMessages();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Customer Inquiries & Messages</h1>
        <p className="text-xs text-slate-500 mt-1">Inbound queries received through the public contact form</p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Loading inquiries...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
          No customer inquiries received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-3xl border transition-all shadow-sm ${
                msg.is_read ? 'bg-white border-slate-200' : 'bg-amber-500/5 border-amber-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs">
                    {msg.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{msg.name}</h3>
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {msg.email}</span>
                      {msg.phone && <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> +91 {msg.phone}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-slate-400">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleToggleRead(msg.id)}
                    className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase transition-colors ${
                      msg.is_read
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-amber-400 text-slate-950 hover:bg-amber-500'
                    }`}
                  >
                    {msg.is_read ? 'Mark Unread' : 'Mark as Read'}
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <span className="text-xs font-bold text-amber-700 uppercase">{msg.subject}</span>
                <p className="text-xs text-slate-700 leading-relaxed">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessagesPage;
