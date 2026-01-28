import React from 'react';
import Button from '@/components/ui/Button';
const ConnectSocialAccountButton = ({ onConnect }) => (
  <Button onClick={() => onConnect?.()}>Conectar Conta</Button>
);
export default ConnectSocialAccountButton;
