SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `hw_admin` (
  `id` int(11) NOT NULL COMMENT 'ID',
  `uid` int(11) NOT NULL COMMENT 'User ID in table hw_user'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `hw_course` (
  `id` int(11) NOT NULL COMMENT 'Course ID',
  `innercourseid` varchar(80) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Official Course ID with no space',
  `courseid` varchar(80) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Official Course ID',
  `name` varchar(250) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Course Name',
  `school` varchar(80) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'British Columbia Institution of Technology' COMMENT 'School Name (Default:BCIT)',
  `term` varchar(80) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Term',
  `instructor` varchar(80) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Instructor Name',
  `class` varchar(80) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Class/Group/SET',
  `logo` varchar(4096) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Course Logp'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `hw_done` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID',
  `cid` int(10) UNSIGNED NOT NULL COMMENT 'Inner Course ID',
  `uid` int(10) UNSIGNED NOT NULL COMMENT 'User ID',
  `kid` int(10) UNSIGNED NOT NULL COMMENT 'Homewrok ID'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `hw_follow` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID',
  `uid` int(10) UNSIGNED NOT NULL COMMENT 'User ID',
  `cid` int(10) UNSIGNED NOT NULL COMMENT 'Inner Course ID'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `hw_homework` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID',
  `cid` int(10) UNSIGNED NOT NULL COMMENT 'Inner Course ID',
  `title` varchar(512) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Title for Homework',
  `description` text COLLATE utf8_unicode_ci NOT NULL COMMENT 'Details',
  `due` datetime DEFAULT NULL COMMENT 'Due Date Time'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `hw_user` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'User ID',
  `gid` varchar(28) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Google ID',
  `fname` varchar(80) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Full Name',
  `gname` varchar(80) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Given Name',
  `xname` varchar(80) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Family Name',
  `head` varchar(4096) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Head Image',
  `email` varchar(80) COLLATE utf8_unicode_ci NOT NULL COMMENT 'E-Mail',
  `token` varchar(40) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Token'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `hw_volunteer` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID',
  `cid` int(10) UNSIGNED NOT NULL COMMENT 'Course Index ID',
  `vid` int(10) UNSIGNED NOT NULL COMMENT 'User ID'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


ALTER TABLE `hw_admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

ALTER TABLE `hw_course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);

ALTER TABLE `hw_done`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`),
  ADD KEY `kid` (`kid`),
  ADD KEY `cid` (`cid`);

ALTER TABLE `hw_follow`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

ALTER TABLE `hw_homework`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cid` (`cid`),
  ADD KEY `due` (`due`);

ALTER TABLE `hw_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `gid` (`gid`) USING BTREE,
  ADD KEY `email` (`email`);

ALTER TABLE `hw_volunteer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cid` (`cid`),
  ADD KEY `uid` (`vid`);


ALTER TABLE `hw_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID';

ALTER TABLE `hw_course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Course ID';

ALTER TABLE `hw_done`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID';

ALTER TABLE `hw_follow`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID';

ALTER TABLE `hw_homework`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID';

ALTER TABLE `hw_user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'User ID';

ALTER TABLE `hw_volunteer`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID';
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
