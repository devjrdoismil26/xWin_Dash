<?php

namespace App\Domains\Products\Http\Controllers;

use App\Domains\Core\Http\Controllers\Controller;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel as LeadCaptureForm;
use Inertia\Inertia;

class LeadCaptureFormPublicController extends Controller
{
    /**
     * Exibe um formulário de captura de leads publicamente.
     *
     * @param string $slug
     *
     * @return \Inertia\Response
     */
    public function show($slug)
    {
        $form = LeadCaptureForm::where('slug', $slug)->where('status', 'published')->firstOrFail();

        // Renderiza o formulário usando Inertia, que será capturado pelo frontend
        return Inertia::render('Products/LeadCaptureForms/LeadCaptureFormShow', [
            'form' => $form,
        ]);
    }
}
