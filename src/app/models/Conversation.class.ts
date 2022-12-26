export class Conversation {
    members: string[];
    messages: JSON; // Should get a Format like { message: [], userId: [] } --> Message[1] and userId[1] is connected

    constructor(obj?: any) {
        this.members = obj? obj.members: [];
        this.messages = obj? obj.messages: {};
    }

    toJSON() {
        return {
            members: this.members,
            messages: this.messages
        }
    }
}