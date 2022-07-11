/**
 * [[include:yaf.md]]
 * @module
 * */

import path from 'path';
import * as lib from '@yaf/lib';
import * as storage from '@yaf/storage';

process.env['NODE_CONFIG_DIR'] = path.join(lib.findYafRootDir(__dirname), 'configs');
import theConfig from 'config';

export {lib};
export {storage};
export const config = theConfig;

/**@hidden */
export default { 
	lib,
	storage,
	config
};