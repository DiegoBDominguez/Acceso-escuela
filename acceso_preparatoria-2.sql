-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-01-2026 a las 18:20:09
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `acceso_preparatoria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrativos`
--

CREATE TABLE `administrativos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `puesto` varchar(50) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido_paterno` varchar(50) NOT NULL,
  `apellido_materno` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `administrativos`
--

INSERT INTO `administrativos` (`id`, `usuario_id`, `puesto`, `nombre`, `apellido_paterno`, `apellido_materno`) VALUES
(4, 4, 'Director', 'Juan', 'Hernández', 'López'),
(5, 4, 'Director', 'Juan', 'Hernández', 'López');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

CREATE TABLE `alumnos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `matricula` varchar(20) DEFAULT NULL,
  `correo_institucional` varchar(100) DEFAULT NULL,
  `grado` int(11) NOT NULL,
  `grupo` varchar(5) NOT NULL,
  `turno` enum('MATUTINO','VESPERTINO') NOT NULL,
  `foto_url` longtext DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido_paterno` varchar(50) NOT NULL,
  `apellido_materno` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `alumnos`
--

INSERT INTO `alumnos` (`id`, `usuario_id`, `matricula`, `correo_institucional`, `grado`, `grupo`, `turno`, `foto_url`, `nombre`, `apellido_paterno`, `apellido_materno`) VALUES
(3, 1, NULL, 'diego.bustamante@escuela.edu.mx', 3, 'A', 'MATUTINO', NULL, 'Diego', 'Bustamante', 'Perez'),
(4, 6, NULL, 'prueba@test.com', 3, 'A', 'MATUTINO', NULL, 'Prueba', 'Test', 'Usuario'),
(6, 24, '202133226', 'prueba2@escuela.edu.mx', 2, 'B', 'MATUTINO', '/uploads/1769380940071.jpeg', 'Prueba2', 'Prueba', 'Prueba'),
(8, 34, '202135679', 'prueba2@escuela.edu.mx', 2, 'A', 'MATUTINO', NULL, 'Jose', 'Jose', 'Jose');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencias`
--

CREATE TABLE `asistencias` (
  `id` int(11) NOT NULL,
  `alumno_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_entrada` time DEFAULT NULL,
  `hora_salida` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `asistencias`
--

INSERT INTO `asistencias` (`id`, `alumno_id`, `fecha`, `hora_entrada`, `hora_salida`) VALUES
(1, 3, '2026-01-23', '17:15:26', '17:15:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal`
--

CREATE TABLE `personal` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido_paterno` varchar(100) NOT NULL,
  `apellido_materno` varchar(100) DEFAULT NULL,
  `matricula` varchar(20) NOT NULL,
  `rol` enum('ADMIN','ENTRADA') DEFAULT 'ADMIN',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `personal`
--

INSERT INTO `personal` (`id`, `usuario_id`, `nombre`, `apellido_paterno`, `apellido_materno`, `matricula`, `rol`, `fecha_registro`) VALUES
(10, 40, 'Jose', 'Perez', 'Perez', '5678', 'ENTRADA', '2026-01-26 16:37:47'),
(11, 41, 'Juan', 'Lopes', 'Sosa', '0987', 'ADMIN', '2026-01-26 16:44:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_entrada`
--

CREATE TABLE `personal_entrada` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido_paterno` varchar(50) NOT NULL,
  `apellido_materno` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `personal_entrada`
--

INSERT INTO `personal_entrada` (`id`, `usuario_id`, `nombre`, `apellido_paterno`, `apellido_materno`) VALUES
(1, 5, 'Carlos', 'Ramírez', 'Gómez');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `qr_tokens`
--

CREATE TABLE `qr_tokens` (
  `id` int(11) NOT NULL,
  `alumno_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expira_en` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `qr_tokens`
--

INSERT INTO `qr_tokens` (`id`, `alumno_id`, `token`, `expira_en`) VALUES
(1, 3, '7c8256153619fea18ff911efa81005136a9b5caa10d901fc78ff694fbfd05184', '2027-01-23 13:22:29'),
(2, 6, '19a2ee72fc96ba3aeb16447c9b7f18b615890f1b3423a233115131d91f6effd9', '2027-01-25 17:09:56'),
(3, 8, 'd7afcfdb8e788c1a3deb5f36a13ed52c6908fd0b66575641560ee5c49812cdd6', '2027-01-26 09:46:50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `matricula` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ALUMNO','ADMIN','ENTRADA') NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `matricula`, `password`, `rol`, `activo`, `created_at`) VALUES
(1, '202133193', '$2b$10$spXuyjk8Mx662dzPBcHivuxiLs2NOLNidoJ0a3FyFDq8t4jbmw.wa', 'ALUMNO', 1, '2026-01-21 22:42:58'),
(4, 'ADMIN001', '$2b$10$p8osbo.XXtIlX3Yjf2wnJecsjvpilPGh0eTGZaYMSwPusM56Hq0b.', 'ADMIN', 1, '2026-01-23 17:31:41'),
(5, 'ENTRADA001', '$2b$10$0GCEJinfQpeDJ2gjSZWaI.e.C4Ub/p7AdcmXLM0Tr11JQ5STRmAuG', 'ENTRADA', 1, '2026-01-23 18:39:53'),
(6, '1233456789', '$2b$10$.0FXYSHqmmSaM1AbeKJ8De1HqpqmhMPs8x4BluBPGCqpyn8/E/CSG', 'ALUMNO', 1, '2026-01-23 23:20:57'),
(24, '202133226', '$2b$10$0e3b.Y2BQSUjeU6jN08eZeF3AzTpAmwQ7rDnajrHm.8uzchBb2Ybi', 'ALUMNO', 1, '2026-01-25 22:42:20'),
(32, '202135667', '$2b$10$ixh7YFVIBS9KuuCpTLqNd.gQxI9I6EcIX0ggafoSToMPcP6EbJGAq', 'ALUMNO', 1, '2026-01-26 08:52:59'),
(34, '202135679', '$2b$10$/YvGRqsiteJx96VemYxxI.k5fMDerzUlB6sgEvwEQnm.kZuaWOrjG', 'ALUMNO', 1, '2026-01-26 15:46:17'),
(40, '5678', '$2b$10$ZLlaJA9hum2J.DD8xZKoVuAk1qqSYva8z56HIVCi4ExSUFqjjVTFq', 'ENTRADA', 1, '2026-01-26 16:37:47'),
(41, '0987', '$2b$10$l9eDM7F9pyHBf5cyHz4UieqHlCSg5t2sfle04GM2.1rmC56gxF12i', 'ADMIN', 1, '2026-01-26 16:44:37'),
(42, '202137558', '$2b$10$ZGceWMFYUDaRckuObnk0FOo.L4AwwgEgJ8OIZzQGPvDFQb63sws.C', 'ALUMNO', 1, '2026-01-26 16:46:24');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrativos`
--
ALTER TABLE `administrativos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `alumno_fecha` (`alumno_id`,`fecha`);

--
-- Indices de la tabla `personal`
--
ALTER TABLE `personal`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricula` (`matricula`),
  ADD KEY `fk_usuario_personal` (`usuario_id`);

--
-- Indices de la tabla `personal_entrada`
--
ALTER TABLE `personal_entrada`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `qr_tokens`
--
ALTER TABLE `qr_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `alumno_id` (`alumno_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricula` (`matricula`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administrativos`
--
ALTER TABLE `administrativos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `personal`
--
ALTER TABLE `personal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `personal_entrada`
--
ALTER TABLE `personal_entrada`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `qr_tokens`
--
ALTER TABLE `qr_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administrativos`
--
ALTER TABLE `administrativos`
  ADD CONSTRAINT `administrativos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD CONSTRAINT `alumnos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`);

--
-- Filtros para la tabla `personal`
--
ALTER TABLE `personal`
  ADD CONSTRAINT `fk_usuario_personal` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `personal_entrada`
--
ALTER TABLE `personal_entrada`
  ADD CONSTRAINT `personal_entrada_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `qr_tokens`
--
ALTER TABLE `qr_tokens`
  ADD CONSTRAINT `qr_tokens_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
