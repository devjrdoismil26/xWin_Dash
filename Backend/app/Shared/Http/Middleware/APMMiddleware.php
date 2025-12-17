<?php

namespace App\Shared\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class APMMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);

        try {
            $response = $next($request);
        } catch (\Exception $e) {
            // Log the error and re-throw
            Log::error('APM Middleware Error: ' . $e->getMessage());
            throw $e;
        }

        $endTime = microtime(true);
        $responseTime = ($endTime - $startTime) * 1000; // em milissegundos

        $memoryUsage = round(memory_get_peak_usage(true) / (1024 * 1024), 2); // em MB

        // Safely get status code
        $statusCode = null;
        if ($response && method_exists($response, 'getStatusCode')) {
            try {
                $statusCode = $response->getStatusCode();
            } catch (\Exception $e) {
                $statusCode = 'unknown';
            }
        }

        Log::info(
            'APM Metrics',
            [
                'path' => $request->path(),
                'method' => $request->method(),
                'response_time_ms' => $responseTime,
                'memory_usage_mb' => $memoryUsage,
                'status_code' => $statusCode,
            ],
        );

        return $response;
    }
}
