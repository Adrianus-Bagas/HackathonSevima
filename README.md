## Route Planner

Pada aplikasi route planner, saya membuat database dengan table bernama BusStops dan memiliki empat field yaitu id, x_axis, y_axis, dan name dimana x_axis dan y_axis bernilai antara 0-19. Saya membuat API /api/rute dimana pada service layernya terdapat proses pencarian jarak terpendek menggunakan algoritam A*. Response dari API tersebut adalah grid yang dilalui dan total jarak. Dalam UI nya, dibuat sebuah grid berukuran 20x20 dan diwarnai putih untuk jalur tersedia dan warna hitam untuk jalur tertutup. Ketika button get route diklik, maka grid yang dilalui akan berwarna hijau.

## Finance Tracker
Pada aplikasi finance tracker, saya membuat database dengan 2 table, yaitu user dan transaction. Hubungan antara user dan transaction adalah OneToMany. Saya membuat API /upload untuk mengupload transaksi berupa file csv dan pada service layernya terdapat logic dimana value pada csv akan diparse dan akan ditambahkan pada table transaction. Saya juga membuat API filter and pagination dimana user dapat melakukan filter berdasarkan kriteria yang ingin dicari.

Beberapa dokumentasi dalam proses pembuatan aplikasi terdapat dalam ppt yang sudah saya upload pada repository ini. Terima kasih.
