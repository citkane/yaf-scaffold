import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import rewire from 'rewire';

chai.use(chaiAsPromised);
export const assert = chai.assert;


export {rewire};
export default {
	rewire,
	assert
};

