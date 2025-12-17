<?php

namespace App\Domains\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // --- Validação dos Dados de Entrada ---
        // Garante que os dados são válidos antes de prosseguir.
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // --- Criação do Usuário ---
        // Cria a nova entrada no banco de dados.
        // A senha é criptografada com Hash::make por segurança. NUNCA salve senhas em texto plano.
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // --- Disparo do Evento de Registro ---
        // Informa ao resto do sistema que um novo usuário se registrou.
        // Permite que outras partes (ex: um listener de email) reajam a este evento.
        event(new Registered($user));

        // --- Login Automático ---
        // Para uma melhor experiência do usuário, ele é automaticamente logado após o registro.
        Auth::login($user);

        // --- Redirecionamento ---
        // Envia o usuário para a próxima página lógica da aplicação.
        return redirect(route('projects.select'));
    }
}
