<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('brand');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->string('short_description');
            $table->text('description');
            // Flexible per-product spec sheet: [{ "label": "...", "value": "..." }]
            $table->json('specs')->nullable();
            // Simple string list: ["IMPRES charger", "Carry holster", ...]
            $table->json('accessories')->nullable();
            // Nullable on purpose — B2B/govt pricing is usually "contact for quote"
            $table->decimal('price', 10, 2)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
