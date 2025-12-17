<?php

namespace Database\Seeders;

use App\Domains\Universe\Models\EnterpriseTenant;
use App\Domains\Universe\Models\EnterpriseUser;
use App\Domains\Universe\Models\EnterpriseProject;
use Illuminate\Database\Seeder;

class EnterpriseArchitectureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Enterprise Tenants
        $tenants = [
            [
                'name' => 'Acme Corporation',
                'description' => 'Leading technology company with global operations',
                'domain' => 'acme-corp.com',
                'subdomain' => 'acme',
                'plan_type' => 'enterprise',
                'plan_configuration' => [
                    'max_users' => -1,
                    'max_storage_gb' => -1,
                    'features' => ['sso', 'audit_logs', 'custom_integrations', 'dedicated_support'],
                ],
                'billing_info' => [
                    'billing_email' => 'billing@acme-corp.com',
                    'payment_method' => 'credit_card',
                    'billing_cycle' => 'monthly',
                ],
                'security_settings' => [
                    'sso_enabled' => true,
                    'mfa_required' => true,
                    'password_policy' => 'strong',
                    'session_timeout' => 480, // 8 hours
                ],
                'compliance_settings' => [
                    'gdpr_compliant' => true,
                    'sox_compliant' => true,
                    'hipaa_compliant' => false,
                    'audit_retention_days' => 2555, // 7 years
                ],
                'status' => 'active',
                'max_users' => -1,
                'max_storage_gb' => -1,
                'features_enabled' => ['sso', 'audit_logs', 'custom_integrations', 'dedicated_support'],
                'owner_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'metadata' => [
                    'industry' => 'Technology',
                    'company_size' => '1000+',
                    'founded_year' => 2010,
                ],
            ],
            [
                'name' => 'StartupXYZ',
                'description' => 'Innovative startup focused on AI and machine learning',
                'domain' => 'startupxyz.io',
                'subdomain' => 'startupxyz',
                'plan_type' => 'professional',
                'plan_configuration' => [
                    'max_users' => 50,
                    'max_storage_gb' => 100,
                    'features' => ['advanced_analytics', 'priority_support', 'custom_integrations'],
                ],
                'billing_info' => [
                    'billing_email' => 'admin@startupxyz.io',
                    'payment_method' => 'credit_card',
                    'billing_cycle' => 'monthly',
                ],
                'security_settings' => [
                    'sso_enabled' => false,
                    'mfa_required' => true,
                    'password_policy' => 'medium',
                    'session_timeout' => 240, // 4 hours
                ],
                'compliance_settings' => [
                    'gdpr_compliant' => true,
                    'sox_compliant' => false,
                    'hipaa_compliant' => false,
                    'audit_retention_days' => 365, // 1 year
                ],
                'status' => 'active',
                'max_users' => 50,
                'max_storage_gb' => 100,
                'features_enabled' => ['advanced_analytics', 'priority_support', 'custom_integrations'],
                'owner_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'metadata' => [
                    'industry' => 'AI/ML',
                    'company_size' => '10-50',
                    'founded_year' => 2022,
                ],
            ],
            [
                'name' => 'Small Business Solutions',
                'description' => 'Local business management and operations',
                'domain' => 'smallbiz.local',
                'subdomain' => 'smallbiz',
                'plan_type' => 'starter',
                'plan_configuration' => [
                    'max_users' => 10,
                    'max_storage_gb' => 10,
                    'features' => ['basic_analytics', 'standard_support'],
                ],
                'billing_info' => [
                    'billing_email' => 'owner@smallbiz.local',
                    'payment_method' => 'credit_card',
                    'billing_cycle' => 'monthly',
                ],
                'security_settings' => [
                    'sso_enabled' => false,
                    'mfa_required' => false,
                    'password_policy' => 'basic',
                    'session_timeout' => 120, // 2 hours
                ],
                'compliance_settings' => [
                    'gdpr_compliant' => false,
                    'sox_compliant' => false,
                    'hipaa_compliant' => false,
                    'audit_retention_days' => 90, // 3 months
                ],
                'status' => 'active',
                'max_users' => 10,
                'max_storage_gb' => 10,
                'features_enabled' => ['basic_analytics', 'standard_support'],
                'owner_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'metadata' => [
                    'industry' => 'Retail',
                    'company_size' => '1-10',
                    'founded_year' => 2020,
                ],
            ],
        ];

        foreach ($tenants as $tenantData) {
            $tenant = EnterpriseTenant::firstOrCreate(
                ['subdomain' => $tenantData['subdomain']],
                $tenantData
            );

            // Create Enterprise Users for each tenant
            $users = [
                [
                    'tenant_id' => $tenant->id,
                    'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                    'role' => 'admin',
                    'permissions' => ['*'],
                    'status' => 'active',
                    'accepted_at' => now(),
                ],
                [
                    'tenant_id' => $tenant->id,
                    'user_id' => '9fc52eb6-ce92-4ba7-8670-106729ee20a5',
                    'role' => 'manager',
                    'permissions' => ['read', 'write', 'manage_users'],
                    'status' => 'active',
                    'accepted_at' => now(),
                ],
                [
                    'tenant_id' => $tenant->id,
                    'user_id' => '9fc52eb6-ce92-4ba7-8670-106729ee20a5',
                    'role' => 'member',
                    'permissions' => ['read', 'write'],
                    'status' => 'active',
                    'accepted_at' => now(),
                ],
            ];

            foreach ($users as $userData) {
                EnterpriseUser::firstOrCreate(
                    ['tenant_id' => $userData['tenant_id'], 'user_id' => $userData['user_id']],
                    $userData
                );
            }

            // Create Enterprise Projects for each tenant
            $projects = [
                [
                    'tenant_id' => $tenant->id,
                    'name' => 'Main Project',
                    'description' => 'Primary project for ' . $tenant->name,
                    'status' => 'active',
                    'configuration' => [
                        'environment' => 'production',
                        'version' => '1.0.0',
                    ],
                    'security_settings' => [
                        'access_level' => 'standard',
                        'encryption' => true,
                    ],
                    'compliance_settings' => [
                        'data_retention' => 365,
                        'backup_frequency' => 'daily',
                    ],
                ],
                [
                    'tenant_id' => $tenant->id,
                    'name' => 'Development Project',
                    'description' => 'Development and testing environment',
                    'status' => 'active',
                    'configuration' => [
                        'environment' => 'development',
                        'version' => '0.9.0',
                    ],
                    'security_settings' => [
                        'access_level' => 'restricted',
                        'encryption' => true,
                    ],
                    'compliance_settings' => [
                        'data_retention' => 90,
                        'backup_frequency' => 'weekly',
                    ],
                ],
            ];

            foreach ($projects as $projectData) {
                EnterpriseProject::create($projectData);
            }
        }
    }
}