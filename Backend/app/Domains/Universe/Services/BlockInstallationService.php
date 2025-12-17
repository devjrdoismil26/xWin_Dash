<?php

namespace App\Domains\Universe\Services;

use App\Domains\Universe\Models\UniverseInstance;
use App\Domains\Universe\Models\UniverseBlock;
use App\Domains\Universe\Models\BlockConnection;
use App\Domains\Universe\Models\BlockInstallation;
use App\Domains\Universe\Models\BlockMarketplace;
use Illuminate\Support\Facades\DB;

class BlockInstallationService
{
    public function addBlockToInstance(string $instanceId, string $blockType, array $config): UniverseBlock
    {
        $instance = UniverseInstance::findOrFail($instanceId);
        
        // Validate block is installed by user
        $installation = BlockInstallation::where('installed_by', $instance->user_id)
            ->whereHas('block', fn($q) => $q->where('block_type', $blockType))
            ->where('is_active', true)
            ->first();
        
        if (!$installation) {
            throw new \Exception("Block type '{$blockType}' is not installed");
        }
        
        return $instance->addBlock($blockType, array_merge(
            $installation->configuration ?? [],
            $config
        ));
    }

    public function removeBlockFromInstance(string $instanceId, string $blockId): bool
    {
        $instance = UniverseInstance::findOrFail($instanceId);
        
        // Delete connections first
        BlockConnection::where('source_block_id', $blockId)
            ->orWhere('target_block_id', $blockId)
            ->delete();
        
        return $instance->removeBlock($blockId);
    }

    public function updateBlockConfig(string $blockId, array $config): UniverseBlock
    {
        $block = UniverseBlock::findOrFail($blockId);
        $block->update(['config' => array_merge($block->config, $config)]);
        
        return $block->fresh();
    }

    public function connectBlocks(string $sourceId, string $targetId, array $config = []): BlockConnection
    {
        // Validate blocks exist and belong to same instance
        $sourceBlock = UniverseBlock::findOrFail($sourceId);
        $targetBlock = UniverseBlock::findOrFail($targetId);
        
        if ($sourceBlock->instance_id !== $targetBlock->instance_id) {
            throw new \Exception("Blocks must belong to the same instance");
        }
        
        return BlockConnection::create([
            'source_block_id' => $sourceId,
            'target_block_id' => $targetId,
            'connection_type' => $config['type'] ?? 'data',
            'config' => $config,
        ]);
    }

    public function disconnectBlocks(string $connectionId): bool
    {
        $connection = BlockConnection::findOrFail($connectionId);
        return $connection->delete();
    }

    public function getBlockConnections(string $blockId): array
    {
        $block = UniverseBlock::with('connections')->findOrFail($blockId);
        
        return [
            'outgoing' => $block->connections,
            'incoming' => BlockConnection::where('target_block_id', $blockId)->get(),
        ];
    }
}
