Web Peminjaman Ruangan: Capstone-Project-Kelompok-2-PPSI
How to use
Clone repository

bash
Copy code
git clone https://github.com/najlandv/Capstone-Project-Kelompok-2-PPSI.git
Masuk ke folder project

bash
Copy code
cd Capstone-Project-Kelompok-2-PPSI
Install node modules

bash
Copy code
npm install
Isi variabel .env sesuai database, jwt secret code, dan pusher api key yang dimiliki

bash
Copy code
 DB_HOST = localhost
 DB_NAME = ""
 DB_USERNAME = ""
 DB_PASSWORD = ""
 DB_CONNECTION = "mysql"
 PORT = 3000
 NODE_ENV = "development"

 JWT_SECRET = 
 JWT_COOKIE_EXPIRES_IN = 3600
 JWT_EXPIRES_IN = "60m"

 PUSHER_APP_ID=
 PUSHER_APP_KEY=
 PUSHER_APP_SECRET=
 PUSHER_APP_CLUSTER=
Lakukan migrasi tabel dari Express ke database

bash
Copy code
npx sequelize-cli db:migrate
Jalankan seeder untuk mengirim data ke database

bash
Copy code
npx sequelize-cli db:seed:all
Jalankan Express di terminal

bash
Copy code
npm run dev # untuk menjalankan Express
Opsional: Jalankan proses build untuk CSS (jika menggunakan Tailwind)

bash
Copy code
npm run build # untuk menjalankan Tailwind


Tentang Proyek
Proyek ini merupakan hasil kerja kelompok dalam mata kuliah Pengembangan Perangkat Sistem Informasi (PPSI). Sistem ini dirancang untuk mempermudah proses peminjaman ruangan dengan fitur-fitur seperti autentikasi, manajemen pengguna, dan antarmuka yang responsif.

Teknologi yang Digunakan
Backend: Node.js, Express.js
Frontend: EJS, CSS, Tailwind (opsional)
Database: MySQL dengan Sequelize ORM
Autentikasi: JSON Web Token (JWT)
Notifikasi Real-Time: Pusher