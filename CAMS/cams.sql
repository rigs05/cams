-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 12, 2023 at 11:26 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cams`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `empID` int(5) DEFAULT NULL,
  `datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `presabs` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Attendance Management';

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`empID`, `datetime`, `presabs`) VALUES
(102, '2023-05-26 21:41:56', 'Present'),
(101, '2023-05-26 22:42:58', 'Present'),
(102, '2023-05-27 20:54:17', 'Present'),
(101, '2023-05-27 23:38:15', 'Present'),
(102, '2023-05-28 19:23:22', 'Present'),
(101, '2023-05-28 19:33:42', 'Present'),
(102, '2023-05-29 13:29:31', 'Present'),
(101, '2023-05-29 13:39:07', 'Present'),
(102, '2023-05-30 13:44:00', 'Present'),
(101, '2023-05-30 18:01:50', 'Present'),
(103, '2023-05-30 22:59:49', 'Present'),
(104, '2023-05-31 01:23:42', 'Present'),
(106, '2023-05-31 01:46:08', 'Present'),
(104, '2023-05-31 01:46:19', 'Present'),
(105, '2023-05-31 01:46:37', 'Present'),
(104, '2023-05-31 03:34:04', 'Present'),
(105, '2023-05-31 03:54:51', 'Present'),
(104, '2023-05-31 03:55:52', 'Present'),
(106, '2023-05-31 04:23:17', 'Present'),
(106, '2023-05-31 04:25:38', 'Present'),
(106, '2023-05-31 04:27:04', 'Present'),
(103, '2023-05-31 06:43:00', 'Present'),
(102, '2023-05-31 06:44:23', 'Present'),
(107, '2023-05-31 07:17:00', 'Present'),
(102, '2023-06-01 15:43:30', 'Present'),
(103, '2023-06-01 15:45:48', 'Present');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `empID` int(5) NOT NULL,
  `name` varchar(20) NOT NULL,
  `dob` date NOT NULL,
  `mobile` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `usertype` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Employee Personal Information';

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`empID`, `name`, `dob`, `mobile`, `email`, `address`, `usertype`) VALUES
(101, 'Abhishek', '2000-05-11', '0987636299', 'abhi@gmail.com', '', 'Admin'),
(102, 'Sunny', '2000-11-05', '0987636299', 'sunny@gmail.com', 'mera ghar', 'Admin'),
(103, 'Nitesh', '1999-09-19', '9876543210', 'nites@gmail.com', '', 'Emp'),
(104, 'Dhrub', '2000-01-02', '9876543210', 'dhruv@gmail.com', '', 'Emp'),
(105, 'Prajwal Sharma', '2000-07-25', '9876543210', 'prajwal@gmail.com', '', 'Emp'),
(106, 'Stuti', '2000-02-01', '9876543210', 'stuti@gmail.com', '', 'Emp'),
(107, 'Rahul', '2001-01-23', '7894563218', 'rahul@yahoo.in', 'Noida', 'Emp');

-- --------------------------------------------------------

--
-- Table structure for table `feedback_complaint`
--

CREATE TABLE `feedback_complaint` (
  `empID` int(5) NOT NULL,
  `feedcomplaint` text NOT NULL,
  `type` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Feedback/Complaint portion';

--
-- Dumping data for table `feedback_complaint`
--

INSERT INTO `feedback_complaint` (`empID`, `feedcomplaint`, `type`) VALUES
(102, 'test2', 'complaint'),
(102, 'test2', 'complaint'),
(102, 'test3', 'feedback'),
(102, 'test5', 'complaint'),
(102, 'query6', 'feedback'),
(104, 'kindly incorporate latest tech like biometrics as soon your project gets approved.', 'feedback'),
(106, 'I want to update a few things here and there', 'complaint'),
(105, 'The end balcony is untidy, kindly decorate it with plants so it make the environment more serene.', 'feedback'),
(103, 'hii', 'complaint');

-- --------------------------------------------------------

--
-- Table structure for table `management`
--

CREATE TABLE `management` (
  `empID` int(5) NOT NULL,
  `userID` varchar(15) NOT NULL,
  `password` varchar(80) NOT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Employee Login Information';

--
-- Dumping data for table `management`
--

INSERT INTO `management` (`empID`, `userID`, `password`, `remarks`) VALUES
(101, 'abhi12', '$2a$08$fiHESwlc2E1vEhTyw8N.XOmu5ojGd8e7zhN9U1mftfJS5Y3pvA49i', ''),
(102, 'sunny007', '$2a$08$3yeA.PmpPOguCrogZP4gyOzyVeLhXwliB7Js.Pptc.SUBA68E6H62', ''),
(103, 'nites', '$2a$08$ZXOA3jFcEczBhuZvm.j3metQmADu16YlYEw4R.P01qQHnw.mLnJ3m', ''),
(104, 'naai', '$2a$08$uQBaYSoSdkWj76MljXBfVOkBMtWZkDwjlXYBapAbOurzHM2X94B12', 'checked in just now'),
(105, 'pj25', '$2a$08$.JD4ehJAzrOZxn1o.ir1/eBt4HzAsHjyWRaw88tTgtSn..Kp27r3.', ''),
(106, 'stuti', '$2a$08$4w17tUJZHgETMA1NlhQDBuGWlAChYSDyUm9HOcZVKpiruEkPD/4YC', 'hello world'),
(107, 'rahul', '$2a$08$MMLbItmMQRm7mxilZJUDVO/TCSBCfYkcYtHnzPgoVVIYnBBzJNjbi', 'new joinee in this office');

-- --------------------------------------------------------

--
-- Table structure for table `official`
--

CREATE TABLE `official` (
  `empID` int(5) NOT NULL,
  `designation` varchar(20) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `dateofjoin` datetime NOT NULL DEFAULT current_timestamp(),
  `supervisor` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Employee Official Information';

--
-- Dumping data for table `official`
--

INSERT INTO `official` (`empID`, `designation`, `department`, `dateofjoin`, `supervisor`) VALUES
(101, 'soft dev', 'fin', '2023-05-23 16:02:57', NULL),
(102, 'student', 'BCA', '2023-05-23 16:32:33', NULL),
(103, 'Officer', 'Government', '2023-05-30 22:55:31', NULL),
(104, 'hair stylist', 'freelancer', '2023-05-31 01:22:03', NULL),
(105, 'Photographer', 'freelancer', '2023-05-31 01:38:52', NULL),
(106, 'SDE', 'Dell', '2023-05-31 01:43:04', NULL),
(107, 'Senior Manger', 'WIPRO', '2023-05-31 07:14:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `syslog`
--

CREATE TABLE `syslog` (
  `date` datetime NOT NULL,
  `category` varchar(20) NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD KEY `empID` (`empID`) USING BTREE;

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`empID`) USING BTREE,
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `feedback_complaint`
--
ALTER TABLE `feedback_complaint`
  ADD KEY `empID` (`empID`) USING BTREE;

--
-- Indexes for table `management`
--
ALTER TABLE `management`
  ADD PRIMARY KEY (`empID`),
  ADD UNIQUE KEY `userID` (`userID`) USING BTREE;

--
-- Indexes for table `official`
--
ALTER TABLE `official`
  ADD PRIMARY KEY (`empID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `empID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `FK_attendance` FOREIGN KEY (`empID`) REFERENCES `employee` (`empID`),
  ADD CONSTRAINT `fk_attendance_employee` FOREIGN KEY (`empID`) REFERENCES `employee` (`empID`) ON DELETE CASCADE;

--
-- Constraints for table `feedback_complaint`
--
ALTER TABLE `feedback_complaint`
  ADD CONSTRAINT `FK_feedback` FOREIGN KEY (`empID`) REFERENCES `employee` (`empID`),
  ADD CONSTRAINT `fk_feedback_complaint_employee` FOREIGN KEY (`empID`) REFERENCES `employee` (`empID`) ON DELETE CASCADE;

--
-- Constraints for table `management`
--
ALTER TABLE `management`
  ADD CONSTRAINT `FK_management` FOREIGN KEY (`empID`) REFERENCES `employee` (`empID`),
  ADD CONSTRAINT `fk_management_employee` FOREIGN KEY (`empID`) REFERENCES `employee` (`empID`) ON DELETE CASCADE;

--
-- Constraints for table `official`
--
ALTER TABLE `official`
  ADD CONSTRAINT `FK_official` FOREIGN KEY (`empID`) REFERENCES `employee` (`empID`),
  ADD CONSTRAINT `fk_official_employee` FOREIGN KEY (`empID`) REFERENCES `employee` (`empID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
