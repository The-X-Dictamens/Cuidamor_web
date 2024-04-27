-- MySQL Workbench Forward Engineering

-- -----------------------------------------------------
-- Schema Cuidamor_Users
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Cuidamor_Users
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `Cuidamor_Users` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------

USE `Cuidamor_Users` ;

-- -----------------------------------------------------
-- Table `Cuidamor_Users`.`datos_scceso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuidamor_Users`.`datos_acceso` (
  `id_datacc` INT NOT NULL AUTO_INCREMENT,
  `cor_datacc` VARCHAR(45) NULL,
  `pas_datacc` VARCHAR(100) NULL,
  `rol_datacc` ENUM('clie', 'enfe', 'cuid') NULL,
  PRIMARY KEY (`id_datacc`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuidamor_Users`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuidamor_Users`.`user` (
  `id_us` INT NOT NULL AUTO_INCREMENT,
  `nom_us` VARCHAR(45) NULL,
  `pat_us` VARCHAR(45) NULL,
  `mat_us` VARCHAR(45) NULL,
  `fot_us` VARCHAR(45) NULL,
  `tel_us` VARCHAR(45) NULL,
  `id_datacc` INT NOT NULL,
  PRIMARY KEY (`id_us`),
  INDEX `fk_User_DatosAcceso_idx` (`id_datacc` ASC) VISIBLE,
  CONSTRAINT `fk_User_DatosAcceso`
    FOREIGN KEY (`id_datacc`)
    REFERENCES `Cuidamor_Users`.`datos_scceso` (`id_datacc`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuidamor_Users`.`Direccion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuidamor_Users`.`Direccion` (
  `id_dir` INT NOT NULL AUTO_INCREMENT,
  `del_dir` VARCHAR(45) NULL,
  `col_dir` VARCHAR(45) NULL,
  `calle_dir` VARCHAR(45) NULL,
  `cp_dir` VARCHAR(45) NULL,
  `ref_dir` VARCHAR(45) NULL,
  `user_id_us` INT NOT NULL,
  PRIMARY KEY (`id_dir`),
  INDEX `fk_Direccion_user1_idx` (`user_id_us` ASC) VISIBLE,
  CONSTRAINT `fk_Direccion_user1`
    FOREIGN KEY (`user_id_us`)
    REFERENCES `Cuidamor_Users`.`user` (`id_us`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuidamor_Users`.`empleado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuidamor_Users`.`empleado` (
  `id_emp` INT NOT NULL AUTO_INCREMENT,
  `nom_emp` VARCHAR(45) NULL,
  `pat_emp` VARCHAR(45) NULL,
  `mat_emp` VARCHAR(45) NULL,
  `fot_emp` VARCHAR(45) NULL,
  `tel_emp` VARCHAR(45) NULL,
  `est_emp` ENUM('Aceptado', 'Rechazado', 'Proceso') 'Proceso',--nosesiasiestebien--------
  `id_datacc` INT NOT NULL,
  `id_dir` INT NOT NULL,
  PRIMARY KEY (`id_emp`),
  INDEX `fk_Empleado_DatosAcceso1_idx` (`id_datacc` ASC) VISIBLE,
  INDEX `fk_empleado_Direccion1_idx` (`id_dir` ASC) VISIBLE,
  CONSTRAINT `fk_Empleado_DatosAcceso1`
    FOREIGN KEY (`id_datacc`)
    REFERENCES `Cuidamor_Users`.`datos_scceso` (`id_datacc`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_empleado_Direccion1`
    FOREIGN KEY (`id_dir`)
    REFERENCES `Cuidamor_Users`.`Direccion` (`id_dir`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuidamor_Users`.`historial_medico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuidamor_Users`.`historial_medico` (
  `id_hm` INT NOT NULL AUTO_INCREMENT,
  `med_hm` VARCHAR(45) NULL,
  `des_hm` VARCHAR(45) NULL,
  `trat_hm` VARCHAR(45) NULL,
  `rec_hm` VARCHAR(45) NULL,
  PRIMARY KEY (`id_hm`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuidamor_Users`.`paciente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuidamor_Users`.`paciente` (
  `id_pac` INT NOT NULL AUTO_INCREMENT,
  `nom_pac` VARCHAR(45) NULL,
  `pat_pac` VARCHAR(45) NULL,
  `mat_pac` VARCHAR(45) NULL,
  `fot_pac` VARCHAR(45) NULL,
  `id_hm` INT NOT NULL,
  `id_us` INT NOT NULL,
  PRIMARY KEY (`id_pac`),
  INDEX `fk_paciente_historial_medico1_idx` (`id_hm` ASC) VISIBLE,
  INDEX `fk_paciente_user1_idx` (`id_us` ASC) VISIBLE,
  CONSTRAINT `fk_paciente_historial_medico1`
    FOREIGN KEY (`id_hm`)
    REFERENCES `Cuidamor_Users`.`historial_medico` (`id_hm`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_paciente_user1`
    FOREIGN KEY (`id_us`)
    REFERENCES `Cuidamor_Users`.`user` (`id_us`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuidamor_Users`.`horario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuidamor_Users`.`horario` (
  `id_hor` INT NOT NULL,
  `fecini_hor` DATE NULL,
  `fecfin_hor` DATE NULL,
  PRIMARY KEY (`id_hor`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuidamor_Users`.`solicitud`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuidamor_Users`.`solicitud` (
  `id_sol` INT NOT NULL AUTO_INCREMENT,
  `des_sol` VARCHAR(500) NULL,
  `tipo_sol` ENUM('cuid', 'enfe') NULL,
  `est_sol` ENUM('Espera', 'Curso', 'Final') 'Espera',
  `cost_sol` DECIMAL(7,2) NULL,
  `id_hor` INT NOT NULL,
  `id_us` INT NOT NULL,
  `id_pac` INT NOT NULL,
  `id_emp` INT NULL,
  `id_dir` INT NOT NULL,
  PRIMARY KEY (`id_sol`),
  INDEX `fk_solicitud_horario1_idx` (`id_hor` ASC) VISIBLE,
  INDEX `fk_solicitud_user1_idx` (`id_us` ASC) VISIBLE,
  INDEX `fk_solicitud_paciente1_idx` (`id_pac` ASC) VISIBLE,
  INDEX `fk_solicitud_empleado1_idx` (`id_emp` ASC) VISIBLE,
  INDEX `fk_solicitud_Direccion1_idx` (`id_dir` ASC) VISIBLE,
  CONSTRAINT `fk_solicitud_horario1`
    FOREIGN KEY (`id_hor`)
    REFERENCES `Cuidamor_Users`.`horario` (`id_hor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitud_user1`
    FOREIGN KEY (`id_us`)
    REFERENCES `Cuidamor_Users`.`user` (`id_us`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitud_paciente1`
    FOREIGN KEY (`id_pac`)
    REFERENCES `Cuidamor_Users`.`paciente` (`id_pac`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitud_empleado1`
    FOREIGN KEY (`id_emp`)
    REFERENCES `Cuidamor_Users`.`empleado` (`id_emp`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitud_Direccion1`
    FOREIGN KEY (`id_dir`)
    REFERENCES `Cuidamor_Users`.`Direccion` (`id_dir`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuidamor_Users`.`dia_horario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuidamor_Users`.`dia_horario` (
  `id_dh` INT NOT NULL AUTO_INCREMENT,
  `horini_dh` VARCHAR(45) NULL,
  `horfin_dh` VARCHAR(45) NULL,
  `dia_dh` ENUM('Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do') NULL,
  `id_hor` INT NOT NULL,
  PRIMARY KEY (`id_dh`),
  INDEX `fk_dia_horario_horario1_idx` (`id_hor` ASC) VISIBLE,
  CONSTRAINT `fk_dia_horario_horario1`
    FOREIGN KEY (`id_hor`)
    REFERENCES `Cuidamor_Users`.`horario` (`id_hor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuidamor_Users`.`Perfil_Profecional`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuidamor_Users`.`Perfil_Profecional` (
  `id_prof` INT NOT NULL AUTO_INCREMENT,
  `cedu_prof` VARCHAR(45) NULL,
  `cert_prof` VARCHAR(45) NULL,
  `ine_prof` VARCHAR(45) NULL,
  `comdom_prof` VARCHAR(45) NULL,
  `id_emp` INT NOT NULL,
  PRIMARY KEY (`id_prof`),
  INDEX `fk_datos_profecionales_empleado1_idx` (`id_emp` ASC) VISIBLE,
  CONSTRAINT `fk_datos_profecionales_empleado1`
    FOREIGN KEY (`id_emp`)
    REFERENCES `Cuidamor_Users`.`empleado` (`id_emp`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuidamor_Users`.`pruebas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuidamor_Users`.`pruebas` (
  `id_pru` INT NOT NULL AUTO_INCREMENT,
  `psc_pru` VARCHAR(45) NULL,
  `con_pru` VARCHAR(45) NULL,
  `id_emp` INT NOT NULL,
  PRIMARY KEY (`id_pru`),
  INDEX `fk_pruebas_empleado1_idx` (`id_emp` ASC) VISIBLE,
  CONSTRAINT `fk_pruebas_empleado1`
    FOREIGN KEY (`id_emp`)
    REFERENCES `Cuidamor_Users`.`empleado` (`id_emp`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


