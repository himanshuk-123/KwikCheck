import { deleteLocalFile } from "@src/Utils";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("video_sync_queue.db");

// Function to create table with unique leadId
const createTable = async () => {
  console.log("IN CREATE TABLE");
  await db.withTransactionAsync(async () => {
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS video_sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        leadId TEXT NOT NULL UNIQUE, 
        video_uri TEXT NOT NULL
      );`
    );
  });
};

/* Function to insert or replace data for unique leadId */
const insertVideoSyncQueueDB = async (leadId: string, videoUri: string) => {
  await db.withTransactionAsync(async () => {
    const exists: any = await db.getFirstAsync(
      `SELECT * FROM video_sync_queue WHERE leadId='${leadId}';`
    );

    if (exists) {
      console.log("ALREADY EXISTS", exists.video_uri);
      await deleteLocalFile(exists.video_uri);
    }

    const resp = await db.runAsync(
      `INSERT OR REPLACE INTO video_sync_queue (leadId, video_uri) VALUES ('${leadId}','${videoUri}');`
    );
    console.log("INSERTED", resp);
  });
};

// Function to fetch all data
const fetchAllVideoSyncQueueDB = async () => {
  await db.withTransactionAsync(async () => {
    const result = await db.getAllAsync("SELECT * FROM video_sync_queue;");
    console.log("FETCHED", result);
  });
};

const getDataWithLeadId = async (leadId: string) => {
  //   return await db.withTransactionAsync(async () => {
  const result = await db.getFirstAsync(
    `SELECT * FROM video_sync_queue WHERE leadId='${leadId}';`
  );
  console.log("FETCHED", result);
  return result || null;
  //   });
};

createTable();
export { insertVideoSyncQueueDB, fetchAllVideoSyncQueueDB, getDataWithLeadId };
