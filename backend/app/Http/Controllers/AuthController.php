<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'business_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'business_name' => $request->business_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Berhasil mendaftar',
            'token' => $user->createToken('admin-token')->plainTextToken,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Alamat email atau kata sandi salah'
            ], 401);
        }

        // Return a new token
        return response()->json([
            'token' => $user->createToken('admin-token')->plainTextToken,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Berhasil keluar'
        ]);
    }

    public function deleteUser(Request $request)
    {
        $user = $request->user();
        
        // Revoke all tokens
        $user->tokens()->delete();
        
        // Delete the user
        $user->delete();

        return response()->json([
            'message' => 'Akun berhasil dihapus'
        ]);
    }
}
