'use client';

import { useState } from 'react';
import { markMessageRead, deleteMessage } from '@/app/actions/admin/content';
import { Mail, CheckCircle, Trash2, Calendar, Phone, User, MessageSquare } from 'lucide-react';

export default function MessageList({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState(null);

  const selectedMessage = messages.find(m => m.id === selectedId);

  const handleRead = async (id) => {
    const res = await markMessageRead(id);
    if (res.success) {
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus pesan ini?')) return;
    const res = await deleteMessage(id);
    if (res.success) {
      setMessages(messages.filter(m => m.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[500px]">
      {/* Sidebar: Message List */}
      <div className="w-full md:w-80 border-r border-gray-100 overflow-y-auto max-h-[600px]">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Belum ada pesan.</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => {
                setSelectedId(msg.id);
                if (!msg.is_read) handleRead(msg.id);
              }}
              className={`p-4 border-b border-gray-50 cursor-pointer transition-all ${selectedId === msg.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${msg.is_read ? 'text-gray-400' : 'text-primary-600'}`}>
                  {msg.is_read ? 'DIBACA' : 'BARU'}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(msg.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
              <h4 className={`text-sm ${msg.is_read ? 'font-medium text-gray-600' : 'font-bold text-gray-900'} truncate`}>
                {msg.name}
              </h4>
              <p className="text-xs text-gray-500 truncate">{msg.subject || '(Sapaan)'}</p>
            </div>
          ))
        )}
      </div>

      {/* Content: Selected Message Content */}
      <div className="flex-1 p-6 md:p-10 bg-white rounded-r-xl">
        {selectedMessage ? (
          <div className="flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl">
                  {selectedMessage.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedMessage.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Mail size={14} /> {selectedMessage.email || '-'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Hapus Pesan"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={14} /> {selectedMessage.phone || 'Tidak dicantumkan'}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={14} /> Diterima: {new Date(selectedMessage.created_at).toLocaleString('id-ID')}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">Subjek: {selectedMessage.subject || 'N/A'}</h4>
                <div className="text-gray-700 leading-relaxed bg-white border border-gray-100 p-6 rounded-xl shadow-sm italic">
                  "{selectedMessage.message}"
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-4">
            <Mail size={48} strokeWidth={1} />
            <p className="text-sm font-medium">Pilih pesan untuk membacanya</p>
          </div>
        )}
      </div>
    </div>
  );
}
