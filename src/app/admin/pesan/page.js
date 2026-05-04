import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { Mail, CheckCircle2, Trash2, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import MessageList from './MessageList';

export const metadata = {
  title: 'Pesan Masuk',
};

async function getMessages() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data;
}

export default async function MessagesPage() {
  const messages = await getMessages();
  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pesan Masuk</h1>
          <p className="text-sm text-gray-500">Kumpulan pesan dari formulir kontak website.</p>
        </div>
        {unreadCount > 0 && (
          <Badge color="warning" className="animate-pulse">
            {unreadCount} Pesan Baru
          </Badge>
        )}
      </div>

      <div className="admin-card" style={{ padding: '0' }}>
        <MessageList initialMessages={messages} />
      </div>
    </div>
  );
}
