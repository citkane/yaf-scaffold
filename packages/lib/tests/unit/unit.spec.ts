if (process.env['NODE_ENV'] !== 'test') throw new Error(`Environment is not test. Got: ${process.env['NODE_ENV'] }`);

import path from 'path';
import yaf from 'yaf';
import {assert} from '@yaf/testconfig';

describe('TOOL UTILITY TESTS', function(){
	it('Finds the root install path', function () {
		const installPath = path.join(__dirname, '../../../../');
		const rootPath = yaf.lib.findYafRootDir();
		assert.equal(installPath, rootPath , `did not find the root install directory. Got: ${rootPath}`);
	});	
	it('Errors when the system root folder is reached', function(){
		assert.throws(()=>yaf.lib.findYafRootDir(__dirname, '/'), Error, 'Cannot find the project root folder: \'/\'');
	});
});

require('./security.spec');
require('./persistence.spec');