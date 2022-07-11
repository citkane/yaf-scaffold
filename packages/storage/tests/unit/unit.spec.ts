if (process.env['NODE_ENV'] !== 'test') throw new Error(`Environment is not test. Got: ${process.env['NODE_ENV'] }`);

import {Storage} from '@yaf/storage';
import {assert} from '@yaf/testconfig';

describe('STORAGE CLASS FUNCTIONS', function(){
	it('creates a new sqlite database', async function(){
		const store = await new Storage('sqlite', 'test.db').init();
		console.log(store);
	});
});