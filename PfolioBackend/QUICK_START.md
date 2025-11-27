# Quick Start Guide - MySQL Setup

## 🚀 Get Your Application Running in 5 Minutes!

### Prerequisites Checklist
- [ ] Java 21 installed
- [ ] Maven installed (or use ./mvnw)
- [ ] MySQL Server installed
- [ ] Git (optional, for version control)

---

## Step 1: Install MySQL (Choose Your Platform)

### Windows
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run installer → Choose "Developer Default"
3. Set root password: `root` (or remember your password)
4. Complete installation

**Verify Installation:**
```powershell
mysql --version
Get-Service MySQL80  # Should show "Running"
```

### macOS
```bash
# Install using Homebrew
brew install mysql

# Start MySQL
brew services start mysql

# Secure installation (optional)
mysql_secure_installation
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql  # Auto-start on boot
```

---

## Step 2: Create Database (2 minutes)

### Open MySQL Terminal:
```bash
# Windows (MySQL Command Line Client)
mysql -u root -p

# macOS/Linux
mysql -u root -p
```

### Run These Commands:
```sql
-- Create database
CREATE DATABASE pfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify it's created
SHOW DATABASES;

-- Exit
EXIT;
```

**Done!** ✅ Your database is ready.

---

## Step 3: Configure Application (30 seconds)

Open: `src/main/resources/application.properties`

**If you used different credentials:**
```properties
# Update these lines only if needed
spring.datasource.username=root
spring.datasource.password=root  # Change to your password
```

**That's it!** The file is already configured for MySQL.

---

## Step 4: Run Your Application (1 minute)

### Option A: Using Maven Wrapper (Recommended)
```bash
# Navigate to project directory
cd d:\LaxmanPersonal\DEVOPSPROJECT\PfolioBackend

# Run application
./mvnw spring-boot:run
```

### Option B: Using IDE
1. Open project in IntelliJ IDEA / Eclipse / VS Code
2. Right-click on `PfolioBackendApplication.java`
3. Select "Run" or "Debug"

### Expected Output:
```
Started PfolioBackendApplication in X seconds
Tomcat started on port(s): 2420
```

**Success!** 🎉 Your application is running!

---

## Step 5: Verify Everything Works (1 minute)

### Check Database Tables
```sql
mysql -u root -p
USE pfolio;
SHOW TABLES;
```

**You should see:**
- admin
- certifications  
- contact
- messages
- projects
- skills

### Test API Endpoints

**In Browser or Postman:**
```
http://localhost:2420/projects/viewAll
http://localhost:2420/projects/countprojects
http://localhost:2420/certifications/viewAll
http://localhost:2420/contacts/all
```

**Using cURL:**
```bash
curl http://localhost:2420/projects/viewAll
curl http://localhost:2420/projects/countprojects
```

**If you get JSON response:** ✅ Everything is working!

---

## 🎯 Common Commands

### Start MySQL Service
```bash
# Windows
Start-Service MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### Stop Application
Press `Ctrl + C` in terminal running the application

### Rebuild Application
```bash
./mvnw clean install
```

### View Application Logs
Check terminal output or:
```bash
tail -f logs/spring.log  # If logging to file
```

---

## ⚠️ Troubleshooting

### Problem: "Can't connect to MySQL server"
**Solution:**
```bash
# Check if MySQL is running
# Windows:
Get-Service MySQL80

# macOS/Linux:
sudo systemctl status mysql
```

### Problem: "Access denied for user 'root'@'localhost'"
**Solution:**
Update password in `application.properties`:
```properties
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

### Problem: "Unknown database 'pfolio'"
**Solution:**
```sql
mysql -u root -p
CREATE DATABASE pfolio;
```

### Problem: Port 2420 already in use
**Solution:**
Change port in `application.properties`:
```properties
server.port=8080  # Or any available port
```

### Problem: Application starts but no tables
**Solution:**
Check `application.properties` has:
```properties
spring.jpa.hibernate.ddl-auto=update
```

---

## 📊 Quick Database Inspection

### View All Data in a Table
```sql
USE pfolio;
SELECT * FROM projects;
SELECT * FROM skills;
```

### Check Table Structure
```sql
DESCRIBE projects;
DESCRIBE certifications;
```

### Count Records
```sql
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM skills;
```

---

## 🔄 Add Sample Data (Optional)

```sql
USE pfolio;

-- Add a test project
INSERT INTO projects (title, description, category, technologies, gitlink)
VALUES ('Test Project', 'A sample project', 'Web', 'Java, Spring Boot', 'https://github.com/test');

-- Add a test skill
INSERT INTO skills (skillname, category, description)
VALUES ('Java', 'Backend', 'Programming language');

-- Verify
SELECT * FROM projects;
SELECT * FROM skills;
```

---

## 📱 API Testing with Postman

### Import This Collection:
Create a new Postman collection with these requests:

**1. Get All Projects**
- Method: GET
- URL: `http://localhost:2420/projects/viewAll`

**2. Add Project**
- Method: POST
- URL: `http://localhost:2420/projects/add`
- Body: form-data
  - project: (raw JSON)
    ```json
    {
      "title": "My Portfolio",
      "description": "Personal portfolio website",
      "category": "Web",
      "technologies": "React, Spring Boot"
    }
    ```
  - image: (file)

**3. Update Project**
- Method: PUT
- URL: `http://localhost:2420/projects/update/1`
- Body: raw JSON
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description"
  }
  ```

**4. Delete Project**
- Method: DELETE
- URL: `http://localhost:2420/projects/del/1`

---

## 🎓 Next Steps

Now that your application is running:

1. **Add Initial Data**: Use SQL INSERT statements or your API
2. **Test All Endpoints**: Verify CRUD operations work
3. **Connect Frontend**: Update your React/Angular app to use new API
4. **Setup Backup**: Configure MySQL backup strategy
5. **Deploy**: Prepare for production deployment

---

## 📚 Quick Reference

### Project URLs
- Application: `http://localhost:2420`
- H2 Console: Not available (using MySQL)
- MySQL: `localhost:3306`

### Default Credentials
- MySQL User: `root`
- MySQL Password: `root` (as configured)
- Database: `pfolio`

### Important Files
- Configuration: `src/main/resources/application.properties`
- Main Class: `src/main/java/com/laxman/portfolio/PfolioBackendApplication.java`
- Migration Guide: `MYSQL_SETUP_GUIDE.md`
- Summary: `MIGRATION_SUMMARY.md`

### Maven Commands
```bash
./mvnw clean                    # Clean build files
./mvnw compile                  # Compile project
./mvnw test                     # Run tests
./mvnw spring-boot:run         # Run application
./mvnw clean install           # Build JAR file
```

---

## ✅ Verification Checklist

Before considering setup complete:

- [ ] MySQL server installed and running
- [ ] Database `pfolio` created
- [ ] Application starts without errors
- [ ] All 6 tables created automatically
- [ ] Can access API at http://localhost:2420
- [ ] At least one API endpoint tested successfully
- [ ] Can insert and retrieve data

---

## 🆘 Need More Help?

1. **Detailed Setup**: See `MYSQL_SETUP_GUIDE.md`
2. **Migration Details**: See `MIGRATION_SUMMARY.md`
3. **Spring Docs**: https://spring.io/guides/gs/accessing-data-jpa/
4. **MySQL Docs**: https://dev.mysql.com/doc/

---

**Congratulations!** 🎊 

Your Portfolio Backend is now running with MySQL!

**Status:** ✅ MongoDB → MySQL migration complete  
**Database:** MySQL 8.0+ with JPA/Hibernate  
**API:** REST endpoints active on port 2420  
**Tables:** Auto-created and ready to use  

Start building your portfolio! 🚀
