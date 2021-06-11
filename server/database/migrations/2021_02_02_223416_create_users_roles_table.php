<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersRolesTable extends Migration
{
    public function up()
    {
        Schema::create('users_roles', function (Blueprint $table) {
            $table->unsignedInteger('userId');
            $table->unsignedInteger('roleId');
            $table->timestamps();

            //FOREIGN KEY CONSTRAINTS
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('roleId')->references('id')->on('roles')->onDelete('cascade');

            //SETTING THE PRIMARY KEYS
            $table->primary(['userId', 'roleId']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('users_roles');
    }
}
