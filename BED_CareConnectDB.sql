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
  age INT,
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

INSERT INTO Users (name, email, password_hash, birthday)
VALUES (
  'Lee Meng',
  'lm@gmail.com',
  '12345',
  '2004-12-12'
);
