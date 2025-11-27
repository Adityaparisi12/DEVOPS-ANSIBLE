# MySQL Database Migration Guide

## Overview
This guide provides step-by-step instructions for setting up MySQL database for your Portfolio Backend application after migrating from MongoDB.

## What Was Changed

### 1. Dependencies (pom.xml)
- **Removed**: `spring-boot-starter-data-mongodb`
- **Added**: 
  - `mysql-connector-j` (MySQL JDBC Driver)
  - `spring-boot-starter-data-jpa` (Spring Data JPA)

### 2. Configuration (application.properties)
- **Removed**: MongoDB URI and configuration
- **Added**: MySQL datasource configuration with JPA/Hibernate settings

### 3. Model Classes
All model classes were updated:
- **Removed MongoDB annotations**: `@Document`, MongoDB's `@Id`, `@Field`
- **Added JPA annotations**:
  - `@Entity` - Marks class as JPA entity
  - `@Table` - Specifies table name
  - `@Id` - Marks primary key field
  - `@GeneratedValue(strategy = GenerationType.IDENTITY)` - Auto-increment ID
  - `@Column` - Defines column properties
  - `@Temporal` - For Date fields
- **Changed ID type**: From `String` to `Long` for all entities

### 4. Repository Interfaces
- **Changed**: `MongoRepository` → `JpaRepository`
- **Updated**: ID type parameter from `String` to `Long`

### 5. Service and Controller Classes
- **Updated**: All ID parameters from `String` to `Long`
- **Fixed**: Type compatibility issues throughout the codebase

## MySQL Installation and Setup

### Step 1: Install MySQL Server

#### On Windows:
1. Download MySQL Installer from [MySQL Official Website](https://dev.mysql.com/downloads/installer/)
2. Run the installer and choose "Developer Default" setup
3. During installation:
   - Set root password as `root` (or update `application.properties` accordingly)
   - Keep default port `3306`
   - Configure MySQL as Windows Service for auto-start

#### On macOS:
```bash
# Using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation
mysql_secure_installation
```

#### On Linux (Ubuntu/Debian):
```bash
# Update package index
sudo apt update

# Install MySQL Server
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql

# Enable MySQL to start on boot
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation
```

### Step 2: Create Database

1. **Open MySQL Command Line Client or Terminal:**

```bash
mysql -u root -p
```

2. **Create the database:**

```sql
CREATE DATABASE pfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Create a dedicated user (Optional but recommended for production):**

```sql
CREATE USER 'pfolio_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON pfolio.* TO 'pfolio_user'@'localhost';
FLUSH PRIVILEGES;
```

4. **Verify database creation:**

```sql
SHOW DATABASES;
USE pfolio;
```

5. **Exit MySQL:**

```sql
EXIT;
```

### Step 3: Configure Application Properties

Your `application.properties` is already configured with:

```properties
# MySQL DataSource Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/pfolio
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA & Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

**If you created a dedicated user**, update these lines:
```properties
spring.datasource.username=pfolio_user
spring.datasource.password=your_secure_password
```

### Step 4: Understanding JPA Configuration

#### `spring.jpa.hibernate.ddl-auto=update`
This setting automatically creates/updates database tables based on your entity classes:
- `create`: Drops existing tables and creates new ones (DATA LOSS!)
- `create-drop`: Creates tables, drops them when application stops
- `update`: Updates schema, preserves existing data (RECOMMENDED for development)
- `validate`: Only validates schema, doesn't make changes
- `none`: Disables automatic schema management

**For Production**: Use `validate` or `none` and manage schema with migration tools like Flyway or Liquibase.

## Running the Application

### Step 5: Start MySQL Service

Make sure MySQL is running:

**Windows:**
```powershell
# Check if MySQL service is running
Get-Service MySQL*

# Start MySQL if not running
Start-Service MySQL80  # or MySQL57 depending on version
```

**macOS/Linux:**
```bash
# Check MySQL status
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql
```

### Step 6: Run Your Application

```bash
# Using Maven wrapper
./mvnw spring-boot:run

# Or if you built the JAR
java -jar target/PfolioBackend-0.0.1-SNAPSHOT.jar
```

### Step 7: Verify Tables Created

After running the application for the first time, check if tables were created:

```sql
mysql -u root -p
USE pfolio;
SHOW TABLES;
```

You should see these tables:
- `admin`
- `certifications`
- `contact`
- `messages`
- `projects`
- `skills`

## Data Migration (Optional)

If you have existing data in MongoDB that you want to migrate:

### Option 1: Manual Export/Import
1. Export data from MongoDB to JSON
2. Write a migration script to insert into MySQL
3. Use Spring Boot's `CommandLineRunner` for one-time data import

### Option 2: Keep Both Temporarily
1. Run both databases temporarily
2. Create a migration service to copy data
3. Verify data integrity before switching completely

## Troubleshooting

### Common Issues:

#### 1. Connection Refused
```
Error: java.sql.SQLNonTransientConnectionException: Could not create connection to database server
```
**Solution:**
- Ensure MySQL is running
- Check port 3306 is not blocked by firewall
- Verify credentials in `application.properties`

#### 2. Authentication Failed
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:**
- Verify username and password
- Reset MySQL root password if needed:
  ```bash
  mysql -u root -p
  ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
  ```

#### 3. Database Does Not Exist
```
Error: Unknown database 'pfolio'
```
**Solution:**
- Create the database manually (see Step 2)

#### 4. Table Already Exists
```
Error: Table 'projects' already exists
```
**Solution:**
- Either drop existing tables or change `spring.jpa.hibernate.ddl-auto` to `validate`

#### 5. Time Zone Issues
```
Error: The server time zone value 'XXX' is unrecognized
```
**Solution:**
Update datasource URL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pfolio?useTimezone=true&serverTimezone=UTC
```

## Testing Your APIs

After successful setup, test your endpoints:

### Using cURL or Postman:

```bash
# Test GET all projects
curl http://localhost:2420/projects/viewAll

# Test POST new project (with form-data)
# Use Postman for multipart/form-data requests

# Test project count
curl http://localhost:2420/projects/countprojects
```

## Performance Optimization

### Recommended MySQL Configuration

Add these settings to MySQL configuration file (`my.cnf` or `my.ini`):

```ini
[mysqld]
# Connection Settings
max_connections = 200

# Buffer Pool Size (set to 70-80% of available RAM for dedicated MySQL server)
innodb_buffer_pool_size = 1G

# Log Settings
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql-slow.log
long_query_time = 2

# Character Set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

## Security Best Practices

1. **Never use 'root' in production**
   - Create dedicated database user with limited privileges

2. **Use environment variables for credentials**
   ```properties
   spring.datasource.username=${DB_USERNAME:root}
   spring.datasource.password=${DB_PASSWORD:root}
   ```

3. **Enable SSL for database connections** (Production)
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/pfolio?useSSL=true
   ```

4. **Regular backups**
   ```bash
   # Backup database
   mysqldump -u root -p pfolio > pfolio_backup_$(date +%Y%m%d).sql
   
   # Restore database
   mysql -u root -p pfolio < pfolio_backup_20241127.sql
   ```

## Monitoring

### Check Database Size
```sql
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'pfolio'
GROUP BY table_schema;
```

### Check Table Sizes
```sql
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'pfolio'
ORDER BY (data_length + index_length) DESC;
```

## Summary

Your Portfolio Backend application has been successfully migrated from MongoDB to MySQL with the following benefits:

✅ **ACID Compliance**: Better data integrity and transaction support  
✅ **SQL Queries**: More powerful querying capabilities  
✅ **Better Joins**: Efficient relational data operations  
✅ **Mature Ecosystem**: Extensive tooling and support  
✅ **Auto-increment IDs**: Simplified ID management with `Long` type  

The application is now ready to run with MySQL. All CRUD operations remain the same from the API perspective, making this a seamless backend migration.

## Next Steps

1. ✅ Install MySQL
2. ✅ Create database `pfolio`
3. ✅ Update `application.properties` if needed
4. ✅ Run the application
5. ✅ Verify tables are created
6. ✅ Test your APIs
7. 📝 Migrate existing data (if any)
8. 🚀 Deploy to production

---

**Need Help?** Check the troubleshooting section or refer to:
- [Spring Data JPA Documentation](https://spring.io/projects/spring-data-jpa)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Hibernate Documentation](https://hibernate.org/orm/documentation/)
