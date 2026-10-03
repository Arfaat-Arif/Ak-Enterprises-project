<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * POST /api/admin/login
     * Issues a Sanctum personal access token for the CMS/admin panel.
     * The public storefront never calls this — only the admin login page.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();

        if (! $user->is_admin) {
            Auth::logout();
            return response()->json(['message' => 'This account does not have admin access.'], 403);
        }

        $token = $user->createToken('admin-panel')->plainTextToken;

        return response()->json(['token' => $token]);
    }

    /**
     * POST /api/admin/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    /**
     * GET /api/admin/account
     * Returns the authenticated admin's non-sensitive account profile.
     */
    public function account(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'data' => [
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * PUT /api/admin/account
     * Lets the authenticated admin update their own email and/or password.
     * Requires the current password. Revokes all Sanctum tokens after a change.
     */
    public function updateAccount(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        if (! Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $newEmail = isset($validated['email']) ? trim((string) $validated['email']) : null;
        $newPassword = $validated['password'] ?? null;

        $changingEmail = is_string($newEmail) && $newEmail !== '' && strcasecmp($newEmail, (string) $user->email) !== 0;
        $changingPassword = is_string($newPassword) && $newPassword !== '';

        if (! $changingEmail && ! $changingPassword) {
            throw ValidationException::withMessages([
                'email' => ['Provide a new email and/or a new password to update.'],
            ]);
        }

        if ($changingEmail) {
            $user->email = $newEmail;
        }

        if ($changingPassword) {
            $user->password = $newPassword;
        }

        $user->save();
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Account updated. Please sign in again with your new credentials.',
            'requiresReauth' => true,
            'data' => [
                'email' => $user->email,
            ],
        ]);
    }
}
