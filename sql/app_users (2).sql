-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-11-2024 a las 19:33:14
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
  `id_cargo` int(250) NOT NULL,
  `poder` float NOT NULL,
  `createdAt` date NOT NULL DEFAULT current_timestamp(),
  `updatedAt` date NOT NULL DEFAULT current_timestamp(),
  `id` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `app_usuarios`
--

INSERT INTO `app_usuarios` (`Cedula`, `Nombre`, `Apellido`, `Correo`, `Contraseña`, `id_cargo`, `poder`, `createdAt`, `updatedAt`, `id`) VALUES
(1234567, 'Alejandro', 'De la Espriella Cardona', 'Example@gmail.com', '1234', 1, 3.5, '0000-00-00', '0000-00-00', 0),
(2394232, 'Martín', 'Fernández', 'example@correo', NULL, 2, 6.5, '2024-11-12', '2024-11-12', 0),
(2893764, 'Lucas ', 'Ramírez', 'example@correo', NULL, 2, 2.5, '2024-11-12', '2024-11-12', 0),
(4434344, 'Isabella', 'Isabella', 'example@correo', NULL, 2, 8.5, '2024-11-12', '2024-11-12', 0),
(9876892, 'Josefa', 'Martínez', 'example@correo', NULL, 2, 4, '2024-11-12', '2024-11-12', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asambleas`
--

CREATE TABLE `asambleas` (
  `id` varchar(110) NOT NULL,
  `Title` varchar(20) NOT NULL,
  `Color` varchar(20) NOT NULL,
  `UserId` int(200) NOT NULL,
  `Estado` enum('Activa','Finalizada','notestate') DEFAULT 'notestate',
  `horaIncio` date NOT NULL,
  `horaExpiracion` date NOT NULL,
  `link` varchar(110) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asambleas`
--

INSERT INTO `asambleas` (`id`, `Title`, `Color`, `UserId`, `Estado`, `horaIncio`, `horaExpiracion`, `link`, `createdAt`, `updatedAt`) VALUES
('362e2d09-5538-4508-8158-e153e30082e8', 'Votacion_3', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/MzYyZTJkMDktNTUzOC00NTA4LTgxNTgtZTE1M2UzMDA4MmU4', '2024-11-09', '2024-11-09'),
('3f88da2f-45eb-4594-a5f6-2ea2e90bef22', '', '#fff', 1234567, 'notestate', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/M2Y4OGRhMmYtNDVlYi00NTk0LWE1ZjYtMmVhMmU5MGJlZjIy', '2024-11-15', '2024-11-15'),
('4a853d33-545b-4a4a-8e2a-f844a27163eb', 'encuesta_Prueba_55', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/NGE4NTNkMzMtNTQ1Yi00YTRhLThlMmEtZjg0NGEyNzE2M2Vi', '2024-11-14', '2024-11-14'),
('68c015be-d38e-47c5-abe0-8074c5466989', 'Encuesta de prueba _', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/NjhjMDE1YmUtZDM4ZS00N2M1LWFiZTAtODA3NGM1NDY2OTg5', '2024-11-15', '2024-11-15'),
('7ed06dd7-2a28-4ce9-a31e-94ec2a68567d', 'encuesta5_234', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/N2VkMDZkZDctMmEyOC00Y2U5LWEzMWUtOTRlYzJhNjg1Njdk', '2024-11-15', '2024-11-15'),
('8c15bfdd-39cf-4d7f-8a65-eb7d6c76679e', 'ele pueblo tiene elp', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/OGMxNWJmZGQtMzljZi00ZDdmLThhNjUtZWI3ZDZjNzY2Nzll', '2024-11-14', '2024-11-14'),
('980210ab-436e-434b-9d6e-b9e0f88ea797', 'encuensta 23', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/OTgwMjEwYWItNDM2ZS00MzRiLTlkNmUtYjllMGY4OGVhNzk3', '2024-11-14', '2024-11-14'),
('9ab2e689-5d6d-4e5b-8883-e091687fbc9c', 'Encuesta_34', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/OWFiMmU2ODktNWQ2ZC00ZTViLTg4ODMtZTA5MTY4N2ZiYzlj', '2024-11-12', '2024-11-12'),
('9deba81a-96f5-4415-8982-3499c6e25b1a', 'Encuesta_12345678', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/OWRlYmE4MWEtOTZmNS00NDE1LTg5ODItMzQ5OWM2ZTI1YjFh', '2024-11-15', '2024-11-15'),
('9df73763-eed9-409e-9ccd-bf7538557b28', 'Encuesta_prueba_5', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/OWRmNzM3NjMtZWVkOS00MDllLTljY2QtYmY3NTM4NTU3YjI4', '2024-11-09', '2024-11-09'),
('b988d81c-0c50-4b8e-a6b3-8785dc580917', 'Encuesta_90000', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/Yjk4OGQ4MWMtMGM1MC00YjhlLWE2YjMtODc4NWRjNTgwOTE3', '2024-11-14', '2024-11-14'),
('c782fb22-9690-467e-a16d-407ba5d8e8f0', 'encuensta_Prueba', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/Yzc4MmZiMjItOTY5MC00NjdlLWExNmQtNDA3YmE1ZDhlOGYw', '2024-11-09', '2024-11-09'),
('ddfc9b49-1d2e-423a-8e2d-468d5292c6ba', 'encuesta de prueba', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/ZGRmYzliNDktMWQyZS00MjNhLThlMmQtNDY4ZDUyOTJjNmJh', '2024-11-15', '2024-11-15'),
('e2a015dc-fed8-43aa-bbd9-b38a506927f5', 'Encuesta de prueba_2', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/ZTJhMDE1ZGMtZmVkOC00M2FhLWJiZDktYjM4YTUwNjkyN2Y1', '2024-11-08', '2024-11-08'),
('f8adfe2c-6291-4adb-8a33-d0a51a45a38b', 'Encuesta_Prueba_255', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/ZjhhZGZlMmMtNjI5MS00YWRiLThhMzMtZDBhNTFhNDVhMzhi', '2024-11-14', '2024-11-14'),
('fb464ec0-5315-4240-acde-92a897eb94e1', 'op', '#fff', 1234567, 'Activa', '0000-00-00', '0000-00-00', 'http://localhost:5174/c/ZmI0NjRlYzAtNTMxNS00MjQwLWFjZGUtOTJhODk3ZWI5NGUx', '2024-11-14', '2024-11-14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargos`
--

CREATE TABLE `cargos` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cargos`
--

INSERT INTO `cargos` (`id`, `descripcion`) VALUES
(1, 'Administrador'),
(2, 'Operador de registro'),
(3, 'Cordinador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `opciones`
--

CREATE TABLE `opciones` (
  `id` int(11) NOT NULL,
  `id_pregunta` varchar(110) NOT NULL,
  `opcion` varchar(100) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `opciones`
--

INSERT INTO `opciones` (`id`, `id_pregunta`, `opcion`, `createdAt`, `updatedAt`) VALUES
(158, '1f61a314-609d-4cb2-a55a-cff5c1959f43', 'si ', '0000-00-00', '0000-00-00'),
(159, '1f61a314-609d-4cb2-a55a-cff5c1959f43', 'no ', '0000-00-00', '0000-00-00'),
(160, 'c557614b-a90b-41cf-9d23-78abb7ef42dc', 'si ', '0000-00-00', '0000-00-00'),
(161, 'c557614b-a90b-41cf-9d23-78abb7ef42dc', 'no ', '0000-00-00', '0000-00-00'),
(162, '2250c58b-4ac4-4cb6-87f1-8247c2d39093', 'opcion 1', '0000-00-00', '0000-00-00'),
(163, '2250c58b-4ac4-4cb6-87f1-8247c2d39093', 'opcion 2', '0000-00-00', '0000-00-00'),
(164, 'ebed32a1-69da-4d91-bf1b-103a1c45c28a', 'opcion 1', '0000-00-00', '0000-00-00'),
(165, 'ebed32a1-69da-4d91-bf1b-103a1c45c28a', 'opcion 2', '0000-00-00', '0000-00-00'),
(166, '97f0542c-7f3d-4675-86f9-0f09eea68193', 'opcion_1', '0000-00-00', '0000-00-00'),
(167, '97f0542c-7f3d-4675-86f9-0f09eea68193', 'opcion_2', '0000-00-00', '0000-00-00'),
(176, 'd567fed5-027a-434b-8bd8-1fe28bb9f03f', 'opcion 1', '0000-00-00', '0000-00-00'),
(177, 'd567fed5-027a-434b-8bd8-1fe28bb9f03f', 'opcion 2', '0000-00-00', '0000-00-00'),
(178, 'a01b86e6-2f70-46b1-abf8-4d75eac7a989', 'opcion_1', '0000-00-00', '0000-00-00'),
(179, 'a01b86e6-2f70-46b1-abf8-4d75eac7a989', 'opcion_2', '0000-00-00', '0000-00-00'),
(180, '8941bab0-936d-43fb-8b98-a2682b6ca834', 'opcion lo que tu quiera', '0000-00-00', '0000-00-00'),
(181, '8941bab0-936d-43fb-8b98-a2682b6ca834', 'opcion ya tu sabe ', '0000-00-00', '0000-00-00'),
(182, 'b544faa5-7075-45a0-8d88-a513cd243f85', 'no', '0000-00-00', '0000-00-00'),
(183, 'b544faa5-7075-45a0-8d88-a513cd243f85', 'si ', '0000-00-00', '0000-00-00'),
(186, 'b93cb6f4-ebab-411d-9928-f28305aa4534', 'eres ? ', '0000-00-00', '0000-00-00'),
(187, 'b93cb6f4-ebab-411d-9928-f28305aa4534', 'no eres ? ', '0000-00-00', '0000-00-00'),
(188, '1b4b8306-0194-462b-bd6a-508bb62474d5', '', '0000-00-00', '0000-00-00'),
(189, '1b4b8306-0194-462b-bd6a-508bb62474d5', '', '0000-00-00', '0000-00-00'),
(190, 'efc3f3af-4477-46cd-b359-1fab8d67ad04', 'no', '0000-00-00', '0000-00-00'),
(191, 'efc3f3af-4477-46cd-b359-1fab8d67ad04', 'si ', '0000-00-00', '0000-00-00'),
(192, 'bb5ea791-ef1d-40cf-83b8-9ce02f4fa0e9', 'yes ', '0000-00-00', '0000-00-00'),
(193, 'bb5ea791-ef1d-40cf-83b8-9ce02f4fa0e9', 'no ', '0000-00-00', '0000-00-00'),
(194, 'af995dbe-8542-48d1-bd96-9ab2267c05ba', 'op-1', '0000-00-00', '0000-00-00'),
(195, 'af995dbe-8542-48d1-bd96-9ab2267c05ba', 'op-2', '0000-00-00', '0000-00-00'),
(196, '79c79613-fa13-4029-8c52-8f03201386f1', 'OP-1', '0000-00-00', '0000-00-00'),
(197, '79c79613-fa13-4029-8c52-8f03201386f1', 'OP-2', '0000-00-00', '0000-00-00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `operadoresderegistro`
--

CREATE TABLE `operadoresderegistro` (
  `cedula` int(11) NOT NULL,
  `Nombre` varchar(250) NOT NULL,
  `Apellido` varchar(250) NOT NULL,
  `Correo` varchar(200) NOT NULL,
  `Poder` float NOT NULL DEFAULT 1,
  `createdAt` date NOT NULL DEFAULT current_timestamp(),
  `updatedAt` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `id` varchar(110) NOT NULL,
  `id_card` varchar(110) NOT NULL,
  `Pregunta` varchar(150) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`id`, `id_card`, `Pregunta`, `createdAt`, `updatedAt`) VALUES
('1b4b8306-0194-462b-bd6a-508bb62474d5', '3f88da2f-45eb-4594-a5f6-2ea2e90bef22', '', '2024-11-15', '2024-11-15'),
('1f61a314-609d-4cb2-a55a-cff5c1959f43', 'e2a015dc-fed8-43aa-bbd9-b38a506927f5', 'eres pro ? ', '2024-11-08', '2024-11-08'),
('2250c58b-4ac4-4cb6-87f1-8247c2d39093', 'c782fb22-9690-467e-a16d-407ba5d8e8f0', 'Pregunta de prueba ', '2024-11-09', '2024-11-09'),
('266a0ded-238f-440e-a2b3-fe6e9e1b53f7', 'fb464ec0-5315-4240-acde-92a897eb94e1', 'pregunta_1212', '2024-11-14', '2024-11-14'),
('79c79613-fa13-4029-8c52-8f03201386f1', '68c015be-d38e-47c5-abe0-8074c5466989', 'Pregunta de prueba ', '2024-11-15', '2024-11-15'),
('8941bab0-936d-43fb-8b98-a2682b6ca834', 'b988d81c-0c50-4b8e-a6b3-8785dc580917', 'Pregunta_de prueba', '2024-11-14', '2024-11-14'),
('97f0542c-7f3d-4675-86f9-0f09eea68193', '9ab2e689-5d6d-4e5b-8883-e091687fbc9c', 'Pregunta_23', '2024-11-12', '2024-11-12'),
('a01b86e6-2f70-46b1-abf8-4d75eac7a989', 'f8adfe2c-6291-4adb-8a33-d0a51a45a38b', 'Pregunta de Prueba_23', '2024-11-14', '2024-11-14'),
('af995dbe-8542-48d1-bd96-9ab2267c05ba', 'ddfc9b49-1d2e-423a-8e2d-468d5292c6ba', 'pregunta ramndon', '2024-11-15', '2024-11-15'),
('b544faa5-7075-45a0-8d88-a513cd243f85', '8c15bfdd-39cf-4d7f-8a65-eb7d6c76679e', 'Eres bro ? ', '2024-11-14', '2024-11-14'),
('b93cb6f4-ebab-411d-9928-f28305aa4534', '980210ab-436e-434b-9d6e-b9e0f88ea797', 'pregunta lo que sea', '2024-11-14', '2024-11-14'),
('bb5ea791-ef1d-40cf-83b8-9ce02f4fa0e9', '9deba81a-96f5-4415-8982-3499c6e25b1a', 'quuestiosn english ', '2024-11-15', '2024-11-15'),
('c557614b-a90b-41cf-9d23-78abb7ef42dc', '362e2d09-5538-4508-8158-e153e30082e8', 'Pregunta de prueba ', '2024-11-09', '2024-11-09'),
('d567fed5-027a-434b-8bd8-1fe28bb9f03f', '4a853d33-545b-4a4a-8e2a-f844a27163eb', 'pregunta de prueba ', '2024-11-14', '2024-11-14'),
('ebed32a1-69da-4d91-bf1b-103a1c45c28a', '9df73763-eed9-409e-9ccd-bf7538557b28', 'Pregunta_Prueba_2', '2024-11-09', '2024-11-09'),
('efc3f3af-4477-46cd-b359-1fab8d67ad04', '7ed06dd7-2a28-4ce9-a31e-94ec2a68567d', 'Quien eres tu ???????identificate en estyya mnda', '2024-11-15', '2024-11-15');

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
-- Estructura de tabla para la tabla `votes`
--

CREATE TABLE `votes` (
  `Id` int(11) NOT NULL,
  `id_Option` int(11) NOT NULL,
  `id_voter` int(11) NOT NULL,
  `voto` varchar(20) NOT NULL,
  `id_card` varchar(250) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `votes`
--

INSERT INTO `votes` (`Id`, `id_Option`, `id_voter`, `voto`, `id_card`, `createdAt`, `updatedAt`) VALUES
(140, 163, 4434344, 'opcion 2', 'c782fb22-9690-467e-a16d-407ba5d8e8f0', '2024-11-09', '2024-11-09'),
(141, 162, 2893764, 'opcion 1', 'c782fb22-9690-467e-a16d-407ba5d8e8f0', '2024-11-09', '2024-11-09'),
(142, 163, 1234567, 'opcion 2', 'c782fb22-9690-467e-a16d-407ba5d8e8f0', '2024-11-09', '2024-11-09'),
(143, 164, 4434344, 'opcion 1', '9df73763-eed9-409e-9ccd-bf7538557b28', '2024-11-09', '2024-11-09'),
(144, 166, 4434344, 'opcion_1', '9ab2e689-5d6d-4e5b-8883-e091687fbc9c', '2024-11-12', '2024-11-12'),
(145, 166, 2394232, 'opcion_1', '9ab2e689-5d6d-4e5b-8883-e091687fbc9c', '2024-11-12', '2024-11-12'),
(146, 181, 2893764, 'opcion ya tu sabe ', 'b988d81c-0c50-4b8e-a6b3-8785dc580917', '2024-11-14', '2024-11-14'),
(147, 180, 9876892, 'opcion lo que tu qui', 'b988d81c-0c50-4b8e-a6b3-8785dc580917', '2024-11-14', '2024-11-14'),
(148, 182, 2394232, 'no', '8c15bfdd-39cf-4d7f-8a65-eb7d6c76679e', '2024-11-14', '2024-11-14'),
(149, 183, 9876892, 'si ', '8c15bfdd-39cf-4d7f-8a65-eb7d6c76679e', '2024-11-14', '2024-11-14'),
(150, 182, 4434344, 'no', '8c15bfdd-39cf-4d7f-8a65-eb7d6c76679e', '2024-11-14', '2024-11-14'),
(151, 183, 2893764, 'si ', '8c15bfdd-39cf-4d7f-8a65-eb7d6c76679e', '2024-11-14', '2024-11-14'),
(152, 183, 1234567, 'si ', '8c15bfdd-39cf-4d7f-8a65-eb7d6c76679e', '2024-11-14', '2024-11-14'),
(157, 190, 4434344, 'no', '7ed06dd7-2a28-4ce9-a31e-94ec2a68567d', '2024-11-15', '2024-11-15'),
(158, 190, 2394232, 'no', '7ed06dd7-2a28-4ce9-a31e-94ec2a68567d', '2024-11-15', '2024-11-15'),
(159, 190, 9876892, 'no', '7ed06dd7-2a28-4ce9-a31e-94ec2a68567d', '2024-11-15', '2024-11-15'),
(160, 191, 2893764, 'si ', '7ed06dd7-2a28-4ce9-a31e-94ec2a68567d', '2024-11-15', '2024-11-15'),
(161, 191, 1234567, 'si ', '7ed06dd7-2a28-4ce9-a31e-94ec2a68567d', '2024-11-15', '2024-11-15'),
(162, 192, 2394232, 'yes ', '9deba81a-96f5-4415-8982-3499c6e25b1a', '2024-11-15', '2024-11-15'),
(163, 193, 2893764, 'no ', '9deba81a-96f5-4415-8982-3499c6e25b1a', '2024-11-15', '2024-11-15'),
(164, 192, 4434344, 'yes ', '9deba81a-96f5-4415-8982-3499c6e25b1a', '2024-11-15', '2024-11-15'),
(165, 193, 9876892, 'no ', '9deba81a-96f5-4415-8982-3499c6e25b1a', '2024-11-15', '2024-11-15'),
(166, 194, 2893764, 'op-1', 'ddfc9b49-1d2e-423a-8e2d-468d5292c6ba', '2024-11-15', '2024-11-15'),
(167, 196, 2394232, 'OP-1', '68c015be-d38e-47c5-abe0-8074c5466989', '2024-11-15', '2024-11-15');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `app_usuarios`
--
ALTER TABLE `app_usuarios`
  ADD PRIMARY KEY (`Cedula`),
  ADD KEY `id_cargo` (`id_cargo`);

--
-- Indices de la tabla `asambleas`
--
ALTER TABLE `asambleas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `UserId_2` (`UserId`);

--
-- Indices de la tabla `cargos`
--
ALTER TABLE `cargos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `opciones`
--
ALTER TABLE `opciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_card` (`id_card`);

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
  ADD KEY `id_Option` (`id_Option`),
  ADD KEY `id_card` (`id_card`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cargos`
--
ALTER TABLE `cargos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `opciones`
--
ALTER TABLE `opciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=198;

--
-- AUTO_INCREMENT de la tabla `votes`
--
ALTER TABLE `votes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=168;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `app_usuarios`
--
ALTER TABLE `app_usuarios`
  ADD CONSTRAINT `app_usuarios_ibfk_1` FOREIGN KEY (`id_cargo`) REFERENCES `cargos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `asambleas`
--
ALTER TABLE `asambleas`
  ADD CONSTRAINT `asambleas_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `app_usuarios` (`Cedula`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `opciones`
--
ALTER TABLE `opciones`
  ADD CONSTRAINT `opciones_ibfk_1` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD CONSTRAINT `pregunta_ibfk_1` FOREIGN KEY (`id_card`) REFERENCES `asambleas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`id_Option`) REFERENCES `opciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`id_card`) REFERENCES `asambleas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
