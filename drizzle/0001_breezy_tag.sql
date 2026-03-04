CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripId` int NOT NULL,
	`type` enum('delay','arrival','incident','traffic','custom') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`severity` enum('info','warning','error') DEFAULT 'info',
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`cnpj` varchar(20),
	`email` varchar(255),
	`phone` varchar(20),
	`logo` text,
	`subscriptionPlan` enum('starter','professional','enterprise') NOT NULL DEFAULT 'starter',
	`monthlyTripsLimit` int DEFAULT 100,
	`usedTripsThisMonth` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`),
	CONSTRAINT `companies_cnpj_unique` UNIQUE(`cnpj`)
);
--> statement-breakpoint
CREATE TABLE `sharedTrips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripId` int NOT NULL,
	`shareCode` varchar(32) NOT NULL,
	`publicUrl` text NOT NULL,
	`createdBy` int NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`accessCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sharedTrips_id` PRIMARY KEY(`id`),
	CONSTRAINT `sharedTrips_shareCode_unique` UNIQUE(`shareCode`)
);
--> statement-breakpoint
CREATE TABLE `trackingData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripId` int NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`speed` int NOT NULL,
	`heading` int,
	`accuracy` int,
	`distanceRemaining` int,
	`estimatedArrivalTime` timestamp,
	`currentStatus` enum('on_schedule','delayed','ahead_of_schedule') DEFAULT 'on_schedule',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trackingData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trafficIncidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`road` varchar(50) NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`type` enum('accident','congestion','roadwork','weather','incident') NOT NULL,
	`description` text,
	`severity` enum('low','medium','high') DEFAULT 'medium',
	`estimatedDuration` int,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trafficIncidents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tripStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripId` int NOT NULL,
	`totalDistance` int,
	`totalDuration` int,
	`averageSpeed` int,
	`maxSpeed` int,
	`delayMinutes` int DEFAULT 0,
	`passengersCount` int DEFAULT 0,
	`sharesCount` int DEFAULT 0,
	`alertsTriggered` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tripStats_id` PRIMARY KEY(`id`),
	CONSTRAINT `tripStats_tripId_unique` UNIQUE(`tripId`)
);
--> statement-breakpoint
CREATE TABLE `tripStops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripId` int NOT NULL,
	`stopNumber` int NOT NULL,
	`city` varchar(255) NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`estimatedTime` timestamp,
	`actualTime` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tripStops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`busNumber` varchar(10) NOT NULL,
	`origin` varchar(255) NOT NULL,
	`originLatitude` decimal(10,8),
	`originLongitude` decimal(11,8),
	`destination` varchar(255) NOT NULL,
	`destinationLatitude` decimal(10,8),
	`destinationLongitude` decimal(11,8),
	`departureTime` timestamp NOT NULL,
	`estimatedArrivalTime` timestamp NOT NULL,
	`actualArrivalTime` timestamp,
	`status` enum('scheduled','in_progress','arrived','delayed','cancelled') NOT NULL DEFAULT 'scheduled',
	`companyId` int NOT NULL,
	`currentLatitude` decimal(10,8),
	`currentLongitude` decimal(11,8),
	`currentSpeed` int,
	`delayMinutes` int DEFAULT 0,
	`delayReason` text,
	`totalPassengers` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`notificationsEnabled` boolean DEFAULT true,
	`notifyOnDelay` boolean DEFAULT true,
	`notifyOnArrival` boolean DEFAULT true,
	`notifyOnProximity` boolean DEFAULT true,
	`theme` enum('light','dark','auto') DEFAULT 'auto',
	`language` enum('pt-BR','en-US') DEFAULT 'pt-BR',
	`pushToken` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `userPreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','company') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `companyId` int;