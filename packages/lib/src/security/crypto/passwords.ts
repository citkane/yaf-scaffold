/**
 * #### Hashing and other password related utilities
 * uses the <a href="https://github.com/kelektiv/node.bcrypt.js" target="_blank">bcrypt</a> library.
 * 
 * @module
 */

import bcrypt from 'bcrypt';

export default {
	createHashFromPassword,
	validatePasswordFromHash
};
/**
 * Creates a hash from a password string for storage in the user database
 * @param password 
 * @param rounds the number of hashrounds to use. `config.get('security.hash.saltRounds') as number;`
 * @returns hash string
 * 
 * @group Hashing Functions
 */
export function createHashFromPassword(password: string, rounds: number): Promise<string>{
	return bcrypt.hash(password, rounds);
}

/**
 * Validate a hash against a password string
 * @param password 
 * @param hash 
 * @returns
 * 
 * @group Validation Functions
 */
export function validatePasswordFromHash(password: string, hash: string) :Promise<boolean>{
	return bcrypt.compare(password, hash);
}