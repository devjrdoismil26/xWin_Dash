<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Leads\Models\Lead;
use App\Domains\SocialBuffer\Models\Post;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log as LoggerFacade;

class SocialPostHasMediaNodeExecutor implements WorkflowNodeExecutor
{
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): mixed
    {
        LoggerFacade::info("Executing Social Post Has Media Node for lead {$lead->id}");

        try {
            $postId = $node->configuration['post_id'] ?? null;

            if (!$postId) {
                LoggerFacade::warning("Social Post Has Media Node for lead {$lead->id} has no post ID configured.");
                $context->setData('social_post_has_media_result', [
                    'success' => false,
                    'error' => 'No post ID configured',
                    'hasMedia' => false
                ]);
                return $context->getData();
            }

            // Buscar o post
            $post = Post::find($postId);

            if (!$post) {
                LoggerFacade::warning("Social Post Has Media Node for lead {$lead->id} could not find post with ID {$postId}.");
                $context->setData('social_post_has_media_result', [
                    'success' => false,
                    'error' => "Post with ID {$postId} not found",
                    'hasMedia' => false
                ]);
                return $context->getData();
            }

            // Verificar se o post tem mídia
            $hasMedia = !empty($post->media_attachments) || !empty($post->media_urls);

            // Log da execução
            LoggerFacade::info("Social Post {$postId} media check result", [
                'post_id' => $postId,
                'has_media' => $hasMedia,
                'media_attachments' => $post->media_attachments ?? [],
                'media_urls' => $post->media_urls ?? []
            ]);

            // Adicionar resultado ao contexto
            $context->setData('social_post_has_media_result', [
                'success' => true,
                'hasMedia' => $hasMedia,
                'postId' => $postId,
                'mediaCount' => count($post->media_attachments ?? []) + count($post->media_urls ?? []),
                'executedAt' => now()->toISOString()
            ]);

            return $context->getData();
        } catch (\Exception $e) {
            LoggerFacade::error("Error executing Social Post Has Media Node", [
                'lead_id' => $lead->id,
                'node_id' => $node->id,
                'error' => $e->getMessage()
            ]);

            $context->setData('social_post_has_media_result', [
                'success' => false,
                'error' => $e->getMessage(),
                'hasMedia' => false
            ]);
            return $context->getData();
        }
    }

    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        $config = $node->configuration ?? [];
        $postId = $config['post_id'] ?? null;

        if (!$postId) {
            LoggerFacade::warning("Social Post Has Media Node for lead {$lead->id} has no post ID configured.");
            return $config['false_node_id'] ?? null;
        }

        $post = Post::find($postId);

        if (!$post) {
            LoggerFacade::warning("Social Post Has Media Node for lead {$lead->id} could not find post with ID {$postId}.");
            return $config['false_node_id'] ?? null;
        }

        // Verificar se o post tem mídia
        $hasMedia = !empty($post->media_attachments) || !empty($post->media_urls);

        // Retornar próximo nó baseado na condição
        if ($hasMedia) {
            return $config['true_node_id'] ?? $config['next_node_id'] ?? $node->next_node_id ?? null;
        } else {
            return $config['false_node_id'] ?? null;
        }
    }
}
