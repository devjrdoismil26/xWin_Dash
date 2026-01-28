import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import AuraMessageBubble from '@/modules/Aura/Chats/components/AuraMessageBubble.tsx';
const ChatShow: React.FC<{ auth?: any; chat?: any }> = ({ auth, chat }) => (
  <AuthenticatedLayout user={auth?.user}>
    <Head title={`Chat ${chat?.id || ''}`} />
    <PageLayout title={`Chat ${chat?.id || ''}`}>
      <div className="space-y-3 p-4">
        {(chat?.messages || []).map((m: any) => (
          <AuraMessageBubble key={m.id} text={m} />
        ))}
      </div>
    </PageLayout>
  </AuthenticatedLayout>
);
export default ChatShow;
