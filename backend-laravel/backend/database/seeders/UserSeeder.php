<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin credentials come from local .env only — never commit real passwords.
        $email = env('ADMIN_EMAIL', 'admin@example.com');
        $password = env('ADMIN_PASSWORD');

        if (! is_string($password) || trim($password) === '') {
            if ($this->command) {
                $this->command->warn(
                    'ADMIN_PASSWORD is not set in .env; skipping admin user seed. Configure ADMIN_EMAIL and ADMIN_PASSWORD locally.'
                );
            }

            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Administrator',
                'password' => $password,
                'is_admin' => true,
            ]
        );
    }
}
