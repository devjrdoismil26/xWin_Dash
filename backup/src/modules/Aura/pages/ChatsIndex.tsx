import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import AuraChatList from '@/modules/Aura/Chats/components/AuraChatList.tsx';
const ChatsIndex: React.FC<{ auth?: any; chats?: any[] }> = ({ auth, chats = [] }) => (
  <AuthenticatedLayout user={auth?.user}>
    <Head title="Chats" />
    <PageLayout title="Chats">
      <AuraChatList chats={chats} />
    </PageLayout>
  </AuthenticatedLayout>
);
export default ChatsIndex;
