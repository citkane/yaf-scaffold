/**
 * #### The base Json Web Token (JWT) utilities for yaf.
 * This should be limited to usage of the
 * <a href="https://github.com/panva/jose" target="_blank">jose</a>
 * suite of JWT tools and upgraded to native NODEjs when native tools are stable.
 * 
 * @module
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');
import jose = require('jose');
import type { keyObject } from './keys';

type JWTtoken = `${string}.${string}.${string}`;
type uri = `${string}:${string}/${string}?${string}#${string}` |
`${string}:${string}/${string}?${string}` |
`${string}:${string}/${string}` |
`${string}:${string}/` |
`${string}:${string}`

export type expireTime = `${number} ${'seconds' |'second' | 'minutes' | 'minute' | 'hours' | 'hour'| 'days' | 'day' | 'weeks'| 'week'}`;
/**
 * At minimum recommeended reserved claims as referenced from
 * <a href="https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims#reserved-claims" target="_blank">auth0.com</a>.
 */
export interface jwtClaims extends jwtCustomClaims{
	/** (issuer): The issuer of the JWT */
	iss:uri,
	/** (subject): The subject of the JWT (user) */
	sub:string,
	/** (audience): Recipients for which the JWT is intended. include at minimum the issuing server*/
	aud:(string | uri)[],
	/** (expiration time):Time after which the token expires */
	exp:expireTime,
	/** (not before time): (not before time): Time before which the JWT must not be accepted for processing */
	nbf?:number,
	/** (issued at time): Time at which the JWT was issued; can be used to determine age of the JWT */
	iat?:number,
	/** (JWT ID): Unique identifier; can be used to prevent the JWT from being replayed (allows a token to be used only once) */
	jti?:string,
	/** Any amount of addition custom claims */
}
interface jwtCustomClaims {
	[key:`yaf_${string}`]: string | object | number;
}
export interface validatedClaims {
	payload: jwtClaims,
	protectedHeader: jose.JWTHeaderParameters
}

function formatClaimObject(claim: jwtClaims): jwtClaims {
	const now = Math.round(Date.now()/1000);
	if(!claim.nbf) claim.nbf = now -1;
	if(!claim.iat) claim.iat = now;
	if(!claim.jti) claim.jti = crypto.randomUUID();
	return claim;
}

export default {
	generateTokenJWT,
	decodeTokenJwt,
	validateTokenJWT
};
/**
 * Generates a new [JSON Web Token](https://jwt.io/)
 * @param claims 
 * @param key 
 * @param alg The algorithm to use. `config.get('security.jwt.algorithmASym') as string;`
 * @returns 
 * 
 * @todo Create a type for acceptable algorithm strings
 * 
 * @group Generate
 */
export function generateTokenJWT(claims:jwtClaims, key: keyObject, alg: string): Promise<JWTtoken> {
	const jClaims: unknown = formatClaimObject(claims);
	return new jose.SignJWT(jClaims as jose.JWTPayload)
		.setProtectedHeader({
			alg
		})
		.setIssuer(claims.iss)
		.setExpirationTime(claims.exp)
		.sign(key) as Promise<JWTtoken>;
}

/**
 * Decodes an unencrypted signed JWT.  
 * This does NOT validate if the payload
 * @param token 
 * @returns a payload claims
 * 
 * @group Parse
 */
export function decodeTokenJwt(token: JWTtoken): jwtClaims {
	const payload = jose.decodeJwt(token) as unknown;
	return payload as jwtClaims;
}

/**
 * 
 * @param token 
 * @param key 
 * @returns 
 * 
 * @group Parse
 */
export function validateTokenJWT(token: JWTtoken, key: keyObject): Promise<validatedClaims> {
	const validation = jose.jwtVerify(token, key) as Promise<unknown>;
	return validation as Promise<validatedClaims>;
}
