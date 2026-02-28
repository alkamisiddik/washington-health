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
        Schema::create('environment_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('start_temp', 5, 2)->nullable();
            $table->decimal('start_humidity', 5, 2)->nullable();
            $table->decimal('mid_temp', 5, 2)->nullable();
            $table->decimal('mid_humidity', 5, 2)->nullable();
            $table->decimal('end_temp', 5, 2)->nullable();
            $table->decimal('end_humidity', 5, 2)->nullable();
            $table->boolean('start_in_range')->default(true);
            $table->boolean('mid_in_range')->default(true);
            $table->boolean('end_in_range')->default(true);
            $table->text('corrective_action')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('environment_logs');
    }
};
