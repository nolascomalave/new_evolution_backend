class HandlerErrors {
    protected errors: any = {};

    constructor(name?: string, error?: any) {
        if(name && error){
            this.set(name, error);
        }else if(name){
            throw 'If you define "name" parameter, you need to define "name" parameter!';
        }else if(error){
            throw 'If you define "error" parameter, you need to define "name" parameter!';
        }
    }

    public set(name:string, error: any): void {
        if(!error && (name in this.errors)){
            delete this.errors[name];
        }else if(!!error){
            this.errors[name]=error;
        }
    }

    public get(error: string): null | any {
        return this.errors[error] ?? null;
    }

    public getErrors(): null | object {
        if(Object.keys(this.errors).length > 0) return this.errors;
        return null;
    }

    public getArrayErrors(): any[] {
        let arrayErrors: any[] = [];

        for(let name in this.errors){
            arrayErrors.push(this.errors[name]);
        }

        return arrayErrors;
    }

    public existsErrors(): boolean {
        return (Object.keys(this.errors).length > 0);
    }

    public exists(...errors: (string | RegExp)[]): boolean {
        if(errors.length === 0) {
            return (Object.keys(this.errors).length > 0);
        }

        return errors.some(error => {
            if(typeof error === 'string'){
                return !!this.errors[error];
            }

            if(error instanceof RegExp){
                for(let key in this.errors){
                    if(error.test(key)){
                        return true;
                    }
                }
            }

            return false;
        });
    }

    public merege(errors: HandlerErrors | object): void{
        let newErrors = (errors instanceof HandlerErrors) ? errors.getErrors() : errors;

        if(typeof newErrors === 'object' && newErrors != null && !Array.isArray(newErrors)) return;

        this.errors = { ...this.errors, ...newErrors };
    }

    public pushErrorInArray(name: string, error: any, includeNulls?: boolean): void {
        if(!includeNulls && (error === undefined || error === null)) return;

        if(!this.exists(name)) this.errors[name] = [];
        this.errors[name].push(error ?? null);
    }

    public remove(...names: string[]): void {
        names.forEach(name => {
            if(name in this.errors) delete this.errors[name];
        });
    }

    public reset(): void {
        this.errors={};
    }
}

export default HandlerErrors;