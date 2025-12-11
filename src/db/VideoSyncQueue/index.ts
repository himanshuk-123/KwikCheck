// import { videoSyncQueueDB } from "../dbs";

// const fetchAllVideoSyncQueueDB = async () => {
//   const results = await videoSyncQueueDB.execAsync(
//     `SELECT * FROM video_sync_queue`
//   );

//   console.log("SQLITE DB RES", results);
//   return results;
// };

// const insertVideoSyncQueueDB = async (leadId: string, videoUri: string) => {
//   const resp = await videoSyncQueueDB.execAsync(
//     `INSERT INTO video_sync_queue (leadId, video_uri) VALUES ("${leadId}", "${videoUri}")`
//   );

//   console.log("INERTING INTO DB RES", resp);
//   return resp;
// };

// export { fetchAllVideoSyncQueueDB, insertVideoSyncQueueDB };
