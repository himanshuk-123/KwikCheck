// import * as SQLite from 'expo-sqlite';
// import * as fs from 'expo-file-system';


// const databaseName = process.env.EXPO_PUBLIC_DB_NAME || 'kwik_check_synchronizer.db';

// const db = SQLite.openDatabase(databaseName);

// const init = async () => {
// 	const readOnly = true;
// 	try {
// 		await db.transactionAsync(async (tx) => {

// 			const result = await tx.executeSqlAsync(
// 				'SELECT * FROM sync_queue',
// 				[]
// 			);
// 			console.log('Count:', JSON.stringify(result, undefined, 2));

// 		}, readOnly);
// 		// const insertResponse = await db.transactionAsync(async (tx) => {
// 		// 	try {

// 		// 		const res = await tx.executeSqlAsync("INSERT INTO sync_queue (sync_images2) VALUES ('[data:image/jpg;base64,skdhakhsdjkasjdhakhdakshdkasdhkahdskhaksdkashd]')", []);
// 		// 		console.log(res, "HERE");
// 		// 	} catch (error) {
// 		// 		console.log(error);
// 		// 	}
// 		// })
// 		// console.log(insertResponse, 'gherer');

// 	} catch (error) {
// 		// @ts-ignore
// 		if (error?.message.includes("no such table: sync_queue")) {
// 			await db.transactionAsync(async (tx) => {
// 				const result = await tx.executeSqlAsync(
// 					`CREATE TABLE sync_queue (
// 						id INTEGER PRIMARY KEY AUTOINCREMENT,
// 						sync_images2 TEXT NOT NULL
// 					);`,
// 					[]


// 				);
// 				console.log("Result is ", result);
// 			})
// 		}

// 		console.log(error);
// 	}
// };

// const storeImage = async (base64String: string) => {
// 	try {
// 		console.log('store img', base64String.length);
// 		await db.transactionAsync(async (tx) => {
// 			const result = await tx.executeSqlAsync('INSERT INTO images (base64) VALUES (?);', [base64String],);
// 			console.log('Image saved:', result.insertId);

// 			// return retrieveImages();
// 		});
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// const retrieveImages = async () => {
// 	try {

// 		return await db.transactionAsync(async (tx) => {
// 			const result = await tx.executeSqlAsync('SELECT * FROM images;', []);
// 			console.log(result.insertId);
// 		});
// 	} catch (error) {
// 		console.log(error, 'in retireving images');
// 	}
// };

// export { init, storeImage, retrieveImages };


import * as SQLite from 'expo-sqlite';
import { FullPageLoader } from '../Utils';

const useDBServices = () => {
	const databaseName = process.env.EXPO_PUBLIC_DB_NAME || 'kwik_check_synchronizer.db';
	const db = SQLite.openDatabase(databaseName);

	const initDB = async () => {
		try {
			await db.transactionAsync(async (tx) => {
				const result = await tx.executeSqlAsync(
					`CREATE TABLE IF NOT EXISTS sync_images2  (id INTEGER PRIMARY KEY AUTOINCREMENT, img_url TEXT NOT NULL);`,
					[]
				);
				console.log("Result is ", result);
			});
		} catch (error) {
			console.log(error);
		}
	}

	const storeImgUrlToDB = async (base64String: string) => {
		try {
			await initDB();
			await db.transactionAsync(async (tx) => {
				const result = await tx.executeSqlAsync('INSERT INTO sync_images2 (img_url) VALUES (?);', [base64String],);
				console.log('Image saved:', result.insertId);
			});
		} catch (error) {
			console.log(error);
		}
	}

	const retrieveImages = async (onSuccess?: any) => {
		try {
			FullPageLoader.open({
				label: 'Retrieving images...'
			})
			const results = await db.transactionAsync(async (tx) => {
				const data = await tx.executeSqlAsync('SELECT * FROM sync_images2;', []);
				console.log('Number of Images:', data.rows); // Check for data length

				onSuccess?.(data.rows);
			});
			return results;
		} catch (error) {
			console.log(error, 'in retrieving images');
		} finally {
			FullPageLoader.close();
		}
	}

	return {
		initDB,
		storeImgUrlToDB,
		retrieveImages
	}
}

export default useDBServices;

// const init = async () => {
// 	try {
// 		await db.transactionAsync(async (tx) => {

// 			const result = await tx.executeSqlAsync(
// 				'SELECT * FROM sync_queue;',
// 				[]
// 			);
// 			console.log('Count:', JSON.stringify(result, undefined, 2));

// 		}, false);

// 		// Check for sync_images2 table existence
// 		await db.transactionAsync(async (tx) => {
// 			const result = await tx.executeSqlAsync(
// 				`SELECT name FROM sqlite_master WHERE type='table' AND name='sync_images2'`,
// 				[]
// 			);
// 			if (result.rows.length === 0) {
// 				await tx.executeSqlAsync(
// 					`CREATE TABLE sync_images2 (
//                         id INTEGER PRIMARY KEY AUTOINCREMENT,
//                         sync_images2 TEXT NOT NULL
//                     );`,
// 					[]
// 				);
// 				console.log("sync_images2 table created");
// 			}
// 		});
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// const storeImage = async (base64String: string) => {
// 	console.log('store img', base64String.length);
// 	try {
// 		await db.transactionAsync(async (tx) => {
// 			const result = await tx.executeSqlAsync('INSERT INTO sync_images2 (sync_images2) VALUES (?);', [base64String],);
// 			console.log('Image saved:', result.insertId);
// 		});
// 	} catch (error: any) {
// 		console.log(error);
// 		console.log(error.message.includes('sync_images2'));

// 		if (error?.message.includes("no such table: sync_images2")) {
// 			await db.transactionAsync(async (tx) => {
// 				const result = await tx.executeSqlAsync(
// 					`CREATE TABLE sync_images2 (
// 						id INTEGER PRIMARY KEY AUTOINCREMENT,
// 						sync_images2 TEXT NOT NULL
// 					);`,
// 					[]

// 				);
// 				console.log("Result is ", result);
// 			})

// 		}
// 	}
// };

// const retrieveImages = async () => {
// 	try {
// 		const results = await db.transactionAsync(async (tx) => {
// 			const data = await tx.executeSqlAsync('SELECT * FROM sync_images2;', []);
// 			console.log('Number of Images:', data.rows.length); // Check for data length
// 			// return data;
// 		});
// 		return results;
// 	} catch (error) {
// 		console.log(error, 'in retrieving images');
// 	}
// };


// export { init, storeImage, retrieveImages };
