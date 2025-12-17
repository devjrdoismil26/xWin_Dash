<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User Management
            'manage users',
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view user statistics',
            
            // Project Management
            'manage projects',
            'view projects',
            'create projects',
            'edit projects',
            'delete projects',
            'manage system projects',
            
            // Workflow Management
            'manage workflows',
            'view workflows',
            'create workflows',
            'edit workflows',
            'delete workflows',
            'execute workflows',
            
            // Social Buffer
            'manage social posts',
            'view social posts',
            'create social posts',
            'edit social posts',
            'delete social posts',
            'publish social posts',
            
            // AI Services
            'manage ai services',
            'use ai services',
            'view ai generations',
            'configure ai providers',
            
            // Email Marketing
            'manage email campaigns',
            'view email campaigns',
            'create email campaigns',
            'edit email campaigns',
            'delete email campaigns',
            'send email campaigns',
            
            // Analytics & Reports
            'view analytics',
            'manage analytics',
            'export reports',
            
            // System Administration
            'manage system settings',
            'view system logs',
            'manage integrations',
            'configure apis',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        $superAdminRole->givePermissionTo(Permission::all());

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo([
            'manage users',
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view user statistics',
            'manage projects',
            'view projects',
            'create projects',
            'edit projects',
            'delete projects',
            'manage workflows',
            'view workflows',
            'create workflows',
            'edit workflows',
            'delete workflows',
            'execute workflows',
            'manage social posts',
            'view social posts',
            'create social posts',
            'edit social posts',
            'delete social posts',
            'publish social posts',
            'manage ai services',
            'use ai services',
            'view ai generations',
            'manage email campaigns',
            'view email campaigns',
            'create email campaigns',
            'edit email campaigns',
            'delete email campaigns',
            'send email campaigns',
            'view analytics',
            'manage analytics',
            'export reports',
        ]);

        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $managerRole->givePermissionTo([
            'view users',
            'manage projects',
            'view projects',
            'create projects',
            'edit projects',
            'manage workflows',
            'view workflows',
            'create workflows',
            'edit workflows',
            'execute workflows',
            'manage social posts',
            'view social posts',
            'create social posts',
            'edit social posts',
            'publish social posts',
            'use ai services',
            'view ai generations',
            'manage email campaigns',
            'view email campaigns',
            'create email campaigns',
            'edit email campaigns',
            'send email campaigns',
            'view analytics',
            'export reports',
        ]);

        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->givePermissionTo([
            'view projects',
            'view workflows',
            'execute workflows',
            'view social posts',
            'create social posts',
            'edit social posts',
            'use ai services',
            'view ai generations',
            'view email campaigns',
            'view analytics',
        ]);

        $editorRole = Role::firstOrCreate(['name' => 'editor']);
        $editorRole->givePermissionTo([
            'view projects',
            'view workflows',
            'create workflows',
            'edit workflows',
            'execute workflows',
            'manage social posts',
            'view social posts',
            'create social posts',
            'edit social posts',
            'publish social posts',
            'use ai services',
            'view ai generations',
            'view email campaigns',
            'create email campaigns',
            'edit email campaigns',
            'view analytics',
        ]);

        $this->command->info('Roles and permissions created successfully!');
    }
}