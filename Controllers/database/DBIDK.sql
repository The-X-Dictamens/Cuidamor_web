-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS `cuidamor_users_unificado` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cuidamor_users_unificado`;

-- Crear tabla de admin
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id_adm` int NOT NULL AUTO_INCREMENT,
  `corr_adm` varchar(45) NOT NULL,
  `pass_adm` varchar(45) NOT NULL,
  PRIMARY KEY (`id_adm`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Crear tabla de datos_acceso
DROP TABLE IF EXISTS `datos_acceso`;
CREATE TABLE `datos_acceso` (
  `id_datacc` int NOT NULL AUTO_INCREMENT,
  `cor_datacc` varchar(45) NOT NULL,
  `pas_datacc` varchar(100) DEFAULT NULL,
  `rol_datacc` enum('Cliente','Enfermero','Cuidador') NOT NULL,
  PRIMARY KEY (`id_datacc`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;

-- Crear tabla de dia_horario
DROP TABLE IF EXISTS `dia_horario`;
CREATE TABLE `dia_horario` (
  `id_dh` int NOT NULL AUTO_INCREMENT,
  `horini_dh` varchar(45) DEFAULT NULL,
  `horfin_dh` varchar(45) DEFAULT NULL,
  `dia_dh` SET('Lu','Ma','Mi','Ju','Vi','Sa','Do') DEFAULT NULL,
  `id_hor` int NOT NULL,
  PRIMARY KEY (`id_dh`),
  KEY `fk_dia_horario_horario1_idx` (`id_hor`),
  CONSTRAINT `fk_dia_horario_horario1` FOREIGN KEY (`id_hor`) REFERENCES `horario` (`id_hor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Crear tabla de direccion
DROP TABLE IF EXISTS `direccion`;
CREATE TABLE `direccion` (
  `id_dir` int NOT NULL AUTO_INCREMENT,
  `calle_dir` varchar(45) DEFAULT NULL,
  `del_dir` varchar(45) DEFAULT NULL,
  `numExt_dir` varchar(10) DEFAULT NULL,
  `numInt_dir` varchar(10) DEFAULT NULL,
  `col_dir` varchar(45) DEFAULT NULL,
  `cp_dir` varchar(45) DEFAULT NULL,
  `ref_dir` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_dir`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;

-- Crear tabla de empleado
DROP TABLE IF EXISTS `empleado`;
CREATE TABLE `empleado` (
  `id_emp` int NOT NULL AUTO_INCREMENT,
  `nom_emp` varchar(45) DEFAULT NULL,
  `pat_emp` varchar(45) DEFAULT NULL,
  `mat_emp` varchar(45) DEFAULT NULL,
  `fot_emp` varchar(45) DEFAULT NULL,
  `tel_emp` varchar(45) DEFAULT NULL,
  `est_emp` enum('Aceptado','Rechazado','Proceso') DEFAULT NULL,
  `id_datacc` int NOT NULL,
  `id_dir` int NOT NULL,
  PRIMARY KEY (`id_emp`),
  KEY `fk_Empleado_DatosAcceso1_idx` (`id_datacc`),
  KEY `fk_empleado_Direccion1_idx` (`id_dir`),
  CONSTRAINT `fk_Empleado_DatosAcceso1` FOREIGN KEY (`id_datacc`) REFERENCES `datos_acceso` (`id_datacc`),
  CONSTRAINT `fk_empleado_Direccion1` FOREIGN KEY (`id_dir`) REFERENCES `direccion` (`id_dir`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;

-- Crear tabla de historial_medico
DROP TABLE IF EXISTS `historial_medico`;
CREATE TABLE `historial_medico` (
  `id_hm` int NOT NULL AUTO_INCREMENT,
  `med_hm` varchar(45) DEFAULT NULL,
  `des_hm` varchar(45) DEFAULT NULL,
  `trat_hm` varchar(45) DEFAULT NULL,
  `rec_hm` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_hm`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Crear tabla de horario
DROP TABLE IF EXISTS `horario`;
CREATE TABLE `horario` (
  `id_hor` int NOT NULL AUTO_INCREMENT,
  `fecini_hor` date DEFAULT NULL,
  `fecfin_hor` date DEFAULT NULL,
  PRIMARY KEY (`id_hor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Crear tabla de paciente
DROP TABLE IF EXISTS `paciente`;
CREATE TABLE `paciente` (
  `id_pac` int NOT NULL AUTO_INCREMENT,
  `nom_pac` varchar(45) DEFAULT NULL,
  `pat_pac` varchar(45) DEFAULT NULL,
  `mat_pac` varchar(45) DEFAULT NULL,
  `fot_pac` varchar(45) DEFAULT NULL,
  `id_hm` int NOT NULL,
  `id_us` int NOT NULL,
  PRIMARY KEY (`id_pac`),
  KEY `fk_paciente_historial_medico1_idx` (`id_hm`),
  KEY `fk_paciente_user1_idx` (`id_us`),
  CONSTRAINT `fk_paciente_historial_medico1` FOREIGN KEY (`id_hm`) REFERENCES `historial_medico` (`id_hm`),
  CONSTRAINT `fk_paciente_user1` FOREIGN KEY (`id_us`) REFERENCES `user` (`id_us`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Crear tabla de perfil_profecional
DROP TABLE IF EXISTS `perfil_profecional`;
CREATE TABLE `perfil_profecional` (
  `id_prof` int NOT NULL AUTO_INCREMENT,
  `cedu_prof` varchar(45) DEFAULT NULL,
  `cert_prof` varchar(45) DEFAULT NULL,
  `ine_prof` varchar(45) DEFAULT NULL,
  `comdom_prof` varchar(45) DEFAULT NULL,
  `id_emp` int NOT NULL,
  PRIMARY KEY (`id_prof`),
  KEY `fk_datos_profecionales_empleado1_idx` (`id_emp`),
  CONSTRAINT `fk_datos_profecionales_empleado1` FOREIGN KEY (`id_emp`) REFERENCES `empleado` (`id_emp`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;

-- Crear tabla de pruebas
DROP TABLE IF EXISTS `pruebas`;
CREATE TABLE `pruebas` (
  `id_pru` int NOT NULL AUTO_INCREMENT,
  `tip_pru` varchar(45) DEFAULT NULL,
  `punt_pru` int DEFAULT NULL,
  `est_prue` enum('Aprobado','Reprobado') NOT NULL,
  `id_emp` int NOT NULL,
  PRIMARY KEY (`id_pru`),
  KEY `fk_pruebas_empleado1_idx` (`id_emp`),
  CONSTRAINT `fk_pruebas_empleado1` FOREIGN KEY (`id_emp`) REFERENCES `empleado` (`id_emp`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Crear tabla de solicitud
DROP TABLE IF EXISTS `solicitud`;
CREATE TABLE `solicitud` (
  `id_sol` int NOT NULL AUTO_INCREMENT,
  `des_sol` varchar(500) DEFAULT NULL,
  `tipo_sol` enum('Cuidador','Enfermero') DEFAULT NULL,
  `est_sol` enum('Espera','Curso','Final') DEFAULT NULL,
  `cost_sol` decimal(7,2) DEFAULT NULL,
  `id_hor` int NOT NULL,
  `id_us` int NOT NULL,
  `id_pac` int NOT NULL,
  `id_emp` int DEFAULT NULL,
  `id_dir` int NOT NULL,
  PRIMARY KEY (`id_sol`),
  KEY `fk_solicitud_horario1_idx` (`id_hor`),
  KEY `fk_solicitud_user1_idx` (`id_us`),
  KEY `fk_solicitud_paciente1_idx` (`id_pac`),
  KEY `fk_solicitud_empleado1_idx` (`id_emp`),
  KEY `fk_solicitud_Direccion1_idx` (`id_dir`),
  CONSTRAINT `fk_solicitud_Direccion1` FOREIGN KEY (`id_dir`) REFERENCES `direccion` (`id_dir`),
  CONSTRAINT `fk_solicitud_empleado1` FOREIGN KEY (`id_emp`) REFERENCES `empleado` (`id_emp`),
  CONSTRAINT `fk_solicitud_horario1` FOREIGN KEY (`id_hor`) REFERENCES `horario` (`id_hor`),
  CONSTRAINT `fk_solicitud_paciente1` FOREIGN KEY (`id_pac`) REFERENCES `paciente` (`id_pac`),
  CONSTRAINT `fk_solicitud_user1` FOREIGN KEY (`id_us`) REFERENCES `user` (`id_us`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Crear tabla de user
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id_us` int NOT NULL AUTO_INCREMENT,
  `nom_us` varchar(45) DEFAULT NULL,
  `pat_us` varchar(45) DEFAULT NULL,
  `mat_us` varchar(45) DEFAULT NULL,
  `fot_us` varchar(45) DEFAULT NULL,
  `tel_us` varchar(45) DEFAULT NULL,
  `id_datacc` int NOT NULL,
  `id_dir` int DEFAULT NULL,
  PRIMARY KEY (`id_us`),
  KEY `fk_User_DatosAcceso_idx` (`id_datacc`),
  KEY `fk_user_direccion1_idx` (`id_dir`),
  CONSTRAINT `fk_User_DatosAcceso` FOREIGN KEY (`id_datacc`) REFERENCES `datos_acceso` (`id_datacc`),
  CONSTRAINT `fk_user_direccion1` FOREIGN KEY (`id_dir`) REFERENCES `direccion` (`id_dir`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `tickets` (
  `id_ticket` int NOT NULL AUTO_INCREMENT,
  `num_rastreo` varchar(45) NOT NULL,
  `tipo` enum('Sugerencia', 'Reporte') NOT NULL,
  `descripcion` text NOT NULL,
  `prioridad` enum('Baja', 'Media', 'Alta') NOT NULL,
  `estatus` enum('Abierto', 'En Proceso', 'Resuelto', 'Cerrado') NOT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_ticket`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Crear tabla de asignaciones de tickets
CREATE TABLE `ticket_asignacion` (
  `id_asignacion` int NOT NULL AUTO_INCREMENT,
  `id_ticket` int NOT NULL,
  `id_us` int NOT NULL,
  `fecha_asignacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_asignacion`),
  KEY `fk_ticket_asignacion_ticket_idx` (`id_ticket`),
  KEY `fk_ticket_asignacion_user_idx` (`id_us`),
  CONSTRAINT `fk_ticket_asignacion_ticket` FOREIGN KEY (`id_ticket`) REFERENCES `tickets` (`id_ticket`),
  CONSTRAINT `fk_ticket_asignacion_user` FOREIGN KEY (`id_us`) REFERENCES `user` (`id_us`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Crear trigger para generar número de rastreo y asignar prioridad
DELIMITER //

CREATE TRIGGER `before_insert_ticket` 
BEFORE INSERT ON `tickets` 
FOR EACH ROW
BEGIN
  DECLARE max_id INT;

  -- Obtener el valor máximo de id_ticket actual
  SELECT COALESCE(MAX(id_ticket), 0) + 1 INTO max_id FROM tickets;

  -- Generar el número de rastreo en el formato TRK001, TRK002, etc.
  SET NEW.num_rastreo = CONCAT('TRK', LPAD(max_id, 3, '0'));

  -- Asignar prioridad en función del tipo de ticket
  IF NEW.tipo = 'Reporte' THEN
    SET NEW.prioridad = 'Alta';
  ELSE
    SET NEW.prioridad = 'Baja';
  END IF;
END//

DELIMITER ;


-- Insertar datos de prueba en la tabla admin
INSERT INTO `admin` (`corr_adm`, `pass_adm`) VALUES
('admin1@cuidamor.com', 'adminpass1'),
('admin2@cuidamor.com', 'adminpass2'),
('admin3@cuidamor.com', 'adminpass3');

-- Insertar datos de prueba en la tabla direccion
INSERT INTO `direccion` (`calle_dir`, `del_dir`, `numExt_dir`, `numInt_dir`, `col_dir`, `cp_dir`, `ref_dir`) VALUES
('Calle 1', 'Delegación 1', '100', 'A', 'Colonia 1', '12345', 'Referencia 1'),
('Calle 2', 'Delegación 2', '200', 'B', 'Colonia 2', '23456', 'Referencia 2'),
('Calle 3', 'Delegación 3', '300', 'C', 'Colonia 3', '34567', 'Referencia 3');

-- Insertar datos de prueba en la tabla datos_acceso
INSERT INTO `datos_acceso` (`cor_datacc`, `pas_datacc`, `rol_datacc`) VALUES
('cliente1@cuidamor.com', 'clientepass1', 'Cliente'),
('enfermero1@cuidamor.com', 'enfermeropass1', 'Enfermero'),
('cuidador1@cuidamor.com', 'cuidadorpass1', 'Cuidador');

-- Insertar datos de prueba en la tabla empleado
INSERT INTO `empleado` (`nom_emp`, `pat_emp`, `mat_emp`, `fot_emp`, `tel_emp`, `est_emp`, `id_datacc`, `id_dir`) VALUES
('Juan', 'Pérez', 'García', 'foto1.jpg', '5551234567', 'Aceptado', 2, 1),
('María', 'López', 'Martínez', 'foto2.jpg', '5552345678', 'Proceso', 3, 2);

-- Insertar datos de prueba en la tabla historial_medico
INSERT INTO `historial_medico` (`med_hm`, `des_hm`, `trat_hm`, `rec_hm`) VALUES
('Paracetamol', 'Dolor de cabeza', 'Tomar 1 cada 8 horas', 'No');

-- Insertar datos de prueba en la tabla paciente
INSERT INTO `paciente` (`nom_pac`, `pat_pac`, `mat_pac`, `fot_pac`, `id_hm`, `id_us`) VALUES
('Carlos', 'González', 'Ramírez', 'foto3.jpg', 1, 1);

-- Insertar datos de prueba en la tabla perfil_profecional
INSERT INTO `perfil_profecional` (`cedu_prof`, `cert_prof`, `ine_prof`, `comdom_prof`, `id_emp`) VALUES
('C12345', 'Certificado1', 'INE12345', 'Comprobante1', 1);

-- Insertar datos de prueba en la tabla pruebas
INSERT INTO `pruebas` (`tip_pru`, `punt_pru`, `est_prue`, `id_emp`) VALUES
('Prueba Técnica', 85, 'Aprobado', 1);

-- Insertar datos de prueba en la tabla user
INSERT INTO `user` (`nom_us`, `pat_us`, `mat_us`, `fot_us`, `tel_us`, `id_datacc`, `id_dir`) VALUES
('Luis', 'Fernández', 'Sánchez', 'foto4.jpg', '5553456789', 1, 3);

-- Insertar datos de prueba en la tabla horario
INSERT INTO `horario` (`fecini_hor`, `fecfin_hor`) VALUES
('2024-07-01', '2024-07-31'),
('2024-08-01', '2024-08-31');

-- Insertar datos de prueba en la tabla dia_horario
INSERT INTO `dia_horario` (`horini_dh`, `horfin_dh`, `dia_dh`, `id_hor`) VALUES
('08:00', '12:00', 'Lu', 1),
('12:00', '16:00', 'Ma', 1),
('08:00', '12:00', 'Mi', 2),
('12:00', '16:00', 'Ju', 2);

-- Insertar datos de prueba en la tabla tickets
INSERT INTO `tickets` (`descripcion`, `prioridad`, `estatus`) VALUES
('Problema con la conexión a internet', 'Alta', 'Abierto'),
('Error en el sistema de facturación', 'Media', 'Abierto');

-- Insertar datos de prueba en la tabla ticket_asignacion
INSERT INTO `ticket_asignacion` (`id_ticket`, `id_us`) VALUES
(1, 1), -- Asignar el ticket 1 al usuario 1
(2, 2); -- Asignar el ticket 2 al usuario 2
