<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('salespulse_analytics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('notification_id');
            $table->string('event_type'); // impression, click, dismiss
            $table->timestamp('event_time');
            $table->timestamps();

            $table->foreign('notification_id')->references('id')->on('salespulse_notifications')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('salespulse_analytics');
    }
}; 