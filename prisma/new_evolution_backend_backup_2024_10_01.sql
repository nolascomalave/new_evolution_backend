-- MySQL dump 10.13  Distrib 8.0.32, for macos13 (arm64)
--
-- Host: localhost    Database: new_evolution_backend
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `entity`
--

DROP TABLE IF EXISTS `entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_entity_parent` int DEFAULT NULL,
  `id_document` int DEFAULT NULL,
  `is_natural` bit(1) NOT NULL DEFAULT b'1',
  `name` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('Male','Female') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_birth` datetime DEFAULT NULL,
  `address` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `inactivated_at` datetime DEFAULT NULL,
  `inactivated_by` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_entity_parent` (`id_entity_parent`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `entity_ibfk_1` FOREIGN KEY (`id_entity_parent`) REFERENCES `entity` (`id`),
  CONSTRAINT `entity_ibfk_5` FOREIGN KEY (`id_entity_parent`) REFERENCES `entity` (`id`),
  CONSTRAINT `entity_ibfk_6` FOREIGN KEY (`id_entity_parent`) REFERENCES `entity` (`id`),
  CONSTRAINT `entity_ibfk_7` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_ibfk_8` FOREIGN KEY (`updated_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_ibfk_9` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity`
--

LOCK TABLES `entity` WRITE;
/*!40000 ALTER TABLE `entity` DISABLE KEYS */;
INSERT INTO `entity` VALUES (1,NULL,NULL,_binary '\0','Quotes System',NULL,NULL,NULL,NULL,'2024-07-19 13:40:21',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,NULL,73,_binary '','Nolasco Rafael Malavé Castro','Male',NULL,'Vivo en mi casa.','8cbd30990784bd18ee6c7f721669702c.png','2024-07-19 17:50:28',1,NULL,NULL,'2024-07-22 19:56:41',1,NULL,NULL),(7,NULL,3,_binary '','Johanna Del Valle Castro Alvarado','Male',NULL,NULL,'profile-photo.png','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL,NULL,NULL),(8,NULL,4,_binary '','Rosa Victoria Tarazona Rojas','Female',NULL,NULL,NULL,'2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL,NULL,NULL),(16,NULL,12,_binary '','José Malavé','Male',NULL,NULL,NULL,'2024-07-19 19:05:30',1,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `entity_complete_info`
--

DROP TABLE IF EXISTS `entity_complete_info`;
/*!50001 DROP VIEW IF EXISTS `entity_complete_info`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `entity_complete_info` AS SELECT 
 1 AS `id`,
 1 AS `id_entity_parent`,
 1 AS `id_document`,
 1 AS `is_natural`,
 1 AS `name`,
 1 AS `gender`,
 1 AS `date_birth`,
 1 AS `address`,
 1 AS `photo`,
 1 AS `created_at`,
 1 AS `created_by`,
 1 AS `updated_at`,
 1 AS `updated_by`,
 1 AS `annulled_at`,
 1 AS `annulled_by`,
 1 AS `complete_name`,
 1 AS `names_obj`,
 1 AS `names`,
 1 AS `surnames`,
 1 AS `legal_name`,
 1 AS `business_name`,
 1 AS `comercial_designation`,
 1 AS `documents`,
 1 AS `phones`,
 1 AS `emails`,
 1 AS `id_system`,
 1 AS `id_system_subscription`,
 1 AS `id_system_subscription_user`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `entity_document`
--

DROP TABLE IF EXISTS `entity_document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_document` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_entity_document_category` int DEFAULT NULL,
  `id_entity` int DEFAULT NULL,
  `document` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_entity_document_category` (`id_entity_document_category`),
  KEY `id_entity` (`id_entity`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `entity_document_ibfk_1` FOREIGN KEY (`id_entity_document_category`) REFERENCES `entity_document_category` (`id`),
  CONSTRAINT `entity_document_ibfk_2` FOREIGN KEY (`id_entity`) REFERENCES `entity` (`id`),
  CONSTRAINT `entity_document_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_document_ibfk_4` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_document`
--

LOCK TABLES `entity_document` WRITE;
/*!40000 ALTER TABLE `entity_document` DISABLE KEYS */;
INSERT INTO `entity_document` VALUES (2,1,4,'2351351444',2118,'2024-07-19 17:50:28',1,'2024-07-22 19:56:41',1),(3,1,7,'1462743955',1,'2024-07-19 18:06:38',1,NULL,NULL),(4,1,8,'2663219852',1,'2024-07-19 18:10:09',1,NULL,NULL),(12,1,16,'825109000',1,'2024-07-19 19:05:30',1,NULL,NULL),(19,1,4,'2351351444',2117,'2024-07-22 18:28:43',1,'2024-07-22 19:56:41',1),(20,1,4,'2351351444',2116,'2024-07-22 18:30:11',1,'2024-07-22 19:56:41',1),(21,1,4,'2351351444',2115,'2024-07-22 18:30:15',1,'2024-07-22 19:56:41',1),(22,1,4,'2351351444',2114,'2024-07-22 18:30:23',1,'2024-07-22 19:56:41',1),(23,1,4,'2351351444',2113,'2024-07-22 18:30:41',1,'2024-07-22 19:56:41',1),(24,1,4,'2351351444',2112,'2024-07-22 18:31:13',1,'2024-07-22 19:56:41',1),(25,1,4,'2351351444',2111,'2024-07-22 18:47:30',1,'2024-07-22 19:56:41',1),(26,1,4,'2351351444',2110,'2024-07-22 19:05:40',1,'2024-07-22 19:56:41',1),(27,1,4,'2351351444',2109,'2024-07-22 19:06:57',1,'2024-07-22 19:56:41',1),(28,1,4,'2351351444',2108,'2024-07-22 19:07:12',1,'2024-07-22 19:56:41',1),(29,1,4,'2351351444',2107,'2024-07-22 19:07:41',1,'2024-07-22 19:56:41',1),(30,1,4,'2351351444',2106,'2024-07-22 19:08:04',1,'2024-07-22 19:56:41',1),(31,1,4,'2351351444',2105,'2024-07-22 19:08:22',1,'2024-07-22 19:56:41',1),(32,1,4,'2351351444',2104,'2024-07-22 19:08:31',1,'2024-07-22 19:56:41',1),(33,1,4,'2351351444',2103,'2024-07-22 19:08:45',1,'2024-07-22 19:56:41',1),(34,1,4,'2351351444',2102,'2024-07-22 19:19:18',1,'2024-07-22 19:56:41',1),(38,1,4,'2351351444',2101,'2024-07-22 19:25:34',1,'2024-07-22 19:56:41',1),(39,1,4,'2351351444',2100,'2024-07-22 19:25:42',1,'2024-07-22 19:56:41',1),(42,1,4,'2351351444',2099,'2024-07-22 19:28:29',1,'2024-07-22 19:56:41',1),(43,1,4,'2351351444',2098,'2024-07-22 19:30:13',1,'2024-07-22 19:56:41',1),(44,1,4,'2351351444',2097,'2024-07-22 19:30:17',1,'2024-07-22 19:56:41',1),(45,1,4,'2351351444',2096,'2024-07-22 19:30:22',1,'2024-07-22 19:56:41',1),(46,1,4,'2351351444',2095,'2024-07-22 19:30:42',1,'2024-07-22 19:56:41',1),(47,1,4,'2351351444',2094,'2024-07-22 19:36:50',1,'2024-07-22 19:56:41',1),(48,1,4,'2351351444',2093,'2024-07-22 19:36:56',1,'2024-07-22 19:56:41',1),(49,1,4,'2351351444',2092,'2024-07-22 19:37:25',1,'2024-07-22 19:56:41',1),(50,1,4,'2351351444',2091,'2024-07-22 19:37:31',1,'2024-07-22 19:56:41',1),(51,1,4,'2351351444',2090,'2024-07-22 19:38:07',1,'2024-07-22 19:56:41',1),(52,1,4,'2351351444',2089,'2024-07-22 19:38:15',1,'2024-07-22 19:56:41',1),(53,1,4,'2351351444',2088,'2024-07-22 19:38:22',1,'2024-07-22 19:56:41',1),(54,1,4,'2351351444',2087,'2024-07-22 19:40:06',1,'2024-07-22 19:56:41',1),(55,1,4,'2351351444',2086,'2024-07-22 19:40:14',1,'2024-07-22 19:56:41',1),(56,1,4,'2351351444',2085,'2024-07-22 19:40:22',1,'2024-07-22 19:56:41',1),(57,1,4,'2351351444',2084,'2024-07-22 19:41:35',1,'2024-07-22 19:56:41',1),(58,1,4,'2351351444',2083,'2024-07-22 19:42:20',1,'2024-07-22 19:56:41',1),(59,1,4,'2351351444',2082,'2024-07-22 19:42:51',1,'2024-07-22 19:56:41',1),(60,1,4,'2351351444',2081,'2024-07-22 19:43:46',1,'2024-07-22 19:56:41',1),(62,1,4,'2351351444',2080,'2024-07-22 19:44:46',1,'2024-07-22 19:56:41',1),(63,1,4,'2351351444',2079,'2024-07-22 19:44:56',1,'2024-07-22 19:56:41',1),(67,1,4,'2351351444',2078,'2024-07-22 19:54:01',1,'2024-07-22 19:56:41',1),(68,1,4,'2351351444',2077,'2024-07-22 19:54:45',1,'2024-07-22 19:56:41',1),(69,1,4,'2351351444',2076,'2024-07-22 19:56:04',1,'2024-07-22 19:56:41',1),(70,1,4,'2351351444',2075,'2024-07-22 19:56:31',1,'2024-07-22 19:56:41',1),(71,1,4,'2351351444',2074,'2024-07-22 19:56:33',1,'2024-07-22 19:56:41',1),(72,1,4,'2351351444',2073,'2024-07-22 19:56:35',1,'2024-07-22 19:56:41',1),(73,1,4,'2351351444',1,'2024-07-22 19:56:41',1,NULL,NULL);
/*!40000 ALTER TABLE `entity_document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity_document_by_entity`
--

DROP TABLE IF EXISTS `entity_document_by_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_document_by_entity` (
  `id_entity` int NOT NULL,
  `id_entity_document` int NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id_entity`,`id_entity_document`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_document_by_entity`
--

LOCK TABLES `entity_document_by_entity` WRITE;
/*!40000 ALTER TABLE `entity_document_by_entity` DISABLE KEYS */;
/*!40000 ALTER TABLE `entity_document_by_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity_document_category`
--

DROP TABLE IF EXISTS `entity_document_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_document_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_parent` int DEFAULT NULL,
  `id_city` int DEFAULT NULL,
  `id_state` int DEFAULT NULL,
  `id_country` int DEFAULT NULL,
  `category` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `symbol` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_parent` (`id_parent`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `entity_document_category_ibfk_1` FOREIGN KEY (`id_parent`) REFERENCES `entity_document_category` (`id`),
  CONSTRAINT `entity_document_category_ibfk_2` FOREIGN KEY (`id_parent`) REFERENCES `entity_document_category` (`id`),
  CONSTRAINT `entity_document_category_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_document_category_ibfk_4` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_document_category`
--

LOCK TABLES `entity_document_category` WRITE;
/*!40000 ALTER TABLE `entity_document_category` DISABLE KEYS */;
INSERT INTO `entity_document_category` VALUES (1,NULL,NULL,NULL,NULL,'Social Security Number','SSN','2024-07-19 13:44:18',1,NULL,NULL);
/*!40000 ALTER TABLE `entity_document_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `entity_documents_by_entity`
--

DROP TABLE IF EXISTS `entity_documents_by_entity`;
/*!50001 DROP VIEW IF EXISTS `entity_documents_by_entity`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `entity_documents_by_entity` AS SELECT 
 1 AS `id_entity`,
 1 AS `documents`,
 1 AS `quantity`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `entity_email`
--

DROP TABLE IF EXISTS `entity_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_email` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `entity_email_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_email_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_email_ibfk_3` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_email`
--

LOCK TABLES `entity_email` WRITE;
/*!40000 ALTER TABLE `entity_email` DISABLE KEYS */;
INSERT INTO `entity_email` VALUES (2,'nolascomalave@hotmail.com','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(3,'johacas20@gmail.com','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL),(4,'tarazonavictoria15@gmail.com','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(5,'guillerwolf@hotmail.com','2024-07-19 19:05:30',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `entity_email` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity_email_by_entity`
--

DROP TABLE IF EXISTS `entity_email_by_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_email_by_entity` (
  `id_entity` int NOT NULL,
  `id_entity_email` int NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id_entity`,`id_entity_email`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `entity_email_by_entity_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_email_by_entity_ibfk_2` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_email_by_entity`
--

LOCK TABLES `entity_email_by_entity` WRITE;
/*!40000 ALTER TABLE `entity_email_by_entity` DISABLE KEYS */;
INSERT INTO `entity_email_by_entity` VALUES (4,2,1,'2024-07-19 17:50:28',1,NULL,NULL),(7,3,1,'2024-07-19 18:06:38',1,NULL,NULL),(8,4,1,'2024-07-19 18:10:09',1,NULL,NULL),(16,5,1,'2024-07-19 19:05:30',1,NULL,NULL);
/*!40000 ALTER TABLE `entity_email_by_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `entity_emails_concat`
--

DROP TABLE IF EXISTS `entity_emails_concat`;
/*!50001 DROP VIEW IF EXISTS `entity_emails_concat`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `entity_emails_concat` AS SELECT 
 1 AS `id_entity`,
 1 AS `emails`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `entity_name`
--

DROP TABLE IF EXISTS `entity_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_name` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `entity_name_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_name_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_name_ibfk_3` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_name`
--

LOCK TABLES `entity_name` WRITE;
/*!40000 ALTER TABLE `entity_name` DISABLE KEYS */;
INSERT INTO `entity_name` VALUES (1,'Quotes System','2024-07-19 13:40:32',1,NULL,NULL,NULL,NULL),(2,'Nolasco','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(3,'Rafael','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(4,'Malavé','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(5,'Castro','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(6,'Johanna','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL),(7,'Del Valle','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL),(8,'Alvarado','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL),(9,'Rosa','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(10,'Victoria','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(11,'Tarazona','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(12,'Rojas','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(20,'José','2024-07-19 19:05:30',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `entity_name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity_name_by_entity`
--

DROP TABLE IF EXISTS `entity_name_by_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_name_by_entity` (
  `id_entity` int NOT NULL,
  `id_entity_name` int NOT NULL,
  `id_entity_name_type` int NOT NULL,
  `order_type` int NOT NULL DEFAULT '0',
  `order` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id_entity`,`id_entity_name`,`id_entity_name_type`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  KEY `id_entity_name_type` (`id_entity_name_type`),
  CONSTRAINT `entity_name_by_entity_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_name_by_entity_ibfk_4` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_name_by_entity`
--

LOCK TABLES `entity_name_by_entity` WRITE;
/*!40000 ALTER TABLE `entity_name_by_entity` DISABLE KEYS */;
INSERT INTO `entity_name_by_entity` VALUES (1,1,6,0,1,'2024-07-19 13:44:04',1,NULL,NULL),(4,2,1,0,1,'2024-07-19 17:50:28',1,NULL,NULL),(4,3,1,0,2,'2024-07-19 17:50:28',1,NULL,NULL),(4,4,1,0,275,'2024-07-19 17:50:28',1,'2024-07-22 19:56:41',1),(4,4,2,0,1,'2024-07-22 18:28:43',1,NULL,NULL),(4,5,1,0,276,'2024-07-19 17:50:28',1,'2024-07-22 19:56:41',1),(4,5,2,0,2,'2024-07-22 18:28:43',1,NULL,NULL),(7,5,2,0,1,'2024-07-19 18:06:38',1,NULL,NULL),(7,6,1,0,1,'2024-07-19 18:06:38',1,NULL,NULL),(7,7,1,0,2,'2024-07-19 18:06:38',1,NULL,NULL),(7,8,2,0,2,'2024-07-19 18:06:38',1,NULL,NULL),(8,9,1,0,1,'2024-07-19 18:10:09',1,NULL,NULL),(8,10,1,0,2,'2024-07-19 18:10:09',1,NULL,NULL),(8,11,2,0,1,'2024-07-19 18:10:09',1,NULL,NULL),(8,12,2,0,2,'2024-07-19 18:10:09',1,NULL,NULL),(16,4,2,0,1,'2024-07-19 19:05:30',1,NULL,NULL),(16,20,1,0,1,'2024-07-19 19:05:30',1,NULL,NULL),(24,2,1,0,1,'2024-07-19 19:47:25',1,NULL,NULL),(24,4,2,0,1,'2024-07-19 19:47:25',1,NULL,NULL),(25,2,1,0,1,'2024-07-19 19:47:41',1,NULL,NULL),(25,4,2,0,1,'2024-07-19 19:47:41',1,NULL,NULL),(34,2,1,0,1,'2024-07-19 20:16:49',1,NULL,NULL),(34,4,2,0,1,'2024-07-19 20:16:49',1,NULL,NULL),(35,2,1,0,1,'2024-07-19 20:17:33',1,NULL,NULL),(35,4,2,0,1,'2024-07-19 20:17:33',1,NULL,NULL);
/*!40000 ALTER TABLE `entity_name_by_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity_name_type`
--

DROP TABLE IF EXISTS `entity_name_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_name_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('Name','Surname','Alias','Business Name','Comercial Designation') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apply_to_natural` int NOT NULL DEFAULT '0',
  `apply_to_legal` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `entity_name_type_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_name_type_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_name_type_ibfk_3` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_name_type`
--

LOCK TABLES `entity_name_type` WRITE;
/*!40000 ALTER TABLE `entity_name_type` DISABLE KEYS */;
INSERT INTO `entity_name_type` VALUES (1,'Name',1,1,'2024-07-19 13:40:29',1,NULL,NULL,NULL,NULL),(2,'Surname',1,0,'2024-07-19 13:40:29',1,NULL,NULL,NULL,NULL),(3,'Alias',1,1,'2024-07-19 13:40:29',1,NULL,NULL,NULL,NULL),(4,'Business Name',0,1,'2024-07-19 13:40:29',1,NULL,NULL,NULL,NULL),(5,'Comercial Designation',0,1,'2024-07-19 13:40:29',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `entity_name_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `entity_names_concat_by_type`
--

DROP TABLE IF EXISTS `entity_names_concat_by_type`;
/*!50001 DROP VIEW IF EXISTS `entity_names_concat_by_type`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `entity_names_concat_by_type` AS SELECT 
 1 AS `id_entity`,
 1 AS `type`,
 1 AS `name`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `entity_phone`
--

DROP TABLE IF EXISTS `entity_phone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_phone` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `entity_phone_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_phone_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_phone_ibfk_3` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_phone`
--

LOCK TABLES `entity_phone` WRITE;
/*!40000 ALTER TABLE `entity_phone` DISABLE KEYS */;
INSERT INTO `entity_phone` VALUES (2,'+584123161687','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(5,'04128677911','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL),(6,'04129428193','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(14,'04162152797','2024-07-19 19:05:30',1,NULL,NULL,NULL,NULL),(22,'584123161687','2024-07-19 19:47:25',1,NULL,NULL,NULL,NULL),(23,'+584248411347','2024-07-22 18:28:43',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `entity_phone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity_phone_by_entity`
--

DROP TABLE IF EXISTS `entity_phone_by_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_phone_by_entity` (
  `id_entity` int NOT NULL,
  `id_entity_phone` int NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id_entity`,`id_entity_phone`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `entity_phone_by_entity_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_phone_by_entity_ibfk_2` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_phone_by_entity`
--

LOCK TABLES `entity_phone_by_entity` WRITE;
/*!40000 ALTER TABLE `entity_phone_by_entity` DISABLE KEYS */;
INSERT INTO `entity_phone_by_entity` VALUES (4,2,1,'2024-07-19 17:50:28',1,NULL,NULL),(4,23,2,'2024-07-22 18:28:43',1,NULL,NULL),(7,5,1,'2024-07-19 18:06:38',1,NULL,NULL),(8,6,1,'2024-07-19 18:10:09',1,NULL,NULL),(16,14,1,'2024-07-19 19:05:30',1,NULL,NULL),(24,22,1,'2024-07-19 19:47:25',1,NULL,NULL);
/*!40000 ALTER TABLE `entity_phone_by_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `entity_phones_concat`
--

DROP TABLE IF EXISTS `entity_phones_concat`;
/*!50001 DROP VIEW IF EXISTS `entity_phones_concat`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `entity_phones_concat` AS SELECT 
 1 AS `id_entity`,
 1 AS `phones`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `system`
--

DROP TABLE IF EXISTS `system`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key_name` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `inactivated_at` datetime DEFAULT NULL,
  `inactivated_by` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `annulled_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system`
--

LOCK TABLES `system` WRITE;
/*!40000 ALTER TABLE `system` DISABLE KEYS */;
INSERT INTO `system` VALUES (1,'QS','Quotes System',NULL,'2024-07-19 13:40:19',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `system` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_subscription`
--

DROP TABLE IF EXISTS `system_subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_subscription` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_system` int NOT NULL,
  `id_entity` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `inactivated_at` datetime DEFAULT NULL,
  `inactivated_by` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `system_subscription_index_0` (`id_system`,`id_entity`),
  KEY `id_entity` (`id_entity`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `system_subscription_ibfk_1` FOREIGN KEY (`id_system`) REFERENCES `system` (`id`),
  CONSTRAINT `system_subscription_ibfk_2` FOREIGN KEY (`id_entity`) REFERENCES `entity` (`id`),
  CONSTRAINT `system_subscription_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `system_subscription_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `system_subscription_ibfk_5` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_subscription`
--

LOCK TABLES `system_subscription` WRITE;
/*!40000 ALTER TABLE `system_subscription` DISABLE KEYS */;
INSERT INTO `system_subscription` VALUES (1,1,1,'2024-07-19 13:40:24',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `system_subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_subscription_user`
--

DROP TABLE IF EXISTS `system_subscription_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_subscription_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_system_subscription` int NOT NULL,
  `id_entity` int NOT NULL,
  `username` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(2500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `inactivated_at` datetime DEFAULT NULL,
  `inactivated_by` datetime DEFAULT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `system_subscription_user_index_0` (`id_system_subscription`,`id_entity`),
  UNIQUE KEY `system_subscription_user_index_1` (`id_system_subscription`,`username`),
  KEY `id_entity` (`id_entity`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `system_subscription_user_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `system_subscription_user_ibfk_4` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `system_subscription_user_ibfk_5` FOREIGN KEY (`id_system_subscription`) REFERENCES `system_subscription` (`id`),
  CONSTRAINT `system_subscription_user_ibfk_6` FOREIGN KEY (`id_entity`) REFERENCES `entity` (`id`),
  CONSTRAINT `system_subscription_user_ibfk_7` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `system_subscription_user_ibfk_8` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_subscription_user`
--

LOCK TABLES `system_subscription_user` WRITE;
/*!40000 ALTER TABLE `system_subscription_user` DISABLE KEYS */;
INSERT INTO `system_subscription_user` VALUES (1,1,1,'ADMIN','$2a$10$38IxNu92qUuiCuFyFb7hde8MFwK20lRbAFLH2tBvNJPhNSUoYXBpu','2024-07-19 13:40:26',NULL,NULL,NULL,NULL,NULL),(2,1,4,'usern','$2a$10$dXrVSbaQNZlj2ihdoOY0reTsHgXEU/SPrEWoAXU.R1DC.HWjpNBlq','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(3,1,7,'castroj','$2a$10$SVDjokICXNSW38VTiMG1LOP0hgf9j4Ex6GyLw4fjypxWrE57XOMR.','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL),(4,1,8,'tarazonar','$2a$10$B17hJTLAKlk4t8lTE0CoMOQc6t9rGQeEe5xQ33DLuBzvuW4DNVZAK','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(5,1,16,'malavej','$2a$10$kFdnwbdnUUd11/eXlw3snu6p.f8estmYiH3pc9C2d14j7kz5i/pcu','2024-07-19 19:05:30',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `system_subscription_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `system_subscription_user_complete_info`
--

DROP TABLE IF EXISTS `system_subscription_user_complete_info`;
/*!50001 DROP VIEW IF EXISTS `system_subscription_user_complete_info`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `system_subscription_user_complete_info` AS SELECT 
 1 AS `id`,
 1 AS `id_system`,
 1 AS `id_system_subscription`,
 1 AS `id_entity`,
 1 AS `id_system_subscription_user`,
 1 AS `username`,
 1 AS `password`,
 1 AS `name`,
 1 AS `names_obj`,
 1 AS `complete_name`,
 1 AS `names`,
 1 AS `surnames`,
 1 AS `documents`,
 1 AS `phones`,
 1 AS `emails`,
 1 AS `is_admin`,
 1 AS `inactivated_at_system`,
 1 AS `inactivated_at_system_subscription`,
 1 AS `inactivated_at_system_subscription_user`,
 1 AS `inactivated_by_system_subscription`,
 1 AS `inactivated_by_system_subscription_user`,
 1 AS `inactivated_at`,
 1 AS `inactivated_by`,
 1 AS `annulled_at_system`,
 1 AS `annulled_at_system_subscription`,
 1 AS `annulled_at_system_subscription_user`,
 1 AS `annulled_by_system_subscription`,
 1 AS `annulled_by_system_subscription_user`,
 1 AS `annulled_at`,
 1 AS `annulled_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_entity_names_by_type_obj`
--

DROP TABLE IF EXISTS `view_entity_names_by_type_obj`;
/*!50001 DROP VIEW IF EXISTS `view_entity_names_by_type_obj`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_entity_names_by_type_obj` AS SELECT 
 1 AS `id_entity`,
 1 AS `id_entity_name_type`,
 1 AS `type`,
 1 AS `names`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_entity_names_object`
--

DROP TABLE IF EXISTS `view_entity_names_object`;
/*!50001 DROP VIEW IF EXISTS `view_entity_names_object`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_entity_names_object` AS SELECT 
 1 AS `id_entity`,
 1 AS `types`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `entity_complete_info`
--

/*!50001 DROP VIEW IF EXISTS `entity_complete_info`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `entity_complete_info` AS select `ent`.`id` AS `id`,`ent`.`id_entity_parent` AS `id_entity_parent`,`ent`.`id_document` AS `id_document`,`ent`.`is_natural` AS `is_natural`,`ent`.`name` AS `name`,`ent`.`gender` AS `gender`,`ent`.`date_birth` AS `date_birth`,`ent`.`address` AS `address`,`ent`.`photo` AS `photo`,`ent`.`created_at` AS `created_at`,`ent`.`created_by` AS `created_by`,`ent`.`updated_at` AS `updated_at`,`ent`.`updated_by` AS `updated_by`,`ent`.`annulled_at` AS `annulled_at`,`ent`.`annulled_by` AS `annulled_by`,(case when (`ent`.`is_natural` = 1) then trim(concat(if((`names`.`name` is null),'',`names`.`name`),' ',if((`surnames`.`name` is null),'',`surnames`.`name`))) else coalesce(`name`.`name`,`business_name`.`name`,`comercial_designation`.`name`) end) AS `complete_name`,if((`names_obj`.`types` is null),NULL,concat('[',`names_obj`.`types`,']')) AS `names_obj`,`names`.`name` AS `names`,if((`ent`.`is_natural` = 1),`surnames`.`name`,NULL) AS `surnames`,if((`ent`.`is_natural` = 1),NULL,`name`.`name`) AS `legal_name`,if((`ent`.`is_natural` = 1),NULL,`business_name`.`name`) AS `business_name`,if((`ent`.`is_natural` = 1),NULL,`comercial_designation`.`name`) AS `comercial_designation`,if((coalesce(`ede`.`quantity`,0) < 1),NULL,concat('[',`ede`.`documents`,']')) AS `documents`,if((`epc`.`phones` is null),NULL,concat('[',`epc`.`phones`,']')) AS `phones`,if((`eec`.`emails` is null),NULL,concat('[',`eec`.`emails`,']')) AS `emails`,`ssu`.`id_system` AS `id_system`,`ssu`.`id_system_subscription` AS `id_system_subscription`,`ssu`.`id_system_subscription_user` AS `id_system_subscription_user` from ((((((((((`entity` `ent` join `system_subscription_user_complete_info` `ssu` on((((`ent`.`created_by` is not null) and (`ssu`.`id_system_subscription_user` = `ent`.`created_by`)) or ((`ent`.`created_by` is null) and (`ssu`.`id_entity` = `ent`.`id`))))) left join `entity_documents_by_entity` `ede` on((`ede`.`id_entity` = `ent`.`id`))) left join `view_entity_names_object` `names_obj` on((`names_obj`.`id_entity` = `ent`.`id`))) left join `entity_names_concat_by_type` `names` on(((`names`.`id_entity` = `ent`.`id`) and (`names`.`type` = 'Name')))) left join `entity_names_concat_by_type` `surnames` on(((`surnames`.`id_entity` = `ent`.`id`) and (`surnames`.`type` = 'Surname')))) left join (select `ene`.`id_entity` AS `id_entity`,`ene`.`id_entity_name_type` AS `id_entity_name_type`,`ene`.`id_entity_name` AS `id_entity_name`,first_value(`en`.`id`) OVER (PARTITION BY `ene`.`id_entity`,`ene`.`id_entity_name_type` ORDER BY `ene`.`order`,`ene`.`created_at`,`en`.`name` )  AS `selected_id_entity_name`,`en`.`name` AS `name` from ((`entity_name` `en` join `entity_name_by_entity` `ene` on((`ene`.`id_entity_name` = `en`.`id`))) join `entity_name_type` `ety` on((`ety`.`id` = `ene`.`id_entity_name_type`))) where ((coalesce(`en`.`annulled_at`,`ene`.`annulled_at`) is null) and (`ety`.`type` = 'Name'))) `name` on(((`name`.`id_entity` = `ent`.`id`) and (`name`.`id_entity_name` = `name`.`selected_id_entity_name`)))) left join (select `ene`.`id_entity` AS `id_entity`,`ene`.`id_entity_name_type` AS `id_entity_name_type`,`ene`.`id_entity_name` AS `id_entity_name`,first_value(`en`.`id`) OVER (PARTITION BY `ene`.`id_entity`,`ene`.`id_entity_name_type` ORDER BY `ene`.`order`,`ene`.`created_at`,`en`.`name` )  AS `selected_id_entity_name`,`en`.`name` AS `name` from ((`entity_name` `en` join `entity_name_by_entity` `ene` on((`ene`.`id_entity_name` = `en`.`id`))) join `entity_name_type` `ety` on((`ety`.`id` = `ene`.`id_entity_name_type`))) where ((coalesce(`en`.`annulled_at`,`ene`.`annulled_at`) is null) and (`ety`.`type` = 'Business Name'))) `business_name` on(((`business_name`.`id_entity` = `ent`.`id`) and (`business_name`.`id_entity_name` = `business_name`.`selected_id_entity_name`)))) left join (select `ene`.`id_entity` AS `id_entity`,`ene`.`id_entity_name_type` AS `id_entity_name_type`,`ene`.`id_entity_name` AS `id_entity_name`,first_value(`en`.`id`) OVER (PARTITION BY `ene`.`id_entity`,`ene`.`id_entity_name_type` ORDER BY `ene`.`order`,`ene`.`created_at`,`en`.`name` )  AS `selected_id_entity_name`,`en`.`name` AS `name` from ((`entity_name` `en` join `entity_name_by_entity` `ene` on((`ene`.`id_entity_name` = `en`.`id`))) join `entity_name_type` `ety` on((`ety`.`id` = `ene`.`id_entity_name_type`))) where ((coalesce(`en`.`annulled_at`,`ene`.`annulled_at`) is null) and (`ety`.`type` = 'Comercial Designation'))) `comercial_designation` on(((`comercial_designation`.`id_entity` = `ent`.`id`) and (`comercial_designation`.`id_entity_name` = `comercial_designation`.`selected_id_entity_name`)))) left join `entity_phones_concat` `epc` on((`epc`.`id_entity` = `ent`.`id`))) left join `entity_emails_concat` `eec` on((`eec`.`id_entity` = `ent`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `entity_documents_by_entity`
--

/*!50001 DROP VIEW IF EXISTS `entity_documents_by_entity`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `entity_documents_by_entity` AS select `ed`.`id_entity` AS `id_entity`,group_concat(distinct json_object('id',`ed`.`id`,'id_entity_document_category',`ed`.`id_entity_document_category`,'id_entity',`ed`.`id_entity`,'id_entity_document',`ed`.`id`,'id_city',`edc`.`id_city`,'id_state',`edc`.`id_state`,'id_country',`edc`.`id_country`,'document',`ed`.`document`,'category',`edc`.`category`,'symbol',`edc`.`symbol`,'order',`ed`.`order`) order by `ed`.`order` ASC separator ',') AS `documents`,count(distinct concat(`ed`.`id_entity`,'-',`ed`.`id`)) AS `quantity` from (`entity_document` `ed` join `entity_document_category` `edc` on((`edc`.`id` = `ed`.`id_entity_document_category`))) where (coalesce(`ed`.`annulled_at`,`edc`.`annulled_at`) is null) group by `ed`.`id_entity` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `entity_emails_concat`
--

/*!50001 DROP VIEW IF EXISTS `entity_emails_concat`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `entity_emails_concat` AS select `eee`.`id_entity` AS `id_entity`,group_concat(concat('"',`ee`.`email`,'"') order by `eee`.`order` ASC separator ',') AS `emails` from (`entity_email` `ee` join `entity_email_by_entity` `eee` on((`eee`.`id_entity_email` = `ee`.`id`))) where (coalesce(`ee`.`annulled_at`,`eee`.`annulled_at`) is null) group by `eee`.`id_entity` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `entity_names_concat_by_type`
--

/*!50001 DROP VIEW IF EXISTS `entity_names_concat_by_type`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `entity_names_concat_by_type` AS select `ene`.`id_entity` AS `id_entity`,`ent`.`type` AS `type`,group_concat(`name`.`name` order by `ene`.`order` ASC separator ' ') AS `name` from ((`entity_name_by_entity` `ene` join `entity_name_type` `ent` on((`ent`.`id` = `ene`.`id_entity_name_type`))) join `entity_name` `name` on((`name`.`id` = `ene`.`id_entity_name`))) where (coalesce(`ene`.`annulled_at`,`name`.`annulled_at`) is null) group by `ene`.`id_entity`,`ent`.`type` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `entity_phones_concat`
--

/*!50001 DROP VIEW IF EXISTS `entity_phones_concat`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `entity_phones_concat` AS select `epe`.`id_entity` AS `id_entity`,group_concat(concat('"',`ep`.`phone`,'"') order by `epe`.`order` ASC separator ',') AS `phones` from (`entity_phone` `ep` join `entity_phone_by_entity` `epe` on((`epe`.`id_entity_phone` = `ep`.`id`))) where (coalesce(`ep`.`annulled_at`,`epe`.`annulled_at`) is null) group by `epe`.`id_entity` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `system_subscription_user_complete_info`
--

/*!50001 DROP VIEW IF EXISTS `system_subscription_user_complete_info`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `system_subscription_user_complete_info` AS select `ssu`.`id` AS `id`,`ss`.`id_system` AS `id_system`,`ssu`.`id_system_subscription` AS `id_system_subscription`,`ssu`.`id_entity` AS `id_entity`,`ssu`.`id` AS `id_system_subscription_user`,`ssu`.`username` AS `username`,`ssu`.`password` AS `password`,`ent`.`name` AS `name`,if((`names_obj`.`types` is null),NULL,concat('[',`names_obj`.`types`,']')) AS `names_obj`,trim(concat(if((`names`.`name` is null),'',`names`.`name`),' ',if((`surnames`.`name` is null),'',`surnames`.`name`))) AS `complete_name`,`names`.`name` AS `names`,`surnames`.`name` AS `surnames`,if((coalesce(`ede`.`quantity`,0) < 1),NULL,concat('[',`ede`.`documents`,']')) AS `documents`,if((`epc`.`phones` is null),NULL,concat('[',`epc`.`phones`,']')) AS `phones`,if((`eec`.`emails` is null),NULL,concat('[',`eec`.`emails`,']')) AS `emails`,if((`ssu`.`created_by` is null),1,0) AS `is_admin`,`sys`.`inactivated_at` AS `inactivated_at_system`,`ss`.`inactivated_at` AS `inactivated_at_system_subscription`,`ssu`.`inactivated_at` AS `inactivated_at_system_subscription_user`,`ss`.`inactivated_by` AS `inactivated_by_system_subscription`,`ssu`.`inactivated_by` AS `inactivated_by_system_subscription_user`,least(`sys`.`inactivated_at`,`ss`.`inactivated_at`,`ssu`.`inactivated_at`) AS `inactivated_at`,(case when ((`ss`.`inactivated_at` is not null) and (`ss`.`inactivated_at` = least(`sys`.`inactivated_at`,`ss`.`inactivated_at`,`ssu`.`inactivated_at`))) then `ss`.`inactivated_at` when ((`ssu`.`inactivated_at` is not null) and (`ssu`.`inactivated_at` = least(`sys`.`inactivated_at`,`ss`.`inactivated_at`,`ssu`.`inactivated_at`))) then `ssu`.`inactivated_at` else NULL end) AS `inactivated_by`,`sys`.`annulled_at` AS `annulled_at_system`,`ss`.`annulled_at` AS `annulled_at_system_subscription`,`ssu`.`annulled_at` AS `annulled_at_system_subscription_user`,`ss`.`annulled_by` AS `annulled_by_system_subscription`,`ssu`.`annulled_by` AS `annulled_by_system_subscription_user`,least(`sys`.`annulled_at`,`ss`.`annulled_at`,`ssu`.`annulled_at`) AS `annulled_at`,(case when ((`ss`.`annulled_at` is not null) and (`ss`.`annulled_at` = least(`sys`.`annulled_at`,`ss`.`annulled_at`,`ssu`.`annulled_at`))) then `ss`.`annulled_at` when ((`ssu`.`annulled_at` is not null) and (`ssu`.`annulled_at` = least(`sys`.`annulled_at`,`ss`.`annulled_at`,`ssu`.`annulled_at`))) then `ssu`.`annulled_at` else NULL end) AS `annulled_by` from (((((((((`system_subscription_user` `ssu` join `system_subscription` `ss` on((`ss`.`id` = `ssu`.`id_system_subscription`))) join `system` `sys` on((`sys`.`id` = `ss`.`id_system`))) join `entity` `ent` on((`ent`.`id` = `ssu`.`id_entity`))) left join `entity_documents_by_entity` `ede` on((`ede`.`id_entity` = `ssu`.`id_entity`))) left join `entity_names_concat_by_type` `names` on(((`names`.`id_entity` = `ent`.`id`) and (`names`.`type` = 'Name')))) left join `view_entity_names_object` `names_obj` on((`names_obj`.`id_entity` = `ssu`.`id_entity`))) left join `entity_names_concat_by_type` `surnames` on(((`surnames`.`id_entity` = `ent`.`id`) and (`surnames`.`type` = 'Surname')))) left join `entity_phones_concat` `epc` on((`epc`.`id_entity` = `ent`.`id`))) left join `entity_emails_concat` `eec` on((`eec`.`id_entity` = `ent`.`id`))) where (coalesce(`ss`.`annulled_at`,`sys`.`annulled_at`,`ssu`.`annulled_at`,`ent`.`annulled_at`) is null) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_entity_names_by_type_obj`
--

/*!50001 DROP VIEW IF EXISTS `view_entity_names_by_type_obj`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_entity_names_by_type_obj` AS select `ene`.`id_entity` AS `id_entity`,`ene`.`id_entity_name_type` AS `id_entity_name_type`,`ent`.`type` AS `type`,group_concat(concat('"',`en`.`name`,'"') order by `ene`.`order` ASC separator ',') AS `names` from ((`entity_name_by_entity` `ene` join `entity_name_type` `ent` on((`ent`.`id` = `ene`.`id_entity_name_type`))) join `entity_name` `en` on((`en`.`id` = `ene`.`id_entity_name`))) where (coalesce(`ene`.`annulled_at`,`en`.`annulled_at`) is null) group by `ene`.`id_entity`,`ene`.`id_entity_name_type` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_entity_names_object`
--

/*!50001 DROP VIEW IF EXISTS `view_entity_names_object`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_entity_names_object` AS select `ene`.`id_entity` AS `id_entity`,group_concat(distinct json_object('id_entity_name_type',`ene`.`id_entity_name_type`,'type',`ene`.`type`,'names',concat('[',`ene`.`names`,']')) separator ',') AS `types` from `view_entity_names_by_type_obj` `ene` group by `ene`.`id_entity` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-01 19:20:29
