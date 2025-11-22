import Dexie, { Table } from 'dexie';
import { DailyLog } from './types';
import { ChatMessage } from './mockData';

export class SamDatabase extends Dexie {
    logs!: Table<DailyLog, string>; // id is string
    chatHistory!: Table<ChatMessage, string>; // id is string

    constructor() {
        super('SamDatabase');
        this.version(1).stores({
            logs: 'id, date, timestamp', // Primary key and indexed props
            chatHistory: 'id, timestamp, role'
        });
    }
}

export const db = new SamDatabase();
