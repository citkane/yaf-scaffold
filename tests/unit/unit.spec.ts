if (process.env['NODE_ENV'] !== 'test') throw new Error(`Environment is not test. Got: ${process.env['NODE_ENV'] }`);

import yaf from 'yaf';
import { assert } from '@yaf/testconfig';

describe('YAF unit testing', function(){
	describe('CONFIGURATION', function () {		
		it('The default configuration has loaded and is in test environment', function () {
			assert.exists(yaf.config, 'config does not exist');
			assert.isObject(yaf.config, 'config is not an object');
			assert.equal(yaf.config.get('environment'), 'test', 'not in testing environment');
		});
	});
	require('@yaf/lib/tests/unit/unit.spec');
});