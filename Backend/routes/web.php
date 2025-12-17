<?php

/*
|--------------------------------------------------------------------------
| 🚀 xWin-Dash - Web Routes (Principal)
|--------------------------------------------------------------------------
|
| Este é o arquivo principal de rotas web da aplicação xWin-Dash.
| 
| 📁 ESTRUTURA MODULAR:
| - Rotas principais estão organizadas por domínio em Backend/routes/modules/*
| - Cada módulo corresponde a um domínio em app/Domains/*
| - Sistema de carregamento condicional baseado em configurações
|
| 🎯 ORGANIZAÇÃO:
| - Rotas públicas (sem autenticação)
| - Rotas de autenticação
| - Rotas autenticadas (com middleware auth)
| - Rotas administrativas (com middleware de permissão)
| - Rotas de desenvolvimento (apenas em ambiente local)
|
| ⚡ PERFORMANCE:
| - Carregamento condicional de módulos
| - Cache de rotas em produção
| - Middleware otimizado por grupo
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 🌐 ROTAS PÚBLICAS (SEM AUTENTICAÇÃO)
// ========================================

// Health Check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'environment' => app()->environment(),
        'version' => app()->version(),
    ]);
})->name('health');

// Teste simples
Route::get('/simple-test', function () {
    return response()->json(['status' => 'OK', 'message' => 'Servidor funcionando!']);
})->name('simple.test');

// Landing Pages
Route::get('/welcome', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::get('/landing/product-showcase', function () {
    return Inertia::render('LandingPages/ProductShowcase');
})->name('landing.product-showcase');

// Páginas Legais
Route::get('/terms-of-service', function () {
    return Inertia::render('Legal/TermsOfService');
})->name('terms.of.service');

Route::get('/privacy-policy', function () {
    return Inertia::render('Legal/PrivacyPolicy');
})->name('privacy.policy');

// ========================================
// 🔐 ROTAS DE AUTENTICAÇÃO
// ========================================
Route::middleware(['web'])->group(function () {
    // Login
    Route::get('/login', function () {
        return Inertia::render('Users/Auth/Login');
    })->name('login');

    Route::post('/login', [\App\Http\Controllers\Auth\WebAuthenticatedSessionController::class, 'store']);

    // Registro
    Route::get('/register', function () {
        return Inertia::render('Users/Auth/Register');
    })->name('register');
    
    Route::post('/register', [\App\Domains\Auth\Http\Controllers\RegisteredUserController::class, 'store']);

    // Recuperação de senha
    Route::get('/forgot-password', function () {
        return Inertia::render('Users/Auth/ForgotPassword');
    })->name('password.request');
    
    Route::post('/forgot-password', [\App\Domains\Auth\Http\Controllers\PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('/reset-password/{token}', function (string $token) {
        return Inertia::render('Users/Auth/ResetPassword', ['token' => $token]);
    })->name('password.reset');
    
    Route::post('/reset-password', [\App\Domains\Auth\Http\Controllers\NewPasswordController::class, 'store'])
        ->name('password.store');

    // Verificação de email
    Route::get('/verify-email', function () {
        return Inertia::render('Users/Auth/VerifyEmail');
    })->name('verification.notice');
    
    Route::get('/verify-email/{id}/{hash}', [\App\Domains\Auth\Http\Controllers\VerifyEmailController::class, 'verify'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    
    Route::post('/email/verification-notification', [\App\Domains\Auth\Http\Controllers\VerifyEmailController::class, 'send'])
        ->middleware(['throttle:6,1'])
        ->name('verification.send');

    // Confirmação de senha
    Route::get('/confirm-password', function () {
        return Inertia::render('Users/Auth/ConfirmPassword');
    })->name('password.confirm');
    
    Route::post('/confirm-password', [\App\Domains\Auth\Http\Controllers\ConfirmablePasswordController::class, 'store']);
});

// ========================================
// 🔐 ROTAS AUTENTICADAS (PRINCIPAIS)
// ========================================
Route::middleware(['web', 'auth'])->group(function () {
    // Página Principal - Seleção de Projetos
    Route::get('/', function () {
        return Inertia::render('Projects/ProjectSelector');
    })->name('home');
    
    // Seleção de Projetos
    Route::get('/projects', function () {
        return Inertia::render('Projects/ProjectSelector');
    })->name('projects.select');
    
    // Dashboard (só acessível com projeto selecionado)
    Route::get('/dashboard', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'renderDashboard'])
        ->name('dashboard');
    
    // Projeto selecionado (middleware para verificar se há projeto ativo)
    Route::middleware(['project.selected'])->group(function () {
        Route::get('/projects/universe', function () {
            return Inertia::render('Projects/Universe/index');
        })->name('projects.universe');
    });
    
    // Gerenciamento de projetos
    Route::post('/projects/select', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'select'])
        ->name('projects.select.store');
    Route::post('/projects', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'store'])
        ->name('projects.store');

    // Logout
    Route::post('/logout', [\App\Domains\Auth\Http\Controllers\AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    // ========================================
    // 📁 CARREGAMENTO MODULAR DE ROTAS
    // ========================================
    
    // Core Routes (sempre carregadas)
    require __DIR__ . '/modules/core.php';
    
    // Dashboard Routes
    if (config('modules.dashboard.enabled', true)) {
        require __DIR__ . '/modules/dashboard.php';
    }
    
    // Projects Routes
    if (config('modules.projects.enabled', true)) {
        require __DIR__ . '/modules/projects.php';
    }
    
    // Users Routes
    if (config('modules.users.enabled', true)) {
        require __DIR__ . '/modules/users.php';
    }
    
    // Workflows Routes
    if (config('modules.workflows.enabled', true)) {
        require __DIR__ . '/modules/workflows.php';
    }
    
    // Universe Routes
    if (config('modules.universe.enabled', true)) {
        require __DIR__ . '/modules/universe.php';
    }
    
    // Activity Routes
    if (config('modules.activity.enabled', true)) {
        require __DIR__ . '/modules/activity.php';
    }
    
    // Analytics Routes
    if (config('modules.analytics.enabled', true)) {
        require __DIR__ . '/modules/analytics.php';
    }
    
    // Email Marketing Routes
    if (config('modules.email_marketing.enabled', true)) {
        require __DIR__ . '/modules/email_marketing.php';
    }
    
    // AI Routes
    if (config('modules.ai.enabled', true)) {
        require __DIR__ . '/modules/ai.php';
    }
    
    // Aura Routes
    if (config('modules.aura.enabled', true)) {
        require __DIR__ . '/modules/aura.php';
    }
    
    // Social Buffer Routes
    if (config('modules.social_buffer.enabled', true)) {
        require __DIR__ . '/modules/social_buffer.php';
    }
    
    // Leads Routes
    if (config('modules.leads.enabled', true)) {
        require __DIR__ . '/modules/leads.php';
    }
    
    // Products Routes
    if (config('modules.products.enabled', true)) {
        require __DIR__ . '/modules/products.php';
    }
    
    // Categorization Routes
    if (config('modules.categorization.enabled', true)) {
        require __DIR__ . '/modules/categorization.php';
    }
    
    // Integrations Routes
    if (config('modules.integrations.enabled', true)) {
        require __DIR__ . '/modules/integrations.php';
    }
    
    // NodeRed Routes
    if (config('modules.nodered.enabled', true)) {
        require __DIR__ . '/modules/nodered.php';
    }
    
    // External Integrations Routes
    if (config('modules.external_integrations.enabled', true)) {
        require __DIR__ . '/modules/external_integrations.php';
    }
    
    // Landing Pages Routes
    if (config('modules.landing_pages.enabled', true)) {
        require __DIR__ . '/modules/landing_pages.php';
    }
});

// ========================================
// ⚙️ ROTAS ADMINISTRATIVAS
// ========================================
Route::prefix('admin')->middleware(['auth', 'can:manage-users'])->group(function () {
    Route::get('/users', function () {
        return Inertia::render('Admin/Users/Index');
    })->name('admin.users.index');
    
    Route::get('/users/create', function () {
        return Inertia::render('Admin/Users/Create');
    })->name('admin.users.create');
    
    Route::get('/users/{user}/edit', function ($user) {
        return Inertia::render('Admin/Users/Edit', ['user' => $user]);
    })->name('admin.users.edit');
    
    Route::get('/users/{user}', function ($user) {
        return Inertia::render('Admin/Users/Show', ['user' => $user]);
    })->name('admin.users.show');
    
    Route::get('/users/roles', function () {
        return Inertia::render('Admin/Users/Roles');
    })->name('admin.users.roles');
    
    Route::get('/users/permissions', function () {
        return Inertia::render('Admin/Users/Permissions');
    })->name('admin.users.permissions');
});

// ========================================
// 🧪 ROTAS DE DESENVOLVIMENTO (APENAS LOCAL)
// ========================================
if (app()->environment('local')) {
    // Auto Login para desenvolvimento
    Route::get('/dev-login', function () {
        $user = \App\Models\User::first();
        if (!$user) {
            $user = \App\Models\User::create([
                'name' => 'Desenvolvedor',
                'email' => 'dev@xwindash.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]);
        }
        Auth::login($user);
        return redirect('/dashboard');
    })->name('dev.login');
    
    // Rotas de teste
    Route::get('/test', function () {
        return Inertia::render('Test');
    })->name('test');
    
    Route::get('/test-page', function () {
        return Inertia::render('TestPage');
    })->name('test-page');
    
    Route::get('/test-inertia', function () {
        return Inertia::render('Test/InertiaTest');
    })->name('test.inertia');
    
    Route::get('/test-db-connection', function () {
        try {
            DB::connection()->getPdo();
            return 'Database connection successful!';
        } catch (\Exception $e) {
            return 'Database connection failed: ' . $e->getMessage();
        }
    })->name('test.db.connection');
    
    Route::get('/test-project-selector', function () {
        return Inertia::render('ProjectSelector', [
            'projects' => [
                [
                    'id' => '1',
                    'name' => 'Projeto Principal',
                    'description' => 'Projeto principal da empresa',
                    'status' => 'active',
                    'universe_enabled' => true,
                    'created_at' => now()->toISOString(),
                    'updated_at' => now()->toISOString(),
                ]
            ],
            'user' => [
                'id' => '1',
                'name' => 'Usuário Teste',
                'email' => 'teste@teste.com',
            ]
        ]);
    })->name('test.project.selector');
}

// ========================================
// 📁 INCLUSÃO DE ROTAS DE DOMÍNIO AUTH
// ========================================
require __DIR__ . '/../app/Domains/Auth/Http/routes.php';