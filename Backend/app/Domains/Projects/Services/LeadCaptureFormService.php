<?php

namespace App\Domains\Projects\Services;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel as Project;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel as LeadCaptureForm;
use Illuminate\Support\Facades\Log as LoggerFacade;

class LeadCaptureFormService
{
    /**
     * @param array<string, mixed> $data
     */
    public function createForm(Project $project, array $data): LeadCaptureForm
    {
        /** @var LeadCaptureForm $form */
        $form = $project->leadCaptureForms()->create($data);
        LoggerFacade::info('Lead capture form created', ['form_id' => $form->id, 'project_id' => $project->id]);
        event(new \App\Domains\Projects\Events\LeadCaptureFormCreated($form));
        return $form;
    }

    /**
     * @param array<string, mixed> $data
     */
    public function updateForm(LeadCaptureForm $form, array $data): LeadCaptureForm
    {
        $form->update($data);
        LoggerFacade::info('Lead capture form updated', ['form_id' => $form->id]);
        event(new \App\Domains\Projects\Events\LeadCaptureFormUpdated($form));
        return $form;
    }

    public function deleteForm(LeadCaptureForm $form): bool
    {
        LoggerFacade::info('Lead capture form deleted', ['form_id' => $form->id]);
        $result = $form->delete();
        if ($result) {
            event(new \App\Domains\Projects\Events\LeadCaptureFormDeleted($form));
        }
        return (bool) $result;
    }

    public function generateEmbedCode(LeadCaptureForm $form): string
    {
        $appUrl = config('app.url');
        $formEndpoint = route('lead-capture.submit', ['form' => $form->id], false); // Use false for relative path

        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $fieldsCollection */
        $fieldsCollection = collect($form->fields);
        $htmlFields = $fieldsCollection->map(function ($field) {
            $name = $field['name'];
            $label = $field['label'];
            $type = $field['type'] ?? 'text';
            $required = ($field['required'] ?? false) ? 'required' : '';

            return "<div style=\"margin-bottom: 10px;\">" .
                   "<label for=\"form-{$name}\" style=\"display: block; margin-bottom: 5px;\">{$label}:</label>" .
                   "<input type=\"{$type}\" id=\"form-{$name}\" name=\"{$name}\" {$required} style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;\">" .
                   "</div>";
        })->implode("\n");

        $script = "<script>\n" .
                  "  document.getElementById('lead-capture-form-{$form
                      ->id}').addEventListener('submit', async function(e) {\n" .
                  "    e.preventDefault();\n" .
                  "    const formData = new FormData(this);\n" .
                  "    const data = {};\n" .
                  "    for (let [key, value] of formData.entries()) {\n" .
                  "      data[key] = value;\n" .
                  "    }\n" .
                  "    try {\n" .
                  "      const response = await fetch('{$appUrl}{$formEndpoint}', {\n" .
                  "        method: 'POST',\n" .
                  "        headers: {\n" .
                  "          'Content-Type': 'application/json',\n" .
                  "          'Accept': 'application/json'\n" .
                  "        },\n" .
                  "        body: JSON.stringify(data)\n" .
                  "      });\n" .
                  "      const result = await response.json();\n" .
                  "      if (response.ok) {\n" .
                  "        alert('Lead capturado com sucesso!');\n" .
                  "        window.location.href = '{$form->redirect_url}'; // Redirecionar em caso de sucesso\n" .
                  "      } else {\n" .
                  "        alert('Erro ao capturar lead: ' + (result.message || JSON.stringify(result.errors)));\n" .
                  "      }\n" .
                  "    } catch (error) {\n" .
                  "      alert('Erro de rede ou servidor: ' + error.message);\n" .
                  "    }\n" .
                  "  });\n" .
                  "</script>";

        return "<form id=\"lead-capture-form-{$form->id}\" style=\"font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 400px; margin: 20px auto; box-shadow: 0 2px 4px rgba(0,0,0,0.1);\">\n" .
               $htmlFields .
               "<button type=\"submit\" style=\"width: 100%, padding: 10px, background-color: #007bff, color: white, border: none, border-radius: 4px, cursor: pointer, font-size: 16px,\">Enviar</button>\n" .
               "</form>\n" .
               $script;
    }

    /**
     * Get a lead capture form by its slug.
     *
     * @param string $slug
     * @return LeadCaptureForm|null
     */
    public function getLeadCaptureFormBySlug(string $slug): ?LeadCaptureForm
    {
        /** @var LeadCaptureForm|null $form */
        $form = LeadCaptureForm::where('slug', $slug)->first();
        return $form;
    }
}
