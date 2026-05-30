// Messages from Agent to Server
export type AgentMessage = 
    | { type: 'output'; data: string; }
    | { type: 'resize'; rows: number; cols: number; }
    | { type: 'exit'}

// Messages from Browser to Server
export type BrowserMessage = 
    | { type: 'input'; data: string; }
    | { type: 'resize'; rows: number; cols: number; }
    
// Messages from Server to Browser
export type ServerToBrowserMessage = 
    | { type: 'output'; data: string; }
    | { type: 'resize'; rows: number; cols: number; }
    | { type: 'buffer'; data: string; }
    | { type: 'role', role: Role }
    | { type: 'error', message: string }
    | { type: 'connected'; }
    | { type: 'disconnected'; }
    
// Messages from Server to Agent
export type ServerToAgentMessage = 
    | { type: 'urls'; data: { controllerUrl: string, viewerUrl: string }; }
    | { type: 'input'; data: string; }
    | { type: 'resize'; rows: number; cols: number; }

// User Role
export type Role = 'controller' | 'viewer'