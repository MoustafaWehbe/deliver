<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');
            $table->string('shipmentCode', 100)->unique();
            $table->string('receiverName');
            $table->string('receiverPhone');
            $table->string('receiverAddress');
            $table->string('receiverLandmark');
            $table->string('createdBy');
            $table->string('fees');
            $table->string('currency');
            $table->string('barcode')->nullable();
            $table->string('status');
            $table->string('serviceType');
            $table->string('weight');
            $table->string('comment')->nullable();
            $table->tinyInteger('isTransferedConfirmed')->nullable();
            $table->string('itemDescription')->nullable();
            $table->tinyInteger('isPaid');
            $table->tinyInteger('isDelayed')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['deleted_at']);

            // $table->unsignedInteger('companyId')->nullable();
            $table->unsignedInteger('customerId')->nullable();
            $table->unsignedInteger('driverId')->nullable();
            $table->unsignedInteger('branchId')->nullable();
            $table->unsignedInteger('lastTransferBranchId')->nullable();
        });
        Schema::table('orders', function (Blueprint $table) {
            // $table->foreign('companyId')->references('id')->on('company')->onDelete('cascade');
            $table->foreign('customerId')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('branchId')->references('id')->on('branches')->onDelete('cascade');
            $table->foreign('lastTransferBranchId')->references('id')->on('branches')->onDelete('cascade');
            $table->foreign('driverId')->references('id')->on('drivers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
