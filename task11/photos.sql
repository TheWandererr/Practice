CREATE DATABASE IF NOT EXISTS `makeamoment` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `makeamoment`;
DROP TABLE IF EXISTS `user`;
SET NAMES utf8 ;
SET character_set_client = utf8mb4 ;

CREATE TABLE IF NOT EXISTS `user` (
  `idUSER` int(11) NOT NULL,
  `NAME` varchar(45) NOT NULL,
  PRIMARY KEY (`idUSER`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'bob'),(2,'ark'),(3,'park'),(4,'clark'),(5,'tom'),(6,'kom'),(7,'som'),(8,'sam'),(9,'ram'),(10,'dam'),(11,'pum'),(12,'dum');
UNLOCK TABLES;

USE `makeamoment`;
SET NAMES utf8;
SET character_set_client = utf8mb4 ;

CREATE TABLE IF NOT EXISTS `photo_post` (
  `idPHOTO_POST` int(11) NOT NULL,
  `DESCRIPTION` varchar(200) NOT NULL,
  `CREATION_DATE` datetime NOT NULL,
  `PHOTO_LINK` varchar(45) NOT NULL,
  `idUSER` int(11) NOT NULL,
  PRIMARY KEY (`idPHOTO_POST`),
  KEY `idUSER_idx` (`idUSER`),
  CONSTRAINT `idUSER` FOREIGN KEY (`idUSER`) REFERENCES `user` (`idUSER`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `photo_post` WRITE;
INSERT INTO `photo_post` VALUES (11,'bobobobobobo','2019-05-06 00:00:00','hhtps://11',1),(12,'alalalalalalalallalalalalalalalallalalalalalalalallalalalalalalalallalalalalalalalallalalalalalalalal','2019-05-09 00:00:00','hhtps://12',1),(1,'blablablabla','2019-05-09 00:00:00','hhtps://1',2),(2,'boooooooooooo','2019-05-05 00:00:00','hhtps://2',3),(3,'hello oiyrioqwerwq','2019-05-01 00:00:00','hhtps://3',1),(4,'pupupupupupupup','2019-05-01 00:00:00','hhtps://4',1),(5,'booom hello','2019-04-30 00:00:00','https://5',8),(6,'tatatatatatatat','2019-05-01 00:00:00','hhtps://6',4),(7,'kakakakakakakakka','2019-05-05 00:00:00','hhtps://7',5),(8,'yyryryryryryryry','2019-05-01 00:00:00','hhtps://8',6),(9,'rfewrewrwerrggdgw','2019-05-05 00:00:00','hhtps://9',7),(10,'rewrewr hello wfsetewtew','2019-05-05 00:00:00','hhtps://10',8);
UNLOCK TABLES;

USE `makeamoment`;
SET NAMES utf8 ;
SET character_set_client = utf8mb4 ;

CREATE TABLE IF NOT EXISTS `tags` (
  `idTAG` int(11) NOT NULL,
  `TAG` varchar(20) NOT NULL,
  `idPHOTO_POST` int(11) NOT NULL,
  PRIMARY KEY (`idTAG`),
  KEY `idPHOTO_POST_idx` (`idPHOTO_POST`),
  CONSTRAINT `idPHOTO_POST` FOREIGN KEY (`idPHOTO_POST`) REFERENCES `photo_post` (`idPHOTO_POST`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `tags` WRITE;
INSERT INTO `tags` VALUES (1,'car',1),(2,'moto',1),(3,'child',2),(4,'boom',3),(5,'mobile',4),(6,'mom',5);
UNLOCK TABLES;

USE `makeamoment`;
SET NAMES utf8 ;
SET character_set_client = utf8mb4 ;

CREATE TABLE IF NOT EXISTS `like` (
  `idLIKE` int(11) NOT NULL AUTO_INCREMENT,
  `idPHOTO_POST` int(11) NOT NULL,
  `idUSER` int(11) NOT NULL,
  PRIMARY KEY (`idLIKE`),
  KEY `idPHOTO_POST_idx` (`idPHOTO_POST`),
  KEY `idUSER_idx` (`idUSER`),
  CONSTRAINT `idPERSON` FOREIGN KEY (`idUSER`) REFERENCES `user` (`idUSER`),
  CONSTRAINT `idPOST` FOREIGN KEY (`idPHOTO_POST`) REFERENCES `photo_post` (`idPHOTO_POST`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `like` WRITE;
UNLOCK TABLES;