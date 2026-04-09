1️⃣ ADMIN TABLE

-- CREATE TABLE
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT (Register)
INSERT INTO admin (username, email, password) 
VALUES ('admin', 'admin@bloodbank.com', '$2b$10$3STp60yATywyGznR3vOlUOeBWhbKSiU4SArBGnGAIi2gtY89tLWgW');

-- INSERT (New Admin)
INSERT INTO admin (username, email, password) 
VALUES ('rohit', 'rohit@bloodbank.com', '$2b$10$3STp60yATywyGznR3vOlUOeBWhbKSiU4SArBGnGAIi2gtY89tLWgW');

-- SELECT (Login by email)
SELECT * FROM admin WHERE email = 'admin@bloodbank.com';

-- SELECT (Login by username)
SELECT * FROM admin WHERE username = 'admin';

-- SELECT (All admins)
SELECT id, username, email FROM admin;

-- SELECT (Admin by ID)
SELECT * FROM admin WHERE id = 1;

-- UPDATE (Change password)
UPDATE admin SET password = '$2b$10$NEWHASH' WHERE email = 'admin@bloodbank.com';

-- UPDATE (Change email)
UPDATE admin SET email = 'newemail@bloodbank.com' WHERE id = 1;

-- DELETE (Remove admin)
DELETE FROM admin WHERE id = 2;

-- DELETE (All admins)
DELETE FROM admin;


2️⃣ DONOR TABLE
-- CREATE TABLE
CREATE TABLE IF NOT EXISTS donor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10),
    bloodgroup VARCHAR(5),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    pin VARCHAR(10),
    password VARCHAR(255) NOT NULL,
    aadhar VARCHAR(12) UNIQUE,
    father_name VARCHAR(100),
    total_donation INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT (Register Donor)
INSERT INTO donor (name, age, gender, bloodgroup, email, phone, address, pin, password, aadhar, father_name) 
VALUES ('Rohit Sharma', 25, 'Male', 'O+', 'rohit@test.com', '9876543210', 'Bhopal', '462001', '$2b$10$hash', '123412341234', 'Ram Sharma');

-- SELECT (Login by email)
SELECT * FROM donor WHERE email = 'rohit@test.com';

-- SELECT (Donor by ID)
SELECT id, name, email, bloodgroup, phone, address, total_donation FROM donor WHERE id = 1;

-- SELECT (All donors)
SELECT id, name, email, bloodgroup, phone, total_donation FROM donor;

-- SELECT (Donors by blood group)
SELECT id, name, email, phone FROM donor WHERE bloodgroup = 'O+';

-- SELECT (Search donors)
SELECT * FROM donor WHERE name LIKE '%rohit%' OR email LIKE '%rohit%';

-- UPDATE (Profile update)
UPDATE donor SET name = 'Rohit Kumar', phone = '9876543210', address = 'Indore' WHERE id = 1;

-- UPDATE (Password change)
UPDATE donor SET password = '$2b$10$newhash' WHERE id = 1;

-- UPDATE (Increment donation count)
UPDATE donor SET total_donation = total_donation + 1 WHERE id = 1;

-- DELETE (Remove donor)
DELETE FROM donor WHERE id = 2;

-- DELETE (Inactive donors)
DELETE FROM donor WHERE total_donation = 0 AND created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);


3️⃣ BANK TABLE
-- CREATE TABLE
CREATE TABLE IF NOT EXISTS bank (
    bank_id INT AUTO_INCREMENT PRIMARY KEY,
    Blood_Bank_Name VARCHAR(200) NOT NULL,
    Hospital_Name VARCHAR(200),
    Category VARCHAR(100),
    Person_Name VARCHAR(100),
    Email VARCHAR(100),
    Conatct_No VARCHAR(15),
    Licence_No VARCHAR(100),
    License_Issue DATE,
    License_Expiry DATE,
    Website VARCHAR(200),
    No_Beds INT,
    state VARCHAR(50),
    district VARCHAR(50),
    Address TEXT,
    Pincode VARCHAR(10),
    Donor_Type VARCHAR(200),
    Donation_Type VARCHAR(200),
    Component_Type VARCHAR(200),
    Bag_Type VARCHAR(200),
    TTI_Type VARCHAR(200),
    Action VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT (Register Bank)
INSERT INTO bank (Blood_Bank_Name, Hospital_Name, Category, Person_Name, Email, Conatct_No, Licence_No, License_Issue, License_Expiry, state, district, Address, Pincode, Action) 
VALUES ('City Blood Bank', 'City Hospital', 'Private', 'John Doe', 'city@bank.com', '9876543210', 'LIC12345', '2024-01-01', '2026-01-01', 'Madhya Pradesh', 'Bhopal', 'MP Nagar', '462001', 'pending');

-- SELECT (All banks)
SELECT * FROM bank;

-- SELECT (Accepted banks)
SELECT * FROM bank WHERE Action = 'accepted';

-- SELECT (Pending banks)
SELECT * FROM bank WHERE Action = 'pending';

-- SELECT (Bank by ID)
SELECT * FROM bank WHERE bank_id = 1;

-- SELECT (Banks by location)
SELECT * FROM bank WHERE state = 'Madhya Pradesh' AND district = 'Bhopal' AND Action = 'accepted';

-- UPDATE (Accept bank)
UPDATE bank SET Action = 'accepted' WHERE bank_id = 1;

-- UPDATE (Reject bank)
UPDATE bank SET Action = 'rejected' WHERE bank_id = 1;

-- UPDATE (Update bank profile)
UPDATE bank SET Email = 'new@bank.com', Blood_Bank_Name = 'New Name', Address = 'New Address' WHERE bank_id = 1;

-- DELETE (Remove bank)
DELETE FROM bank WHERE bank_id = 2;

-- DELETE (Rejected banks)
DELETE FROM bank WHERE Action = 'rejected';


4️⃣ BANK ADMIN TABLE
-- CREATE TABLE
CREATE TABLE IF NOT EXISTS bank_admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    bank_id INT,
    role VARCHAR(20) DEFAULT 'bank_admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_id) REFERENCES bank(bank_id) ON DELETE CASCADE
);

-- INSERT (Create bank admin)
INSERT INTO bank_admin (username, password, bank_id) 
VALUES ('city@bank.com', '$2b$10$hash', 1);

-- SELECT (Login by username)
SELECT * FROM bank_admin WHERE username = 'city@bank.com';

-- SELECT (Admin by bank ID)
SELECT * FROM bank_admin WHERE bank_id = 1;

-- UPDATE (Change password)
UPDATE bank_admin SET password = '$2b$10$newhash' WHERE bank_id = 1;

-- DELETE (Remove bank admin)
DELETE FROM bank_admin WHERE bank_id = 1;



5️⃣ BLOOD CAMP TABLE

-- CREATE TABLE
CREATE TABLE IF NOT EXISTS blood_camp (
    camp_id INT AUTO_INCREMENT PRIMARY KEY,
    organization_type VARCHAR(250) DEFAULT 'Charitable',
    organization_name VARCHAR(250),
    camp_name VARCHAR(250) NOT NULL,
    organizer_name VARCHAR(250) NOT NULL,
    organizer_mobile_no VARCHAR(15) NOT NULL,
    organizer_email_id VARCHAR(200) NOT NULL,
    camp_date DATE NOT NULL,
    camp_address VARCHAR(250),
    state VARCHAR(250) NOT NULL,
    district VARCHAR(250) NOT NULL,
    start_time TIME,
    end_time TIME,
    Action VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT (Register Camp)
INSERT INTO blood_camp (organization_type, organization_name, camp_name, organizer_name, organizer_mobile_no, organizer_email_id, camp_date, camp_address, state, district, start_time, end_time, Action) 
VALUES ('Charitable', 'Red Cross', 'Blood Donation Camp', 'John Organizer', '9876543210', 'camp@redcross.com', '2024-12-31', 'Bhopal', 'Madhya Pradesh', 'Bhopal', '10:00', '17:00', 'pending');

-- SELECT (All camps)
SELECT * FROM blood_camp;

-- SELECT (Accepted camps)
SELECT * FROM blood_camp WHERE Action = 'accepted';

-- SELECT (Pending camps)
SELECT * FROM blood_camp WHERE Action = 'pending';

-- SELECT (Camp by ID)
SELECT * FROM blood_camp WHERE camp_id = 1;

-- SELECT (Search camps by location and date)
SELECT * FROM blood_camp WHERE State = 'Madhya Pradesh' AND District = 'Bhopal' AND Camp_Date = '2024-12-31' AND Action = 'accepted';

-- UPDATE (Accept camp)
UPDATE blood_camp SET Action = 'accepted' WHERE camp_id = 1;

-- UPDATE (Reject camp)
UPDATE blood_camp SET Action = 'rejected' WHERE camp_id = 1;

-- UPDATE (Update camp details)
UPDATE blood_camp SET camp_name = 'New Camp Name', camp_address = 'New Address' WHERE camp_id = 1;

-- DELETE (Remove camp)
DELETE FROM blood_camp WHERE camp_id = 2;

-- DELETE (Old camps)
DELETE FROM blood_camp WHERE camp_date < CURDATE();

6️⃣ DONATION TABLE
-- CREATE TABLE
CREATE TABLE IF NOT EXISTS donation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_id INT,
    donor_id INT,
    blood_type VARCHAR(5),
    donation_date DATE,
    donation_time TIME,
    status VARCHAR(20) DEFAULT 'pending',
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_id) REFERENCES bank(bank_id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES donor(id) ON DELETE CASCADE
);

-- INSERT (Create donation request)
INSERT INTO donation (bank_id, donor_id) VALUES (1, 1);

-- SELECT (All donations)
SELECT * FROM donation;

-- SELECT (Pending donations for bank)
SELECT d.*, donor.name as donor_name, donor.bloodgroup 
FROM donation d 
JOIN donor ON d.donor_id = donor.id 
WHERE d.bank_id = 1 AND d.status = 'pending';

-- SELECT (Approved donations)
SELECT * FROM donation WHERE status = 'approved';

-- SELECT (Donations by donor)
SELECT * FROM donation WHERE donor_id = 1;

-- UPDATE (Approve donation)
UPDATE donation SET donation_date = '2024-12-31', donation_time = '10:00', status = 'approved' WHERE id = 1;

-- UPDATE (Complete donation)
UPDATE donation SET status = 'completed' WHERE id = 1;

-- UPDATE (Reject donation)
UPDATE donation SET status = 'rejected' WHERE id = 1;

-- DELETE (Remove donation)
DELETE FROM donation WHERE id = 2;

-- DELETE (Old pending donations)
DELETE FROM donation WHERE status = 'pending' AND application_date < DATE_SUB(NOW(), INTERVAL 7 DAY);

7️⃣ DONATION HISTORY TABLE
-- CREATE TABLE
CREATE TABLE IF NOT EXISTS donation_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_id INT,
    donor_id INT,
    donation_id INT,
    blood_group VARCHAR(5),
    donation_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_id) REFERENCES bank(bank_id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES donor(id) ON DELETE CASCADE
);

-- INSERT (Add donation to history)
INSERT INTO donation_history (bank_id, donor_id, donation_id, blood_group, donation_date, expiry_date) 
VALUES (1, 1, 1, 'O+', '2024-12-31', DATE_ADD('2024-12-31', INTERVAL 42 DAY));

-- SELECT (History by bank)
SELECT * FROM donation_history WHERE bank_id = 1;

-- SELECT (History by donor)
SELECT * FROM donation_history WHERE donor_id = 1;

-- SELECT (History with donor names)
SELECT dh.*, d.name as donor_name, b.Blood_Bank_Name 
FROM donation_history dh
JOIN donor d ON dh.donor_id = d.id
JOIN bank b ON dh.bank_id = b.bank_id;

-- DELETE (Old history)
DELETE FROM donation_history WHERE expiry_date < CURDATE();

8️⃣ INVENTORY TABLE
-- CREATE TABLE
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_id INT,
    bloodgroup VARCHAR(5),
    quantity INT DEFAULT 0,
    last_updated_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_id) REFERENCES bank(bank_id) ON DELETE CASCADE,
    UNIQUE KEY unique_bank_blood (bank_id, bloodgroup)
);

-- INSERT (Initialize inventory for new bank)
INSERT INTO inventory (bank_id, bloodgroup, quantity, last_updated_date) VALUES 
(1, 'A+', 0, CURDATE()),
(1, 'A-', 0, CURDATE()),
(1, 'B+', 0, CURDATE()),
(1, 'B-', 0, CURDATE()),
(1, 'AB+', 0, CURDATE()),
(1, 'AB-', 0, CURDATE()),
(1, 'O+', 0, CURDATE()),
(1, 'O-', 0, CURDATE());

-- INSERT (Add blood stock)
INSERT INTO inventory (bank_id, bloodgroup, quantity, last_updated_date) 
VALUES (1, 'A+', 10, CURDATE()) 
ON DUPLICATE KEY UPDATE quantity = quantity + 10, last_updated_date = CURDATE();

-- SELECT (Inventory by bank)
SELECT * FROM inventory WHERE bank_id = 1;

-- SELECT (Blood availability by location)
SELECT i.*, b.Blood_Bank_Name, b.Address, b.Conatct_No 
FROM inventory i 
JOIN bank b ON i.bank_id = b.bank_id 
WHERE b.state = 'Madhya Pradesh' AND b.district = 'Bhopal' AND i.bloodgroup = 'A+' AND i.quantity > 0;

-- UPDATE (Update quantity after donation)
UPDATE inventory SET quantity = quantity - 1, last_updated_date = CURDATE() 
WHERE bank_id = 1 AND bloodgroup = 'A+';

-- DELETE (Remove zero stock)
DELETE FROM inventory WHERE quantity = 0;

9️⃣ UTILITY QUERIES

-- Get Dashboard Stats
SELECT 
    (SELECT COUNT(*) FROM donor) as totalDonors,
    (SELECT COUNT(*) FROM bank WHERE Action = 'accepted') as totalBanks,
    (SELECT COUNT(*) FROM bank WHERE Action = 'pending') as pendingBanks,
    (SELECT COUNT(*) FROM blood_camp) as totalCamps;

-- Get Recent Activities
SELECT * FROM bank ORDER BY created_at DESC LIMIT 5;
SELECT * FROM donor ORDER BY created_at DESC LIMIT 5;
SELECT * FROM donation_history ORDER BY created_at DESC LIMIT 5;

-- Safe Mode Off/On
SET SQL_SAFE_UPDATES = 0;
SET SQL_SAFE_UPDATES = 1;

-- Show all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE admin;
DESCRIBE donor;
DESCRIBE bank;
DESCRIBE blood_camp;
DESCRIBE donation;
DESCRIBE donation_history;
DESCRIBE inventory;

-- Drop tables (Be careful!)
DROP TABLE IF EXISTS donation_history;
DROP TABLE IF EXISTS donation;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS blood_camp;
DROP TABLE IF EXISTS bank_admin;
DROP TABLE IF EXISTS bank;
DROP TABLE IF EXISTS donor;
DROP TABLE IF EXISTS admin;


<!--
###  DATABASE SCHEMA DESCRIPTION
1️⃣ ADMIN TABLE
Column	Type	Null	Default	Description
id	INT	NO	AUTO_INCREMENT	Primary key, unique ID
username	VARCHAR(100)	NO	-	Admin login username (unique)
email	VARCHAR(100)	NO	-	Admin email (unique)
password	VARCHAR(255)	NO	-	Hashed password (bcrypt)
role	VARCHAR(50)	YES	'admin'	User role
created_at	TIMESTAMP	YES	CURRENT_TIMESTAMP	Account creation time
Purpose: Store admin user credentials and information.

2️⃣ DONOR TABLE
Column	Type	Null	Default	Description
id	INT	NO	AUTO_INCREMENT	Primary key, unique ID
name	VARCHAR(100)	NO	-	Donor's full name
age	INT	YES	-	Donor's age
gender	VARCHAR(10)	YES	-	Male/Female/Other
bloodgroup	VARCHAR(5)	YES	-	Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
email	VARCHAR(100)	NO	-	Email (unique)
phone	VARCHAR(15)	YES	-	Mobile number
address	TEXT	YES	-	Residential address
pin	VARCHAR(10)	YES	-	Pincode
password	VARCHAR(255)	NO	-	Hashed password
aadhar	VARCHAR(12)	YES	-	Aadhar number (unique)
father_name	VARCHAR(100)	YES	-	Father's name
total_donation	INT	YES	0	Total donations count
created_at	TIMESTAMP	YES	CURRENT_TIMESTAMP	Registration date
Purpose: Store blood donor personal information and donation history.

3️⃣ BANK TABLE
Column	Type	Null	Default	Description
bank_id	INT	NO	AUTO_INCREMENT	Primary key, unique ID
Blood_Bank_Name	VARCHAR(200)	NO	-	Name of blood bank
Hospital_Name	VARCHAR(200)	YES	-	Parent hospital name
Category	VARCHAR(100)	YES	-	Govt/Private/Charitable
Person_Name	VARCHAR(100)	YES	-	Contact person name
Email	VARCHAR(100)	YES	-	Bank email
Conatct_No	VARCHAR(15)	YES	-	Contact number
Licence_No	VARCHAR(100)	YES	-	License number
License_Issue	DATE	YES	-	License issue date
License_Expiry	DATE	YES	-	License expiry date
Website	VARCHAR(200)	YES	-	Bank website
No_Beds	INT	YES	-	Number of beds
state	VARCHAR(50)	YES	-	State name
district	VARCHAR(50)	YES	-	District name
Address	TEXT	YES	-	Full address
Pincode	VARCHAR(10)	YES	-	Pincode
Donor_Type	VARCHAR(200)	YES	-	Voluntary/Family/Directed
Donation_Type	VARCHAR(200)	YES	-	Whole Blood/Plasmapheresis
Component_Type	VARCHAR(200)	YES	-	RBC/Plasma/Platelets
Bag_Type	VARCHAR(200)	YES	-	Single/Double/Triple bag
TTI_Type	VARCHAR(200)	YES	-	HIV/Hepatitis/Malaria
Action	VARCHAR(20)	YES	'pending'	pending/accepted/rejected
created_at	TIMESTAMP	YES	CURRENT_TIMESTAMP	Registration date
Purpose: Store blood bank registration and verification information.

4️⃣ BANK_ADMIN TABLE
Column	Type	Null	Default	Description
id	INT	NO	AUTO_INCREMENT	Primary key, unique ID
username	VARCHAR(100)	NO	-	Bank admin login email (unique)
password	VARCHAR(255)	NO	-	Hashed password
bank_id	INT	YES	-	Foreign key to bank table
role	VARCHAR(20)	YES	'bank_admin'	User role
created_at	TIMESTAMP	YES	CURRENT_TIMESTAMP	Account creation date
Purpose: Store blood bank admin credentials (created when admin accepts bank).

5️⃣ BLOOD_CAMP TABLE
Column	Type	Null	Default	Description
camp_id	INT	NO	AUTO_INCREMENT	Primary key, unique ID
organization_type	VARCHAR(250)	YES	'Charitable'	Govt/Private/Charitable
organization_name	VARCHAR(250)	YES	-	Organization name
camp_name	VARCHAR(250)	NO	-	Camp name
organizer_name	VARCHAR(250)	NO	-	Organizer name
organizer_mobile_no	VARCHAR(15)	NO	-	Organizer mobile number
organizer_email_id	VARCHAR(200)	NO	-	Organizer email
camp_date	DATE	NO	-	Camp date
camp_address	VARCHAR(250)	YES	-	Camp address
state	VARCHAR(250)	NO	-	State name
district	VARCHAR(250)	NO	-	District name
start_time	TIME	YES	-	Camp start time
end_time	TIME	YES	-	Camp end time
Action	VARCHAR(20)	YES	'pending'	pending/accepted/rejected
created_at	TIMESTAMP	YES	CURRENT_TIMESTAMP	Registration date
Purpose: Store blood donation camp registration and verification information.

6️⃣ DONATION TABLE
Column	Type	Null	Default	Description
id	INT	NO	AUTO_INCREMENT	Primary key, unique ID
bank_id	INT	YES	-	Foreign key to bank table
donor_id	INT	YES	-	Foreign key to donor table
blood_type	VARCHAR(5)	YES	-	Blood group donated
donation_date	DATE	YES	-	Scheduled donation date
donation_time	TIME	YES	-	Scheduled donation time
status	VARCHAR(20)	YES	'pending'	pending/approved/completed/rejected
application_date	TIMESTAMP	YES	CURRENT_TIMESTAMP	Request date
Purpose: Track blood donation requests and their status.

7️⃣ DONATION_HISTORY TABLE
Column	Type	Null	Default	Description
id	INT	NO	AUTO_INCREMENT	Primary key, unique ID
bank_id	INT	YES	-	Foreign key to bank table
donor_id	INT	YES	-	Foreign key to donor table
donation_id	INT	YES	-	Reference to donation table
blood_group	VARCHAR(5)	YES	-	Blood group donated
donation_date	DATE	YES	-	Actual donation date
expiry_date	DATE	YES	-	Blood expiry date (+42 days)
created_at	TIMESTAMP	YES	CURRENT_TIMESTAMP	Record creation date
Purpose: Store completed donation history for tracking and inventory.

8️⃣ INVENTORY TABLE
Column	Type	Null	Default	Description
id	INT	NO	AUTO_INCREMENT	Primary key, unique ID
bank_id	INT	YES	-	Foreign key to bank table
bloodgroup	VARCHAR(5)	YES	-	Blood group (A+, A-, B+, etc.)
quantity	INT	YES	0	Available units count
last_updated_date	DATE	YES	-	Last inventory update date
created_at	TIMESTAMP	YES	CURRENT_TIMESTAMP	Record creation date
Purpose: Track blood stock availability for each blood bank.

📊 TABLE RELATIONSHIPS
text
admin (independent)
    ↓
bank → bank_admin (FK)
    ↓
inventory (FK)
    ↓
donation (FK) → donor (FK)
    ↓
donation_history (FK)
    ↓
blood_camp (independent)
🔑 Foreign Keys
Table	Foreign Key	References
bank_admin	bank_id	bank(bank_id)
donation	bank_id	bank(bank_id)
donation	donor_id	donor(id)
donation_history	bank_id	bank(bank_id)
donation_history	donor_id	donor(id)
inventory	bank_id	bank(bank_id)
📈 ENUM Values
Column	Possible Values
bloodgroup	A+, A-, B+, B-, AB+, AB-, O+, O-
Action	pending, accepted, rejected
status	pending, approved, completed, rejected
gender	male, female, other
Category	Govt, Private, Charitable
 -->