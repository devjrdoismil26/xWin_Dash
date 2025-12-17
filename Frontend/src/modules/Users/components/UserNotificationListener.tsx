import React, { useEffect, useRef } from 'react';
const NotificationListener = React.memo(function NotificationListener({ 
  userId, 
  onNewNotification, 
  onNotificationRead 
}) {
  const echoRef = useRef<any>(null);

  useEffect(() => {
    if (!userId || !window.Echo) {
      return;
    }
    // Configurar Echo se não estiver configurado
    if (!echoRef.current) {
      echoRef.current = window.Echo;
    }
    // Canal privado para o usuário
    const channel = echoRef.current.private(`App.Models.User.${userId}`);

    // Escutar novos eventos de notificação
    channel.listen('NotificationSent', (e: unknown) => {
      if (onNewNotification) {
        onNewNotification(e.notification);

      } );

    // Escutar eventos de notificação lida
    channel.listen('NotificationRead', (e: unknown) => {
      if (onNotificationRead) {
        onNotificationRead(e.notificationId);

      } );

    // Cleanup
    return () => {
      if (channel) {
        channel.stopListening('NotificationSent');

        channel.stopListening('NotificationRead');

      } ;

  }, [userId, onNewNotification, onNotificationRead]);

  // Este componente não renderiza nada visualmente
  return null;
});

export default NotificationListener;
