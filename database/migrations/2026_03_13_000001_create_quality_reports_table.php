<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quality_reports', function (Blueprint $table) {
            $table->id();
            $table->string('month_year', 7); // e.g. "2026-03"
            $table->string('vehicle_ids')->nullable(); // comma-separated or JSON
            $table->string('transport_days_reviewed')->nullable();
            $table->text('environmental_excursions')->nullable();
            $table->text('corrective_actions')->nullable();
            $table->text('training_issues')->nullable();
            $table->text('preventive_improvements')->nullable();
            $table->string('supervisor_name')->nullable();
            $table->string('signature_date')->nullable();
            $table->foreignId('delivery_id')->nullable()->constrained('deliveries')->nullOnDelete();
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quality_reports');
    }
};
