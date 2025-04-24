import * as SQLite from 'expo-sqlite';

//database for the app, still need to figure out how to implement this into the app. 
const db = SQLite.openDatabase('terrierShowdown.db');

export function initDB() {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL UNIQUE,
                    first_name TEXT,
                    last_name TEXT,
                )`,
                [],
                () => resolve(),
                (_, error) => {
                    console.error('Failed to create user table:', error);
                    reject(error);
                    return false;
                }
            );
        });
    });
}

export function addUser(email, first_name, last_name) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO users (email, first_name, last_name) VALUES (?, ?, ?)',
                [email, first_name, last_name],
                (_tx, result) => resolve(result.insertId), (_tx, error) =>  {
                    console.error('Failed to add user:', error);
                    reject(error);
                    return false;
                }
            );
        });
    });
}

export function getUserById(id) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM users WHERE id = ?;`,
          [id],
          (_tx, { rows }) => resolve(rows._array[0] || null),
          (_tx, err) => {
            console.error('Failed to fetch user by ID:', err);
            reject(err);
            return false;
          }
        );
      });
    });
  }
  
  export function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM users WHERE email = ?;`,
          [email],
          (_tx, { rows }) => resolve(rows._array[0] || null),
          (_tx, err) => {
            console.error('Failed to fetch user by email:', err);
            reject(err);
            return false;
          }
        );
      });
    });
  }