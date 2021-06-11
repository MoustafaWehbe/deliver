Backend: 
    local run: php artisan serve
    php artisan migrate:fresh --seed (for updating the db tables, fresh is for deleting everything, seed for data seed. Check Laravel)

Server:
    heroku config (check the configs of the server)
    heroku open
    heroku run bash
    heroku run {{You Command like php artisan migrate:fresh --seed}}
    push the code for build: git push heroku master

Front-end: code inside resources/frontend
    local dev: npm start
    prod build: ng build --prod && cp ../../public/index.html ../views/angular.blade.php
    NOTE: the above command will remove the files ".htaccess" "index.php" "robots.txt" and "web.config" so make sure to copy these files
    from the public directory, and then run the build command, and after it finishes paste the 4 files back to the public dir since they are required for the apache web server

MYSQL DB:
    local: run mysql locally. db configs are in the .env file in the rood dir (host, port, username, pass...)
    for MySQL on heroku the configs can be changed on the heroku website/settings
    when pushing to prod, check database.php file and make sure the follwing are being user in the mysql list inside connections:
        $url = parse_url(getenv("CLEARDB_DATABASE_URL"));
        $host = $url["host"] ?? null;
        $username = $url["user"] ?? null;
        $password = $url["pass"] ?? null;
        $database = substr($url["path"], 1);
    to connect to db on heroku, you need to check the host, username and password on heroku website by clicking on mysqldb instance 

Others:
    echo "web: vendor/bin/heroku-php-apache2 public/" > Procfile
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
    ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
