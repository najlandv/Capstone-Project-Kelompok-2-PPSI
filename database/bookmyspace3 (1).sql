-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 28 Nov 2024 pada 07.32
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bookmyspace3`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `detailpeminjamans`
--

CREATE TABLE `detailpeminjamans` (
  `idPeminjaman` int(11) NOT NULL,
  `idRuangan` int(11) NOT NULL,
  `tanggalMulai` date NOT NULL,
  `tanggalSelesai` date NOT NULL,
  `jamMulai` time NOT NULL,
  `jamSelesai` time NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `detailpeminjamans`
--

INSERT INTO `detailpeminjamans` (`idPeminjaman`, `idRuangan`, `tanggalMulai`, `tanggalSelesai`, `jamMulai`, `jamSelesai`, `createdAt`, `updatedAt`) VALUES
(6, 1, '2024-11-26', '2024-11-28', '09:22:00', '09:23:00', '2024-11-26 02:26:49', '2024-11-26 02:26:49'),
(7, 1, '2024-11-26', '2024-11-27', '09:50:00', '09:50:00', '2024-11-26 02:49:00', '2024-11-26 02:49:00'),
(8, 1, '2024-11-29', '2024-11-30', '10:35:00', '10:35:00', '2024-11-26 03:35:40', '2024-11-26 03:35:40');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifikasis`
--

CREATE TABLE `notifikasis` (
  `idNotifikasi` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `notifikasis`
--

INSERT INTO `notifikasis` (`idNotifikasi`, `idUser`, `message`, `createdAt`, `updatedAt`) VALUES
(1, 12, 'Peminjaman ruangan Anda dengan ID 1 telah diterima oleh admin', '2024-11-25 17:53:30', '2024-11-25 17:53:30'),
(2, 12, 'Peminjaman ruangan Anda dengan ID 2 telah diterima oleh admin', '2024-11-25 18:02:23', '2024-11-25 18:02:23'),
(3, 10, 'Peminjaman ruangan Anda dengan ID 3 telah diterima oleh admin', '2024-11-25 23:31:21', '2024-11-25 23:31:21'),
(4, 10, 'Peminjaman ruangan Anda dengan ID 6 telah diterima oleh admin', '2024-11-26 03:56:33', '2024-11-26 03:56:33'),
(5, 10, 'Peminjaman ruangan Anda dengan ID 7 telah diterima oleh admin', '2024-11-26 04:23:15', '2024-11-26 04:23:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `peminjamans`
--

CREATE TABLE `peminjamans` (
  `idPeminjaman` int(11) NOT NULL,
  `idPeminjam` int(11) NOT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `kegiatan` varchar(255) NOT NULL,
  `tanggalMulai` datetime NOT NULL,
  `tanggalSelesai` datetime NOT NULL,
  `formulir` varchar(255) NOT NULL,
  `statusPengajuan` enum('Menunggu','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu',
  `tanggalKeputusan` datetime DEFAULT NULL,
  `alasanPenolakan` varchar(255) DEFAULT NULL,
  `suratPeminjaman` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `peminjamans`
--

INSERT INTO `peminjamans` (`idPeminjaman`, `idPeminjam`, `idAdmin`, `kegiatan`, `tanggalMulai`, `tanggalSelesai`, `formulir`, `statusPengajuan`, `tanggalKeputusan`, `alasanPenolakan`, `suratPeminjaman`, `createdAt`, `updatedAt`) VALUES
(6, 10, 1, 'aaaaaa', '2024-11-26 00:00:00', '2024-11-28 00:00:00', 'ruangan_UNAND.jpeg.jpg-1732588009507.jpg', 'Disetujui', '2024-11-26 03:56:33', NULL, '2211522021_naufal aja_2024-11-26_10-56-21-240.pdf', '2024-11-26 02:26:49', '2024-11-26 03:56:33'),
(7, 10, 1, 'bbbbbbbbb', '2024-11-26 00:00:00', '2024-11-27 00:00:00', 'ruangan_LOGO SIMAPAN FIX.png-1732589340178.png', 'Disetujui', '2024-11-26 04:23:15', NULL, '2211522021_naufal aja_2024-11-26_11-23-3-385.pdf', '2024-11-26 02:49:00', '2024-11-26 04:23:15'),
(8, 10, 1, 'cccccccccccccccccc', '2024-11-29 00:00:00', '2024-11-30 00:00:00', 'ruangan_LOGO SIMAPAN SIDEBAR.png-1732592140046.png', 'Menunggu', NULL, NULL, NULL, '2024-11-26 03:35:40', '2024-11-26 03:35:40');

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
  `idRole` int(11) NOT NULL,
  `namaRole` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `roles`
--

INSERT INTO `roles` (`idRole`, `namaRole`, `createdAt`, `updatedAt`) VALUES
(1, 'user', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'admin', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `ruangans`
--

CREATE TABLE `ruangans` (
  `idRuangan` int(11) NOT NULL,
  `namaRuangan` varchar(255) NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `kapasitas` int(255) NOT NULL,
  `fasilitas` varchar(255) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `statusKetersediaan` enum('Tersedia','Dipinjam') NOT NULL DEFAULT 'Tersedia',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `ruangans`
--

INSERT INTO `ruangans` (`idRuangan`, `namaRuangan`, `lokasi`, `kapasitas`, `fasilitas`, `foto`, `statusKetersediaan`, `createdAt`, `updatedAt`) VALUES
(1, 'ruangan 1', 'padanng', 102, 'bagus', 'ruangan_LOGO SIMAPAN SIDEBAR.png-1732775174775.png', 'Dipinjam', '2024-11-25 17:51:21', '2024-11-28 06:26:14'),
(2, 'ruangan 2', 'padang', 15, 'baguss', 'ruangan_adasadas.png-1732557102707.png', 'Tersedia', '2024-11-25 17:51:42', '2024-11-25 18:06:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data untuk tabel `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20240509172358-create-role.js'),
('20240509172537-create-user.js'),
('20240526174616-create-notifikasi.js'),
('20240526174708-create-peminjaman.js'),
('20240526174744-create-ruangan.js'),
('20240526182400-create-detail-peminjaman.js');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `idUser` int(11) NOT NULL,
  `idRole` int(11) DEFAULT NULL,
  `nama` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `noHp` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`idUser`, `idRole`, `nama`, `username`, `password`, `noHp`, `gender`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'admin', 'admin', '$2b$10$szkO4FMgt/inshay7uWSyuwsl0DIc23Q3CyNy22SZzaG59dtU.gIi', 'None', 'None', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 1, 'Mustafa Fathur Rahman', '2211522036', '$2b$10$0WadHsy17qfHKs5uuTU49eh5wLd8E7FfumoYFfug.t.l/j3nvWREu', '082268108031', 'Laki-laki', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 1, 'Naufal Adli Dhiaurrahman', '2211521008', '$2b$10$0WadHsy17qfHKs5uuTU49eBV9xcFlbvOY8sg.GrYP4SoEED5u4ABu', '08123', 'Laki-laki', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 1, 'Laura Iffa Razitta', '2211523020', '$2b$10$0WadHsy17qfHKs5uuTU49eGd/DRIUk/aFy4KAmIte8fVq8HvU5.36', '0822', 'Perempuan', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, 1, 'naufal', '2211522020', '$2a$10$QRDdfZIA8.SehdAOcCy3LuPMdZxWcvfhiM9c/WeasX9ag/WybXqZ2', '08', 'Laki-laki', '2024-11-25 17:34:55', '2024-11-25 17:34:55'),
(10, 1, 'naufal aja', '2211522021', '$2a$10$Vt0LH0dfINFbQ8UlN0OyROMy0ZnWlBp5/qQNUlesfXwrKPuRx3Yom', '087878449687', 'Laki-laki', '2024-11-25 17:42:07', '2024-11-25 17:42:07'),
(11, 1, 'adasd', '22115220201', '$2a$10$3.J/MLTvx8EbqBtGll8f8O5GbElMepvA3zqC5kCc2uqWlmUWC4bQe', '087878449687', 'Laki-laki', '2024-11-25 17:43:49', '2024-11-25 17:43:49'),
(12, 1, 'asdads', '22115220200', '$2a$10$3kZ5EY4uoad5e3dW/DhU...VIV.5/s9x3iFbR5PFMRB4JUt0JNW86', '087878449687', 'Laki-laki', '2024-11-25 17:49:28', '2024-11-25 17:49:28');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `detailpeminjamans`
--
ALTER TABLE `detailpeminjamans`
  ADD KEY `idPeminjaman` (`idPeminjaman`),
  ADD KEY `idRuangan` (`idRuangan`);

--
-- Indeks untuk tabel `notifikasis`
--
ALTER TABLE `notifikasis`
  ADD PRIMARY KEY (`idNotifikasi`),
  ADD KEY `idUser` (`idUser`);

--
-- Indeks untuk tabel `peminjamans`
--
ALTER TABLE `peminjamans`
  ADD PRIMARY KEY (`idPeminjaman`),
  ADD KEY `idPeminjam` (`idPeminjam`),
  ADD KEY `idAdmin` (`idAdmin`);

--
-- Indeks untuk tabel `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`idRole`);

--
-- Indeks untuk tabel `ruangans`
--
ALTER TABLE `ruangans`
  ADD PRIMARY KEY (`idRuangan`);

--
-- Indeks untuk tabel `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idRole` (`idRole`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `notifikasis`
--
ALTER TABLE `notifikasis`
  MODIFY `idNotifikasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `peminjamans`
--
ALTER TABLE `peminjamans`
  MODIFY `idPeminjaman` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `roles`
--
ALTER TABLE `roles`
  MODIFY `idRole` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `ruangans`
--
ALTER TABLE `ruangans`
  MODIFY `idRuangan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `detailpeminjamans`
--
ALTER TABLE `detailpeminjamans`
  ADD CONSTRAINT `detailpeminjamans_ibfk_1` FOREIGN KEY (`idPeminjaman`) REFERENCES `peminjamans` (`idPeminjaman`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detailpeminjamans_ibfk_2` FOREIGN KEY (`idRuangan`) REFERENCES `ruangans` (`idRuangan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `notifikasis`
--
ALTER TABLE `notifikasis`
  ADD CONSTRAINT `notifikasis_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `peminjamans`
--
ALTER TABLE `peminjamans`
  ADD CONSTRAINT `peminjamans_ibfk_1` FOREIGN KEY (`idPeminjam`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `peminjamans_ibfk_2` FOREIGN KEY (`idAdmin`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`idRole`) REFERENCES `roles` (`idRole`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
