import yaf from 'yaf';
import { assert } from '@yaf/testconfig';

const algorithm = yaf.config.get('security.keys.algorithm') as string;
const modulusLength = yaf.config.get('security.keys.modulusLength') as number;

let privateKey, publicKey, keyPair, privatePem, publicPem;
describe('Asymmetrical Key functions', function () {
	it('creates keys', async function () {
		keyPair = await yaf.lib.security.crypto.keys.generateKeyPair(algorithm, modulusLength);
		assert.hasAllKeys(keyPair, ['privateKey', 'publicKey'], 'invalid KeyPair created');

		({ privateKey, publicKey } = keyPair);

		assert.isObject(privateKey, 'invalid private key object');
		assert.equal(privateKey.type, 'private', 'private key is not private');
		assert.isObject(publicKey, 'invalid public key object');
		assert.equal(publicKey.type, 'public', 'public key is not public');
		assert.eventually;
	});
	it('errors on incorrect key algorithm', async function(){
		return assert.isRejected(yaf.lib.security.crypto.keys.generateKeyPair('foo', modulusLength), Error, 'The argument \'type\' must be a supported key type. Received \'foo\'');
	});

	it('converts keys to PEM', function () {
		assert.isString((() => privatePem = yaf.lib.security.crypto.keys.keyToPEM(privateKey))());
		assert.isString((() => publicPem = yaf.lib.security.crypto.keys.keyToPEM(publicKey))());
		assert.isTrue(privatePem.startsWith('-----BEGIN PRIVATE KEY-----\n'), 'invalid private PEM created');
		assert.isTrue(publicPem.startsWith('-----BEGIN PUBLIC KEY-----\n'), 'invalid public PEM created');


	});
	it('errors when converting public PEM to private key', function () {
		assert.throws(
			() => yaf.lib.security.crypto.keys.pemToPrivateKey(publicPem),
			Error,
			'Not a valid PRIVATE PEM string'
		);
	});
	it('converts PEM to keys', function () {
		assert.isTrue(yaf.lib.security.crypto.keys.pemToPublicKey(publicPem).equals(publicKey), 'invalid public key returned from pem');
		assert.isTrue(yaf.lib.security.crypto.keys.pemToPrivateKey(privatePem).equals(privateKey), 'invalid private key returned from pem');
	});
});