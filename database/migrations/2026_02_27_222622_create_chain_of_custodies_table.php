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
        Schema::create('chain_of_custodies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('container_ids')->nullable();
            $table->string('condition')->nullable();
            $table->string('pickup_department')->nullable();
            $table->string('delivery_department')->nullable();
            $table->dateTime('pickup_time')->nullable();
            $table->dateTime('delivery_time')->nullable();
            $table->longText('driver_signature')->nullable();
            $table->longText('receiver_signature')->nullable();
            $table->text('exceptions')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chain_of_custodies');
    }
};
