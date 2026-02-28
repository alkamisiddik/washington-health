<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'role' => 'admin',
            'password' => Hash::make('12345678'),
        ]);

        User::factory()->create([
            'name' => 'Officer User',
            'email' => 'officer@gmail.com',
            'role' => 'officer',
            'password' => Hash::make('12345678'),
        ]);

        User::factory()->create([
            'name' => 'Driver User',
            'email' => 'driver@gmail.com',
            'role' => 'driver',
            'password' => Hash::make('12345678'),
        ]);
    }
}
