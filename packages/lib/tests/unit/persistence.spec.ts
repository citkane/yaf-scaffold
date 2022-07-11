
import path from 'path';
import fs from 'fs-extra';
import yaf from 'yaf';
import { assert } from '@yaf/testconfig';

const testTempDir = path.join(yaf.lib.findYafRootDir(), 'tests/tmp');
const testDBfile = path.join(testTempDir, 'tests/tmp/test.db');
let db;

describe('PERSISTENCE UTILITY TESTS', async function(){
	describe('sqlite database', function(){
		before(function(){
			fs.removeSync(testTempDir);
			fs.ensureFileSync(testDBfile);
		});
		after(function(){
			fs.removeSync(testTempDir);
		});
		it('opens a sqlite3 database from file', async function(){
			db = await yaf.lib.persistence.getSqliteDb(testDBfile);
			assert.hasAllDeepKeys(db, ['inTransaction', 'memory', 'name', 'open', 'readonly']);
		});
		it('writes to and retrieves from the db', async function(){
			const table = await db.prepare(`CREATE TABLE foo (
				val INTEGER PRIMARY KEY NOT NULL,
				user TEXT NOT NULL
			)`).run();
			assert.hasAllKeys(table, ['changes', 'lastInsertRowid'], 'did not create database table');
			const row = await db.prepare('INSERT INTO foo VALUES (?, ?)').run(1, 'Fred');
			assert.hasAllKeys(row, ['changes', 'lastInsertRowid'], 'did not create database row');
			const result = await db.prepare('SELECT * from foo LIMIT 1').all();
			assert.isArray(result, 'did not return a result array');
			assert.isObject(result[0], 'did not return a result object');
			assert.equal(result[0].user, 'Fred', 'did not retrieve correct data');
		});
	});
});