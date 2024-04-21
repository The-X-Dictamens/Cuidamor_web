-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema cuisamor_usuarios1
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema cuisamor_usuarios1
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `cuisamor_usuarios1` DEFAULT CHARACTER SET utf8mb3 ;
USE `cuisamor_usuarios1` ;

-- -----------------------------------------------------
-- Table `cuisamor_usuarios1`.`cenfermedad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios1`.`cenfermedad` (
  `idCEnfermedad` INT NOT NULL,
  `nom_cenf` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idCEnfermedad`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios1`.`cservicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios1`.`cservicios` (
  `idServicios` INT NOT NULL,
  `des_cser` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idServicios`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios1`.`datos_acceso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios1`.`datos_acceso` (
  `id_datu` INT NOT NULL,
  `cor_datu` VARCHAR(45) NULL DEFAULT NULL,
  `pas_datu` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id_datu`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios1`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios1`.`usuario` (
  `id_use` INT NOT NULL,
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
-- Table `cuisamor_usuarios1`.`direcciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios1`.`direcciones` (
  `id_diru` INT NOT NULL AUTO_INCREMENT,
  `dir_diru` VARCHAR(150) NULL DEFAULT NULL,
  `id_use` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_diru`),
  INDEX `id_usu_idx` (`id_use` ASC) VISIBLE,
  CONSTRAINT `id_usu`
    FOREIGN KEY (`id_use`)
    REFERENCES `cuisamor_usuarios1`.`usuario` (`id_use`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios1`.`paciente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios1`.`paciente` (
  `id_pac` INT NOT NULL AUTO_INCREMENT,
  `id_use` INT NULL DEFAULT NULL,
  `nom_pac` VARCHAR(45) NULL DEFAULT NULL,
  `rela_pac` VARCHAR(45) NULL DEFAULT NULL COMMENT 'QUe relacion tiene ? papa mama etc',
  PRIMARY KEY (`id_pac`),
  INDEX `id_use_idx` (`id_use` ASC) VISIBLE,
  CONSTRAINT `id_use`
    FOREIGN KEY (`id_use`)
    REFERENCES `cuisamor_usuarios1`.`usuario` (`id_use`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios1`.`historial_medico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios1`.`historial_medico` (
  `idHistorial_medico` INT NOT NULL AUTO_INCREMENT,
  `id_pac` INT NULL DEFAULT NULL,
  `Historial_medicocol` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idHistorial_medico`),
  INDEX `id_pac_idx` (`id_pac` ASC) VISIBLE,
  CONSTRAINT `id_pac`
    FOREIGN KEY (`id_pac`)
    REFERENCES `cuisamor_usuarios1`.`paciente` (`id_pac`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cuisamor_usuarios1`.`trabajo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisamor_usuarios1`.`trabajo` (
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
    REFERENCES `cuisamor_usuarios1`.`paciente` (`id_pac`),
  CONSTRAINT `idCEnfermedad`
    FOREIGN KEY (`idCEnfermedad`)
    REFERENCES `cuisamor_usuarios1`.`cenfermedad` (`idCEnfermedad`),
  CONSTRAINT `idServicios`
    FOREIGN KEY (`idServicios`)
    REFERENCES `cuisamor_usuarios1`.`cservicios` (`idServicios`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
