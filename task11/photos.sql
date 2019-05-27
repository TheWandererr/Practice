CREATE DATABASE IF NOT EXISTS `makeamoment` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `makeamoment`;
DROP TABLE IF EXISTS `user`;
SET NAMES utf8 ;
SET character_set_client = utf8mb4 ;

CREATE TABLE IF NOT EXISTS `user` (
  `idUSER` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(45) NOT NULL,
  `PASS` varchar(45) NOT NULL,
  PRIMARY KEY (`idUSER`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'admin', '21232f297a57a5a743894a0e4a801fc3'),(2,'bob', '81dc9bdb52d04dc20036dbd8313ed055');
UNLOCK TABLES;

USE `makeamoment`;
SET NAMES utf8;
SET character_set_client = utf8mb4 ;

CREATE TABLE IF NOT EXISTS `photo_post` (
  `idPHOTO_POST` int(11) NOT NULL AUTO_INCREMENT,
  `DESCRIPTION` varchar(200) NOT NULL,
  `CREATION_DATE` bigint(22) NOT NULL,
  `PHOTO_LINK` varchar(45) NOT NULL,
  `idUSER` int(11) NOT NULL,
  PRIMARY KEY (`idPHOTO_POST`),
  KEY `idUSER_idx` (`idUSER`),
  CONSTRAINT `idUSER` FOREIGN KEY (`idUSER`) REFERENCES `user` (`idUSER`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


USE `makeamoment`;
SET NAMES utf8 ;
SET character_set_client = utf8mb4 ;

CREATE TABLE IF NOT EXISTS `tags` (
  `idTAG` int(11) NOT NULL AUTO_INCREMENT,
  `TAG` varchar(20) NOT NULL,
  `idPHOTO_POST` int(11) NOT NULL,
  PRIMARY KEY (`idTAG`),
  KEY `idPHOTO_POST_idx` (`idPHOTO_POST`),
  CONSTRAINT `idPHOTO_POST` FOREIGN KEY (`idPHOTO_POST`) REFERENCES `photo_post` (`idPHOTO_POST`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


USE `makeamoment`;
SET NAMES utf8 ;
SET character_set_client = utf8mb4 ;

CREATE TABLE IF NOT EXISTS `like` (
  `idLIKE` int(11) NOT NULL AUTO_INCREMENT,
  `idPHOTO_POST` int(11) NOT NULL,
  `idUSER` int(11) NOT NULL,
  UNIQUE (`idPHOTO_POST`, `idUSER`),
  PRIMARY KEY (`idLIKE`),
  KEY `idPHOTO_POST_idx` (`idPHOTO_POST`),
  KEY `idUSER_idx` (`idUSER`),
  CONSTRAINT `idPERSON` FOREIGN KEY (`idUSER`) REFERENCES `user` (`idUSER`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `idPOST` FOREIGN KEY (`idPHOTO_POST`) REFERENCES `photo_post` (`idPHOTO_POST`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `like` WRITE;
UNLOCK TABLES;