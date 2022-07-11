describe('SECURITY UTILITY TESTS', function () {
	describe('Crytographic functions', function () {
		require('./security/crypto/keys.spec');
		require('./security/crypto/jwt.spec');
		require('./security/crypto/passwords.spec');
	});	
});