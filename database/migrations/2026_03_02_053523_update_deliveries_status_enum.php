<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE deliveries MODIFY COLUMN status ENUM('pending', 'assigned', 'picked_up', 'in_transit', 'in_progress', 'completed') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE deliveries MODIFY COLUMN status ENUM('pending', 'assigned', 'in_progress', 'completed') DEFAULT 'pending'");
    }
};
