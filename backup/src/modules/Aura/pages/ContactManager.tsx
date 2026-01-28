import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import ContactDetails from '@/modules/Aura/components/ContactDetails.tsx';
const ContactManager = ({ contact }) => (
  <PageLayout title="Contato">
    <ContactDetails contact={contact} />
  </PageLayout>
);
export default ContactManager;
