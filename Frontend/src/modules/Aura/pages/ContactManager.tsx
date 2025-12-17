/**
 * @module ContactManager
 * @description P?gina para gerenciar detalhes de um contato do Aura.
 * 
 * Esta p?gina ? um wrapper simples que utiliza o componente ContactDetails
 * para exibir e gerenciar informa??es de um contato espec?fico.
 * 
 * @example
 * ```tsx
 * // Rota Inertia.js
 * <ContactManager contact={contactData} / />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import ContactDetails from '@/modules/Aura/components/ContactDetails';

/**
 * Interface para os dados de um contato
 * 
 * @interface Contact
 * @property {string} id - ID ?nico do contato
 * @property {string} name - Nome do contato
 * @property {string} [phone] - Telefone do contato
 * @property {any} [chat] - Dados do chat associado
 */
interface Contact {
  /** ID ?nico do contato */
  id: string;
  /** Nome do contato */
  name: string;
  /** Telefone do contato */
  phone?: string;
  /** Dados do chat associado */
  chat?: string; }

/**
 * Interface para as propriedades do componente ContactManager
 * 
 * @interface ContactManagerProps
 * @property {Contact} contact - Dados do contato a ser exibido
 */
interface ContactManagerProps {
  /** Dados do contato a ser exibido */
contact: Contact;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente de p?gina para gerenciar detalhes de um contato
 * 
 * @param {ContactManagerProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const ContactManager: React.FC<ContactManagerProps> = ({ contact    }) => (
  <PageLayout title="Contato" />
    <ContactDetails chat={contact.chat || contact} / />
  </PageLayout>);

export default ContactManager;
