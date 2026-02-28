<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chain_of_custodies', function (Blueprint $table) {
            $table->dateTime('driver_signed_at')->nullable()->after('driver_signature');
            $table->dateTime('receiver_signed_at')->nullable()->after('receiver_signature');
        });
    }

    public function down(): void
    {
        Schema::table('chain_of_custodies', function (Blueprint $table) {
            $table->dropColumn(['driver_signed_at', 'receiver_signed_at']);
        });
    }
};
