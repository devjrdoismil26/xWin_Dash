<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Tamanho Máximo de Arquivo Permitido (em bytes)
    |--------------------------------------------------------------------------
    |
    | Define o tamanho máximo de arquivo que pode ser enviado.
    | Padrão: 10MB (10 * 1024 * 1024 bytes)
    |
    */
    'max_file_size' => 10 * 1024 * 1024, // 10 MB

    /*
    |--------------------------------------------------------------------------
    | Tipos MIME de Mídia Permitidos
    |--------------------------------------------------------------------------
    |
    | Lista de tipos MIME que são permitidos para upload na aplicação.
    | Use uma abordagem de lista branca para segurança.
    |
    */
    'allowed_mimetypes' => [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'video/mp4',
        'video/webm',
        'audio/mpeg',
        'audio/wav',
    ],

    /*
    |--------------------------------------------------------------------------
    | Extensões de Arquivo Permitidas
    |--------------------------------------------------------------------------
    |
    | Lista de extensões de arquivo que são permitidas para upload na aplicação.
    | Deve estar em sincronia com os tipos MIME permitidos.
    |
    */
    'allowed_extensions' => [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'pdf',
        'mp4',
        'webm',
        'mp3',
        'wav',
    ],
];
