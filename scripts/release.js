const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const pkg = require('../package.json');
const semver = require('semver');
const execa = require('execa');
const { prompt } = require('enquirer');

const { version: currentVersion } = pkg;
const versionIncrements = [
    'patch',
    'minor',
    'major'
];
const tags = [
    'latest',
    'next'
];

const inc = i => semver.inc(currentVersion, i);
const step = msg => console.log(chalk.cyan(msg));
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts} );
// const bin = name => path.resolve(__dirname, `../node_modules/.bin/${name}`);

async function main() {
    let targetVersion;

    // version
    const { release } = await prompt({
        type: 'select',
        name: 'release',
        message: 'Select release Type',
        choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
    });
    
    if (release === 'custom') {
        targetVersion = (await prompt({
            type: 'input',
            name: 'version',
            message: 'Input your custom version',
            initial: currentVersion
        })).version;
    } else {
        targetVersion = release.match(/\((.*)\)/)[1];
    }

    if (!semver.valid(targetVersion)) {
        throw new Error(`version is not valid: ${targetVersion}`);
    }

    // tag
    const { tag } = await prompt({
        type: 'select',
        name: 'tag',
        message: 'Select release tag',
        choices: tags
    });

    // double confirm
    const { yes: tagOk } = await prompt({
        type: 'confirm',
        name: 'yes',
        message: `Release version "${targetVersion}" wth the "${tag}" tag, confirm?`
    })

    if (!tagOk) {
        return;
    }

    // run test
    step('\nRunning test...');
    await run('yarn', ['build']);

    // update vesion
    step('\nUpdating version...');
    updateVersion(targetVersion);

    // commit change
    step('\nCommitting changes...');
    // await run('git', ['add', '-A']);
    // await run('git', ['commit', '-m', `release: v${targetVersion}`]);

    // Publish the package.
    step('\nPublishing the package...')
    // await run ('yarn', [
    //   'publish', '--tag', tag, '--new-version', targetVersion, '--no-commit-hooks',
    //   '--no-git-tag-version'
    // ])

    // push to github
    step('\nPushing to github...');
    // await run('git', ['tag', `v`]);
    // await run('git', ['push', 'origin', `refs/tags/v`]);
    // await run('git', ['push']);

    step('\nFinished');
    step(`\n👏🏻👏🏻Congratulation, success release version "${targetVersion}" with the "${tag}" tag.`);

    function updateVersion(version) {
        const pkgPath = path.resolve(__dirname, '../package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

        pkg.version = version;

        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    }
}

main().catch(console.error);
