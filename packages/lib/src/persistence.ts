//import sqlite3 from 'sqlite3';
//import { open, Database } from 'sqlite';

import Db, { Database } from 'better-sqlite3';


export type sqlite3Db = Database //Database<sqlite3.Database, sqlite3.Statement>
export default {
	getSqliteDb
};

export async function getSqliteDb(filename: string): Promise<sqlite3Db>  {
	return new Db(filename);
	/*
	return open({
		filename,
		driver: sqlite3.Database
	});
	*/
}