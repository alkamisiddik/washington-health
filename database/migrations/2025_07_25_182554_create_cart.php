<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cart', function (Blueprint $table) {
            $table->id();
            $table->enum('cart_type', ['Crash Cart', 'Urology Cart', 'Broselow Cart', 'Chest Tube Cart', 'Peacemaker Cart', 'Intubation Box', 'MH Cart'])->default('Crash Cart');
            $table->string('cart_number');
            $table->string('medi_lock')->nullable();
            $table->string('supply_lock')->nullable();
            $table->date('last_checked_date')->nullable();
            $table->string('qr_code');
            $table->foreignId('location_id')->constrained('location')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->timestamps();
            $table->unique(['cart_type', 'cart_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart');
    }
};
