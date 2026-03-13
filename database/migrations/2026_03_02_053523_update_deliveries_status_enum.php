<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE deliveries MODIFY COLUMN status ENUM('pending', 'assigned', 'picked_up', 'in_transit', 'in_progress', 'completed') DEFAULT 'pending'");
        }
        // SQLite does not support MODIFY COLUMN or ENUM; leave status as string
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE deliveries MODIFY COLUMN status ENUM('pending', 'assigned', 'in_progress', 'completed') DEFAULT 'pending'");
        }
    }
};
