CREATE DATABASE CareConnectDB;
GO
USE CareConnectDB;
GO

CREATE TABLE Users (
  user_id INT PRIMARY KEY IDENTITY,
  name NVARCHAR(100),
  email NVARCHAR(100) UNIQUE NOT NULL,
  password_hash NVARCHAR(255) NOT NULL,
  birthday DATE
);

-- Medication Manager
-- (Braden)
CREATE TABLE Medications (
  id INT PRIMARY KEY IDENTITY(1,1),
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  name NVARCHAR(100) NOT NULL,
  dosage NVARCHAR(100) NOT NULL,
  time NVARCHAR(100) NOT NULL,
  frequency NVARCHAR(100) NOT NULL
);

-- Live Bus Tracker
-- (Braden)
CREATE TABLE BusSearchHistory (
  search_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  bus_stop_code NVARCHAR(20) NOT NULL,
  searched_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE BusSearchResults (
  result_id INT PRIMARY KEY IDENTITY,
  search_id INT FOREIGN KEY REFERENCES BusSearchHistory(search_id),
  service_no NVARCHAR(10) NOT NULL,
  estimated_arrival DATETIME NOT NULL,
  load NVARCHAR(10) NOT NULL  -- SEA, SDA, LSD
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
  profile_photo_url NVARCHAR(255)
);


-- Workout Plan Organizer
-- (Lee Meng)
CREATE TABLE WorkoutPlans (
  plan_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  exercise_name NVARCHAR(100),
  frequency NVARCHAR(50),
  duration_minutes INT,
  activity_level NVARCHAR(50)
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

-- Friends list
CREATE TABLE Friendships (
    friendship_id INT PRIMARY KEY IDENTITY(1,1),
    sender_id INT NOT NULL, -- the user who sent the request
    receiver_id INT NOT NULL, -- the user who receives the request
    status NVARCHAR(20) NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (sender_id) REFERENCES Users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id)
);


/*Sample Data Insertions*/

INSERT INTO Users (name, email, password_hash, birthday)
VALUES 
('Henry Neo', 'henryneo@example.com',
 '$2b$10$OeBEXYx1V3xMUMY6Euvg0OBmYMWDL4kKfeZTLPyItPCMWNi8rSSry', -- password: 12345
 '2005-04-23'),

('Tan Ah Kow', 'tan.kow@example.com',
 '$2b$10$SZ37cVFRdSePPi4EsyA18O0.68FYzAMdzyhTR1OXA5/BMsMa5rkWu', -- password: 67890
 '1950-03-12'),

('Lim Bee Hwa', 'lim.bee@example.com',
 '$2b$10$UkzDojbPT2v1ANZz1m20ieQl.tDLa6x6ZyKcGeUXc3VZ3GBTC3WRK', -- password: password1
 '1948-08-25'),

('Goh Soon Chye', 'goh.chye@example.com',
 '$2b$10$2mBOFpyUxtLhSkMEmBoYseBCs2FRUZvlb8DxxDnxZ4IdKkeH4zWbS', -- password: test123
 '1955-01-15'),

('Chong Mei Lin', 'mei.lin@example.com',
 '$2b$10$8YLBZrKf3TwMfrwrJcMPduFvUnuvVboDOW2keS7k6QEkTtPyC7ZC6', -- password: hello321
 '1952-06-07'),

('Wong Ah Ma', 'ah.ma@example.com',
 '$2b$10$BPVX9O0N4H7rmi34WlSDQuZ9I/P2ejb0kzhLSGCxuJJKX.1r95oqq', -- password: s3nior$afe
 '1945-10-30');


/* MEDICATIONS (frequency = how many times per day, time = time slots separated by commas) */

INSERT INTO Medications (user_id, name, dosage, time, frequency) VALUES
(1, 'Panadol', '500mg', '8am, 8pm', '2'),           -- Henry Neo
(1, 'Vitamin D', '1000 IU', '9am', '1'),
(1, 'Metformin', '850mg', '8am, 2pm, 8pm', '3'),
(1, 'Aspirin', '75mg', '7am', '1'),
(1, 'Amoxicillin', '500mg', '7am, 1pm, 7pm', '3'),

(2, 'Lisinopril', '10mg', '9am', '1'),              -- Tan Ah Kow
(2, 'Atorvastatin', '20mg', '9pm', '1'),

(3, 'Glucosamine', '500mg', '8am, 8pm', '2'),        -- Lim Bee Hwa
(3, 'Calcium', '600mg', '12pm', '1'),

(4, 'Paracetamol', '500mg', '10am, 10pm', '2'),      -- Goh Soon Chye

(5, 'Omeprazole', '20mg', '7am', '1'),               -- Chong Mei Lin

(6, 'Multivitamins', '1 tablet', '8am', '1'),        -- Wong Ah Ma
(6, 'Iron Supplement', '325mg', '9am, 9pm', '2');


INSERT INTO Reminders (user_id, message, reminder_time, is_completed) VALUES
(1, 'Take blood pressure medicine at 9AM', '2025-06-07 09:00:00', 0),
(1, 'Doctor appointment at Bukit Batok Polyclinic', '2025-06-08 14:30:00', 0),
(1, 'Go for evening walk', '2025-06-07 18:00:00', 0),
(1, 'Call daughter to confirm weekend plans', '2025-06-07 11:00:00', 1),
(1, 'Check blood sugar level', '2025-06-07 08:00:00', 0),
(1, 'Refill prescription at pharmacy', '2025-06-09 10:00:00', 0);

INSERT INTO UserProfiles (user_id, profile_photo_url)
VALUES 
  (1, 'http://example.com/img3.jpg'),
  (2, 'http://example.com/img4.jpg');

INSERT INTO Events (user_id, title, description, location, event_time, invitees)
VALUES
(1, 'Morning Tai Chi', 'Gentle tai chi session for seniors', 'Community Park Pavilion', '2025-07-15 07:30:00', '2,3,4'),
(2, 'Health Talk', 'A doctor-led talk on managing arthritis', 'Senior Activity Centre Hall A', '2025-07-18 10:00:00', '1,3,5'),
(3, 'Craft Workshop', 'Learn to make handmade greeting cards', 'Tampines Community Club', '2025-07-20 14:00:00', '2,4,6'),
(4, 'Gardening Club Meetup', 'Monthly meeting for garden lovers', 'Bukit Timah Allotment Garden', '2025-07-22 09:00:00', '1,2,3'),
(5, 'Classic Movie Screening', 'Watch and discuss a classic film together', 'Golden Years Centre AV Room', '2025-07-25 15:30:00', '3,4,6'),
(1, 'Baking for Beginners', 'Basic baking class with a community chef', 'Bedok Senior Centre Kitchen', '2025-07-28 11:00:00', '2,5'),
(2, 'Memory Games Hour', 'Engage in memory-boosting puzzles and games', 'Jurong West Elderly Hub', '2025-07-30 13:00:00', '1,3,4'),
(3, 'Walking Club', 'Gentle group walk around the reservoir', 'MacRitchie Reservoir Entrance', '2025-08-01 07:00:00', '1,2,6'),
(4, 'Karaoke Afternoon', 'Sing your favourite oldies with friends', 'Senior Karaoke Room, Hougang CC', '2025-08-03 16:00:00', '2,3,5'),
(5, 'Storytelling Circle', 'Share life stories and wisdom with peers', 'Library@HarbourFront - Activity Room', '2025-08-06 10:30:00', '1,4,6');

INSERT INTO Friendships (sender_id, receiver_id, status) VALUES
(1, 3, 'pending'),  -- Henry Neo → Lim Bee Hwa
(4, 1, 'pending'),  -- Goh Soon Chye → Henry Neo
(2, 6, 'accepted'), -- Tan Ah Kow ↔ Wong Ah Ma
(5, 1, 'accepted'), -- Chong Mei Lin ↔ Henry Neo
(5, 3, 'accepted'); -- Chong Mei Lin ↔ Lim Bee Hwa 
