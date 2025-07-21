# BED Assignment Team – CareConnect Web App

A multi-module web application built for seniors to manage daily tasks, medications, appointments, health records and social events—all in one place.

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Prerequisites](#prerequisites)  
- [Installing Node.js](#installing-nodejs)  
- [Installation](#installation)  
- [Database Setup](#database-setup)  
- [Running the App](#running-the-app)  
- [API Endpoints](#api-endpoints)  
- [Project Structure](#project-structure)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Planned Features

- **Medication Manager**: track dosages & schedules  
- **Live Bus Tracker**: real-time arrival data  
- **User Login & Signup** (JWT-based auth)  
- **Shopping List Manager**  
- **Emergency Quick-Dial**  
- **Checklist Creator**  
- **Event Planner** & **Activity Calendar**  
- **Overview Dashboard** (date, weather, upcoming)  
- **Health Records** (BP logs, notes)  
- **Reminders** (create/edit/delete)  
- **Auto-Translation** of input  
- **Doctor & Caretaker Login**  
- **User Profile Manager** (with exercise recommendations)  
- **Workout Plan Organizer**  
- **Daily Log Tracker**

---

## Tech Stack

- **Node.js** & **Express**  
- **Microsoft SQL Server** (via `mssql`)  
- **Authentication**: `bcrypt` + `jsonwebtoken` (JWT)  
- **Validation**: `joi`  
- **Front-end**: static HTML/CSS/JS (served from `/public`)  
- **FullCalendar javascript API** : Interactive drag & drop calendar interface for reminders

---

## Prerequisites

- **Git**  
- **Node.js** (≥16.x) & **npm**  
- **Microsoft SQL Server** & **SQL Server Management Studio (SSMS)**  

---

## Installing Node.js

### Windows & macOS

1. Go to https://nodejs.org/  
2. Download the **LTS** installer and run it.  
3. Verify:
   ```bash
   node -v
   npm -v

## Installation
### Clone the repo
1. git clone https://github.com/s10270089/BED-Assignment-Team.git
2. cd BED-Assignment-Team

### Install dependencies
1. npm install
2. Configure environment
3. create your own at project root:  
PORT=3000  
DB_USER=<your_db_user>  
DB_PASSWORD=<your_db_password>  
DB_SERVER=<your_db_server>  
DB_PORT=1433  
DB_NAME=<your_db_name>  
JWT_SECRET=<your_jwt_secret>  

## Database Setup
In SSMS run:  
backend\db\BED_CareConnectDB.sql

## Running the App
1. node app.js
2. Visit http://localhost:3000 in your browser.
