const dbPromise = require('./db');

(async () => {
  try {
    const db = await dbPromise;

    console.log('Creating tables...');

    const tableQueries = [
      `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        user_type ENUM('client', 'staff') DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT 0,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) DEFAULT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        country VARCHAR(255) DEFAULT NULL,
        city VARCHAR(255) DEFAULT NULL,
        address VARCHAR(255) DEFAULT NULL
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        date_pack_start DATE NOT NULL,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        sender_office_id INT NOT NULL,
        receiver_office_id INT DEFAULT 0,
        description VARCHAR(255) DEFAULT NULL,
        weight DECIMAL(5,3) NOT NULL,
        status ENUM('pending','in_transit','delivered') DEFAULT 'pending',
        date_delivered DATE DEFAULT NULL
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS offices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        office_name VARCHAR(255) NOT NULL,
        country VARCHAR(255),
        city VARCHAR(255),
        address VARCHAR(255)
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS memo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        dds_tax DOUBLE(5,2) DEFAULT 0.0,
        tax_gr DOUBLE(8,2) DEFAULT 0.0,
        txt_home DOUBLE(8,2) DEFAULT 0.0
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS employee (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) DEFAULT NULL,
        role_id int NOT NULL,
        description VARCHAR(255) DEFAULT NULL,
      )
      `
    ];

    for (const query of tableQueries) {
      await db.query(query);
      console.log('Table created or already exists');
    }

    // 2️⃣ Индекси
    console.log('Creating indexes (if missing)...');

    const indexes = [
      { table: 'users', name: 'idx_users_email', column: 'email' },
      { table: 'users', name: 'idx_users_username', column: 'username' },
      { table: 'customers', name: 'idx_customers_email', column: 'email' },
      { table: 'customers', name: 'idx_customers_user_id', column: 'user_id' },
      { table: 'customers', name: 'idx_customers_city', column: 'city' },
      { table: 'packages', name: 'idx_packages_user_id', column: 'user_id' },
      { table: 'packages', name: 'idx_packages_sender_id', column: 'sender_id' },
      { table: 'packages', name: 'idx_packages_receiver_id', column: 'receiver_id' },
      { table: 'packages', name: 'idx_packages_sender_office_id', column: 'sender_office_id' },
      { table: 'packages', name: 'idx_packages_receiver_office_id', column: 'receiver_office_id' }
    ];

    for (const idx of indexes) {
      const [rows] = await db.query(
        `SHOW INDEX FROM ${idx.table} WHERE Key_name = ?`,
        [idx.name]
      );
      if (rows.length === 0) {
        await db.query(
          `CREATE INDEX ${idx.name} ON ${idx.table} (${idx.column})`
        );
        console.log(`Created index ${idx.name} on ${idx.table}(${idx.column})`);
      } else {
        console.log(`Index ${idx.name} already exists`);
      }
    }

    console.log('All tables and indexes are ready!');
    await db.end();
    console.log('Connection closed');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
