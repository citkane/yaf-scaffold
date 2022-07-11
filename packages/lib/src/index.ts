/**
 * 
 * #### A library of base utilities as pure static functions
 * 
 * @module
 */

import path from 'path';
import * as security from './security';
import * as persistence from './persistence';

const defaultRoot = path.join(__dirname, '../../../');
const defaultRootName = path.basename(defaultRoot);

export default {
	security,
	persistence,
	findYafRootDir
};
export {security};
export {persistence};

/**
 * Finds the root folder of the yaf installation
 * 
 * @param childDirName The directory the function is being called from. 
 * @param rootDirName The name of the root directory to be sought.
 * @returns The file path of the root installation
 */
export function findYafRootDir(childDirName = __dirname, rootDirName = defaultRootName): string {
	if (childDirName === '/') throw Error(`Cannot find the project root folder: '${rootDirName}'`);
	return childDirName.endsWith(`/${rootDirName}/`) ? childDirName : findYafRootDir(path.join(childDirName, '../'), rootDirName);
}



