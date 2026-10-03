<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // API-only app: never redirect to a named web login route (none exists).
        // Returning null yields a proper 401 JSON response from Sanctum/auth.
        return null;
    }
}
