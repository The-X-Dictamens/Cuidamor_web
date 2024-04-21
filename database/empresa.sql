-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Cuisamor_Usuarios1
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Cuisamor_Usuarios1
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Cuisamor_Usuarios1` DEFAULT CHARACTER SET utf8 ;
USE `Cuisamor_Usuarios1` ;

-- -----------------------------------------------------
-- Table `Cuisamor_Usuarios1`.`Datos_acceso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuisamor_Usuarios1`.`Datos_acceso` (
  `id_datu` INT NOT NULL AUTO_INCREMENT,
  `cor_datu` VARCHAR(45) NULL,
  `pas_datu` VARCHAR(150) NULL,
  PRIMARY KEY (`id_datu`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuisamor_Usuarios1`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuisamor_Usuarios1`.`Usuario` (
  `id_use` INT NOT NULL AUTO_INCREMENT,
  `id_datu` INT NULL,
  `nom_use` VARCHAR(120) NULL,
  `idd_use` INT NULL ,
  PRIMARY KEY (`id_use`),
  INDEX `id_datu_idx` (`id_datu` ASC) VISIBLE,
  CONSTRAINT `id_datu`
    FOREIGN KEY (`id_datu`)
    REFERENCES `Cuisamor_Usuarios1`.`Datos_acceso` (`id_datu`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuisamor_Usuarios1`.`Direcciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuisamor_Usuarios1`.`Direcciones` (
  `id_diru` INT NOT NULL AUTO_INCREMENT,
  `dir_diru` VARCHAR(150) NULL,
  `idd_use` INT NULL,
  PRIMARY KEY (`id_diru`),
  INDEX `idd_use_idx` (`idd_use` ASC) VISIBLE,
  CONSTRAINT `idd_use`
    FOREIGN KEY (`idd_use`)
    REFERENCES `Cuisamor_Usuarios1`.`Usuario` (`id_use`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuisamor_Usuarios1`.`Paciente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuisamor_Usuarios1`.`Paciente` (
  `id_pac` INT NOT NULL AUTO_INCREMENT,
  `id_use` INT NULL,
  `nom_pac` VARCHAR(45) NULL,
  `rela_pac` VARCHAR(45) NULL COMMENT 'QUe relacion tiene ? papa mama etc',
  PRIMARY KEY (`id_pac`),
  INDEX `id_use_idx` (`id_use` ASC) VISIBLE,
  CONSTRAINT `id_use`
    FOREIGN KEY (`id_use`)
    REFERENCES `Cuisamor_Usuarios1`.`Usuario` (`id_use`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuisamor_Usuarios1`.`Historial_medico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuisamor_Usuarios1`.`Historial_medico` (
  `idHistorial_medico` INT NOT NULL AUTO_INCREMENT,
  `id_pac` INT NULL,
  `Historial_medicocol` VARCHAR(45) NULL,
  PRIMARY KEY (`idHistorial_medico`),
  INDEX `id_pac_idx` (`id_pac` ASC) VISIBLE,
  CONSTRAINT `id_paci`
    FOREIGN KEY (`id_pac`)
    REFERENCES `Cuisamor_Usuarios1`.`Paciente` (`id_pac`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuisamor_Usuarios1`.`CServicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuisamor_Usuarios1`.`CServicios` (
  `idServicios` INT NOT NULL AUTO_INCREMENT,
  `des_cser` VARCHAR(45) NULL,
  PRIMARY KEY (`idServicios`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuisamor_Usuarios1`.`CEnfermedad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuisamor_Usuarios1`.`CEnfermedad` (
  `idCEnfermedad` INT NOT NULL AUTO_INCREMENT,
  `nom_cenf` VARCHAR(45) NULL,
  PRIMARY KEY (`idCEnfermedad`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cuisamor_Usuarios1`.`Trabajo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cuisamor_Usuarios1`.`Trabajo` (
  `idTrabajo` INT NOT NULL ,
  `idServicios` INT NULL,
  `idCEnfermedad` INT NULL,
  `id_pac` INT NULL,
  `horas` VARCHAR(45) NULL,
  `paga` VARCHAR(45) NULL,
  `dias` VARCHAR(45) NULL,
  `horai` VARCHAR(45) NULL,
  PRIMARY KEY (`idTrabajo`),
  INDEX `idCEnfermedad_idx` (`idCEnfermedad` ASC) VISIBLE,
  INDEX `idServicios_idx` (`idServicios` ASC) VISIBLE,
  INDEX `id_pac_idx` (`id_pac` ASC) VISIBLE,
  CONSTRAINT `idCEnfermedad`
    FOREIGN KEY (`idCEnfermedad`)
    REFERENCES `Cuisamor_Usuarios1`.`CEnfermedad` (`idCEnfermedad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `idServicios`
    FOREIGN KEY (`idServicios`)
    REFERENCES `Cuisamor_Usuarios1`.`CServicios` (`idServicios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_pac`
    FOREIGN KEY (`id_pac`)
    REFERENCES `Cuisamor_Usuarios1`.`Paciente` (`id_pac`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
