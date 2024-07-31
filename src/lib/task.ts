export default class Task {
    text: string;
    description: string;
    dueDate: Date | null;
    timeSpecific: boolean;
    completed: boolean;  // Added completed property

    constructor(text: string, description = "", dueDate: Date | null = null, timeSpecific = false, completed = false) {
        this.text = text;
        this.description = description;
        this.dueDate = dueDate;
        this.timeSpecific = timeSpecific;
        this.completed = completed;
    }
}