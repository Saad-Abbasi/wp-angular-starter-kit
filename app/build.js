const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pluginName = 'ng-wp-form';
const pluginFileName = `${pluginName}.php`;
const destination = path.resolve(__dirname, `../plugin/${pluginName}`);
const pluginFilePath = path.join(destination, pluginFileName);

// Remove the dist folder in the plugin file if it's present.
try {
    fs.rmSync(path.join(destination, 'dist'), { recursive: true, force: true });
    console.log('Old dist folder removed successfully.');
} catch (error) {
    console.error('Error removing dist folder:', error);
}

// Run the build command
try {
    execSync('ng build --configuration production', { encoding: 'utf-8', stdio: 'inherit' });
    console.log('Build successful.');
} catch (error) {
    console.error('Error during build:', error);
    process.exit(1);
}

// Move the bundle from the `/app` folder to the plugin's folder
try {
    const srcPath = path.resolve(__dirname, './dist');
    const destPath = path.join(destination, 'dist');
    fs.renameSync(srcPath, destPath);
    console.log('Bundle moved to plugin folder.');
} catch (error) {
    console.error('Error moving bundle:', error);
    process.exit(1);
}

// Copy the js and css file names to an array
distFilenames = fs.readdirSync(`${destination}/dist/wp-angular-form`);
scriptsAndStyleFiles = distFilenames.filter(file => file.endsWith('.js') || file.endsWith('.css'));

// Replace the js and css file names in the php file contents
const pluginFileContents = fs.readFileSync(`${pluginFilePath}`, 'utf8');

const updateLine = (line, name) => {
    const matchedFileName = scriptsAndStyleFiles.find(file => file.includes(name));
    if (matchedFileName) {
        const hash = matchedFileName.match(/(?<=\.).*?(?=\.)/)[0]; // Extract the hash
        return line.replace('{{hash}}', hash); // Replace {{hash}} with the actual hash
    } else {
        console.warn(`No matching file found for ${name}`);
        return line;
    }
};

const updatedFileContentArray = pluginFileContents.split(/\r?\n/).map(line => {
    switch (true) {
        case line.includes('wp_enqueue_style( \'ng_styles'):
            return updateLine(line, 'styles');
        case line.includes('wp_register_script( \'ng_main'):
            return updateLine(line, 'main');
        case line.includes('wp_register_script( \'ng_polyfills'):
            return updateLine(line, 'polyfills');
        case line.includes('wp_register_script( \'ng_runtime'):
            return updateLine(line, 'runtime');
        default:
            return line;
    }
});
const updatedFileContents = updatedFileContentArray.join('\n');

// Write the new names to the php file
fs.writeFileSync(`${pluginFilePath}`, updatedFileContents);
console.log(`*************** ${pluginFileName} updated! ***************`);
