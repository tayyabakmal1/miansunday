<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('salespulse_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type')->default('real'); // real or fake
            $table->string('buyer_name');
            $table->string('city')->nullable();
            $table->string('product_title');
            $table->unsignedBigInteger('product_id')->nullable();
            $table->boolean('is_fake')->default(false);
            $table->timestamp('shown_at')->nullable();
            $table->timestamp('dismissed_at')->nullable();
            $table->timestamp('clicked_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('salespulse_notifications');
    }
}; 