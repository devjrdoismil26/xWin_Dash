<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lead Nurturing - {{ $lead->name }}</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
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
        .lead-info { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #667eea;
        }
        .lead-info h3 {
            margin: 0 0 15px 0;
            color: #2d3748;
            font-size: 18px;
        }
        .info-item { 
            display: flex; 
            justify-content: space-between; 
            margin: 8px 0; 
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .info-item:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #4a5568;
        }
        .info-value {
            color: #2d3748;
        }
        .action-badge { 
            display: inline-block; 
            background: #667eea; 
            color: white; 
            padding: 6px 16px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: 600; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .btn { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
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
        .message-content {
            background: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #48bb78;
        }
        .message-content p {
            margin: 0;
            line-height: 1.7;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 14px;
        }
        .campaign-link {
            background: #48bb78;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤝 Lead Nurturing</h1>
            <p>Ação: <span class="action-badge">{{ ucfirst($action) }}</span></p>
        </div>

        <div class="content">
            <p>Olá <strong>{{ $user->name }}</strong>,</p>

            <p>Uma nova ação de nurturing foi executada para o lead <strong>{{ $lead->name }}</strong>.</p>

            <div class="lead-info">
                <h3>👤 Informações do Lead</h3>
                <div class="info-item">
                    <span class="info-label">Nome:</span>
                    <span class="info-value">{{ $lead->name }}</span>
                </div>
                @if(isset($lead->email))
                <div class="info-item">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{{ $lead->email }}</span>
                </div>
                @endif
                @if(isset($lead->phone))
                <div class="info-item">
                    <span class="info-label">Telefone:</span>
                    <span class="info-value">{{ $lead->phone }}</span>
                </div>
                @endif
                @if(isset($lead->company))
                <div class="info-item">
                    <span class="info-label">Empresa:</span>
                    <span class="info-value">{{ $lead->company }}</span>
                </div>
                @endif
                @if(isset($lead->status))
                <div class="info-item">
                    <span class="info-label">Status:</span>
                    <span class="info-value">{{ ucfirst($lead->status) }}</span>
                </div>
                @endif
                @if(isset($data['score']))
                <div class="info-item">
                    <span class="info-label">Score:</span>
                    <span class="info-value">{{ $data['score'] }}/100</span>
                </div>
                @endif
            </div>

            @if(isset($data['message']))
            <div class="message-content">
                <h4>💬 Mensagem Enviada:</h4>
                <p>{!! nl2br($data['message']) !!}</p>
            </div>
            @endif

            @if(isset($data['campaign_name']))
            <div class="lead-info">
                <h3>📧 Campanha Relacionada</h3>
                <div class="info-item">
                    <span class="info-label">Nome da Campanha:</span>
                    <span class="info-value">{{ $data['campaign_name'] }}</span>
                </div>
                @if(isset($data['campaign_type']))
                <div class="info-item">
                    <span class="info-label">Tipo:</span>
                    <span class="info-value">{{ ucfirst($data['campaign_type']) }}</span>
                </div>
                @endif
            </div>
            @endif

            <p>🎯 Esta ação faz parte da estratégia de nurturing automatizada para maximizar as conversões e manter o engajamento com seus leads.</p>

            <a href="{{ $leadUrl }}" class="btn">Ver Lead Completo</a>
            
            @if(isset($campaignUrl))
            <a href="{{ $campaignUrl }}" class="campaign-link">Ver Campanha</a>
            @endif

            <div class="footer">
                <p>Se você tiver alguma dúvida ou precisar de suporte, nossa equipe está sempre disponível para ajudar.</p>
                <p>Atenciosamente,<br>
                <strong>Equipe xWin Dash</strong></p>
            </div>
        </div>
    </div>
</body>
</html>