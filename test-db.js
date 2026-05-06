
const mysql = require('mysql2/promise');

async function test() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'website_db',
  });

  const [rows] = await connection.execute('SELECT * FROM schedules');
  console.log('Schedules:', JSON.stringify(rows, null, 2));
  
  const [doctors] = await connection.execute('SELECT * FROM doctors');
  console.log('Doctors:', JSON.stringify(doctors, null, 2));

  await connection.end();
}

test().catch(console.error);
