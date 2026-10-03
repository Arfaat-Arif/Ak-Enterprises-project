<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            // 'brand' = Motorola/Hytera/ICOM/Baofeng, 'product_type' = Hand Held
            // Radios / Base & Vehicle Stations, 'security' = CCTV & Security.
            $table->enum('type', ['brand', 'product_type', 'security'])->default('brand');
            $table->string('image_path')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
