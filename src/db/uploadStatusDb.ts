import {
  insertImagesUploadedStatusDBInterface,
} from "@src/@types/insert";
import { deleteLocalFile } from "@src/Utils";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("upload_status.db");

const createTable = async () => {
  try {
    console.log("in create table of uploadStatusDb");
    await db.execAsync(
      `
      CREATE TABLE IF NOT EXISTS images_uploaded_status (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          identifier TEXT NOT NULL UNIQUE,
          leadId TEXT NOT NULL, 
          step TEXT NOT NULL,
          uri TEXT,
          isUploaded INTEGER DEFAULT 0,
          vehicleType TEXT,
          imgUrl TEXT,
          side TEXT,
          regNo TEXT,
          prospectNo TEXT,
          lastValuated TEXT,
          latitude TEXT,
          longitude TEXT
      );
    `
    );

    await db.execAsync(
      `
      CREATE TABLE IF NOT EXISTS leads_valuated (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          identifier TEXT NOT NULL UNIQUE,
          leadId TEXT NOT NULL
      );
    `
    );
  } catch (error) {
    console.warn("createTable error", error);
  }
};

const insertImagesUploadedStatusDB = async ({
  leadUId,
  leadId,
  uri,
  step,
  vehicleType,
  imgUrl,
  side,
  lastValuated,
  regNo,
  prospectNo,
  longitude,
  latitude,
}: insertImagesUploadedStatusDBInterface) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    if (!leadId || !step || !uri) return;

    // check existing row
    const exists: any = await db.getFirstAsync(
      `SELECT * FROM images_uploaded_status WHERE leadId = ? AND step = ?;`,
      [leadId, step]
    );

    if (exists && exists.uri) {
      try {
        await deleteLocalFile(exists.uri);
      } catch (e) {
        console.warn("deleteLocalFile failed for existing uri", e);
      }
    }

    const identifier = `${leadUId}-${step}`;
    await db.runAsync(
      `
      INSERT OR REPLACE INTO images_uploaded_status (
          identifier,
          leadId,
          step,
          uri,
          vehicleType,
          imgUrl,
          side,
          lastValuated,
          regNo,
          prospectNo,
          latitude,
          longitude
       )
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?);
      `,
      [
        identifier,
        leadId,
        step,
        uri,
        vehicleType || "",
        imgUrl || "",
        side || "",
        lastValuated?.length > 0 ? lastValuated : today,
        regNo || "",
        prospectNo || "",
        latitude || "",
        longitude || "",
      ]
    );
  } catch (error) {
    console.error("insertImagesUploadedStatusDB error", error);
    throw error;
  }
};

const markLeadSideAsUploaded = async ({
  leadId,
  step,
  uri,
}: insertImagesUploadedStatusDBInterface) => {
  try {
    const identifier = `${leadId}-${step}`;
    await db.runAsync(
      `
      UPDATE images_uploaded_status 
      SET isUploaded = 1, imgUrl = ?
      WHERE identifier = ?;
      `,
      [uri, identifier]
    );

    const resp = await db.getAllAsync(
      `SELECT identifier, isUploaded FROM images_uploaded_status WHERE leadId = ?;`,
      [leadId]
    );
    return resp;
  } catch (error) {
    console.error("markLeadSideAsUploaded error", error);
    throw error;
  }
};

const getStatusWithLeadId = async (leadId: string) => {
  try {
    const totalRow: any = await db.getFirstAsync(
      `SELECT COUNT(*) AS cnt FROM images_uploaded_status WHERE leadId = ?;`,
      [leadId]
    );
    const uploadedRow: any = await db.getFirstAsync(
      `SELECT COUNT(*) AS cnt FROM images_uploaded_status WHERE leadId = ? AND isUploaded = 1;`,
      [leadId]
    );

    return {
      total: totalRow?.cnt ?? 0,
      uploaded: uploadedRow?.cnt ?? 0,
    };
  } catch (error) {
    console.error("getStatusWithLeadId error", error);
    throw error;
  }
};

const getStatusWithoutLeadId = () => {
  try {
    const allData = db.getAllSync(
      `
      SELECT 
        leadId,
        regNo,
        prospectNo,
        vehicleType,
        uri,
        MAX(lastValuated) AS lastValuated,
        COUNT(*) AS total_count,
        SUM(CASE WHEN isUploaded = 1 THEN 1 ELSE 0 END) AS uploaded_count
      FROM 
        images_uploaded_status
      GROUP BY 
        leadId, regNo, prospectNo;
    `
    );

    return {
      total: allData.length,
      response: allData,
    };
  } catch (error) {
    console.error("getStatusWithoutLeadId error", error);
    throw error;
  }
};

const getClickedImagesWithLeadId = async (leadId: string) => {
  try {
    const allData = await db.getAllAsync(
      `SELECT * FROM images_uploaded_status WHERE leadId = ? AND isUploaded = 1;`,
      [leadId]
    );

    const dataObject = allData.reduce(
      (acc: Record<string, string>, row: { step: string; imgUrl: string }) => {
        acc[row.step] = row.imgUrl;
        return acc;
      },
      {}
    );

    return dataObject;
  } catch (error) {
    console.error("getClickedImagesWithLeadId error", error);
    throw error;
  }
};

const getValuatedLeads = () => {
  try {
    const allData = db.getAllSync(`SELECT identifier FROM leads_valuated;`);
    return allData;
  } catch (error) {
    console.error("getValuatedLeads error", error);
    throw error;
  }
};

const insertLeadsValuated = async ({ leadId }: { leadId: string }) => {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO leads_valuated (identifier, leadId) VALUES (?, ?);`,
      [leadId, leadId]
    );
  } catch (error) {
    console.error("insertLeadsValuated error", error);
    throw error;
  }
};

const getNotUploadedImageWithLeadId = ({ leadId }: { leadId: string }) => {
  try {
    return db.getAllSync(
      `SELECT * FROM images_uploaded_status WHERE leadId = ? AND isUploaded = 0;`,
      [leadId]
    );
  } catch (error) {
    console.error("getNotUploadedImageWithLeadId error", error);
    throw error;
  }
};

const clearDB = async () => {
  try {
    await db.execAsync(`DELETE FROM images_uploaded_status;`);
  } catch (error) {
    console.error("clearDB error", error);
    throw error;
  }
};

createTable().catch((e) => console.warn("createTable error", e));

export {
  insertImagesUploadedStatusDB,
  markLeadSideAsUploaded,
  getStatusWithLeadId,
  getStatusWithoutLeadId,
  getValuatedLeads,
  insertLeadsValuated,
  getClickedImagesWithLeadId,
  clearDB,
  getNotUploadedImageWithLeadId,
};