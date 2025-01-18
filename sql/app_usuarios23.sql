-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-12-2024 a las 10:52:00
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
-- Base de datos: `app_users`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `app_usuarios`
--

CREATE TABLE `app_usuarios` (
  `Cedula` int(30) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Apellido` varchar(150) NOT NULL,
  `Correo` varchar(200) NOT NULL,
  `Contraseña` varchar(200) DEFAULT NULL,
  `cargo` int(11) NOT NULL,
  `id_card` varchar(250) DEFAULT NULL,
  `Asistencia` enum('Presente','Ausente') DEFAULT NULL,
  `createdAt` date NOT NULL DEFAULT current_timestamp(),
  `updatedAt` date NOT NULL DEFAULT current_timestamp(),
  `id` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `app_usuarios`
--

INSERT INTO `app_usuarios` (`Cedula`, `Nombre`, `Apellido`, `Correo`, `Contraseña`, `cargo`, `id_card`, `Asistencia`, `createdAt`, `updatedAt`, `id`) VALUES
(123445, 'Alejandro', 'Beltran', 'example@gmail.com', '1234', 1, NULL, NULL, '2024-12-31', '2024-12-31', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `app_usuarios`
--
ALTER TABLE `app_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cargo` (`cargo`),
  ADD KEY `id_card` (`id_card`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `app_usuarios`
--
ALTER TABLE `app_usuarios`
  ADD CONSTRAINT `app_usuarios_ibfk_1` FOREIGN KEY (`Cargo`) REFERENCES `cargos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `app_usuarios_ibfk_2` FOREIGN KEY (`id_card`) REFERENCES `asambleas` (`id`) ON DELETE CASCADE ON UPDATE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
