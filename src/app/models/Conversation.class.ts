export class Conversation {
    members: string[];
    messages: JSON; // Should get a Format like { message: [], userEmail: [] } --> Message[1] and userEmail[1] is connected

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