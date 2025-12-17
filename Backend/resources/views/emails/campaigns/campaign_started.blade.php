<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campanha {{ $campaign->name }} Iniciada</title>
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
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
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
        .launch-box { 
            background: #eff6ff; 
            border: 1px solid #bfdbfe; 
            color: #1e40af; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #3b82f6;
        }
        .launch-box h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
        }
        .status-badge { 
            display: inline-block; 
            background: #3b82f6; 
            color: white; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: bold; 
        }
        .btn { 
            display: inline-block; 
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
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
        .stats { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #3b82f6;
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
            <h1>🚀 Campanha Iniciada</h1>
            <p>{{ $campaign->name }}</p>
        </div>

        <div class="content">
            <p>Olá <strong>{{ $user->name }}</strong>,</p>

            <div class="launch-box">
                <h3>🎉 Campanha Lançada com Sucesso</h3>
                <p>Sua campanha <strong>{{ $campaign->name }}</strong> foi iniciada e está sendo executada. Os emails começaram a ser enviados para sua lista de destinatários.</p>
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
                @if(isset($campaign->started_at))
                <div class="stat-item">
                    <span>Iniciada em:</span>
                    <span>{{ $campaign->started_at->format('d/m/Y H:i') }}</span>
                </div>
                @endif
            </div>

            <p>📈 <strong>O que acontece agora:</strong></p>
            <ul>
                <li>Os emails estão sendo enviados automaticamente</li>
                <li>As estatísticas estão sendo coletadas em tempo real</li>
                <li>Você pode acompanhar o progresso no painel</li>
                <li>Relatórios detalhados serão gerados ao final</li>
            </ul>

            <p>💡 <strong>Dicas para maximizar seus resultados:</strong></p>
            <ul>
                <li>Monitore as taxas de abertura e cliques</li>
                <li>Acompanhe as métricas de engajamento</li>
                <li>Analise os horários de melhor performance</li>
                <li>Use os dados para otimizar futuras campanhas</li>
            </ul>

            <a href="{{ $campaignUrl }}" class="btn">Acompanhar Campanha</a>

            <div class="footer">
                <p>Se você tiver alguma dúvida ou precisar de suporte, nossa equipe está sempre disponível para ajudar.</p>
                <p>Atenciosamente,<br>
                <strong>Equipe xWin Dash</strong></p>
            </div>
        </div>
    </div>
</body>
</html>