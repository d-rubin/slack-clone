export class Conversation {
    members: string[];
    partnerName: string;
    messages: JSON; // Should get a Format like { message: [], userEmail: [] } --> Message[1] and userEmail[1] is connected

    constructor(obj?: any) {
        this.members = obj? obj.members: [];
        this.partnerName = obj? obj.partnerName: '';
        this.messages = obj? obj.messages: {};
    }

    toJSON() {
        return {
            members: this.members,
            partnerName: this.partnerName,
            messages: this.messages
        }
    }
}