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
        Schema::create('driver_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_id')->unique()->constrained()->cascadeOnDelete();
            $table->boolean('vehicle_clean')->default(false);
            $table->boolean('hvac_running')->default(false);
            $table->boolean('logger_active')->default(false);
            $table->boolean('separation_verified')->default(false);
            $table->boolean('containers_sealed')->default(false);
            $table->boolean('logs_completed')->default(false);
            $table->boolean('chain_of_custody_signed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_checklists');
    }
};
