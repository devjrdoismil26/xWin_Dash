<?php

namespace App\Domains\Products\Http\Controllers;

use App\Domains\Core\Http\Controllers\Controller;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\LandingPageModel as LandingPage;

class LandingPageViewController extends Controller
{
    /**
     * Exibe uma landing page publicada.
     *
     * @param string $slug o slug da página a ser exibida
     *
     * @return \Illuminate\View\View|\Illuminate\Http\Response
     */
    public function show($slug)
    {
        // Busca a página pelo slug, mas apenas se ela estiver com o status 'published'.
        // Se não encontrar ou se a página for um rascunho, retorna um erro 404.
        $page = LandingPage::where('slug', $slug)->where('status', 'published')->firstOrFail();

        // Aqui, em vez de retornar um componente Inertia (que exige autenticação);
        // retornaremos uma view Blade simples ou diretamente o HTML.
        // Por enquanto, vamos retornar uma representação simples em JSON para teste.
        // No futuro, isso será uma view Blade que renderiza os componentes do `content`.

        return view('landing-pages.show', ['page' => $page]);
    }
}
