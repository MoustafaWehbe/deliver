<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // $this->call(UserSeeder::class);
        $this->call(RoleSeeder::class);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        Model::reguard();
    }
}

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table((new Role)->getTable())->truncate();

        Role::insert([
            [
                'id'    => 1,
                'name' => 'manager',
            ],
            [
                'id'    => 2,
                'name' => 'admin',
            ],
            [
            	'id'    => 3,
            	'name' => 'client'
            ],
            [
            	'id'    => 4,
            	'name' => 'accountant'
            ],
            [
            	'id'    => 5,
            	'name' => 'agent'
            ]
        ]);
    }
}
