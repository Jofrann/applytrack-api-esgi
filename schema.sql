CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(255),
  postal_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_id INT,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  job_title VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE interactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_id INT,
  date DATE,
  type VARCHAR(255),
  description TEXT,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
