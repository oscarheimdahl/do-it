import dotenv from 'dotenv';
import mysql from 'mysql2';
dotenv.config();

const dbUrl = process.env.DATABASE_URL as string;
// console.log('Connected to PlanetScale!');

async function q(query: string) {
  console.log(query);
  return await new Promise<{
    err: mysql.QueryError | null;
    res: mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader;
  }>((resolve) => {
    connection.query(query, (err, res) => {
      resolve({ err, res });
    });
  });
}

const connection = mysql.createConnection(dbUrl);
export async function getDaysDoneIt() {
  const res = q('select * from doit');
  return res;
}

export async function setDidIt(date: Date, didit: boolean) {
  console.log(date);
  const sqlDate = new Date(date).toISOString().split('T')[0];
  console.log(sqlDate);
  const res = q(`REPLACE INTO doit (Date, didit) VALUES (DATE '${sqlDate}', ${didit ? 1 : 0})`);
  return res;
}
