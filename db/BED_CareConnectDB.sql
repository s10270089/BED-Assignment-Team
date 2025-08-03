CREATE DATABASE CareConnectDB;
GO
USE CareConnectDB;
GO

CREATE TABLE Users (
  user_id INT PRIMARY KEY IDENTITY,
  name NVARCHAR(100),
  email NVARCHAR(100) UNIQUE NOT NULL,
  password_hash NVARCHAR(255) NULL, 
  birthday DATE,
  weight float,
  height float,
  profile_photo_url NVARCHAR(255) NULL,
  gender NVARCHAR(10),
  google_id NVARCHAR(100),
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

CREATE TABLE BusFavourites (
  favourite_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  bus_stop_code NVARCHAR(20) NOT NULL,
  bus_stop_name NVARCHAR(100) NOT NULL
);

-- Shopping List Manager
-- (Osmond)
CREATE TABLE ShoppingListItems (
  item_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  item_name NVARCHAR(100),
  item_type NVARCHAR(100),      -- Add this if you want to save type
  amount NVARCHAR(50),          -- Combine value and unit if needed
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
  date DATE,
  event_start_time DATETIME,
  event_end_time DATETIME,
  invitees NVARCHAR(255)
);

-- Event Invitations
-- (Yoshi)
CREATE TABLE EventInvitations (
  invitation_id INT PRIMARY KEY IDENTITY,
  event_id INT FOREIGN KEY REFERENCES Events(event_id),
  invitee_id INT FOREIGN KEY REFERENCES Users(user_id),
  status NVARCHAR(20) CHECK (status IN ('pending', 'accepted', 'rejected')) NOT NULL,
  sent_at DATETIME DEFAULT GETDATE(),
  accepted_at DATETIME NULL  -- NULL by default until accepted
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
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
	  exercise_type NVARCHAR(100),
    exercise_name NVARCHAR(100),
	  frequency NVARCHAR(100),
    activity_level NVARCHAR(50),
    is_default BIT,
    image_url NVARCHAR(MAX),
    reps INT,
    sets INT,
    duration_minutes DECIMAL(3,1),
    instructions NVARCHAR(MAX)
);

CREATE TABLE WorkoutTypes (
exercise_type NVARCHAR(100),
exercise_name NVARCHAR(100),
frequency NVARCHAR(100),
activity_level NVARCHAR(50),
image_url NVARCHAR(MAX),
reps INT,
sets INT,
duration_minutes DECIMAL(3,1),
instructions NVARCHAR(MAX)
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

CREATE TABLE Appointments (
  appointment_id INT PRIMARY KEY IDENTITY,
  user_id INT FOREIGN KEY REFERENCES Users(user_id),
  appointment_date DATETIME,
  doctor_name NVARCHAR(100),
  purpose NVARCHAR(255),
  status NVARCHAR(50) DEFAULT 'Scheduled'
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

INSERT INTO Events (user_id, title, description, location, date, event_start_time, event_end_time, invitees)
VALUES 
-- Henry Neo (user_id = 1)
(1, 'Morning Tai Chi', 'Gentle tai chi session for seniors', 'Community Park Pavilion',
 '2025-08-10', '2025-08-10 07:30:00', '2025-08-10 08:30:00', '2,3,4'),

(1, 'Baking for Beginners', 'Basic baking class with a community chef', 'Bedok Senior Centre Kitchen',
 '2025-08-12', '2025-08-12 11:00:00', '2025-08-12 13:00:00', '2,5'),

-- Tan Ah Kow (user_id = 2)
(2, 'Health Talk', 'A doctor-led talk on managing arthritis', 'Senior Activity Centre Hall A',
 '2025-08-15', '2025-08-15 10:00:00', '2025-08-15 11:30:00', '1,3,5'),

(2, 'Memory Games Hour', 'Engage in memory-boosting puzzles and games', 'Jurong West Elderly Hub',
 '2025-08-20', '2025-08-20 13:00:00', '2025-08-20 14:30:00', '1,3,4'),

-- Lim Bee Hwa (user_id = 3)
(3, 'Craft Workshop', 'Learn to make handmade greeting cards', 'Tampines Community Club',
 '2025-08-17', '2025-08-17 14:00:00', '2025-08-17 16:00:00', '2,4,6'),

(3, 'Walking Club', 'Gentle group walk around the reservoir', 'MacRitchie Reservoir Entrance',
 '2025-08-23', '2025-08-23 07:00:00', '2025-08-23 08:30:00', '1,2,6');

 INSERT INTO EventInvitations (event_id, invitee_id, status, sent_at, accepted_at)
VALUES
-- Activity 1 Invitations
(1, 2, 'pending', GETDATE(), NULL),
(1, 3, 'accepted', GETDATE(), '2025-08-05 10:00:00'),
(1, 4, 'rejected', GETDATE(), NULL),

-- Activity 2 Invitations
(2, 1, 'accepted', GETDATE(), '2025-08-06 09:30:00'),
(2, 4, 'accepted', GETDATE(), '2025-08-06 10:00:00'),

-- Activity 3 Invitations
(3, 1, 'pending', GETDATE(), NULL),
(3, 2, 'accepted', GETDATE(), '2025-08-07 08:15:00'),
(3, 6, 'pending', GETDATE(), NULL),

-- Activity 4 Invitations
(4, 1, 'accepted', GETDATE(), '2025-08-08 18:00:00'),
(4, 2, 'accepted', GETDATE(), '2025-08-08 18:10:00'),
(4, 3, 'pending', GETDATE(), NULL);



INSERT INTO Friendships (sender_id, receiver_id, status) VALUES
(1, 3, 'pending'),  -- Henry Neo → Lim Bee Hwa
(4, 1, 'pending'),  -- Goh Soon Chye → Henry Neo
(2, 6, 'accepted'), -- Tan Ah Kow ↔ Wong Ah Ma
(5, 1, 'accepted'), -- Chong Mei Lin ↔ Henry Neo
(5, 3, 'accepted'); -- Chong Mei Lin ↔ Lim Bee Hwa 

INSERT INTO HealthRecords (user_id, allergies, diagnosis, doctor_contact, emergency_contact, last_updated) VALUES
  (1, 'Penicillin', 'Hypertension', '61234567', '81234567', '2024-07-01 10:30:00'),
  (1, 'Latex', 'Asthma', '64567890', '87776665', '2024-07-06 11:45:00'),
  (1, 'None', 'High Cholesterol', '61239876', '81231234', '2024-07-11 09:00:00');

-- Sample Appointments for testing
INSERT INTO Appointments (user_id, appointment_date, doctor_name, purpose) VALUES
(1, '2025-07-15 09:00:00', 'Dr. John Smith', 'General check-up'),
(1, '2025-07-20 14:00:00', 'Dr. Emily Watson', 'Blood pressure monitoring'),
(2, '2025-08-01 10:00:00', 'Dr. Sarah Lee', 'Orthopedic consultation'),
(3, '2025-07-28 16:00:00', 'Dr. Brian Clark', 'Asthma follow-up');

insert into EmergencyContacts(user_id, name, phone_number, relationship) values
(2, 'BRADEN_MY_GOAT', 87654321, 'GOATRAHHH');

INSERT INTO WorkoutTypes(
    exercise_type, exercise_name, rest_duration, activity_level, image_url, reps, sets, duration_minutes, instructions, Benefits, recommended
) VALUES 
('Strength', 'Wall push-ups', 2, 'beginner', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753706323/xymszqdrqp8lqbophm3m.png', 12, 2, null, 'Stand arm''s length from wall, place palms flat, lower chest toward wall, push back.', 'Helps improve upper body strength and stability, promoting better posture and balance.', 0),
('Strength', 'Sit-to-stands', 2, 'beginner', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729349/SitToStand.png', 10, 3, null, 'Sit on a sturdy chair, stand up fully, then slowly sit back down.', 'Strengthens the legs and core muscles, improving mobility and reducing the risk of falls.', 1),
('Strength', 'Standing calf raises', 2, 'beginner', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729349/StandingCalfRaises.png', 15, 2, null, 'Stand tall, raise heels off the ground, then lower slowly.', 'Enhances lower leg strength and balance, helping with walking and preventing falls.', 1),
('Strength', 'Heel slides', 2, 'beginner', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729351/Heel%20Slides.png', 10, 2, null, 'Lie down, slowly slide heel toward hips and back.', 'Improves joint flexibility, especially in the knees, and helps with mobility.', 0),
('Strength', 'Seated rows', 2, 'beginner', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729346/ChatGPT_Image_Jul_29_2025_02_55_57_AM_yw8rfd.png', 12, 2, null, 'Use resistance band, pull handles toward torso, squeeze shoulder blades.', 'Strengthens the upper back, shoulders, and arms, which aids in maintaining good posture and upper body strength.', 1),
('Strength', 'Step-ups', 2, 'intermediate', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729344/ChatGPT_Image_Jul_29_2025_02_56_01_AM_bxipme.png', 10, 2, null, 'Step onto low platform with one foot, push up, step down.', 'Boosts leg strength and balance, essential for everyday tasks like climbing stairs and walking.', 1),
('Strength', 'Glute bridges', 2, 'intermediate', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729343/ChatGPT_Image_Jul_29_2025_02_56_03_AM_lmf9a8.png', 12, 2, null, 'Lie on back, knees bent, lift hips upward, squeeze glutes.', 'Strengthens the hips, glutes, and lower back, helping with stability and mobility.', 1),
('Strength', 'Bicep curls', 2, 'intermediate', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729347/ChatGPT_Image_Jul_29_2025_02_56_04_AM_vnrryy.png', 12, 2, null, 'Stand on band, curl handles toward shoulders.', 'Improves arm strength, making it easier to perform tasks that require lifting or carrying objects.', 1),
('Strength', 'Seated Chest press', 2, 'intermediate', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729344/ChatGPT_Image_Jul_29_2025_02_56_05_AM_rmhwne.png', 10, 2, null, 'Anchor band behind, press handles forward until arms extend.', 'Strengthens the chest, shoulders, and arms, which aids in everyday activities like pushing or lifting.', 0),
('Strength', 'Incline Push-ups', 2, 'intermediate', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729348/ChatGPT_Image_Jul_29_2025_02_56_00_AM_o9ui8x.png', 10, 2, null, 'Hold dumbbells at shoulders, press upward until arms are extended.', 'Enhances upper body strength, especially the chest, arms, and shoulders, while being easier on the joints compared to regular push-ups.', 0),
('Strength', 'Goblet squats', 2, 'advanced', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729345/ChatGPT_Image_Jul_29_2025_02_56_07_AM_qeah0h.png', 8, 2, null, 'Hold dumbbell at chest, squat down and stand back up.', 'Strengthens the legs and core muscles, improving balance and functionality for sitting, standing, and walking.', 0),
('Strength', 'Romanian Deadlifts', 2, 'advanced', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729345/ChatGPT_Image_Jul_29_2025_02_56_08_AM_puwh4f.png', 8, 2, null, 'Hold weights, bend at hips, lower to shin height, return upright.', 'Helps strengthen the hamstrings, glutes, and lower back, which is important for maintaining mobility and preventing back pain.', 0),
('Strength', 'Farmer’s carry', 2, 'advanced', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729344/ChatGPT_Image_Jul_29_2025_02_56_11_AM_r48zwk.png', null, 2, 0.5, 'Hold weights at sides, walk slowly for time.', 'Improves grip strength, overall endurance, and stability, important for carrying groceries or lifting objects safely.', 0),
('Strength', 'Lat pulldown', 2, 'advanced', 'https://res.cloudinary.com/dgtx0alyb/video/upload/v1753729348/01501201-Cable-Bar-Lateral-Pulldown_Back_tsy6ay.mp4', 10, 2, null, 'Sit at machine, pull bar to chest, control on return.', 'Strengthens the back, shoulders, and arms, improving posture and upper body strength.', 0),
('Strength', 'Side steps', 2, 'advanced', 'https://res.cloudinary.com/dgtx0alyb/image/upload/v1753729342/Side_Step_d0hpog.png', 10, 2, null, 'Push handles away from chest, control return.', 'Enhances balance and coordination, reducing the risk of falls and helping with side-to-side movements in daily life.', 0);
