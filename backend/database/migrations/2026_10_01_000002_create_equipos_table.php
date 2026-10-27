<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 20)->unique();
            $table->string('nombre', 120);
            $table->foreignId('categoria_id')
                  ->constrained()
                  ->restrictOnDelete();
            $table->enum('estado', ['disponible', 'prestado', 'mantenimiento'])
                  ->default('disponible')
                  ->index();
            $table->date('fecha_adquisicion');
            $table->decimal('costo_interno', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipos');
    }
};
