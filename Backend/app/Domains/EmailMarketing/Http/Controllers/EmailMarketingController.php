<?php

namespace App\Domains\EmailMarketing\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailMarketingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('EmailMarketing/Index', [
            'campaigns' => [],
            'stats' => [
                'totalCampaigns' => 0,
                'totalSent' => 0,
                'totalOpened' => 0,
                'totalClicked' => 0,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('EmailMarketing/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'template_id' => 'required|exists:email_templates,id',
            'list_id' => 'required|exists:email_lists,id',
            'schedule_at' => 'nullable|date|after:now',
            'is_draft' => 'boolean'
        ]);

        try {
            $campaign = \App\Domains\EmailMarketing\Models\EmailCampaign::create([
                'name' => $request->name,
                'subject' => $request->subject,
                'template_id' => $request->template_id,
                'list_id' => $request->list_id,
                'schedule_at' => $request->schedule_at,
                'is_draft' => $request->is_draft ?? true,
                'status' => $request->is_draft ? 'draft' : 'scheduled',
                'user_id' => auth()->id(),
                'project_id' => auth()->user()->current_project_id
            ]);

            return redirect()->route('email-marketing.index')
                ->with('success', 'Campanha criada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Erro ao criar campanha: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        return Inertia::render('EmailMarketing/Show', [
            'campaign' => [],
            'stats' => []
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        return Inertia::render('EmailMarketing/Edit', [
            'campaign' => []
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'template_id' => 'required|exists:email_templates,id',
            'list_id' => 'required|exists:email_lists,id',
            'schedule_at' => 'nullable|date|after:now',
            'is_draft' => 'boolean'
        ]);

        try {
            $campaign = \App\Domains\EmailMarketing\Models\EmailCampaign::findOrFail($id);

            // Verificar se o usuário tem permissão para editar
            if ($campaign->user_id !== auth()->id()) {
                return redirect()->back()->with('error', 'Você não tem permissão para editar esta campanha.');
            }

            // Verificar se a campanha pode ser editada
            if (in_array($campaign->status, ['sent', 'sending'])) {
                return redirect()->back()->with('error', 'Não é possível editar uma campanha que já foi enviada.');
            }

            $campaign->update([
                'name' => $request->name,
                'subject' => $request->subject,
                'template_id' => $request->template_id,
                'list_id' => $request->list_id,
                'schedule_at' => $request->schedule_at,
                'is_draft' => $request->is_draft ?? $campaign->is_draft,
                'status' => $request->is_draft ? 'draft' : 'scheduled'
            ]);

            return redirect()->route('email-marketing.index')
                ->with('success', 'Campanha atualizada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Erro ao atualizar campanha: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $campaign = \App\Domains\EmailMarketing\Models\EmailCampaign::findOrFail($id);

            // Verificar se o usuário tem permissão para excluir
            if ($campaign->user_id !== auth()->id()) {
                return redirect()->back()->with('error', 'Você não tem permissão para excluir esta campanha.');
            }

            // Verificar se a campanha pode ser excluída
            if (in_array($campaign->status, ['sent', 'sending'])) {
                return redirect()->back()->with('error', 'Não é possível excluir uma campanha que já foi enviada.');
            }

            $campaign->delete();

            return redirect()->route('email-marketing.index')
                ->with('success', 'Campanha excluída com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erro ao excluir campanha: ' . $e->getMessage());
        }
    }
}
