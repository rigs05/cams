USE cams;

-- Drop tables if they exist to avoid duplication errors
DROP TABLE IF EXISTS syslog, official, management, feedback_complaint, attendance, employee;

-- Table: employee
CREATE TABLE `employee` (
  `empID` int(5) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `dob` date NOT NULL,
  `mobile` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `usertype` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`empID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Employee Personal Information';

-- Table: attendance
CREATE TABLE `attendance` (
  `empID` int(5) DEFAULT NULL,
  `datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `presabs` varchar(10) NOT NULL,
  KEY `empID` (`empID`),
  CONSTRAINT `FK_attendance` FOREIGN KEY (`empID`) REFERENCES `employee` (`empID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Attendance Management';

-- Table: feedback_complaint
CREATE TABLE `feedback_complaint` (
  `empID` int(5) NOT NULL,
  `feedcomplaint` text NOT NULL,
  `type` varchar(10) DEFAULT NULL,
  KEY `empID` (`empID`),
  CONSTRAINT `FK_feedback` FOREIGN KEY (`empID`) REFERENCES `employee` (`empID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Feedback/Complaint portion';

-- Table: management
CREATE TABLE `management` (
  `empID` int(5) NOT NULL,
  `userID` varchar(15) NOT NULL,
  `password` varchar(80) NOT NULL,
  `remarks` text DEFAULT NULL,
  PRIMARY KEY (`empID`),
  UNIQUE KEY `userID` (`userID`),
  CONSTRAINT `FK_management` FOREIGN KEY (`empID`) REFERENCES `employee` (`empID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Employee Login Information';

-- Table: official
CREATE TABLE `official` (
  `empID` int(5) NOT NULL,
  `designation` varchar(20) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `dateofjoin` datetime NOT NULL DEFAULT current_timestamp(),
  `supervisor` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`empID`),
  CONSTRAINT `FK_official` FOREIGN KEY (`empID`) REFERENCES `employee` (`empID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Employee Official Information';

-- Table: syslog
CREATE TABLE `syslog` (
  `date` datetime NOT NULL,
  `category` varchar(20) NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Sample Data

INSERT INTO `employee` (`empID`, `name`, `dob`, `mobile`, `email`, `address`, `usertype`) VALUES
(101, 'Ritik Chawla', '2000-03-12', '9876543210', 'ritik@gmail.com', '', 'Admin');

INSERT INTO `attendance` (`empID`, `datetime`, `presabs`) VALUES
(101, '2025-06-09 21:41:56', 'Present');

INSERT INTO `feedback_complaint` (`empID`, `feedcomplaint`, `type`) VALUES
(101, 'test1', 'complaint');

INSERT INTO `management` (`empID`, `userID`, `password`, `remarks`) VALUES
(101, 'ritik01', '$2a$10$cSkaPG60AgwdFsX6RFm2muHjr/w553c48p2S.OZQA9QQvyVJv.jg2', '');

INSERT INTO `official` (`empID`, `designation`, `department`, `dateofjoin`, `supervisor`) VALUES
(101, 'software developer', 'finance', '2025-06-08 16:02:57', NULL);
