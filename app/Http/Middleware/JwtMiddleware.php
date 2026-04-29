<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = explode(' ', $request->header('Authorization'))[1] ?? null;

        if (!$token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $response = Http::post(env('AUTH_SERVICE_URL') . '/auth/verify', [
            'token' => $token
        ]);

        if ($response->status() !== 200) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // inject user id dari gateway header
        $request->merge([
            'user_id' => $request->header('x-user-id')
        ]);

        return $next($request);
    }
}