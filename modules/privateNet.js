import logger from './utils/logger';

const fs = require('fs');
const spawn = require('child_process').spawn;
const Settings = require('./settings');
const privateNetName = 'darwin';

const privateNetLog = logger.create('privateNet');
const privatePath = Settings.constructUserDataPath(`${privateNetName}`);
const geneisPath = Settings.constructUserDataPath(`${privateNetName}.json`);
const geneis = require('./privateNetGeneis');

const privateArgs = {
    '--networkid': '20180515',
    '--datadir': privatePath,
    '--bootnodes': 'enode://f23e3f746ca646ac34ed3535d8d7397d0cfece6e1bc4d73bfa1dec1a16c340cd49f1a1af4a63b560b9e634bb86006f7c74230169808bfc85982f7656ed2807c5@120.79.38.67:30603',
    '--ipcpath': Settings.rpcIpcPath,
};

// output
module.exports = {
    privateInit: (args, binPath) => {
        const argMap = {};
        let argRet = [];
        for (let idx = 0; idx < args.length; idx++) {
            if ((idx % 2 === 0) && idx < args.length) {
                argMap[args[idx]] = args[idx + 1];
            }
        }

        // 私有链参数
        for (const _key in privateArgs) {
            if (argMap[_key] === undefined) {
                argMap[_key] = privateArgs[_key];
            }
        }

        for (const _key in argMap) {
            argRet.push(_key);
            argRet.push(argMap[_key]);
        }

        privateNetLog.warn('args', args);
        privateNetLog.warn('argMap', argMap);
        privateNetLog.warn('argRet', argRet);
        privateNetLog.warn('binPath', binPath);
        privateNetLog.warn('private', Settings.constructUserDataPath('private'));

        // 测试初始化
        if (fs.existsSync(geneisPath) === false) {
            // 创世快
            fs.writeFileSync(geneisPath, geneis, {encoding: 'utf8'});
            const _args = [
                '--datadir',
                privatePath,
                'init',
                geneisPath,
            ];
            privateNetLog.warn('init', binPath, _args);
            // execSync(binPath, _args);
            spawn(binPath, _args);
            // this.sleep(2000);
            for (var start = +new Date; +new Date - start <= 2000;) {
            }
        }
        return argRet;
    }
};
