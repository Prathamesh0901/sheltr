import { AgentMessage, Role } from "@sheltr/shared";
import { UUID } from "node:crypto";
import { WebSocket } from 'ws';

class Session {
    id: string; 
    agentSocket: WebSocket | null = null;
    browserSockets: Map<WebSocket, { role: Role, id: UUID }> = new Map();
    buffer: string = "";
    recording: { t: number, data: string }[] = [];
    startTime: number = Date.now();
    maxViewers: number;

    constructor (id: string, agentWs: WebSocket) {
        this.id = id;
        this.agentSocket = agentWs;
        this.startTime = Date.now();
        this.maxViewers = 0;
    }      
};

class SessionManager {
    sessions: Session[] = [];
    static instance: SessionManager | null = null;
    sessionTimer: Map<string, NodeJS.Timeout> = new Map<string, NodeJS.Timeout>
    
    private constructor () {}

    static getSessionManager() {
        if(this.instance) return this.instance;
        this.instance = new SessionManager();
        return this.instance;
    }

    createSession(agentWs: WebSocket, sessionId: string) {
        this.sessions.push(new Session(sessionId, agentWs));

        const timeout = setTimeout(() => {
            this.destroySession(sessionId);
            this.sessionTimer.delete(sessionId);
        }, 600000);

        this.sessionTimer.set(sessionId, timeout);

        return;
    }

    getSession(id: string): Session | undefined {
        const session = this.sessions.find(session => session.id === id);
        return session;
    }

    addBrowser(id: string, role: Role, browserSocket: WebSocket, browserId: UUID): boolean {
        const session = this.getSession(id);
        if (session) {
            if(session.browserSockets.size === 0) {
                const timer = this.sessionTimer.get(session.id);
                if(timer) {
                    clearTimeout(timer);
                    this.sessionTimer.delete(session.id);
                }
            }
            session.browserSockets.set(browserSocket, {role, id: browserId});
            if(session.browserSockets.size > session.maxViewers) {
                session.maxViewers = session.browserSockets.size;
            }
            return true;
        }
        return false;
    }

    removeBrowser(id: string, browserSocket: WebSocket) {
        const session = this.getSession(id);
        if (session) {
            session.browserSockets.delete(browserSocket);
        }
        return;
    }

    appendScrollback(id: string, data: AgentMessage) {
        const session = this.getSession(id);
        if (session && data.type === 'output') {
            session.buffer += data.data;
        }
    }

    appendRecording(id: string, data: string) {
        const session = this.getSession(id);
        if(!session) return;

        session.recording.push({ t: Date.now()-session.startTime, data});
    }
    
    destroySession(id: string) {
        const timer = this.sessionTimer.get(id)
        if(timer) {
            clearTimeout(timer)
            this.sessionTimer.delete(id)
        }
        const filteredSessions = this.sessions.filter(session => session.id !== id);
        this.sessions = filteredSessions;
    }
};

export default SessionManager.getSessionManager();