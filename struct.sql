DROP TABLE IF EXISTS `m_user_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `m_user_account` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `qquid` varchar(32),
  `weibouid` varchar(32),
  `confirm` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `username` varchar(20) NOT NULL,
  `password` char(32) NOT NULL,
  `salt` char(12) NOT NULL,
  `email` varchar(50) NOT NULL,
  `cip` varchar(15) NOT NULL DEFAULT '',
  `uip` varchar(15) NOT NULL DEFAULT '',
  `ctime` int(10) unsigned NOT NULL,
  `utime` int(10) unsigned NOT NULL,
  `ban` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `iconid` int(10) unsigned NOT NULL DEFAULT '0',
  `iconurl` varchar(60) NOT NULL DEFAULT 'icon01.png',
  `iconcolor` varchar(50) NOT NULL DEFAULT '#91c0edm#cde1edm#709cc9m#5079c9m#709cc9',
  `teamid` int(11) unsigned NOT NULL DEFAULT '0',
  `teamname` varchar(20) NOT NULL DEFAULT '',
  `subtitle` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

{
  token,
  login_time,
  expire_time,

  user_id,
  username,
  iconid,
  iconurl,
  iconcolor,
  teamid,
  teamname,
  subtitle,

  access: []
}
