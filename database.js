import * as SQLite from 'expo-sqlite';
import { use } from 'react';

//database for the app, still need to figure out how to implement this into the app. 
const db = SQLite.openDatabase('terrierShowdown.db');

export function initDB() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      //create users table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
           id         INTEGER PRIMARY KEY AUTOINCREMENT,
           email      TEXT    NOT NULL UNIQUE,
           first_name TEXT,
           last_name  TEXT
         );`,
        [],
        () => {
          //create media table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS media (
               id            INTEGER PRIMARY KEY AUTOINCREMENT,
               user_id       INTEGER NOT NULL,
               workout_day   TEXT,
               type          TEXT    NOT NULL,
               uri           TEXT    NOT NULL UNIQUE,
               thumbnail_uri TEXT,
               created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now')),
               FOREIGN KEY (user_id) REFERENCES users(id)
             );`,
            [],
            () => resolve(),                    // both tables are ready
            (_t, error) => {                    // media table failed
              console.error('Failed to create media table:', error);
              reject(error);
              return false;
            }
          );
        },
        (_t, error) => {                            // users table failed
          console.error('Failed to create users table:', error);
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

//functions below are media related helper functions

//this functions actually stores the media in the database
export function addMedia(user_id, workout_day, type, uri, thumbnail_uri=null) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO media,
          (user_id, workout_day, type, uri, thumbnail_uri) VALUES (?, ?, ?, ?, ?)`,
        [user_id, workout_day, type, uri, thumbnail_uri],
        (_t, {insertId}) => resolve(insertId),
        (_t, err) => { reject(err); return false; }
      );
    });
  });
}
//this function fetches all media for a given user
export function fetchMediaForDay(userId, workout_day) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM media
        WHERE user_id = ? AND workout_day = ?;`,
        [userId, workout_day],
        (_t, { rows }) => resolve(rows._array),
        (_t, err) => { reject(err); return false; }
      );
    });
  });
}