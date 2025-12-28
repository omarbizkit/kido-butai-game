import { LogEntry } from '../types';

export const createLogEntry = (message: string, type: LogEntry['type'] = 'SYSTEM'): LogEntry => ({
  id: Math.random().toString(36).substr(2, 9),
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  message,
  type
});

export const logsToEntries = (messages: string[], type: LogEntry['type'] = 'SYSTEM'): LogEntry[] => 
  messages.map(m => createLogEntry(m, type));
