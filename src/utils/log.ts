import { LogEntry } from '../types';

export const createLogEntry = (message: string, type: LogEntry['type'] = 'SYSTEM'): LogEntry => ({
  id: Math.random().toString(36).substring(2, 11),
  timestamp: '', // Will be set when displayed to avoid hydration mismatch
  message,
  type
});

export const logsToEntries = (messages: string[], type: LogEntry['type'] = 'SYSTEM'): LogEntry[] => 
  messages.map(m => createLogEntry(m, type));
