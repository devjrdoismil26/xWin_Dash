<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workflow {{ $workflow->name }}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: {{ $newStatus === 'failed' ? '#ef4444' : ($newStatus === 'completed' ? '#10b981' : '#3b82f6') }}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .status-badge { display: inline-block; background: {{ $newStatus === 'failed' ? '#ef4444' : ($newStatus === 'completed' ? '#10b981' : '#3b82f6') }}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .stats { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .stat-item { display: flex; justify-content: space-between; margin: 10px 0; }
        .error-box { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 15px; border-radius: 6px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>
                @if($newStatus === 'failed')
                    ❌ Workflow Falhou
                @elseif($newStatus === 'completed')
                    ✅ Workflow Concluído
                @else
                    🔄 Workflow Atualizado
                @endif
            </h1>
            <p>{{ $workflow->name }}</p>
        </div>
        
        <div class="content">
            <p>Olá <strong>{{ $user->name }}</strong>,</p>
            
            <p>O workflow <strong>{{ $workflow->name }}</strong> teve seu status alterado para <span class="status-badge">{{ ucfirst($newStatus) }}</span>.</p>
            
            @if($errorMessage)
            <div class="error-box">
                <strong>⚠️ Erro:</strong><br>
                {{ $errorMessage }}
            </div>
            @endif
            
            <div class="stats">
                <h3>📋 Detalhes do Workflow</h3>
                <div class="stat-item">
                    <span>Nome:</span>
                    <strong>{{ $workflow->name }}</strong>
                </div>
                <div class="stat-item">
                    <span>Status Anterior:</span>
                    <span>{{ ucfirst($oldStatus) }}</span>
                </div>
                <div class="stat-item">
                    <span>Status Atual:</span>
                    <span class="status-badge">{{ ucfirst($newStatus) }}</span>
                </div>
                @if(isset($workflow->description))
                <div class="stat-item">
                    <span>Descrição:</span>
                    <span>{{ $workflow->description }}</span>
                </div>
                @endif
                @if(isset($workflow->updated_at))
                <div class="stat-item">
                    <span>Atualizado em:</span>
                    <span>{{ $workflow->updated_at->format('d/m/Y H:i') }}</span>
                </div>
                @endif
            </div>
            
            @if($newStatus === 'completed')
                <p>🎉 Parabéns! Seu workflow foi executado com sucesso. Todas as tarefas foram concluídas conforme planejado.</p>
            @elseif($newStatus === 'failed')
                <p>⚠️ O workflow encontrou um erro durante a execução. Verifique os logs e configurações para identificar o problema.</p>
            @else
                <p>🔄 O workflow está em execução. Você será notificado quando houver atualizações importantes.</p>
            @endif
            
            <a href="{{ $workflowUrl }}" class="btn">Ver Workflow</a>
            @if(isset($executionUrl))
            <a href="{{ $executionUrl }}" class="btn" style="background: #6b7280;">Ver Execuções</a>
            @endif
            
            <p>Se você tiver alguma dúvida ou precisar de suporte, nossa equipe está sempre disponível para ajudar.</p>
            
            <p>Atenciosamente,<br>
            <strong>Equipe xWin Dash</strong></p>
        </div>
    </div>
</body>
</html>