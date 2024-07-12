import {
	writeFileSync,
	existsSync,
	renameSync,
	unlinkSync,
	readFileSync
} from 'fs';

export default class Files {
	public static getUniqueFileName(route: string, prefix?: string, ext?: string): string {
		let num: number = Date.now(),
			name = '',
			end = false;

		route = route.replace(/(\/|\\)*$/, '/');

		do {
			name = `${(prefix ?? '')}${num}${ext ?? ''}`;

			if(existsSync(`${route}${name}`)) num++;
			else end = true;
		} while(end === false);

		return name;
	}

	public static exists(path: string) {
		return existsSync(path);
	}

	public static readAsPlainText(path: string, asText: boolean | undefined | null) {
		asText ??= false;

		try{
			return readFileSync(path, asText ? 'utf8' : undefined);
		}catch(e){
			return null;
		}
	}

	public static renameFile(odlPath: string, path: string): string | null {
	    if(existsSync(odlPath)){
	        try{
	            renameSync(odlPath, path);
	            return null;
	        }catch(e){
	            console.log(e);
	            return odlPath;
	        }
	    }
	    return odlPath;
	}

	public static deleteFile(path: string){
	    if(existsSync(path)){
			try{
				unlinkSync(path);
				return path;
			}catch(e){
				return null;
			}
		}
		return null;
	}

	public static createFile(data: string, path: string) {
		try{
			writeFileSync(path, data);
			return true;
		}catch(e){
			return false;
		}
	}
}