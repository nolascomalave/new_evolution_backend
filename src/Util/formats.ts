export function ssre(text: string): string{
	let chars='\\/-^[]()|\'"`+$?¡¿!*.{}<>';

	for(let i=0; i<chars.length; i++){
		text=text.replace(eval('/\\'+chars.charAt(i)+'/gi'), '\\'+chars.charAt(i));
	}

	return text;
}

export function regularExpressionVocalGroup(text: string): string{
	let mal='aáäàâeéèêëiíïîìoóòôöuúûùü', bien='aaaaeeeeiiiioooouuuu', abc='abcdefghijklmnñopqrstuvwxyz';
	let a_group='[aáäàâ]', e_group='[eéèêë]', i_group='[iíïîì]', o_group='[oóòôö]', u_group='[uúûùü]';
	let result='';

	for(let i=0; i<text.length; i++){
		let numero=0, changed=false;
		for(let j=0; j<mal.length; j++){
			if(text.charAt(i)==mal.charAt(j) || text.charAt(i).toUpperCase()==mal.charAt(j).toUpperCase()){
				numero=j;
				changed=true;
				break;
			}
		}

		if(changed==true){
			if(numero<5){
				result=result+'('+a_group+'|'+a_group.toUpperCase()+')';
			}else if(numero<10){
				result=result+'('+e_group+'|'+e_group.toUpperCase()+')';
			}else if(numero<14){
				result=result+'('+i_group+'|'+i_group.toUpperCase()+')';
			}else if(numero<19){
				result=result+'('+o_group+'|'+o_group.toUpperCase()+')';
			}else{
				result=result+'('+u_group+'|'+u_group.toUpperCase()+')';
			}
		}else{
			result=result+text.charAt(i);
		}
	}

	return result;
}

export function regexSearch(text: string): string{
	text=ssre(text);
	text=regularExpressionVocalGroup(text);
	return eval('/'+text+'/i');
}

export function busqueda(busqueda: string, place: string): boolean{
	let regExp=/ /gi;
	busqueda=ssre(busqueda);
	busqueda=regularExpressionVocalGroup(busqueda);
	regExp=eval('/'+busqueda+'/gi');
	return regExp.test(place);
}

export function textToRegExp(text: string): string{
	return regularExpressionVocalGroup(ssre(text));
}

export function extractExt(filename: string): string{
	return filename.trim().replace(/((\w:?)(\\|\/)(.+(\\|\/)))?(.*\.)/g, '');
}

export function extractFilename(file: string): string {
	let match: RegExpMatchArray | null = file.trim().match(/[^\\\/]*(\\|\/)*$/);
	return (match !== null) ? match[0].replace(/(\\|\/)/g, '') : '';
}

export function renameLastDirname(dirname: string, newName: string): string {
	let match: RegExpMatchArray | null = dirname.match(/[\\\/]*$/),
		slashes =( match !== null) ? match[0] : '';

	return dirname.replace(/[^\\\/]*(\\|\/)*$/, newName + slashes);
}

export function spaceXHippen(text: string): string{
	return text.replace(/ +/g, '-');
}

export function cleanSpaces(text:string): string{
    return text.replace(/  +/g, ' ').trim();
}

export function dotToLowBar(text: string): string{
	return text.replace(/\.+/g, '_');
}

export function extractNumberInText(text: string | number): string{
	text = typeof text === 'number' ? text.toString() : text;
	return text.replace(/[^0-9]/g, '');
}

export function adaptNumTwo(num: number | string): string{
    if(String(num).length > 1) return String(num);

    return String('0'+num);
}

export function adaptZerosNum(num: number | string, zeros: number): string{
	num=String(num);
	let count=zeros-num.length;

	for(let i=0; i<count; i++){
		num='0'+String(num);
	}
	return num;
}

export function sanitizeString(text: string): string{
	text=text.trim();
	text=text.replace(/\</gi, '&lt;');
	text=text.replace(/\>/gi, '&gt;');
	return text.replace(/\"/gi, '&quot;');
}

export function quitSpace(text: string): string{
	return text.replace(/ /g, '').toLowerCase();
}

export function destilde(text: string): string{
	let a='[áäàâ]', e='[éèêë]', i='[íïîì]', o='[óòôö]', u='[úûùü]';

    text=text.replace(eval('/'+a+'/gi'), 'a');
	text=text.replace(eval('/'+e+'/gi'), 'e');
	text=text.replace(eval('/'+i+'/gi'), 'i');
	text=text.replace(eval('/'+o+'/gi'), 'o');
	text=text.replace(eval('/'+u+'/gi'), 'u');

	return text.replace(/ñ/gi, 'nh');
}

export function firstUpper(name: string): string{
	return name.charAt(0).toUpperCase()+name.slice(1).toLowerCase();
}

export function firstCharName(name: string): string{
    let result: string | string[] = name.split(' ');

	for(let i=0;i<result.length;i++){
		result[i]=result[i].charAt(0).toUpperCase()+result[i].slice(1);
	}

	result=result.join(' ');

	return result;
}

export function entityFormat(text: string){
	text=text.replace(/ {2,}/g, ' ').trim();
	text=text.replace(/\B_/g, '');
	return firstCharName(text.replace(/\B-/g, ''));
}

export function addDots(num: number | string = 0): string | number{
    let additionals = '', match: RegExpMatchArray | null | string;
    num = num.toString();
    num = num.replace(/[^0-9]/g, '');

    additionals = num.replace(/\d{3}/g, '');
    additionals = num.slice(0, additionals.length);

    match = num.slice(additionals.length).match(/\d{3}/g);
    if (!match) return Number(num);
    return (additionals.length > 0 ? additionals + '.' : '') + match.join('.');
}

export function booleanFormat(bool: any): boolean {
	let type: string = typeof bool;

	if(type === 'number'){
		if(bool === 1) return true;
		if(bool === 0) return false;
	}else if(type === 'string'){
		if(bool === '1' || bool.toLowerCase() === 'true') return true;
		if(bool === '0' || bool.toLowerCase() === 'false') return false;
	}else if(type === 'boolean'){
		return bool;
	}

	return false;
}

export function rifFormat(rif: string): string{
	let rifNumber=extractNumberInText(rif);
	rifNumber=rifNumber.substring(0, rifNumber.length-1);
	return rif.charAt(0).toUpperCase()+'-'+rifNumber+'-'+rif.charAt(rif.length-1);
}

export function stringToDate(date: string): Date {
	let newDate: string[] | number[];
	date = quitSpace(date);

	if(!/^\d+\-\d{1,2}\-\d{1,2}$/.test(date)) return new Date();

	newDate = date.split('-');

	newDate = newDate.map((el: string | number) => Number(el));

	return new Date(newDate[2], newDate[1] - 1, newDate[0]);
}

export function formatStringYMDDateToYMDHIStringDate(date: any): any {
	if((typeof date === 'string') && (/^[1-9]\d*-(0?[1-9]|1[0-2])-[0-3]\d$/).test(date.trim())) {
		date = date.concat(' 00:00');
	}

	return date;
}

export function dateToString(date: Date, type?: 'en' | 'es'){
	let newDate: string | string[] | number[] = date.toLocaleString();

	newDate = newDate.split('/').map((el: string, i: number) => (i === 2 ? el : adaptNumTwo(el)));
	newDate = (type !== 'es') ? newDate.reverse() : newDate;

	return newDate.join('');
}

export function quitUndesiredSpaces(text: any): any | string {
	if(typeof text !== 'string') return text;

	return cleanSpaces(text);
}

export function getRandomNumber(min: number, max: number): number {
	return Math.floor((Math.random() * (max - min + 1)) + min);
}

export function getRandomString(numDigits: number): string {
	let dataToPassword: (string | number)[] = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
	let randomPassword: string = '';
	for(let i = 0; i < numDigits; i++) randomPassword += dataToPassword[getRandomNumber(1, 64) - 1].toString();
    return randomPassword;
}

export function username(name: string, fname: string, array: string[]): string {
    let abc:string = 'abcdefghijklmnñopqrstuvwxyz',
        username:string|string[] = destilde(fname+name.charAt(0)).toLowerCase(),
        initialUserName:string = username,
        iterations:[number] = [0];

    do{
        let add:string = '';
        for(let i=0; i<iterations.length; i++){
            add+= abc.charAt(iterations[i]);
        }

        if(iterations.length<2){
            if(!array.some(el => el.toLocaleLowerCase() === username)) return username;
        }

        username = initialUserName+add;

        for(let j:number = 0; j<27; j++){
            username = username.slice(0, username.length-1) + abc.charAt(j);

            if(!array.some(el => el.toLocaleLowerCase() === username)) return username;

            if(iterations.length>1){
                for(let i:number = iterations.length; i>0; i--){
                    if(iterations[i-1]<26){
                        iterations[i-1]++;
                        break;
                    }else{
                        iterations[i-1]=0;
                        if(i-1==0){
                            iterations.push(0);
                            break;
                        }
                    }
                }
            }else{
                iterations.push(0);
            }
        }
    }while(true);
}

export function convertJSONStringToJSON(obj: any): any {
	try {
		return JSON.parse(obj);
	} catch(e) {
		return obj;
	}
}

export function JSONParser(obj: any) {
	return JSON.parse(JSON.stringify(obj, (key, value) => {
		return (typeof value === 'bigint' ? (!(value < parseInt(value.toString())) && !(value > parseInt(value.toString())) ? parseInt(value.toString()) : value.toString()) : value);
	}));
}

export function getCompleteDateToSQL(date: Date, exclude: {minutes?:  null | boolean, seconds?:  null | boolean, milliseconds?:  null | boolean} = {}) {
	return `${adaptZerosNum(date.getFullYear(), 4)}-${adaptZerosNum(date.getMonth() + 1, 2)}-${adaptZerosNum(date.getDate(), 2)} ${exclude.minutes ? adaptZerosNum(date.getMinutes(), 2) : '00'}:${exclude.seconds ? adaptZerosNum(date.getSeconds(), 2) : '00'}:${exclude.milliseconds ? adaptZerosNum(date.getMilliseconds(), 2) : '00'}`;
}


export function getAllFlatValuesOfDataAsArray(data, ignoreNulls): any[] {
    if (ignoreNulls === void 0) {
		ignoreNulls = false;
	}

    let results = [];

    if ((data !== null && data !== void 0 ? data : null) === null) {
		return ignoreNulls === true ? results : [data];
	}

    if (typeof data !== 'object') {
        return [data];
	}

    if (Array.isArray(data)) {
        data.forEach(function (el) {
			return results = [
				...results,
				...getAllFlatValuesOfDataAsArray(el, ignoreNulls)
			];
		});
	} else {
        for (var prop in data) {
			results = [
				...results,
				...getAllFlatValuesOfDataAsArray(data[prop], ignoreNulls)
			];
		}
	}

    return results;
}