// Messages from Agent to Server
export type AgentMessage = 
    | { type: 'output'; data: string; }
    | { type: 'resize'; rows: number; cols: number; }
    | { type: 'exit'}

// Messages from Browser to Server
export type BrowserMessage = 
    | { type: 'output'; data: string; }
    | { type: 'resize'; rows: number; cols: number; }

// Messages from Server to Browser
export type ServerMessage = 
    | { type: 'output'; data: string; }
    | { type: 'resize'; rows: number; cols: number; }
    | { type: 'connected'}
    | { type: 'disconnected'}