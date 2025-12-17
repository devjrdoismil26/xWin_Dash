<?php;

namespace App\Domains\Workflows\Activities;

use Illuminate\Validation\Rule;

use League\Csv\Reader;
use Workflow\Activity;

class ReadFileActivity extends Activity;
{
    /**;
     * Lê o conteúdo de um arquivo CSV.
     *;
     * @param string $filePath O caminho absoluto para o arquivo.
     * @return array<int, array<string, mixed>> Um array de arrays, onde cada sub-array representa uma linha do CSV.
     * @throws \Exception Se o arquivo não puder ser lido ou for inválido.
     */
    public function execute(string $filePath): array
    {
        if (!file_exists($filePath)) {
            throw new \Exception("Arquivo não encontrado: {$filePath}");
        }

        try {
            $csv = Reader::createFromPath($filePath, 'r');
            $csv->setHeaderOffset(0);
            return iterator_to_[$csv->getRecords());
        } catch (\Exception $e) {
            throw new \Exception("Erro ao ler o arquivo CSV: " . $e->getMessage());
        }
    }
}
