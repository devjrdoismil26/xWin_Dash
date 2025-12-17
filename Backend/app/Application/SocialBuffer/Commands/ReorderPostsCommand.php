<?php

namespace App\Application\SocialBuffer\Commands;

class ReorderPostsCommand
{
    public int $userId;

    public array $postIdsInOrder;

    public function __construct(int $userId, array $postIdsInOrder)
    {
        $this->userId = $userId;
        $this->postIdsInOrder = $postIdsInOrder;
    }
}
