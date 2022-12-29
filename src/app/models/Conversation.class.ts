export class Conversation {
    members: string[];
    name: string;
    messages: JSON; // Should get a Format like { message: [], userEmail: [] } --> Message[1] and userEmail[1] is connected

    constructor(obj?: any) {
        this.members = obj? obj.members: [];
        this.name = obj? obj.name: '';
        this.messages = obj? obj.messages: {};
    }

    toJSON() {
        return {
            members: this.members,
            name: this.name,
            messages: this.messages
        }
    }
}