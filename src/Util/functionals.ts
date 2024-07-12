import { Request } from 'express';
import {unlinkSync, existsSync, renameSync} from 'fs';

export function renameFile(odlPath: string, path: string){
    if(existsSync(odlPath)){
        try{
            renameSync(odlPath, path);
            return true;
        }catch(e){
            console.log(e);
            return false;
        }
    }
    return false;
}

export function deleteFile(path: string){
    if(existsSync(path)){
        try{
            unlinkSync(path);
            return path;
        }catch(e){
            return null;
        }
    }
}

/* export function deleteUploadFiles(req: Request){
    if('file' in req && !!req.file) deleteFile(req.file.path);

    if('files' && !!req.files){
        let {files} = req;

        if(Array.isArray(files)) files.forEach(file=> deleteFile(file.path));

        if(typeof files === 'object' && !Array.isArray(files)){
            for(const field in files){
                files[field].forEach(file=> deleteFile(file.path));
            }
        }
    }

    return;
}

export function deleteRestUploadedFiles(req: Request, toDelete: any[]): void {
	if('files' && !!req.files){
        let {files} = req;

    	toDelete.forEach(el => {
    		if(typeof el !== 'number' && typeof el !== 'string') return;

    		if(Array.isArray(files) && typeof el === 'number') {
    			deleteFile(files[el].path);
    		}

			if(typeof files === 'object' && !Array.isArray(files) && typeof el === 'string'){
				if(!files[el]) return;

				if(Array.isArray(files[el])) return files[el].forEach(file=> deleteFile(file.path));

				// if(typeof files[el] === 'object' && ('path' in files[el])) deleteFile(files[el].path);
			}
    	});
    }
} */

export function renderString(text: string, vars: any): string {
    if((typeof vars !== 'object') || Array.isArray(vars)) return text;

    let matches: RegExpMatchArray | null = text.match(/{{ *(BOOLEAN:)?\w+ *}}/g);

    if(!matches) return text;

    matches.forEach(el => {
        el = el.replace(/({{ *(BOOLEAN:)?| *}})/g, '');

        if(!(el in vars)) return;

        let regExp: RegExp = eval(`/{{ *${el} *}}/g`);
        text = text.replace(regExp, vars[el]);

        let booleanVal = '<div class="boolean-val ' + (!vars[el] ? 'false' : 'true') + '"></div>';

        regExp = eval(`/{{ *BOOLEAN:${el} *}}/g`);
        text = text.replace(regExp, vars[el]);
    });

    return text;
}