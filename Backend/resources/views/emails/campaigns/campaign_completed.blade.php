<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campanha {{ $campaign->name }} Concluída</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .status-badge { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .stats { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .stat-item { display: flex; justify-content: space-between; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Campanha Concluída!</h1>
            <p>{{ $campaign->name }}</p>
        </div>
        
        <div class="content">
            <p>Olá <strong>{{ $user->name }}</strong>,</p>
            
            <p>Sua campanha de email marketing foi <span class="status-badge">CONCLUÍDA</span> com sucesso!</p>
            
            <div class="stats">
                <h3>📊 Resumo da Campanha</h3>
                <div class="stat-item">
                    <span>Nome:</span>
                    <strong>{{ $campaign->name }}</strong>
                </div>
                <div class="stat-item">
                    <span>Assunto:</span>
                    <strong>{{ $campaign->subject }}</strong>
                </div>
                <div class="stat-item">
                    <span>Status Anterior:</span>
                    <span>{{ ucfirst($oldStatus) }}</span>
                </div>
                <div class="stat-item">
                    <span>Status Atual:</span>
                    <span class="status-badge">{{ ucfirst($newStatus) }}</span>
                </div>
                @if(isset($campaign->sent_at))
                <div class="stat-item">
                    <span>Enviada em:</span>
                    <span>{{ $campaign->sent_at->format('d/m/Y H:i') }}</span>
                </div>
                @endif
            </div>
            
            <p>🎉 Parabéns! Sua campanha foi executada com sucesso. Você pode verificar os resultados detalhados e métricas de performance no painel.</p>
            
            <a href="{{ $campaignUrl }}" class="btn">Ver Campanha</a>
            
            <p>Se você tiver alguma dúvida ou precisar de suporte, nossa equipe está sempre disponível para ajudar.</p>
            
            <p>Atenciosamente,<br>
            <strong>Equipe xWin Dash</strong></p>
        </div>
    </div>
</body>
</html>
