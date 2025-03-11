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
  `inactivated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_entity_parent` (`id_entity_parent`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `annulled_by` (`annulled_by`),
  KEY `inactivated_by` (`inactivated_by`),
  CONSTRAINT `entity_ibfk_1` FOREIGN KEY (`id_entity_parent`) REFERENCES `entity` (`id`),
  CONSTRAINT `entity_ibfk_10` FOREIGN KEY (`inactivated_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_ibfk_5` FOREIGN KEY (`id_entity_parent`) REFERENCES `entity` (`id`),
  CONSTRAINT `entity_ibfk_6` FOREIGN KEY (`id_entity_parent`) REFERENCES `entity` (`id`),
  CONSTRAINT `entity_ibfk_7` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_ibfk_8` FOREIGN KEY (`updated_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `entity_ibfk_9` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity`
--

LOCK TABLES `entity` WRITE;
/*!40000 ALTER TABLE `entity` DISABLE KEYS */;
INSERT INTO `entity` VALUES (1,NULL,NULL,_binary '\0','Quotes System',NULL,NULL,NULL,NULL,'2024-07-19 13:40:21',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,NULL,217,_binary '','Nolascom Rafael Malavé Castro','Male',NULL,'Vivo en mi casa.','d030ff96ec93373da5ab5160dd657033.png','2024-07-19 17:50:28',1,NULL,NULL,'2024-12-12 14:21:25',2,NULL,NULL),(7,NULL,219,_binary '','Melania Andrea Chaffardett','Female',NULL,'Barinas.',NULL,'2024-07-19 18:06:38',1,NULL,NULL,'2024-12-13 13:08:40',2,NULL,NULL),(8,NULL,220,_binary '','Mirna Dayana Rodríguez González','Female',NULL,'Boyacá, Sector 1.',NULL,'2024-07-19 18:10:09',1,NULL,NULL,'2024-12-13 13:08:55',2,NULL,NULL),(16,NULL,222,_binary '','José González','Male',NULL,'Barcelona.',NULL,'2024-07-19 19:05:30',1,NULL,NULL,'2024-12-13 13:10:05',2,NULL,NULL),(41,NULL,NULL,_binary '\0','Examplazo',NULL,NULL,NULL,NULL,'2024-11-22 19:37:17',1,NULL,NULL,'2024-12-13 13:08:20',2,NULL,NULL),(42,NULL,218,_binary '','Alfredo Miguel Di Stefanos Hernández','Male',NULL,NULL,NULL,'2024-11-22 19:59:08',1,NULL,NULL,'2024-12-12 14:41:16',2,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=223 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_document`
--

LOCK TABLES `entity_document` WRITE;
/*!40000 ALTER TABLE `entity_document` DISABLE KEYS */;
INSERT INTO `entity_document` VALUES (2,1,4,'2351351444',10002,'2024-07-19 17:50:28',1,'2024-12-12 14:21:25',2),(3,1,7,'1462743955',7399,'2024-07-19 18:06:38',1,'2024-12-13 13:08:41',2),(4,1,8,'2663219852',6,'2024-07-19 18:10:09',1,'2024-12-13 13:08:56',2),(12,1,16,'825109000',18,'2024-07-19 19:05:30',1,'2024-12-13 13:10:05',2),(19,1,4,'2351351444',10001,'2024-07-22 18:28:43',1,'2024-12-12 14:21:25',2),(20,1,4,'2351351444',10000,'2024-07-22 18:30:11',1,'2024-12-12 14:21:25',2),(21,1,4,'2351351444',9999,'2024-07-22 18:30:15',1,'2024-12-12 14:21:25',2),(22,1,4,'2351351444',9998,'2024-07-22 18:30:23',1,'2024-12-12 14:21:25',2),(23,1,4,'2351351444',9997,'2024-07-22 18:30:41',1,'2024-12-12 14:21:25',2),(24,1,4,'2351351444',9996,'2024-07-22 18:31:13',1,'2024-12-12 14:21:25',2),(25,1,4,'2351351444',9995,'2024-07-22 18:47:30',1,'2024-12-12 14:21:25',2),(26,1,4,'2351351444',9994,'2024-07-22 19:05:40',1,'2024-12-12 14:21:25',2),(27,1,4,'2351351444',9993,'2024-07-22 19:06:57',1,'2024-12-12 14:21:25',2),(28,1,4,'2351351444',9992,'2024-07-22 19:07:12',1,'2024-12-12 14:21:25',2),(29,1,4,'2351351444',9991,'2024-07-22 19:07:41',1,'2024-12-12 14:21:25',2),(30,1,4,'2351351444',9990,'2024-07-22 19:08:04',1,'2024-12-12 14:21:25',2),(31,1,4,'2351351444',9989,'2024-07-22 19:08:22',1,'2024-12-12 14:21:25',2),(32,1,4,'2351351444',9988,'2024-07-22 19:08:31',1,'2024-12-12 14:21:25',2),(33,1,4,'2351351444',9987,'2024-07-22 19:08:45',1,'2024-12-12 14:21:25',2),(34,1,4,'2351351444',9986,'2024-07-22 19:19:18',1,'2024-12-12 14:21:25',2),(38,1,4,'2351351444',9985,'2024-07-22 19:25:34',1,'2024-12-12 14:21:25',2),(39,1,4,'2351351444',9984,'2024-07-22 19:25:42',1,'2024-12-12 14:21:25',2),(42,1,4,'2351351444',9983,'2024-07-22 19:28:29',1,'2024-12-12 14:21:25',2),(43,1,4,'2351351444',9982,'2024-07-22 19:30:13',1,'2024-12-12 14:21:25',2),(44,1,4,'2351351444',9981,'2024-07-22 19:30:17',1,'2024-12-12 14:21:25',2),(45,1,4,'2351351444',9980,'2024-07-22 19:30:22',1,'2024-12-12 14:21:25',2),(46,1,4,'2351351444',9979,'2024-07-22 19:30:42',1,'2024-12-12 14:21:25',2),(47,1,4,'2351351444',9978,'2024-07-22 19:36:50',1,'2024-12-12 14:21:25',2),(48,1,4,'2351351444',9977,'2024-07-22 19:36:56',1,'2024-12-12 14:21:25',2),(49,1,4,'2351351444',9976,'2024-07-22 19:37:25',1,'2024-12-12 14:21:25',2),(50,1,4,'2351351444',9975,'2024-07-22 19:37:31',1,'2024-12-12 14:21:25',2),(51,1,4,'2351351444',9974,'2024-07-22 19:38:07',1,'2024-12-12 14:21:25',2),(52,1,4,'2351351444',9973,'2024-07-22 19:38:15',1,'2024-12-12 14:21:25',2),(53,1,4,'2351351444',9972,'2024-07-22 19:38:22',1,'2024-12-12 14:21:25',2),(54,1,4,'2351351444',9971,'2024-07-22 19:40:06',1,'2024-12-12 14:21:25',2),(55,1,4,'2351351444',9970,'2024-07-22 19:40:14',1,'2024-12-12 14:21:25',2),(56,1,4,'2351351444',9969,'2024-07-22 19:40:22',1,'2024-12-12 14:21:25',2),(57,1,4,'2351351444',9968,'2024-07-22 19:41:35',1,'2024-12-12 14:21:25',2),(58,1,4,'2351351444',9967,'2024-07-22 19:42:20',1,'2024-12-12 14:21:25',2),(59,1,4,'2351351444',9966,'2024-07-22 19:42:51',1,'2024-12-12 14:21:25',2),(60,1,4,'2351351444',9965,'2024-07-22 19:43:46',1,'2024-12-12 14:21:25',2),(62,1,4,'2351351444',9964,'2024-07-22 19:44:46',1,'2024-12-12 14:21:25',2),(63,1,4,'2351351444',9963,'2024-07-22 19:44:56',1,'2024-12-12 14:21:25',2),(67,1,4,'2351351444',9962,'2024-07-22 19:54:01',1,'2024-12-12 14:21:25',2),(68,1,4,'2351351444',9961,'2024-07-22 19:54:45',1,'2024-12-12 14:21:25',2),(69,1,4,'2351351444',9960,'2024-07-22 19:56:04',1,'2024-12-12 14:21:25',2),(70,1,4,'2351351444',9959,'2024-07-22 19:56:31',1,'2024-12-12 14:21:25',2),(71,1,4,'2351351444',9958,'2024-07-22 19:56:33',1,'2024-12-12 14:21:25',2),(72,1,4,'2351351444',9957,'2024-07-22 19:56:35',1,'2024-12-12 14:21:25',2),(73,1,4,'2351351444',9956,'2024-07-22 19:56:41',1,'2024-12-12 14:21:25',2),(74,1,8,'2663219852',5,'2024-10-04 21:06:21',2,'2024-12-13 13:08:56',2),(75,1,7,'1462743955',7398,'2024-10-07 13:10:17',2,'2024-12-13 13:08:41',2),(76,1,16,'825109000',17,'2024-10-07 13:10:47',2,'2024-12-13 13:10:05',2),(77,1,16,'825109000',16,'2024-10-07 13:11:09',2,'2024-12-13 13:10:05',2),(78,1,4,'2351351444',9955,'2024-10-07 13:38:44',1,'2024-12-12 14:21:25',2),(79,1,4,'2351351444',9954,'2024-10-07 14:10:50',1,'2024-12-12 14:21:25',2),(80,1,4,'2351351444',9953,'2024-10-07 14:11:50',1,'2024-12-12 14:21:25',2),(81,1,4,'2351351444',9952,'2024-10-07 14:13:01',1,'2024-12-12 14:21:25',2),(82,1,4,'2351351444',9951,'2024-10-07 14:43:53',1,'2024-12-12 14:21:25',2),(83,1,4,'2351351444',9950,'2024-10-07 14:44:29',1,'2024-12-12 14:21:25',2),(84,1,4,'2351351444',9949,'2024-10-07 14:45:31',1,'2024-12-12 14:21:25',2),(85,1,4,'2351351444',9948,'2024-10-07 14:45:45',1,'2024-12-12 14:21:25',2),(86,1,4,'2351351444',9947,'2024-10-07 14:46:47',1,'2024-12-12 14:21:25',2),(87,1,4,'2351351444',9946,'2024-10-07 14:47:59',1,'2024-12-12 14:21:25',2),(88,1,4,'2351351444',9945,'2024-10-07 14:51:11',1,'2024-12-12 14:21:25',2),(89,1,4,'2351351444',9944,'2024-10-07 14:52:17',1,'2024-12-12 14:21:25',2),(90,1,4,'2351351444',9943,'2024-10-07 14:53:51',1,'2024-12-12 14:21:25',2),(91,1,4,'2351351444',9942,'2024-10-07 14:54:24',1,'2024-12-12 14:21:25',2),(92,1,4,'2351351444',9941,'2024-10-07 14:54:50',1,'2024-12-12 14:21:25',2),(93,1,4,'2351351444',9940,'2024-10-07 14:57:27',1,'2024-12-12 14:21:25',2),(94,1,4,'2351351444',9939,'2024-10-07 14:57:40',1,'2024-12-12 14:21:25',2),(95,1,4,'2351351444',9938,'2024-10-07 14:58:13',1,'2024-12-12 14:21:25',2),(96,1,4,'2351351444',9937,'2024-10-07 14:58:27',1,'2024-12-12 14:21:25',2),(97,1,4,'2351351444',9936,'2024-10-07 14:59:27',1,'2024-12-12 14:21:25',2),(98,1,4,'2351351444',9935,'2024-10-07 14:59:48',1,'2024-12-12 14:21:25',2),(99,1,4,'2351351444',9934,'2024-10-07 15:03:16',1,'2024-12-12 14:21:25',2),(100,1,4,'2351351444',9933,'2024-10-07 15:06:50',1,'2024-12-12 14:21:25',2),(101,1,4,'2351351444',9932,'2024-10-07 15:07:56',1,'2024-12-12 14:21:25',2),(102,1,4,'2351351444',9931,'2024-10-07 15:09:00',1,'2024-12-12 14:21:25',2),(103,1,4,'2351351444',9930,'2024-10-07 15:09:39',1,'2024-12-12 14:21:25',2),(104,1,4,'2351351444',9929,'2024-10-07 15:11:15',1,'2024-12-12 14:21:25',2),(105,1,4,'2351351444',9928,'2024-10-07 15:11:36',1,'2024-12-12 14:21:25',2),(106,1,4,'2351351444',9927,'2024-10-07 15:13:51',1,'2024-12-12 14:21:25',2),(107,1,4,'2351351444',9926,'2024-10-07 15:14:42',1,'2024-12-12 14:21:25',2),(108,1,4,'2351351444',9925,'2024-10-07 15:14:57',1,'2024-12-12 14:21:25',2),(109,1,4,'2351351444',9924,'2024-10-07 15:18:00',1,'2024-12-12 14:21:25',2),(110,1,4,'2351351444',9923,'2024-10-07 15:18:07',1,'2024-12-12 14:21:25',2),(111,1,4,'2351351444',9922,'2024-10-07 15:23:35',1,'2024-12-12 14:21:25',2),(112,1,4,'2351351444',9921,'2024-10-07 15:23:44',1,'2024-12-12 14:21:25',2),(113,1,4,'2351351444',9920,'2024-10-07 15:24:22',1,'2024-12-12 14:21:25',2),(114,1,4,'2351351444',9919,'2024-10-07 15:24:29',1,'2024-12-12 14:21:25',2),(115,1,4,'2351351444',9918,'2024-10-07 15:26:03',1,'2024-12-12 14:21:25',2),(116,1,4,'2351351444',9917,'2024-10-07 15:26:15',1,'2024-12-12 14:21:25',2),(117,1,4,'2351351444',9916,'2024-10-07 15:26:53',1,'2024-12-12 14:21:25',2),(118,1,4,'2351351444',9915,'2024-10-07 15:27:28',1,'2024-12-12 14:21:25',2),(119,1,7,'1462743955',7397,'2024-10-14 22:28:53',2,'2024-12-13 13:08:41',2),(120,1,7,'1462743955',7396,'2024-10-14 22:29:33',2,'2024-12-13 13:08:41',2),(121,1,7,'1462743955',7395,'2024-10-14 22:31:53',2,'2024-12-13 13:08:41',2),(122,1,7,'1462743955',7394,'2024-10-14 22:32:27',2,'2024-12-13 13:08:41',2),(123,1,7,'1462743955',7393,'2024-10-14 22:34:14',2,'2024-12-13 13:08:41',2),(124,1,7,'1462743955',7392,'2024-10-14 22:34:20',2,'2024-12-13 13:08:41',2),(125,1,7,'1462743955',7391,'2024-10-14 22:35:11',2,'2024-12-13 13:08:41',2),(126,1,7,'1462743955',7390,'2024-10-14 22:36:06',2,'2024-12-13 13:08:41',2),(127,1,7,'1462743955',7389,'2024-10-14 22:37:54',2,'2024-12-13 13:08:41',2),(128,1,7,'1462743955',7388,'2024-10-14 22:41:25',2,'2024-12-13 13:08:41',2),(129,1,7,'1462743955',7387,'2024-10-14 22:42:14',2,'2024-12-13 13:08:41',2),(130,1,7,'1462743955',7386,'2024-10-14 22:42:57',2,'2024-12-13 13:08:41',2),(131,1,7,'1462743955',7385,'2024-10-14 22:43:41',2,'2024-12-13 13:08:41',2),(132,1,7,'1462743955',7384,'2024-10-14 22:44:03',2,'2024-12-13 13:08:41',2),(133,1,7,'1462743955',7383,'2024-10-14 22:45:56',2,'2024-12-13 13:08:41',2),(134,1,7,'1462743955',7382,'2024-10-14 22:49:22',2,'2024-12-13 13:08:41',2),(135,1,7,'1462743955',7381,'2024-10-14 22:49:49',2,'2024-12-13 13:08:41',2),(136,1,7,'1462743955',7380,'2024-10-14 22:49:58',2,'2024-12-13 13:08:41',2),(137,1,7,'1462743955',7379,'2024-10-14 22:50:20',2,'2024-12-13 13:08:41',2),(138,1,7,'1462743955',7378,'2024-10-14 22:50:37',2,'2024-12-13 13:08:41',2),(139,1,7,'1462743955',7377,'2024-10-14 22:53:04',2,'2024-12-13 13:08:41',2),(140,1,7,'1462743955',7376,'2024-10-14 22:53:41',2,'2024-12-13 13:08:41',2),(141,1,7,'1462743955',7375,'2024-10-14 22:54:09',2,'2024-12-13 13:08:41',2),(142,1,4,'2351351444',9914,'2024-11-01 19:44:54',1,'2024-12-12 14:21:25',2),(143,1,4,'2351351444',9913,'2024-11-01 19:47:24',1,'2024-12-12 14:21:25',2),(144,1,4,'2351351444',9912,'2024-11-01 19:47:36',1,'2024-12-12 14:21:25',2),(145,1,4,'2351351444',9911,'2024-11-01 19:49:26',1,'2024-12-12 14:21:25',2),(146,1,4,'2351351444',9910,'2024-11-01 19:49:36',1,'2024-12-12 14:21:25',2),(147,1,4,'2351351444',9909,'2024-11-01 19:50:08',1,'2024-12-12 14:21:25',2),(148,1,4,'2351351444',9908,'2024-11-01 19:54:03',1,'2024-12-12 14:21:25',2),(149,1,4,'2351351444',9907,'2024-11-01 19:54:38',1,'2024-12-12 14:21:25',2),(150,1,4,'2351351444',9906,'2024-11-01 19:54:42',1,'2024-12-12 14:21:25',2),(151,1,4,'2351351444',9905,'2024-11-07 23:44:39',1,'2024-12-12 14:21:25',2),(152,1,7,'1462743955',7374,'2024-11-07 23:46:36',1,'2024-12-13 13:08:41',2),(153,1,7,'1462743955',7373,'2024-11-22 15:11:33',1,'2024-12-13 13:08:41',2),(154,1,7,'1462743955',7372,'2024-11-22 15:11:45',1,'2024-12-13 13:08:41',2),(155,1,7,'1462743955',7371,'2024-11-22 15:11:59',1,'2024-12-13 13:08:41',2),(156,1,7,'1462743955',7370,'2024-11-22 15:12:20',1,'2024-12-13 13:08:41',2),(157,1,7,'1462743955',7369,'2024-11-22 15:13:02',1,'2024-12-13 13:08:41',2),(158,1,7,'156278556',7368,'2024-11-22 19:28:02',1,'2024-12-13 13:08:41',2),(159,1,42,'354681354',6,'2024-11-22 19:59:08',1,'2024-12-12 14:41:16',2),(160,1,42,'354681354',5,'2024-11-22 20:00:52',1,'2024-12-12 14:41:16',2),(161,1,7,'156278556',7367,'2024-12-09 18:41:24',2,'2024-12-13 13:08:41',2),(162,1,7,'156278556',7366,'2024-12-09 18:42:41',2,'2024-12-13 13:08:41',2),(163,1,7,'156278556',7365,'2024-12-09 18:53:52',2,'2024-12-13 13:08:41',2),(164,1,7,'156278556',7364,'2024-12-09 18:55:57',2,'2024-12-13 13:08:41',2),(165,1,7,'156278556',7363,'2024-12-09 19:01:33',2,'2024-12-13 13:08:41',2),(166,1,7,'156278556',7362,'2024-12-09 19:01:52',2,'2024-12-13 13:08:41',2),(167,1,7,'156278556',7361,'2024-12-09 19:02:01',2,'2024-12-13 13:08:41',2),(168,1,7,'156278556',7360,'2024-12-09 19:20:16',2,'2024-12-13 13:08:41',2),(169,1,7,'156278556',7359,'2024-12-09 19:20:55',2,'2024-12-13 13:08:41',2),(170,1,7,'156278556',7358,'2024-12-09 19:34:47',2,'2024-12-13 13:08:41',2),(171,1,7,'156278556',7357,'2024-12-09 19:36:16',2,'2024-12-13 13:08:41',2),(172,1,7,'156278556',7356,'2024-12-09 19:38:50',2,'2024-12-13 13:08:41',2),(173,1,7,'156278556',7355,'2024-12-09 19:39:34',2,'2024-12-13 13:08:41',2),(174,1,7,'156278556',7354,'2024-12-09 19:39:56',2,'2024-12-13 13:08:41',2),(175,1,7,'156278556',7353,'2024-12-09 19:40:44',2,'2024-12-13 13:08:41',2),(176,1,7,'156278556',7352,'2024-12-09 19:40:53',2,'2024-12-13 13:08:41',2),(177,1,7,'156278556',7351,'2024-12-09 19:42:27',2,'2024-12-13 13:08:41',2),(178,1,7,'156278556',7350,'2024-12-09 19:42:51',2,'2024-12-13 13:08:41',2),(179,1,7,'156278556',7349,'2024-12-09 19:43:09',2,'2024-12-13 13:08:41',2),(180,1,7,'156278556',7348,'2024-12-09 19:43:45',2,'2024-12-13 13:08:41',2),(181,1,7,'156278556',7347,'2024-12-09 19:52:45',2,'2024-12-13 13:08:41',2),(182,1,7,'156278556',7346,'2024-12-09 19:53:11',2,'2024-12-13 13:08:41',2),(183,1,7,'156278556',7345,'2024-12-09 19:54:51',2,'2024-12-13 13:08:41',2),(184,1,7,'156278556',7344,'2024-12-09 19:55:00',2,'2024-12-13 13:08:41',2),(185,1,7,'156278556',7343,'2024-12-09 19:55:18',2,'2024-12-13 13:08:41',2),(186,1,7,'156278556',7342,'2024-12-09 19:57:54',2,'2024-12-13 13:08:41',2),(187,1,7,'156278556',7341,'2024-12-09 20:00:12',2,'2024-12-13 13:08:41',2),(188,1,7,'156278556',7340,'2024-12-09 20:00:54',2,'2024-12-13 13:08:41',2),(189,1,7,'156278556',7339,'2024-12-09 20:04:03',2,'2024-12-13 13:08:41',2),(190,1,7,'156278556',7338,'2024-12-09 20:04:49',2,'2024-12-13 13:08:41',2),(191,1,7,'156278556',7337,'2024-12-09 20:07:40',2,'2024-12-13 13:08:41',2),(192,1,7,'156278556',7336,'2024-12-09 20:07:50',2,'2024-12-13 13:08:41',2),(193,1,7,'156278556',7335,'2024-12-09 20:08:34',2,'2024-12-13 13:08:41',2),(194,1,7,'156278556',7334,'2024-12-09 20:09:17',2,'2024-12-13 13:08:41',2),(195,1,7,'156278556',7333,'2024-12-09 20:10:17',2,'2024-12-13 13:08:41',2),(196,1,7,'156278556',7332,'2024-12-09 20:15:57',2,'2024-12-13 13:08:41',2),(197,1,7,'156278556',7331,'2024-12-09 20:16:41',2,'2024-12-13 13:08:41',2),(198,1,7,'156278556',7330,'2024-12-09 20:18:13',2,'2024-12-13 13:08:41',2),(199,1,7,'156278556',7329,'2024-12-09 20:18:17',2,'2024-12-13 13:08:41',2),(200,1,7,'156278556',7328,'2024-12-09 20:18:22',2,'2024-12-13 13:08:41',2),(201,1,7,'156278556',7327,'2024-12-09 20:18:35',2,'2024-12-13 13:08:41',2),(202,1,7,'156278556',7326,'2024-12-09 20:19:49',2,'2024-12-13 13:08:41',2),(203,1,7,'156278556',7325,'2024-12-09 20:20:32',2,'2024-12-13 13:08:41',2),(204,1,7,'156278556',7324,'2024-12-09 20:21:08',2,'2024-12-13 13:08:41',2),(205,1,7,'156278556',7323,'2024-12-09 20:21:12',2,'2024-12-13 13:08:41',2),(206,1,7,'156278556',7322,'2024-12-09 20:22:29',2,'2024-12-13 13:08:41',2),(207,1,7,'156278556',7321,'2024-12-09 20:35:04',2,'2024-12-13 13:08:41',2),(208,1,7,'156278556',7320,'2024-12-09 20:36:56',2,'2024-12-13 13:08:41',2),(209,1,7,'156278556',7319,'2024-12-12 13:54:03',2,'2024-12-13 13:08:41',2),(210,1,7,'156278556',7318,'2024-12-12 13:55:09',2,'2024-12-13 13:08:41',2),(211,1,7,'156278556',7317,'2024-12-12 13:55:28',2,'2024-12-13 13:08:41',2),(212,1,7,'156278556',7316,'2024-12-12 13:56:16',2,'2024-12-13 13:08:41',2),(213,1,7,'156278556',7315,'2024-12-12 13:56:32',2,'2024-12-13 13:08:41',2),(214,1,7,'156278556',7314,'2024-12-12 13:57:29',2,'2024-12-13 13:08:41',2),(215,1,4,'2351351444',9904,'2024-12-12 14:17:00',2,'2024-12-12 14:21:25',2),(216,1,4,'2351351444',9903,'2024-12-12 14:20:39',2,'2024-12-12 14:21:25',2),(217,1,4,'2351351444',1,'2024-12-12 14:21:25',2,NULL,NULL),(218,1,42,'354681354',1,'2024-12-12 14:41:16',2,NULL,NULL),(219,1,7,'156278556',1,'2024-12-13 13:08:40',2,NULL,NULL),(220,1,8,'2663219852',1,'2024-12-13 13:08:55',2,NULL,NULL),(221,1,16,'825109000',15,'2024-12-13 13:09:06',2,'2024-12-13 13:10:05',2),(222,1,16,'825109000',1,'2024-12-13 13:10:05',2,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_email`
--

LOCK TABLES `entity_email` WRITE;
/*!40000 ALTER TABLE `entity_email` DISABLE KEYS */;
INSERT INTO `entity_email` VALUES (2,'nolascomalave@hotmail.com','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(3,'johacas20@gmail.com','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL),(4,'tarazonavictoria15@gmail.com','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(5,'guillerwolf@hotmail.com','2024-07-19 19:05:30',1,NULL,NULL,NULL,NULL),(7,'proheredes@gmail.com','2024-11-22 19:37:17',1,NULL,NULL,NULL,NULL),(8,'alfredodistefano@example.com','2024-11-22 19:59:08',1,NULL,NULL,NULL,NULL),(9,'melaniachaffardett@gmail.com','2024-12-13 13:08:40',2,NULL,NULL,NULL,NULL),(10,'mirnaperez@gmail.com','2024-12-13 13:08:55',2,NULL,NULL,NULL,NULL),(11,'josegonzalex@hotmail.com','2024-12-13 13:09:06',2,NULL,NULL,NULL,NULL);
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
INSERT INTO `entity_email_by_entity` VALUES (4,2,1,'2024-07-19 17:50:28',1,NULL,NULL),(7,3,1,'2024-07-19 18:06:38',1,'2024-12-13 13:08:40',2),(7,9,1,'2024-12-13 13:08:40',2,NULL,NULL),(8,4,1,'2024-07-19 18:10:09',1,'2024-12-13 13:08:56',2),(8,10,1,'2024-12-13 13:08:55',2,NULL,NULL),(16,5,1,'2024-07-19 19:05:30',1,'2024-12-13 13:10:05',2),(16,11,1,'2024-12-13 13:09:06',2,NULL,NULL),(41,7,1,'2024-11-22 19:37:17',1,NULL,NULL),(42,8,1,'2024-11-22 19:59:08',1,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_name`
--

LOCK TABLES `entity_name` WRITE;
/*!40000 ALTER TABLE `entity_name` DISABLE KEYS */;
INSERT INTO `entity_name` VALUES (1,'Quotes System','2024-07-19 13:40:32',1,NULL,NULL,NULL,NULL),(2,'Nolasco','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(3,'Rafael','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(4,'Malavé','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(5,'Castro','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(6,'Isabel','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL),(7,'Monroe','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL),(8,'Pérez','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL),(9,'Mirna','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(10,'Dayana','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(11,'Rodríguez','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(12,'González','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(20,'José','2024-07-19 19:05:30',1,NULL,NULL,NULL,NULL),(21,'Corona','2024-10-14 22:28:53',2,NULL,NULL,NULL,NULL),(22,'Melania','2024-10-14 22:29:33',2,NULL,NULL,NULL,NULL),(23,'Catrina','2024-10-14 22:31:53',2,NULL,NULL,NULL,NULL),(24,'Carolina','2024-10-14 22:35:11',2,NULL,NULL,NULL,NULL),(25,'Malavén','2024-11-01 19:44:54',1,NULL,NULL,NULL,NULL),(26,'Nolascom','2024-11-01 19:49:26',1,NULL,NULL,NULL,NULL),(27,'Romelia','2024-11-22 15:11:59',1,NULL,NULL,NULL,NULL),(32,'Empresa','2024-11-22 18:28:35',1,NULL,NULL,NULL,NULL),(33,'Empresa Falsa.','2024-11-22 18:28:35',1,NULL,NULL,NULL,NULL),(34,'Andrea','2024-11-22 19:28:02',1,NULL,NULL,NULL,NULL),(35,'Chafardett','2024-11-22 19:28:02',1,NULL,NULL,NULL,NULL),(38,'Proheredes','2024-11-22 19:37:17',1,NULL,NULL,NULL,NULL),(39,'Software Solutions','2024-11-22 19:37:17',1,NULL,NULL,NULL,NULL),(40,'Alfredo','2024-11-22 19:59:08',1,NULL,NULL,NULL,NULL),(41,'Di Stefano','2024-11-22 19:59:08',1,NULL,NULL,NULL,NULL),(42,'Miguel','2024-11-22 20:00:52',1,NULL,NULL,NULL,NULL),(43,'Hernández','2024-11-22 20:00:52',1,NULL,NULL,NULL,NULL),(44,'Chaffardett','2024-12-09 18:41:24',2,NULL,NULL,NULL,NULL),(45,'Chafardettt','2024-12-09 19:55:00',2,NULL,NULL,NULL,NULL),(46,'Chafffardett','2024-12-12 13:55:28',2,NULL,NULL,NULL,NULL),(47,'Di Stefanos','2024-12-12 14:41:16',2,NULL,NULL,NULL,NULL),(48,'Examplazo','2024-12-13 13:08:20',2,NULL,NULL,NULL,NULL);
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
INSERT INTO `entity_name_by_entity` VALUES (1,1,6,0,1,'2024-07-19 13:44:04',1,NULL,NULL),(4,2,1,0,610,'2024-07-19 17:50:28',1,'2024-12-12 14:21:25',2),(4,3,1,0,2,'2024-07-19 17:50:28',1,NULL,NULL),(4,4,1,0,611,'2024-07-19 17:50:28',1,'2024-12-12 14:21:25',2),(4,4,2,0,1,'2024-07-22 18:28:43',1,NULL,NULL),(4,5,1,0,612,'2024-07-19 17:50:28',1,'2024-12-12 14:21:25',2),(4,5,2,0,2,'2024-07-22 18:28:43',1,NULL,NULL),(4,25,2,0,34,'2024-11-01 19:44:54',1,'2024-12-12 14:21:25',2),(4,26,1,0,1,'2024-11-01 19:49:26',1,NULL,NULL),(7,5,2,0,362,'2024-07-19 18:06:38',1,'2024-12-13 13:08:40',2),(7,6,1,0,1317,'2024-07-19 18:06:38',1,'2024-12-13 13:08:40',2),(7,7,1,0,1322,'2024-07-19 18:06:38',1,'2024-12-13 13:08:40',2),(7,8,2,0,363,'2024-07-19 18:06:38',1,'2024-12-13 13:08:40',2),(7,21,1,0,1321,'2024-10-14 22:28:53',2,'2024-12-13 13:08:40',2),(7,22,1,0,1,'2024-10-14 22:29:33',2,NULL,NULL),(7,23,1,0,1320,'2024-10-14 22:31:53',2,'2024-12-13 13:08:40',2),(7,24,1,0,1319,'2024-10-14 22:35:11',2,'2024-12-13 13:08:40',2),(7,27,1,0,1318,'2024-11-22 15:11:59',1,'2024-12-13 13:08:40',2),(7,32,4,0,1,'2024-11-22 18:28:35',1,'2024-12-13 13:08:40',2),(7,33,5,0,1,'2024-11-22 18:28:35',1,'2024-12-13 13:08:40',2),(7,34,1,0,2,'2024-11-22 19:28:02',1,NULL,NULL),(7,35,2,0,359,'2024-11-22 19:28:02',1,'2024-12-13 13:08:40',2),(7,44,2,0,1,'2024-12-09 18:41:24',2,NULL,NULL),(7,45,2,0,361,'2024-12-09 19:55:00',2,'2024-12-13 13:08:40',2),(7,46,2,0,360,'2024-12-12 13:55:28',2,'2024-12-13 13:08:40',2),(8,9,1,0,1,'2024-07-19 18:10:09',1,NULL,NULL),(8,10,1,0,2,'2024-07-19 18:10:09',1,NULL,NULL),(8,11,2,0,1,'2024-07-19 18:10:09',1,NULL,NULL),(8,12,2,0,2,'2024-07-19 18:10:09',1,NULL,NULL),(16,4,2,0,3,'2024-07-19 19:05:30',1,'2024-12-13 13:10:05',2),(16,12,2,0,1,'2024-12-13 13:10:05',2,NULL,NULL),(16,20,1,0,1,'2024-07-19 19:05:30',1,NULL,NULL),(24,2,1,0,1,'2024-07-19 19:47:25',1,NULL,NULL),(24,4,2,0,1,'2024-07-19 19:47:25',1,NULL,NULL),(25,2,1,0,1,'2024-07-19 19:47:41',1,NULL,NULL),(25,4,2,0,1,'2024-07-19 19:47:41',1,NULL,NULL),(34,2,1,0,1,'2024-07-19 20:16:49',1,NULL,NULL),(34,4,2,0,1,'2024-07-19 20:16:49',1,NULL,NULL),(35,2,1,0,1,'2024-07-19 20:17:33',1,NULL,NULL),(35,4,2,0,1,'2024-07-19 20:17:33',1,NULL,NULL),(41,38,4,0,3,'2024-11-22 19:37:17',1,'2024-12-13 13:08:20',2),(41,39,5,0,1,'2024-11-22 19:37:17',1,NULL,NULL),(41,48,4,0,1,'2024-12-13 13:08:20',2,NULL,NULL),(42,40,1,0,1,'2024-11-22 19:59:08',1,NULL,NULL),(42,41,2,0,4,'2024-11-22 19:59:08',1,'2024-12-12 14:41:16',2),(42,42,1,0,2,'2024-11-22 20:00:52',1,NULL,NULL),(42,43,2,0,2,'2024-11-22 20:00:52',1,NULL,NULL),(42,47,2,0,1,'2024-12-12 14:41:16',2,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_phone`
--

LOCK TABLES `entity_phone` WRITE;
/*!40000 ALTER TABLE `entity_phone` DISABLE KEYS */;
INSERT INTO `entity_phone` VALUES (2,'+584123161687','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(5,'04128677911','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL),(6,'04129428193','2024-07-19 18:10:09',1,NULL,NULL,NULL,NULL),(14,'04162152797','2024-07-19 19:05:30',1,NULL,NULL,NULL,NULL),(22,'584123161687','2024-07-19 19:47:25',1,NULL,NULL,NULL,NULL),(23,'+584248411347','2024-07-22 18:28:43',1,NULL,NULL,NULL,NULL),(24,'+584162152797','2024-10-14 22:49:49',2,NULL,NULL,NULL,NULL),(25,'+584123161688','2024-11-22 19:37:17',1,NULL,NULL,NULL,NULL),(26,'+584123161689','2024-11-22 19:59:08',1,NULL,NULL,NULL,NULL);
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
INSERT INTO `entity_phone_by_entity` VALUES (4,2,1,'2024-07-19 17:50:28',1,NULL,NULL),(4,23,2,'2024-07-22 18:28:43',1,NULL,NULL),(7,5,1,'2024-07-19 18:06:38',1,NULL,NULL),(7,24,2,'2024-10-14 22:49:49',2,NULL,NULL),(8,6,1,'2024-07-19 18:10:09',1,NULL,NULL),(16,14,1,'2024-07-19 19:05:30',1,NULL,NULL),(24,22,1,'2024-07-19 19:47:25',1,NULL,NULL),(41,25,1,'2024-11-22 19:37:17',1,NULL,NULL),(42,26,1,'2024-11-22 19:59:08',1,NULL,NULL);
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
-- Table structure for table `sym_by_unit_meas_by_sys_subsc`
--

DROP TABLE IF EXISTS `sym_by_unit_meas_by_sys_subsc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sym_by_unit_meas_by_sys_subsc` (
  `id_unit_measurement_by_system_subscription` int NOT NULL,
  `id_symbol_by_unit_measurement` int NOT NULL,
  `ordering` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  UNIQUE KEY `sym_by_unit_meas_by_sys_subsc_pk1` (`id_unit_measurement_by_system_subscription`,`id_symbol_by_unit_measurement`),
  KEY `id_symbol_by_unit_measurement` (`id_symbol_by_unit_measurement`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `sym_by_unit_meas_by_sys_subsc_ibfk_1` FOREIGN KEY (`id_unit_measurement_by_system_subscription`) REFERENCES `unit_measurement_by_system_subscription` (`id`),
  CONSTRAINT `sym_by_unit_meas_by_sys_subsc_ibfk_2` FOREIGN KEY (`id_symbol_by_unit_measurement`) REFERENCES `symbol_by_unit_measurement` (`id`),
  CONSTRAINT `sym_by_unit_meas_by_sys_subsc_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `sym_by_unit_meas_by_sys_subsc_ibfk_4` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sym_by_unit_meas_by_sys_subsc`
--

LOCK TABLES `sym_by_unit_meas_by_sys_subsc` WRITE;
/*!40000 ALTER TABLE `sym_by_unit_meas_by_sys_subsc` DISABLE KEYS */;
/*!40000 ALTER TABLE `sym_by_unit_meas_by_sys_subsc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `symbol_by_unit_measurement`
--

DROP TABLE IF EXISTS `symbol_by_unit_measurement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `symbol_by_unit_measurement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_unit_measurement_symbol` int NOT NULL,
  `id_unit_measurement` int NOT NULL,
  `ordering` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `symbol_by_unit_measurement_pk1` (`id_unit_measurement_symbol`,`id_unit_measurement`),
  KEY `id_unit_measurement` (`id_unit_measurement`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `symbol_by_unit_measurement_ibfk_1` FOREIGN KEY (`id_unit_measurement_symbol`) REFERENCES `unit_measurement_symbol` (`id`),
  CONSTRAINT `symbol_by_unit_measurement_ibfk_2` FOREIGN KEY (`id_unit_measurement`) REFERENCES `unit_measurement` (`id`),
  CONSTRAINT `symbol_by_unit_measurement_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `symbol_by_unit_measurement_ibfk_4` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `symbol_by_unit_measurement`
--

LOCK TABLES `symbol_by_unit_measurement` WRITE;
/*!40000 ALTER TABLE `symbol_by_unit_measurement` DISABLE KEYS */;
/*!40000 ALTER TABLE `symbol_by_unit_measurement` ENABLE KEYS */;
UNLOCK TABLES;

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
  `inactivated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `annulled_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`),
  KEY `inactivated_by` (`inactivated_by`),
  CONSTRAINT `system_ibfk_1` FOREIGN KEY (`inactivated_by`) REFERENCES `system_subscription_user` (`id`)
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
  `inactivated_by` int DEFAULT NULL,
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
  KEY `inactivated_by` (`inactivated_by`),
  CONSTRAINT `system_subscription_ibfk_1` FOREIGN KEY (`id_system`) REFERENCES `system` (`id`),
  CONSTRAINT `system_subscription_ibfk_2` FOREIGN KEY (`id_entity`) REFERENCES `entity` (`id`),
  CONSTRAINT `system_subscription_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `system_subscription_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `system_subscription_ibfk_5` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `system_subscription_ibfk_6` FOREIGN KEY (`inactivated_by`) REFERENCES `system_subscription_user` (`id`)
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
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(2500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `inactivated_at` datetime DEFAULT NULL,
  `inactivated_by` int DEFAULT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `system_subscription_user_index_0` (`id_system_subscription`,`id_entity`),
  UNIQUE KEY `system_subscription_user_index_1` (`id_system_subscription`,`username`),
  KEY `id_entity` (`id_entity`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  KEY `inactivated_by` (`inactivated_by`),
  CONSTRAINT `system_subscription_user_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `system_subscription_user_ibfk_4` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `system_subscription_user_ibfk_5` FOREIGN KEY (`id_system_subscription`) REFERENCES `system_subscription` (`id`),
  CONSTRAINT `system_subscription_user_ibfk_6` FOREIGN KEY (`id_entity`) REFERENCES `entity` (`id`),
  CONSTRAINT `system_subscription_user_ibfk_7` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `system_subscription_user_ibfk_8` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `system_subscription_user_ibfk_9` FOREIGN KEY (`inactivated_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_subscription_user`
--

LOCK TABLES `system_subscription_user` WRITE;
/*!40000 ALTER TABLE `system_subscription_user` DISABLE KEYS */;
INSERT INTO `system_subscription_user` VALUES (1,1,1,'ADMIN','$2a$10$BOs5VST2Fd.NvFGrpat4Fu.jW68cicYtowTH/oshuMLrBMrCSuGly','2024-07-19 13:40:26',NULL,NULL,NULL,NULL,NULL),(2,1,4,'malaven','$2a$10$5MgkukzGaXRjhuIESVUg9eecn8aVnrNRo63vQowX8zDgsOKbCQYiu','2024-07-19 17:50:28',1,NULL,NULL,NULL,NULL),(3,1,7,'monroei','$2a$10$JewHKip1ECono0OqQRgErOncH6ZD9D.dZ7.qzAAgmYSVV.THATfUy','2024-07-19 18:06:38',1,NULL,NULL,NULL,NULL),(4,1,8,'perezm','$2a$10$B17hJTLAKlk4t8lTE0CoMOQc6t9rGQeEe5xQ33DLuBzvuW4DNVZAK','2024-07-19 18:10:09',1,'2024-09-04 10:16:25',2,NULL,NULL),(5,1,16,'gonzalezm','$2a$10$kFdnwbdnUUd11/eXlw3snu6p.f8estmYiH3pc9C2d14j7kz5i/pcu','2024-07-19 19:05:30',1,'2024-09-04 16:00:21',2,NULL,NULL),(6,1,42,'dia','$2a$10$V5OjBS6jmYJY0.DtO6caMOMjXASzWXaoRuLMq58EdJbVbdNR1VItm','2024-11-22 19:59:08',1,NULL,NULL,NULL,NULL);
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
 1 AS `photo`,
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
-- Table structure for table `unit_measurement`
--

DROP TABLE IF EXISTS `unit_measurement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_measurement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_unit_measurement_type` int NOT NULL,
  `id_unit_measurement_base` int DEFAULT NULL,
  `unit_measurement` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `anglo_saxon` bit(1) NOT NULL DEFAULT b'0',
  `value` decimal(30,10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unit_measurement_pk1` (`id_unit_measurement_type`,`unit_measurement`,`anglo_saxon`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  KEY `id_unit_measurement_base` (`id_unit_measurement_base`),
  CONSTRAINT `unit_measurement_ibfk_1` FOREIGN KEY (`id_unit_measurement_type`) REFERENCES `unit_measurement_type` (`id`),
  CONSTRAINT `unit_measurement_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `unit_measurement_ibfk_3` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `unit_measurement_ibfk_4` FOREIGN KEY (`id_unit_measurement_base`) REFERENCES `unit_measurement` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_measurement`
--

LOCK TABLES `unit_measurement` WRITE;
/*!40000 ALTER TABLE `unit_measurement` DISABLE KEYS */;
INSERT INTO `unit_measurement` VALUES (1,1,3,'Millimeter',_binary '\0',0.0100000000,'2025-01-08 18:19:03',1,NULL,NULL),(2,1,1,'Centimeter',_binary '\0',10.0000000000,'2025-01-08 18:29:15',1,NULL,NULL),(3,1,4,'Decimeter',_binary '\0',0.1000000000,'2025-01-08 18:35:39',1,NULL,NULL),(4,1,NULL,'Meter',_binary '\0',1.0000000000,'2025-01-08 18:36:23',1,NULL,NULL),(5,1,3,'Decameter',_binary '\0',100.0000000000,'2025-01-08 18:36:23',1,NULL,NULL),(6,1,5,'Hectometer',_binary '\0',10.0000000000,'2025-01-08 18:36:23',1,NULL,NULL),(7,1,5,'Kilometer',_binary '\0',100.0000000000,'2025-01-08 18:36:23',1,NULL,NULL);
/*!40000 ALTER TABLE `unit_measurement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_measurement_by_system_subscription`
--

DROP TABLE IF EXISTS `unit_measurement_by_system_subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_measurement_by_system_subscription` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_unit_measurement` int NOT NULL,
  `id_system_subscription` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unit_measurement_by_system_subscription_pk1` (`id_unit_measurement`,`id_system_subscription`),
  KEY `id_system_subscription` (`id_system_subscription`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `unit_measurement_by_system_subscription_ibfk_1` FOREIGN KEY (`id_unit_measurement`) REFERENCES `unit_measurement` (`id`),
  CONSTRAINT `unit_measurement_by_system_subscription_ibfk_2` FOREIGN KEY (`id_system_subscription`) REFERENCES `system_subscription` (`id`),
  CONSTRAINT `unit_measurement_by_system_subscription_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `unit_measurement_by_system_subscription_ibfk_4` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_measurement_by_system_subscription`
--

LOCK TABLES `unit_measurement_by_system_subscription` WRITE;
/*!40000 ALTER TABLE `unit_measurement_by_system_subscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `unit_measurement_by_system_subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_measurement_symbol`
--

DROP TABLE IF EXISTS `unit_measurement_symbol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_measurement_symbol` (
  `id` int NOT NULL AUTO_INCREMENT,
  `symbol` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `symbol` (`symbol`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `unit_measurement_symbol_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `unit_measurement_symbol_ibfk_2` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_measurement_symbol`
--

LOCK TABLES `unit_measurement_symbol` WRITE;
/*!40000 ALTER TABLE `unit_measurement_symbol` DISABLE KEYS */;
/*!40000 ALTER TABLE `unit_measurement_symbol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_measurement_type`
--

DROP TABLE IF EXISTS `unit_measurement_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_measurement_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `annulled_at` datetime DEFAULT NULL,
  `annulled_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`),
  KEY `created_by` (`created_by`),
  KEY `annulled_by` (`annulled_by`),
  CONSTRAINT `unit_measurement_type_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `system_subscription_user` (`id`),
  CONSTRAINT `unit_measurement_type_ibfk_2` FOREIGN KEY (`annulled_by`) REFERENCES `system_subscription_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_measurement_type`
--

LOCK TABLES `unit_measurement_type` WRITE;
/*!40000 ALTER TABLE `unit_measurement_type` DISABLE KEYS */;
INSERT INTO `unit_measurement_type` VALUES (1,'Longitude','2025-01-08 18:10:23',1,NULL,NULL);
/*!40000 ALTER TABLE `unit_measurement_type` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Temporary view structure for view `view_unit_measurement_hierarchy`
--

DROP TABLE IF EXISTS `view_unit_measurement_hierarchy`;
/*!50001 DROP VIEW IF EXISTS `view_unit_measurement_hierarchy`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_unit_measurement_hierarchy` AS SELECT 
 1 AS `id_unit_measurement_type`,
 1 AS `id`,
 1 AS `id_unit_measurement_base`,
 1 AS `id_prev`,
 1 AS `id_next`,
 1 AS `type`,
 1 AS `unit_measurement`,
 1 AS `value`,
 1 AS `base_value`,
 1 AS `prev_value`,
 1 AS `next_value`,
 1 AS `scale_value`*/;
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
/*!50001 VIEW `system_subscription_user_complete_info` AS select `ssu`.`id` AS `id`,`ss`.`id_system` AS `id_system`,`ssu`.`id_system_subscription` AS `id_system_subscription`,`ssu`.`id_entity` AS `id_entity`,`ssu`.`id` AS `id_system_subscription_user`,`ssu`.`username` AS `username`,`ssu`.`password` AS `password`,`ent`.`name` AS `name`,if((`names_obj`.`types` is null),NULL,concat('[',`names_obj`.`types`,']')) AS `names_obj`,trim(concat(if((`names`.`name` is null),'',`names`.`name`),' ',if((`surnames`.`name` is null),'',`surnames`.`name`))) AS `complete_name`,`names`.`name` AS `names`,`surnames`.`name` AS `surnames`,if((coalesce(`ede`.`quantity`,0) < 1),NULL,concat('[',`ede`.`documents`,']')) AS `documents`,if((`epc`.`phones` is null),NULL,concat('[',`epc`.`phones`,']')) AS `phones`,if((`eec`.`emails` is null),NULL,concat('[',`eec`.`emails`,']')) AS `emails`,`ent`.`photo` AS `photo`,if((`ssu`.`created_by` is null),1,0) AS `is_admin`,`sys`.`inactivated_at` AS `inactivated_at_system`,`ss`.`inactivated_at` AS `inactivated_at_system_subscription`,`ssu`.`inactivated_at` AS `inactivated_at_system_subscription_user`,`ss`.`inactivated_by` AS `inactivated_by_system_subscription`,`ssu`.`inactivated_by` AS `inactivated_by_system_subscription_user`,least(`sys`.`inactivated_at`,`ss`.`inactivated_at`,`ssu`.`inactivated_at`) AS `inactivated_at`,(case when ((`ss`.`inactivated_at` is not null) and (`ss`.`inactivated_at` = least(`sys`.`inactivated_at`,`ss`.`inactivated_at`,`ssu`.`inactivated_at`))) then `ss`.`inactivated_at` when ((`ssu`.`inactivated_at` is not null) and (`ssu`.`inactivated_at` = least(`sys`.`inactivated_at`,`ss`.`inactivated_at`,`ssu`.`inactivated_at`))) then `ssu`.`inactivated_at` else NULL end) AS `inactivated_by`,`sys`.`annulled_at` AS `annulled_at_system`,`ss`.`annulled_at` AS `annulled_at_system_subscription`,`ssu`.`annulled_at` AS `annulled_at_system_subscription_user`,`ss`.`annulled_by` AS `annulled_by_system_subscription`,`ssu`.`annulled_by` AS `annulled_by_system_subscription_user`,least(`sys`.`annulled_at`,`ss`.`annulled_at`,`ssu`.`annulled_at`) AS `annulled_at`,(case when ((`ss`.`annulled_at` is not null) and (`ss`.`annulled_at` = least(`sys`.`annulled_at`,`ss`.`annulled_at`,`ssu`.`annulled_at`))) then `ss`.`annulled_at` when ((`ssu`.`annulled_at` is not null) and (`ssu`.`annulled_at` = least(`sys`.`annulled_at`,`ss`.`annulled_at`,`ssu`.`annulled_at`))) then `ssu`.`annulled_at` else NULL end) AS `annulled_by` from (((((((((`system_subscription_user` `ssu` join `system_subscription` `ss` on((`ss`.`id` = `ssu`.`id_system_subscription`))) join `system` `sys` on((`sys`.`id` = `ss`.`id_system`))) join `entity` `ent` on((`ent`.`id` = `ssu`.`id_entity`))) left join `entity_documents_by_entity` `ede` on((`ede`.`id_entity` = `ssu`.`id_entity`))) left join `entity_names_concat_by_type` `names` on(((`names`.`id_entity` = `ent`.`id`) and (`names`.`type` = 'Name')))) left join `view_entity_names_object` `names_obj` on((`names_obj`.`id_entity` = `ssu`.`id_entity`))) left join `entity_names_concat_by_type` `surnames` on(((`surnames`.`id_entity` = `ent`.`id`) and (`surnames`.`type` = 'Surname')))) left join `entity_phones_concat` `epc` on((`epc`.`id_entity` = `ent`.`id`))) left join `entity_emails_concat` `eec` on((`eec`.`id_entity` = `ent`.`id`))) where (coalesce(`ss`.`annulled_at`,`sys`.`annulled_at`,`ssu`.`annulled_at`,`ent`.`annulled_at`) is null) */;
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

--
-- Final view structure for view `view_unit_measurement_hierarchy`
--

/*!50001 DROP VIEW IF EXISTS `view_unit_measurement_hierarchy`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_unit_measurement_hierarchy` AS with recursive `umh` as (select `um`.`id_unit_measurement_type` AS `id_unit_measurement_type`,`um`.`id` AS `id`,`um`.`id` AS `root_id`,`um`.`value` AS `root_value`,`um`.`value` AS `value` from `unit_measurement` `um` where ((`um`.`annulled_at` is null) and (`um`.`id_unit_measurement_base` is null)) union all select `um`.`id_unit_measurement_type` AS `id_unit_measurement_type`,`um`.`id` AS `id`,`umh`.`root_id` AS `root_id`,`umh`.`root_value` AS `root_value`,if((`umh`.`root_id` = `um`.`id`),`um`.`value`,(`umh`.`value` * `um`.`value`)) AS `value` from (`unit_measurement` `um` join `umh` on(((`umh`.`id_unit_measurement_type` = `um`.`id_unit_measurement_type`) and (`umh`.`id` = `um`.`id_unit_measurement_base`)))) where (`um`.`annulled_at` is null)) select `umh`.`id_unit_measurement_type` AS `id_unit_measurement_type`,`umh`.`id` AS `id`,`umh`.`root_id` AS `id_unit_measurement_base`,lag(`umh`.`id`) OVER (PARTITION BY `um`.`id_unit_measurement_type`,`umh`.`root_id` ORDER BY `umh`.`root_id`,`umh`.`value` )  AS `id_prev`,lead(`umh`.`id`) OVER (PARTITION BY `um`.`id_unit_measurement_type`,`umh`.`root_id` ORDER BY `umh`.`root_id`,`umh`.`value` )  AS `id_next`,`umt`.`type` AS `type`,`um`.`unit_measurement` AS `unit_measurement`,`umh`.`value` AS `value`,`umh`.`root_value` AS `base_value`,lag(`umh`.`value`) OVER (PARTITION BY `um`.`id_unit_measurement_type`,`umh`.`root_id` ORDER BY `umh`.`root_id`,`umh`.`value` )  AS `prev_value`,lead(`umh`.`value`) OVER (PARTITION BY `um`.`id_unit_measurement_type`,`umh`.`root_id` ORDER BY `umh`.`root_id`,`umh`.`value` )  AS `next_value`,(`umh`.`value` / `umh`.`root_value`) AS `scale_value` from ((`umh` join `unit_measurement` `um` on((`um`.`id` = `umh`.`id`))) join `unit_measurement_type` `umt` on((`umt`.`id` = `um`.`id_unit_measurement_type`))) order by `umt`.`type`,`um`.`id_unit_measurement_type`,`umh`.`root_id`,`umh`.`value` */;
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

-- Dump completed on 2025-01-08 18:01:42
