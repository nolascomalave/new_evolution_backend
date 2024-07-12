import fs from 'fs';
import { addDots, dateToString, stringToDate, extractNumberInText, cleanSpaces } from '../util/formats';

// Type:
type ReturnValidator<Type> = Type | null;

export function validateId(id: any, type: string, required?: boolean): ReturnValidator<string> {
	if(!id && !required) return null;
	if(!id) return `The ${type} id is required!`;

	if((typeof id !== 'string') && typeof id !== 'number') return 'The '+type+' must be defined in text or number format!';

	if(!(/^[1-9]([0-9]+)?$/.test(id.toString()))) return 'The '+type+' id must be a natural number in text or number format greater than 0!';

	return null;
}

export function validateBoolean(bool: any, type: string, required?: boolean){
	if(typeof bool === 'boolean') return null;
	if(!bool && bool != 0 && bool != '0' && bool != '' && required === true) return `The ${type} is required!`;

	if(typeof bool === 'string' && (bool.toLowerCase() === 'false' || bool.toLowerCase() === 'true')) return null;

	return 'The '+type+' must be defined in boolean format!';
}

export function validatePassword(pass: any, min: number = 4, max: number = (min > 30) ? (min + 26) : 30): ReturnValidator<string> {
	if(!pass) return `Password is required!`;
	if(typeof pass!=='string' && typeof pass!=='number') return 'The password must be defined in text or numeric format!';

	if(typeof pass!=='string') pass = pass.toString();

	if(min > max) throw new Error(`Minimum quantity can't be greater than maximum quantity!`);

	if(pass.length < min) return 'The password must contain at least ' + min + ' characters!';
	if(pass.length > max) return 'The password must not contain more than ' + max + ' characters!';

	return null;
}

export function validateSimpleText(text: any, name: string, min?: number, max?: null | number, required?: boolean): ReturnValidator<string> {
	if(!text && !required) return null;
	if(typeof text!='string' && typeof text!='number') return 'The value "'+name+'" must be defined in text or numeric format!';

	if(min === undefined || min === null) min = 1;
	if(min<1) min=1;

	if(max === undefined || max === null) {
		if(min-250<750) max=1000-min;
		else max = min+250;
	}else{
		if(max<min) max=min+250;
	}

	text = text.toString().trim();
	if(text.length<1) return 'The value "'+name+'" is required!';
	if(text.length<min) return 'The value "'+name+'" must not contain less than '+min+' characters!';
	if(text.length>max) return 'The value "'+name+'" must not contain more than '+max+' characters!';

	return null;
}

export function validateName(name: any, type: string, obligatory?: null | boolean): ReturnValidator<string> {
	let typeOf: string = typeof name;

	if(((typeOf === 'string' && name.trim().length < 1) || name === undefined || name === null) && !obligatory){
		return null;
	}

	if((typeOf === 'string' && name.trim().length < 1) || name === undefined || name === null){
		return `The value "${typeOf}" is required!`;
	}

	if(typeOf != 'string') return 'The value "'+ type +'" must be defined in text or numeric format!';

	if(!name && obligatory) return `The value "${type}" is required!`;

	if(!name) return null;

	name = name.trim();

	if(name.length>50){
		return 'The value of "'+type+'" must not contain more than 50 characters!';
	}else if(name.length<2){
		return 'The value of "' + type + '" must not contain less than 2 characters!';
	}else if(/^[a-zA-ZáéíóúÁÉÍÓÚÑñ][a-zA-ZáéíóúÁÉÍÓÚÑñ\-\_]*( [a-zA-ZáéíóúÁÉÍÓÚÑñ][a-zA-ZáéíóúÁÉÍÓÚÑñ\-\_]*)?$/gi.test(name)==false){
		return 'The value of "'+type+'" can only contain some specific special characters (.\'_-)!';
	}

	return null;
}


export function validateSSN(ssn: string | number, required?: boolean): ReturnValidator<string>{
	if(!ssn && !required) return null;
	if(!ssn) return 'The Social Security Number is required!';

	let type=typeof ssn;
	if(type!=='number' && type!=='string') return 'The Social Security Number must be defined in text or numeric format!';
	ssn = ssn.toString().trim();
	if(!/^(\d+|\d+\-\d+\-\d+)$/.test(ssn)) return 'Wrong Social Security Number Format!';

	ssn=ssn.replace(/\-/g, '');

	if(ssn.length!==9) return 'The Social Security Number must be contain 9 digits!';

	let part=[ssn.slice(0,3), ssn.slice(3,5), ssn.slice(5)];

	if(part[0]==='000') return 'The Area Number can\'t be "000"';
	if(part[1]==='00') return 'The Group Number can\'t be "00"';
	if(part[2]==='0000') return 'The Serial Number can\'t be "0000"';

	if(part[0]==='666' || Number(part[0])>=900) return 'The Area Number can\'t be "666" or be in the hundred of 900!';

	return null;
}



export function validateGender(gender: string, required?: boolean): ReturnValidator<string>{
	if(!gender && !required) return null;
	if(!gender) return 'Gender is required!';

	if(typeof gender!=='string') return 'The gender must be defined in text format!';
	gender=gender.trim().toLocaleLowerCase();

	if(gender!=='male' && gender!=='female') return 'The gender must be "Male" or "Female"!';
	return null;
}



export function validateEmail(email: any, obligatory?: boolean | null): ReturnValidator<string> {
	let error=null, type: string = typeof email,
	regExp=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

	if(type != 'string' && type != 'null' && type != 'undefined') return 'The email format must be defined in text!';

	if(!email && !obligatory) return null;

	if(!email) return 'You must enter an email!';

	email = email.trim();
	if(email.length>0){
		if(email.length>131){
			return 'Email must be less than 132 characters long!';
		}else if(regExp.test(email)==false){
			return 'Wrong email format!';
		}
	}else if(obligatory){
		return 'You must enter an email!';
	}

	return null;
}



export function validateDate(date: any | string | Date, type: string, minDate: null | Date, maxDate: null | Date, required?: boolean): ReturnValidator<string> {
	if(!date && !required) return null;

	if(!date) return `The ${type} date is required!`;

	if((typeof date !== 'string') && !(date instanceof Date)) return `The date format must be "dd-mm-yy", or an instance of the "Date" object!`;

	if(typeof date === 'string'){
		date = new Date(date);
		if(isNaN(date.getTime())) return `The date format must be "dd-mm-yy", or an instance of the "Date" object!`;
	}

	if(!!minDate && !!maxDate){
		if(maxDate.getTime() < minDate.getTime()) return `The defined minimum date ("${dateToString(maxDate)}") must not be greater than the maximum date ("${dateToString(maxDate)}")`;
	}

	if(minDate !== null){
		if(minDate.getTime() > date.getTime()) return `The date in ${type} "${dateToString(date)}" must not be less than "${dateToString(minDate)}"`;
	}

	if(maxDate !== null){
		if(maxDate.getTime() < date.getTime()) return `The date in ${type} "${dateToString(date)}" must not be greater than "${dateToString(maxDate)}"`;
	}

	return null;
}

export function validatePhoneNumber(phone: any, required?: boolean): ReturnValidator<string>  {
	if((!phone && (typeof phone !== 'boolean')) && !required) return null;
	if((!phone && (typeof phone !== 'boolean'))) return 'Phone number is required!';

	if((typeof phone !== 'string' && typeof phone !== 'number')) return 'The phone number must be defined in text or numeric format!';

	phone = cleanSpaces((typeof phone === 'string') ? phone : phone.toString());

	if(!/^(\+\d{1,3} ?)?\(?0?\d{3}\)?[- ]?\d{3}-?\d{4}$/.test(phone)) return 'Invalid phone number!';

	return null;
}

export function validateIdDocument(doc: any, min: null | number, max: null | number, required?: boolean): ReturnValidator<string>{
	if((doc === undefined || doc === null || doc === '') && !required) return null;

	if(typeof doc !== 'string' && typeof doc !== 'number') return 'The identity document must be defined in text or numeric format!';

	doc = (typeof doc !== 'number') ? Number(doc).toString() : doc;

	if(!(/^[a-z0-9]{1,50}$/i.test(doc.trim()))) return 'The identity document must be defined as a number only, without additional characters or leading zeros!';

	return null;
}

export function validateFile(file: any, exts: string | string[] | null, route: boolean, withoutExt?: boolean, required?: boolean): ReturnValidator<string> {
	let filetype = typeof file;

	if(((filetype !== 'boolean') && !file) && !required) return null;
	if(((filetype !== 'boolean') && !file)) return 'The file is required!';

	if(filetype !== 'string') return 'The file params must be defined in text format';

	if(!!exts){
		let ext: string = file.trim().replace(/((\w:?)(\\|\/)(.+(\\|\/)))?(.*\.)/g, '').toLowerCase(),
			valid: boolean = (typeof exts === 'string') ? exts.toLowerCase() === ext : exts.some(el => el.toLowerCase() === ext);

		if(!valid) return `The file type is incorrect. The accepted types are: ${(typeof exts === 'string') ? exts : exts.join(', ')}!`;
	}

	if(!!withoutExt) file = file.replace(/.\w+$/, '');
	if(route === true && !fs.existsSync(file)) return 'File not found!';

	return null;
}

export function validateDoc(doc: any, type: string, min: number | null, max: number | null, required?: boolean): ReturnValidator<string> {
	let typeOf=typeof doc, acceptedTypes=['string', 'number', 'null', 'undefined'], acceptedTypesDoc=['V', 'E', 'P'];

	if(!acceptedTypes.some(el => el==typeOf)) return 'The ID number must be defined in numeric or text format!';

	if(!doc && required) return 'You must enter the identity document number!';
	else if(!required) return null;

	if(!type) return 'You must define the type of document, that is, if the document is Venezuelan (V), foreign (E), or is it a passport (P)!';

	if(!acceptedTypesDoc.some(el => el==type.toUpperCase())) return 'The accepted values ​​for the identity document type are "V", "E" and "P"!';

	if(!min) min=1;
	if(min < 1) min=1;
	if(!max) max=20;
	if(max < min) max=min;

	min=Math.round(min);
	if(max!=20) max=Math.round(max);

	if(typeOf=='string') doc=doc.trim();

	if(isNaN(doc) && doc!=addDots(doc)) return `The format of the identity document is incorrect, that is, it must be a number, and only points are accepted to determine units greater than a thousand!`;
	doc=Number(extractNumberInText(doc)).toString();

	if(doc.length<min) return `The length of the identity document must not be less than ${min}!`;
	if(doc.length>max) return `The length of the identity document must not be greater than ${max}!`;

	return null;
}

function getLastNumRif(RIF: string): null | number {
	let rifLetter: string,
		rifNumber: string,
		sumRIF: number = 0,
		multi: number[] = [3, 2, 7, 6, 5, 4, 3, 2];

	RIF = RIF.toUpperCase();
	rifLetter = RIF.charAt(0);
	rifNumber = RIF.slice(1);

	if(!/^[vpgej]$/i.test(rifLetter) || rifNumber.length !== 8 || !Number(rifNumber)) return null;

	switch(rifLetter){
		case "V":
			sumRIF = (1*4);
			break;

		case "E":
			sumRIF = (2*4);
			break;

		case "J":
			sumRIF = (3*4);
			break;

		case "P":
			sumRIF = (4*4);
			break;

		case "G":
			sumRIF = (5*4);
			break;

		default:
			return null;
	}

	for(let i: number = 0; i < 8; i++) sumRIF += (parseInt(rifNumber.charAt(i)) * multi[i]);

	let EntRIF: number = parseInt((sumRIF/11).toString()),
		Residuo: number = sumRIF - (EntRIF * 11),
		DigiVal: number = 11 - Residuo;

	if (DigiVal > 9) DigiVal = 0;

	return DigiVal;
}

export function validateRif(rif: any, obligatory?: boolean): ReturnValidator<string> {
	if(typeof rif !== 'string' && rif !== undefined && rif !== null) return 'The rif must be defined in text format!';

	if(!rif && !obligatory) return null;

	if(!rif) return 'The Rif is required!';

	if(!/[a-z]-?\d{8}-?\d/i.test(rif)) return 'The rif format must contain the letter that identifies the type and nine numbers, no more (V133455669 or V-13345566-9)!';

	if(!/^[vjpge]$/i.test(rif.charAt(0))) return 'Wrong code format letter!';

	rif = rif.replace(/-/, '').toUpperCase();

	if(parseInt(rif.slice(rif.length - 1)) !== getLastNumRif(rif.slice(0, rif.length -1))) return 'Wrong rif!';

	return null;
}

export type ValidateCuantity = {
	num: any;
	name: string;
	min?: number;
	max?: number;
	int?: boolean;
	required?: boolean;
};

export function validateCuantity({num, name, min, max, int, required}: ValidateCuantity): ReturnValidator<string> {
	if((!num && num!=='0' && num!==0) && !required) return null;
	if(!name) name = 'quantity';
	if((!num && num!=='0' && num!==0)) return `The ${name} is required!`;

	let type=typeof num;
	if(type!=='string' && type!=='number') return `The ${name} must be defined in text or number format!`;
	if(type==='string' && isNaN(num)) return `The ${name} is not a number!`;
	num=Number(num);

	if(int && !Number.isInteger(num)) return `The ${name} must be an integer!`;

	if(!min){
		min=0;
	}else{
		let valid = validateCuantity({num:min, name:'minimum quantity', int});
		if(valid) return valid;
	}

	if(!!max){
		let valid = validateCuantity({num:max, name:'maximum quantity', min, int});
		if(valid) return valid;
	}

	if(num<min) return `The ${name} must not be less than ${min}!`;

	if(!!max && num>max) return `The ${name} must not be greater than ${max}!`;

	return null;
}

export function validateJSONQuillContext(json: any, type: string, required = false): string | null {
    json ??= null;

    if (json === null && required !== true) return null;
    else if (json === null) return `The "${type}" value is required!`;

    if ((typeof json !== 'object' || Array.isArray(json) && typeof json !== 'string')) return `The "${type}" value must be defined in JSON format!`;

    try {
        const obj = typeof json === 'string' ? JSON.parse(json) : json;
        if (
            obj.hasOwnProperty("ops") &&
            Array.isArray(obj.ops)
        ) {
            const { ops } = obj;

            if (Array.isArray(ops) && ops.every((op) => typeof op === "object" && op.hasOwnProperty("insert"))) {
                return null;
            }
        }
        return `The "${type}" value is not a valid react-quill context!`;
    } catch (e) {
        return `The "${type}" value is not a valid react-quill context!`;
    }
}
