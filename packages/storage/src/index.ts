import path from 'path';
import yaf from 'yaf';
import { sqlite3Db } from '@yaf/lib/src/persistence';

type storageType = 'sqlite'

export class Storage {
	private ready: boolean;
	private sqlitedb: sqlite3Db;
	private type: storageType;
	private urn: string;
	constructor(type: storageType, urn) {
		this.type = type;
		this.urn = urn;
	}
	
	private getSqliteFile = async (urn) => {
		const yafRoot = yaf.lib.findYafRootDir();
		const storeLocation = yaf.config.get('storage.sqlite.fileStore') as string;
		const sqlitePath = path.join(yafRoot, storeLocation, urn);
		return await yaf.lib.persistence.getSqliteDb(sqlitePath);
	};

	init = async () => {
		switch (this.type) {
		case 'sqlite':
			this.init = async () => {
				await this.getSqliteFile(this.urn);
				this.ready = true;
			};
			break;
		default:
			throw new Error(`Not a valid storage type. Got: ${this.type}`);
		}
	};

	write = async (sql: string, ...args) => {
		if (!this.ready) throw new Error('Storage is not initiated. Use `await new Storage(type, urn).init()`');
		let result;
		switch (this.type) {
		case 'sqlite':
			result = await this.sqlitedb.prepare(sql).run(...args);
			console.log(result);
			break;
		}
		return result;

	};
}

export default {
	Storage
};