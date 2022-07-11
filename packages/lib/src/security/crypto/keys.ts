/**
 * #### The base cryptographic utilities for yaf.
 * This should be limited to use of the native
 * <a href="https://nodejs.org/dist/latest-v16.x/docs/api/crypto.html" target="_blank">node:crypto</a>
 * utils.
 * 
 * @module
 */

process.env['OPENSSL_CONF']='/dev/null'; /* Workaround for https://github.com/nodejs/node/discussions/43184 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');
import type {KeyObject} from 'crypto';

/** The default NodeJS 'KeyOject' with yaf specific allowed type methods */
export type keyObject = KeyObject & {
	equals: (KeyObject: KeyObject) => boolean;
};
export type publicPEM = `-----BEGIN PUBLIC${string}}`;
export type privatePEM = `-----BEGIN PRIVATE${string}}`;

export type KeyPair = {
	publicKey: keyObject,
	privateKey: keyObject
}

export default {
	generateKeyPair,
	keyToPEM,
	pemToPublicKey,
	pemToPrivateKey
};

/**
 * Generate a new Public / Private key pair
 * 
 * @param alg The algorithm to use. `config.get('security.keys.algorithm') as string;`
 * @param len The modulus length to use. `config.get('security.keys.modulusLength') as number;`
 * @returns A new public / private key pair in PEM format
 * 
 * @todo Creat types for acceptable alg and len
 * 
 * @group Key Generation
 */
export function generateKeyPair(alg: string, len: number): Promise<KeyPair> {
	return new Promise((resolve, reject) => {
		crypto.generateKeyPair(
			alg,
			{ modulusLength: len },
			(err: Error, publicKey: keyObject, privateKey: keyObject) => {
				return err? reject(err) : resolve({ publicKey, privateKey });
			});
	});
}

/**
 * Converts a key to a PEM string
 * @param key A public or private key object
 * @returns A PEM string
 * 
 * @group Key Conversion
 */
export function keyToPEM(key: keyObject): publicPEM | privatePEM | null {
	if(key.type !== 'private' && key.type !== 'public') throw Error(`Only public / private keys can be converted to PEM. Received type: ${key.type}`);
	const type = key.type === 'private' ? 'pkcs8' : 'spki';
	return key.export({ type, format: 'pem' }) as publicPEM;
}

/**
 * Converts a PEM encoded key string into a public key object
 * @param PEM the public key PEM string
 * @returns a public key
 * 
 * @group Key Conversion
 */
export function pemToPublicKey(PEM: publicPEM | privatePEM): keyObject{
	return crypto.createPublicKey({ key: PEM, format: 'pem' });
}

/**
 * Converts a PEM encoded key string into a privatekey object
 * @param privatePEM 
 * @returns a private key
 * 
 * @group Key Conversion
 */
export function pemToPrivateKey(privatePEM: privatePEM): keyObject {
	if (privatePEM.startsWith('-----BEGIN PRIVATE')) {
		return crypto.createPrivateKey({ key: privatePEM, format: 'pem' });
	} else {
		throw new Error('Not a valid PRIVATE PEM string');
	}
}

