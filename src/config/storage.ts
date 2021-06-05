import config from './config';
const _module =  {
    getStorageAccountName:() =>{
        
        const matches = /AccountName=(.*?);/.exec(config.AZURE_CONECTION_STORAGE_KEY)!;
        return matches[1];
    }
 }
 module.exports = _module;