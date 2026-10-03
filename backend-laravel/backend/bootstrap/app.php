<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Admin auth uses Sanctum personal access tokens (Bearer), not cookie SPA sessions.
        // Do not prepend EnsureFrontendRequestsAreStateful on all API routes — it starts
        // sessions for every browser Origin request and caused public CMS timeouts/500s.

        // API-only: no named web `login` route. Avoid RouteNotFoundException → HTTP 500
        // when unauthenticated guests hit /api/admin/* without Accept: application/json.
        $middleware->redirectGuestsTo(fn () => null);

        $middleware->alias([
            'auth' => \App\Http\Middleware\Authenticate::class,
            'admin' => \App\Http\Middleware\EnsureAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Ensure /api/* always gets JSON auth errors (401), never a web login redirect.
        $exceptions->shouldRenderJsonWhen(function ($request, Throwable $e) {
            return $request->is('api/*') || $request->expectsJson();
        });
    })
    ->create();
