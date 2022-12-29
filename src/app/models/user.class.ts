export class User {
    name: string;
    email: string;

    constructor(obj?: any) {
        this.name = obj? obj.name: '';
        this.email = obj? obj.email: '';
    }

    toJSON() {
        return {
            name: this.name,
            email: this.email,
        }
    }
}