CREATE DATABASE  IF NOT EXISTS `cuidamor_users_unificado` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cuidamor_users_unificado`;
-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: cuidamor_users_unificado
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id_adm` int NOT NULL AUTO_INCREMENT,
  `corr_adm` varchar(45) NOT NULL,
  `pass_adm` varchar(45) NOT NULL,
  PRIMARY KEY (`id_adm`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `datos_acceso`
--

DROP TABLE IF EXISTS `datos_acceso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datos_acceso` (
  `id_datacc` int NOT NULL AUTO_INCREMENT,
  `cor_datacc` varchar(45) NOT NULL,
  `pas_datacc` varchar(100) DEFAULT NULL,
  `rol_datacc` enum('Cliente','Enfermero','Cuidador') NOT NULL,
  PRIMARY KEY (`id_datacc`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dia_horario`
--

DROP TABLE IF EXISTS `dia_horario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dia_horario` (
  `id_dh` int NOT NULL AUTO_INCREMENT,
  `horini_dh` varchar(45) DEFAULT NULL,
  `horfin_dh` varchar(45) DEFAULT NULL,
  `dia_dh` enum('Lu','Ma','Mi','Ju','Vi','Sa','Do') DEFAULT NULL,
  `id_hor` int NOT NULL,
  PRIMARY KEY (`id_dh`),
  KEY `fk_dia_horario_horario1_idx` (`id_hor`),
  CONSTRAINT `fk_dia_horario_horario1` FOREIGN KEY (`id_hor`) REFERENCES `horario` (`id_hor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `direccion`
--

DROP TABLE IF EXISTS `direccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `historial_medico`
--

DROP TABLE IF EXISTS `historial_medico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_medico` (
  `id_hm` int NOT NULL AUTO_INCREMENT,
  `med_hm` varchar(45) DEFAULT NULL,
  `des_hm` varchar(45) DEFAULT NULL,
  `trat_hm` varchar(45) DEFAULT NULL,
  `rec_hm` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_hm`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `horario`
--

DROP TABLE IF EXISTS `horario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horario` (
  `id_hor` int NOT NULL AUTO_INCREMENT,
  `fecini_hor` date DEFAULT NULL,
  `fecfin_hor` date DEFAULT NULL,
  PRIMARY KEY (`id_hor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `paciente`
--

DROP TABLE IF EXISTS `paciente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `perfil_profecional`
--

DROP TABLE IF EXISTS `perfil_profecional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pruebas`
--

DROP TABLE IF EXISTS `pruebas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `solicitud`
--

DROP TABLE IF EXISTS `solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-26 17:02:57
