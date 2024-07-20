-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 20-07-2024 a las 05:47:52
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
  `id` int(11) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Apellido` varchar(150) NOT NULL,
  `Correo` varchar(200) NOT NULL,
  `Cedula` int(30) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `app_usuarios`
--

INSERT INTO `app_usuarios` (`id`, `Nombre`, `Apellido`, `Correo`, `Cedula`, `createdAt`, `updatedAt`) VALUES
(1, 'Alejandro ', 'Beltran Posso', 'Example_2@gmail.com', 123456782, '0000-00-00', '2024-07-16'),
(23, 'Alejandro', 'de la espriella', 'Example_2@gmail.com', 12345667, '2024-07-19', '2024-07-19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cards`
--

CREATE TABLE `cards` (
  `Id` int(11) NOT NULL,
  `Title` varchar(250) NOT NULL,
  `Content` varchar(300) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL,
  `Color` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cards`
--

INSERT INTO `cards` (`Id`, `Title`, `Content`, `createdAt`, `updatedAt`, `Color`) VALUES
(1, 'Votacion_1', 'Subtitulo', '0000-00-00', '0000-00-00', 'blue'),
(15, 'Votacion_2', 'Contenido_2', '2024-07-20', '2024-07-20', '#d3eabc'),
(16, 'Votacion_3', '', '2024-07-20', '2024-07-20', '#edc6f4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) DEFAULT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Apellido` varchar(150) NOT NULL,
  `Correo` varchar(200) NOT NULL,
  `Cedula` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `Nombre`, `Apellido`, `Correo`, `Cedula`) VALUES
(1, 'Alejandro', 'Beltran Posso', 'example@correo.com', 0),
(1, 'Alejandro', 'Beltran Posso', 'example@correo.com', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `app_usuarios`
--
ALTER TABLE `app_usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `app_usuarios`
--
ALTER TABLE `app_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `cards`
--
ALTER TABLE `cards`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
