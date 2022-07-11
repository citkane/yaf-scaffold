const fs = require('fs-extra');
const path = require('path');

function cleanPackageJson(packageJsonPath) {
	const packageJson = require(packageJsonPath);
	if(packageJson.devDependencies) delete packageJson.devDependencies;
	if(packageJson.scripts) delete packageJson.scripts;
	if(packageJson.workspaces) packageJson.workspaces = packageJson.workspaces.filter(workspace => workspace !== 'tsconfig');
	if(packageJson.typedoc) delete packageJson.typedoc;
	fs.writeJSONSync(packageJsonPath, packageJson, {spaces:'\t'});
};
const buildPath = path.join(__dirname, '../dist');
if(!fs.existsSync(buildPath)) throw new Error('The build folder "dist" does not exist');

try {
	cleanPackageJson(path.join(buildPath, 'package.json'));
	cleanPackageJson(path.join(buildPath, 'src', 'package.json'));
} catch (err){
	throw err;
}
const packageFolderPath = path.join(buildPath, 'packages');
if(!fs.existsSync(packageFolderPath)) throw new Error('The packages folder "dist/packages" does not exist');

fs.readdirSync(packageFolderPath).forEach(folder => {
	try {
		cleanPackageJson(path.join(packageFolderPath, folder, 'package.json'));
	} catch (err){
		throw err;
	}
})