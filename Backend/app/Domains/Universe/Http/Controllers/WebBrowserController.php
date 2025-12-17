<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Services\WebBrowserService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response as ResponseFacade;

class WebBrowserController extends Controller
{
    protected WebBrowserService $webBrowserService;

    public function __construct(WebBrowserService $webBrowserService)
    {
        $this->webBrowserService = $webBrowserService;
    }

    /**
     * Simulate visiting a URL.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function visitUrl(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        try {
            $content = $this->webBrowserService->visitUrl($request->input('url'));
            return ResponseFacade::json(['url' => $request->input('url'), 'content_length' => strlen($content)]);
        } catch (\Exception $e) {
            return ResponseFacade::json(['message' => 'Failed to visit URL.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Simulate filling a form on a given URL.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function fillForm(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|url',
            'form_data' => 'required|array',
        ]);

        try {
            $result = $this->webBrowserService->fillForm($request->input('url'), $request->input('form_data'));
            return ResponseFacade::json(['url' => $request->input('url'), 'result' => $result]);
        } catch (\Exception $e) {
            return ResponseFacade::json(['message' => 'Failed to fill form.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Simulate extracting data from a URL using CSS selectors or XPath.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function extractData(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|url',
            'selector' => 'required|string',
            'type' => 'required|string|in:css,xpath',
        ]);

        try {
            $data = $this->webBrowserService->extractData($request->input('url'), $request->input('selector'), $request->input('type'));
            return ResponseFacade::json(['url' => $request->input('url'), 'selector' => $request->input('selector'), 'extracted_data' => $data]);
        } catch (\Exception $e) {
            return ResponseFacade::json(['message' => 'Failed to extract data.', 'error' => $e->getMessage()], 500);
        }
    }
}
