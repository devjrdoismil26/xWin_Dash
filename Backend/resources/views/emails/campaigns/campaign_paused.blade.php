<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campanha {{ $campaign->name }} Pausada</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
        }
        .header { 
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
            border-radius: 12px 12px 0 0; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 8px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content { 
            background: white; 
            padding: 40px 30px; 
            border-radius: 0 0 12px 12px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .info-box { 
            background: #fffbeb; 
            border: 1px solid #fed7aa; 
            color: #92400e; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #f59e0b;
        }
        .info-box h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
        }
        .status-badge { 
            display: inline-block; 
            background: #f59e0b; 
            color: white; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: bold; 
        }
        .btn { 
            display: inline-block; 
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
            color: white; 
            padding: 14px 28px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 20px 0; 
            font-weight: 600;
            transition: transform 0.2s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .btn-resume {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        .stats { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #f59e0b;
        }
        .stats h3 {
            margin: 0 0 15px 0;
            color: #2d3748;
            font-size: 18px;
        }
        .stat-item { 
            display: flex; 
            justify-content: space-between; 
            margin: 10px 0; 
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .stat-item:last-child {
            border-bottom: none;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏸️ Campanha Pausada</h1>
            <p>{{ $campaign->name }}</p>
        </div>

        <div class="content">
            <p>Olá <strong>{{ $user->name }}</strong>,</p>

            <div class="info-box">
                <h3>⏸️ Campanha Pausada</h3>
                <p>Sua campanha <strong>{{ $campaign->name }}</strong> foi pausada com sucesso. Você pode retomá-la a qualquer momento.</p>
            </div>

            <div class="stats">
                <h3>📊 Detalhes da Campanha</h3>
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
                @if(isset($campaign->created_at))
                <div class="stat-item">
                    <span>Criada em:</span>
                    <span>{{ $campaign->created_at->format('d/m/Y H:i') }}</span>
                </div>
                @endif
                @if(isset($campaign->paused_at))
                <div class="stat-item">
                    <span>Pausada em:</span>
                    <span>{{ $campaign->paused_at->format('d/m/Y H:i') }}</span>
                </div>
                @endif
            </div>

            <p>🔄 <strong>O que acontece quando uma campanha é pausada:</strong></p>
            <ul>
                <li>O envio de emails é interrompido imediatamente</li>
                <li>Os dados de progresso são preservados</li>
                <li>Você pode retomar de onde parou</li>
                <li>As estatísticas ficam disponíveis para análise</li>
            </ul>

            <p>✅ Para retomar sua campanha, basta acessar o painel e clicar em "Retomar Campanha".</p>

            <a href="{{ $campaignUrl }}" class="btn">Ver Campanha</a>
            <a href="{{ $campaignUrl }}?action=resume" class="btn btn-resume">Retomar Campanha</a>

            <div class="footer">
                <p>Se você tiver alguma dúvida ou precisar de suporte, nossa equipe está sempre disponível para ajudar.</p>
                <p>Atenciosamente,<br>
                <strong>Equipe xWin Dash</strong></p>
            </div>
        </div>
    </div>
</body>
</html>