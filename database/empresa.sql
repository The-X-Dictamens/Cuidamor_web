-- MySQL Workbench Forward Engineering

@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Cuidamor_Users
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Cuidamor_Users
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `Cuidamor_Users` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------
-- Schema cuisamor_usuarios1
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema cuisamor_usuarios2
-- -----------------------------------------------------
USE `Cuidamor_Users` ;

-- -----------------------------------------------------
-- Table `Cuidamor_Users`.`datos_scceso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuidamor_Users`.`datos_scceso` (
  `id_datacc` INT NOT NULL,
  `cor_datacc` VARCHAR(45) NULL,
  `pas_datacc` VARCHAR(45) NULL,
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
  `id_dir` INT NOT NULL,
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
  `id_emp` INT NOT NULL,
  `nom_emp` VARCHAR(45) NULL,
  `pat_emp` VARCHAR(45) NULL,
  `mat_emp` VARCHAR(45) NULL,
  `fot_emp` VARCHAR(45) NULL,
  `tel_emp` VARCHAR(45) NULL,
  `est_emp` ENUM('Aceptado', 'Rechazado', 'Proceso') NULL,
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
  `id_hm` INT NOT NULL,
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
  `id_pac` INT NOT NULL,
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
  `id_sol` INT NOT NULL,
  `des_sol` VARCHAR(500) NULL,
  `tipo_sol` ENUM('cuid', 'enfe') NULL,
  `est_sol` ENUM('Espera', 'Curso', 'Final') NULL,
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
  `id_dh` INT NOT NULL,
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
  `id_prof` INT NOT NULL,
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
  `id_pru` INT NOT NULL,
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

USE `cuisamor_usuarios1` ;
USE `cuisamor_usuarios2` ;

-- -----------------------------------------------------
-- Table `cuisamor_usuarios2`.`cenfermedad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios2`.`cenfermedad` (
  `idCEnfermedad` INT NOT NULL AUTO_INCREMENT,
  `nom_cenf` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idCEnfermedad`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios2`.`cservicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios2`.`cservicios` (
  `idServicios` INT NOT NULL AUTO_INCREMENT,
  `des_cser` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idServicios`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios2`.`datos_acceso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios2`.`datos_acceso` (
  `id_datu` INT NOT NULL AUTO_INCREMENT,
  `cor_datu` VARCHAR(45) NULL DEFAULT NULL,
  `pas_datu` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id_datu`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios2`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios2`.`usuario` (
  `id_use` INT NOT NULL AUTO_INCREMENT,
  `id_datu` INT NULL DEFAULT NULL,
  `nom_use` VARCHAR(120) NULL DEFAULT NULL,
  `idd_use` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_use`),
  INDEX `id_datu_idx` (`id_datu` ASC) VISIBLE,
  CONSTRAINT `id_datu`
    FOREIGN KEY (`id_datu`)
    REFERENCES `cuisamor_usuarios1`.`datos_acceso` (`id_datu`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios2`.`direcciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios2`.`direcciones` (
  `id_diru` INT NOT NULL AUTO_INCREMENT,
  `dir_diru` VARCHAR(150) NULL DEFAULT NULL,
  `id_use` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_diru`),
  INDEX `id_usu_idx` (`id_use` ASC) VISIBLE,
  CONSTRAINT `id_usu`
    FOREIGN KEY (`id_use`)
    REFERENCES `cuisamor_usuarios2`.`usuario` (`id_use`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios2`.`paciente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios2`.`paciente` (
  `id_pac` INT NOT NULL AUTO_INCREMENT,
  `id_use` INT NULL DEFAULT NULL,
  `nom_pac` VARCHAR(45) NULL DEFAULT NULL,
  `rela_pac` VARCHAR(45) NULL DEFAULT NULL COMMENT 'QUe relacion tiene ? papa mama etc',
  PRIMARY KEY (`id_pac`),
  INDEX `id_use_idx` (`id_use` ASC) VISIBLE,
  CONSTRAINT `id_use`
    FOREIGN KEY (`id_use`)
    REFERENCES `cuisamor_usuarios2`.`usuario` (`id_use`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios2`.`historial_medico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios2`.`historial_medico` (
  `idHistorial_medico` INT NOT NULL AUTO_INCREMENT,
  `id_pac` INT NULL DEFAULT NULL,
  `Historial_medicocol` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idHistorial_medico`),
  INDEX `id_pac_idx` (`id_pac` ASC) VISIBLE,
  CONSTRAINT `id_pac`
    FOREIGN KEY (`id_pac`)
    REFERENCES `cuisamor_usuarios2`.`paciente` (`id_pac`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios2`.`trabajo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios2`.`trabajo` (
  `idTrabajo` INT NOT NULL AUTO_INCREMENT,
  `idServicios` INT NULL DEFAULT NULL,
  `idCEnfermedad` INT NULL DEFAULT NULL,
  `id_pac` INT NULL DEFAULT NULL,
  `horas` VARCHAR(45) NULL DEFAULT NULL,
  `paga` VARCHAR(45) NULL DEFAULT NULL,
  `dias` VARCHAR(45) NULL DEFAULT NULL,
  `horai` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idTrabajo`),
  INDEX `idCEnfermedad_idx` (`idCEnfermedad` ASC) VISIBLE,
  INDEX `idServicios_idx` (`idServicios` ASC) VISIBLE,
  INDEX `id_pac_idx` (`id_pac` ASC) VISIBLE,
  CONSTRAINT `fk_trabajo_id_pac`
    FOREIGN KEY (`id_pac`)
    REFERENCES `cuisamor_usuarios2`.`paciente` (`id_pac`),
  CONSTRAINT `idCEnfermedad`
    FOREIGN KEY (`idCEnfermedad`)
    REFERENCES `cuisamor_usuarios2`.`cenfermedad` (`idCEnfermedad`),
  CONSTRAINT `idServicios`
    FOREIGN KEY (`idServicios`)
    REFERENCES `cuisamor_usuarios2`.`cservicios` (`idServicios`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


