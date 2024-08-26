-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-08-2024 a las 18:51:19
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
  `Contraseña` varchar(200) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL,
  `id` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `app_usuarios`
--

INSERT INTO `app_usuarios` (`Cedula`, `Nombre`, `Apellido`, `Correo`, `Contraseña`, `createdAt`, `updatedAt`, `id`) VALUES
(111111, 'Ntahalie', 'Russi', 'example@correo.com', '123N', '0000-00-00', '0000-00-00', 2),
(12345678, 'Jose ', 'Muñoz', 'example@gmil.com', '1290', '0000-00-00', '0000-00-00', 0),
(123456782, 'Alejandro ', 'Beltran Posso', 'Example_2@gmail.com', '9012', '0000-00-00', '2024-07-16', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asambleas`
--

CREATE TABLE `asambleas` (
  `id` int(11) NOT NULL,
  `Title` varchar(20) NOT NULL,
  `Color` varchar(20) NOT NULL,
  `UserId` int(200) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asambleas`
--

INSERT INTO `asambleas` (`id`, `Title`, `Color`, `UserId`, `createdAt`, `updatedAt`) VALUES
(1, 'Encuesta', 'blue', 123456782, '2024-08-26', '2024-08-26'),
(7, 'encuesta jose', 'black', 12345678, '2024-08-26', '2024-08-26'),
(2, 'Encuesta_2', 'red', 123456782, '2024-08-26', '2024-08-26'),
(4, 'encuesta_3', 'green', 111111, '2024-08-26', '0000-00-00'),
(0, 'encuesta_5', '#fff', 111111, '2024-08-26', '2024-08-26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `options`
--

CREATE TABLE `options` (
  `id` int(11) NOT NULL,
  `id_pregunta` varchar(110) NOT NULL,
  `opcion` text NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `options`
--

INSERT INTO `options` (`id`, `id_pregunta`, `opcion`, `createdAt`, `updatedAt`) VALUES
(1, 'te gusta la maraculla?', 'si', '0000-00-00', '0000-00-00'),
(2, 'te gusta la maraculla?', 'No', '0000-00-00', '0000-00-00'),
(3, 'te gusta el pollo? ', 'No', '2024-08-26', '2024-08-26'),
(4, 'te gusta el pollo? ', 'Si', '2024-08-26', '2024-08-26'),
(6, 'sos loca ? ', 'no', '2024-08-26', '2024-08-26'),
(7, 'sos loca ? ', 'si ', '2024-08-26', '2024-08-26'),
(73, 'prueba definitiva', 'sera ? ', '2024-08-26', '2024-08-26'),
(74, 'prueba definitiva', 'talvez?', '2024-08-26', '2024-08-26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `id` int(11) NOT NULL,
  `id_title` varchar(150) NOT NULL,
  `Pregunta` varchar(150) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`id`, `id_title`, `Pregunta`, `createdAt`, `updatedAt`) VALUES
(0, 'encuesta_5', 'prueba definitiva', '2024-08-26', '2024-08-26'),
(5, 'encuesta_3', 'sos loca ? ', '2024-08-26', '2024-08-26'),
(2, 'Encuesta_2', 'te gusta el pollo? ', '2024-08-26', '2024-08-26'),
(2, 'Encuesta', 'te gusta la maraculla?', '2024-08-26', '2024-08-26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `questions`
--

CREATE TABLE `questions` (
  `Id` int(11) NOT NULL,
  `id_titulo` varchar(20) NOT NULL,
  `Pregunta` text NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `questions`
--

INSERT INTO `questions` (`Id`, `id_titulo`, `Pregunta`, `createdAt`, `updatedAt`) VALUES
(12, 'encuesta_3', 'La gente es  rara ? ', '2024-08-22', '2024-08-22'),
(13, 'Encuesta_5', 'quien deberia ser ?', '2024-08-22', '2024-08-22');

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votes`
--

CREATE TABLE `votes` (
  `Id` int(11) NOT NULL,
  `id_Option` int(11) NOT NULL,
  `id_voter` int(11) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `app_usuarios`
--
ALTER TABLE `app_usuarios`
  ADD PRIMARY KEY (`Cedula`);

--
-- Indices de la tabla `asambleas`
--
ALTER TABLE `asambleas`
  ADD PRIMARY KEY (`Title`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `UserId_2` (`UserId`);

--
-- Indices de la tabla `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`Pregunta`),
  ADD KEY `id_title` (`id_title`);

--
-- Indices de la tabla `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `id_titulo` (`id_titulo`),
  ADD KEY `id_titulo_2` (`id_titulo`),
  ADD KEY `id_titulo_3` (`id_titulo`),
  ADD KEY `id_titulo_4` (`id_titulo`);

--
-- Indices de la tabla `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `id_Option` (`id_Option`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `options`
--
ALTER TABLE `options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT de la tabla `votes`
--
ALTER TABLE `votes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asambleas`
--
ALTER TABLE `asambleas`
  ADD CONSTRAINT `asambleas_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `app_usuarios` (`Cedula`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `options_ibfk_1` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`Pregunta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `preguntas_ibfk_1` FOREIGN KEY (`id_title`) REFERENCES `asambleas` (`Title`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`id_Option`) REFERENCES `options` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
