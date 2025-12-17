<?php

namespace App\Application\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaStorageService
{
    protected string $disk;

    public function __construct(string $disk = 'public')
    {
        $this->disk = $disk;
    }

    /**
     * Faz o upload de um arquivo de mídia.
     *
     * @param UploadedFile $file o arquivo a ser carregado
     * @param string       $path o caminho dentro do disco onde o arquivo será salvo
     *
     * @return string o caminho completo do arquivo salvo
     */
    public function uploadFile(UploadedFile $file, string $path = 'uploads'): string
    {
        $fileName = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $filePath = Storage::disk($this->disk)->putFileAs($path, $file, $fileName);
        return $filePath;
    }

    /**
     * Obtém a URL de um arquivo de mídia.
     *
     * @param string $filePath o caminho do arquivo
     *
     * @return string a URL pública do arquivo
     */
    public function getFileUrl(string $filePath): string
    {
        return Storage::disk($this->disk)->url($filePath);
    }

    /**
     * Deleta um arquivo de mídia.
     *
     * @param string $filePath o caminho do arquivo a ser deletado
     *
     * @return bool
     */
    public function deleteFile(string $filePath): bool
    {
        return Storage::disk($this->disk)->delete($filePath);
    }

    /**
     * Verifica se um arquivo existe.
     *
     * @param string $filePath
     *
     * @return bool
     */
    public function fileExists(string $filePath): bool
    {
        return Storage::disk($this->disk)->exists($filePath);
    }
}
