CREATE DATABASE CareConnectDB;
GO
USE CareConnectDB;
GO

CREATE TABLE Users (
  user_id INT PRIMARY KEY IDENTITY,
  name NVARCHAR(100),
  email NVARCHAR(100) UNIQUE NOT NULL,
  password_hash NVARCHAR(255) NOT NULL,
  birthday DATE,
  age INT
);

-- Medication Manager
-- (Braden)
CREATE TABLE Medications (
  id INT PRIMARY KEY IDENTITY(1,1),
  name NVARCHAR(100),
  dosage NVARCHAR(100),
  time NVARCHAR(100),
  frequency NVARCHAR(100)
);

-- Live Bus Tracker
-- (Braden)
CREATE TABLE BusSearchHistory (
  search_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  bus_stop_code NVARCHAR(20),
  searched_at DATETIME DEFAULT GETDATE()
);

-- Shopping List Manager
-- (Osmond)
CREATE TABLE ShoppingLists (
  list_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  title NVARCHAR(100),
  created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE ShoppingListItems (
  item_id INT PRIMARY KEY IDENTITY,
  list_id INT FOREIGN KEY REFERENCES ShoppingLists(list_id),
  item_name NVARCHAR(100),
  quantity INT,
  notes NVARCHAR(255)
);

-- Emergency Contact Quick Dial
-- (Osmond)
CREATE TABLE EmergencyContacts (
  contact_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  name NVARCHAR(100),
  phone_number NVARCHAR(20),
  relationship NVARCHAR(50)
);

-- Event Planner
-- (Yoshi)
CREATE TABLE Events (
  event_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  title NVARCHAR(100),
  description NVARCHAR(255),
  location NVARCHAR(100),
  event_time DATETIME,
  invitees NVARCHAR(255)
);

-- Activity Calendar
-- (Yoshi)
CREATE TABLE CalendarActivities (
  activity_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  description NVARCHAR(255),
  activity_time DATETIME,
  reminder BIT
);

-- Overview Page
-- (Louis)
CREATE TABLE DashboardNotes (
  note_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  content NVARCHAR(255),
  note_date DATE
);

-- Health Records
-- (Louis)
CREATE TABLE HealthRecords (
  record_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  allergies NVARCHAR(255),
  diagnosis NVARCHAR(255),
  doctor_contact NVARCHAR(100),
  emergency_contact NVARCHAR(100),
  last_updated DATETIME DEFAULT GETDATE()
);

-- Reminders
-- (Louis)
CREATE TABLE Reminders (
  reminder_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  message NVARCHAR(255),
  reminder_time DATETIME,
  is_completed BIT DEFAULT 0
);

-- User Profile Manager
-- (Lee Meng)
CREATE TABLE UserProfiles (
  profile_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  activity_level NVARCHAR(50),
  profile_photo_url NVARCHAR(255)
);


-- Workout Plan Organizer
-- (Lee Meng)
CREATE TABLE WorkoutPlans (
  plan_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  exercise_name NVARCHAR(100),
  frequency NVARCHAR(50),
  duration_minutes INT
);

-- Daily Log Tracker
-- (Lee Meng)
CREATE TABLE DailyLogs (
  log_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  exercise_done NVARCHAR(100),
  duration_minutes INT,
  reflection NVARCHAR(255),
  log_date DATE
);

/*Sample Data Insertions*/

INSERT INTO Users (name, email, password_hash, birthday, age)
VALUES (
  'Lee Meng',
  'lm@gmail.com',
  '$2b$10$mZy32W7Ev9FCBDO4XrmNKOKLOyZ2zpg0krn1J5r3uOvM75el7lCEi', -- hashed '12345'
  '2004-12-12',
  21
);

INSERT INTO Medications (user_id, name, dosage, time, frequency) VALUES
(1, 'Panadol', '500mg', 'Morning', 'Once daily'),
(1, 'Metformin', '850mg', 'After meals', 'Twice daily'),
(1, 'Vitamin D', '1000 IU', 'Morning', 'Once daily'),
(1, 'Lisinopril', '10mg', 'Evening', 'Once daily'),
(1, 'Aspirin', '75mg', 'Night', 'Once daily'),
(1, 'Amoxicillin', '500mg', 'Every 8 hours', '3 times daily'),
(1, 'Calcium', '600mg', 'With lunch', 'Once daily');

INSERT INTO Reminders (user_id, message, reminder_time, is_completed) VALUES
(1, 'Take blood pressure medicine at 9AM', '2025-06-07 09:00:00', 0),
(1, 'Doctor appointment at Bukit Batok Polyclinic', '2025-06-08 14:30:00', 0),
(1, 'Go for evening walk', '2025-06-07 18:00:00', 0),
(1, 'Call daughter to confirm weekend plans', '2025-06-07 11:00:00', 1),
(1, 'Check blood sugar level', '2025-06-07 08:00:00', 0),
(1, 'Refill prescription at pharmacy', '2025-06-09 10:00:00', 0);

INSERT INTO UserProfiles (user_id, activity_level, profile_photo_url)
VALUES 
  (1, 'High', 'http://example.com/img3.jpg'),
  (2, 'Low', 'http://example.com/img4.jpg');
