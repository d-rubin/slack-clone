export class Channel {
    name: string;
    members: string[];
    messages: JSON; // Should get a Format like { message: [], userId: [] } --> Message[1] and userId[1] is connected

    constructor(obj?: any) {
        this.name = obj? obj.name: '';
        this.members = obj? obj.members: [];
        this.messages = obj? obj.messages: {};
    }

    public toJSON() {
        return {
            name: this.name,
            members: this.members,
            messages: this.messages
        }
    }
}