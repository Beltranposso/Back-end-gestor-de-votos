-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-12-2024 a las 02:05:48
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
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) DEFAULT NULL,
  `Nombre` varchar(250) NOT NULL,
  `Apellido` varchar(250) NOT NULL,
  `Correo` varchar(250) DEFAULT NULL,
  `Cedula` int(11) NOT NULL,
  `quorum` float NOT NULL,
  `id_card` varchar(250) DEFAULT NULL,
  `EstadoVoto` enum('Si','No') NOT NULL DEFAULT 'No',
  `Apto` varchar(200) DEFAULT NULL,
  `cargo` int(11) NOT NULL DEFAULT 4,
  `Asistencia` enum('Presente','Ausente') NOT NULL DEFAULT 'Ausente',
  `createdAt` date NOT NULL DEFAULT current_timestamp(),
  `updatedAt` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `Nombre`, `Apellido`, `Correo`, `Cedula`, `quorum`, `id_card`, `EstadoVoto`, `Apto`, `cargo`, `Asistencia`, `createdAt`, `updatedAt`) VALUES
(NULL, 'dsfa', 'asdf', 'example@gmai', 7, 0.66, '0084a1b9-db46-4199-88ab-3ec491bce443', 'Si', 'b-76', 4, 'Presente', '2024-12-14', '2024-12-15'),
(NULL, 'as.dknfasn', 'sdfgs', 'qweq@sdsds', 8, 0.19, '0799c7d1-cbd1-4598-b346-91c072adf8b5', 'Si', 'c-45', 4, 'Ausente', '2024-12-14', '2024-12-15'),
(NULL, 'afsdf', 'asdfa', 'efgsd@xn--klj-6ma', 27, 0.31, '0084a1b9-db46-4199-88ab-3ec491bce443', 'Si', 'c-3', 4, 'Presente', '2024-12-14', '2024-12-15'),
(NULL, 'ernandes', 'batista', 'example@ksks', 564, 0.45, '0084a1b9-db46-4199-88ab-3ec491bce443', 'Si', 'h-3', 4, 'Presente', '2024-12-14', '2024-12-15'),
(NULL, 'edgar', 'btr', 'ASDa@e', 15263, 0.42, '0799c7d1-cbd1-4598-b346-91c072adf8b5', 'Si', 'b-76', 4, 'Ausente', '2024-12-14', '2024-12-15');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Cedula`),
  ADD KEY `id_card` (`id_card`),
  ADD KEY `Cargo` (`cargo`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_card`) REFERENCES `asambleas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`Cargo`) REFERENCES `cargos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
