import { AgentMessage, Role } from "@sheltr/shared";
import { randomUUID, UUID } from "node:crypto";
import { RawData, WebSocket } from 'ws';

class Session {
    id: UUID; 
    agentSocket: WebSocket | null = null;
    browserSockets: Map<WebSocket, Role> = new Map<WebSocket, Role>();
    buffer: string = "";
    recording: { t: number, data: string }[] = [];
    startTime: number = Date.now();

    constructor (id: UUID, agentWs: WebSocket) {
        this.id = id;
        this.agentSocket = agentWs;
        this.startTime = Date.now();
    }      
};

class SessionManager {
    sessions: Session[] = [];
    static instance: SessionManager | null = null;

    private constructor () {}

    static getSessionManager() {
        if(this.instance) return this.instance;
        this.instance = new SessionManager();
        return this.instance;
    }

    createSession(agentWs: WebSocket): UUID {
        const sessionExists = this.sessions.find(session => session.agentSocket === agentWs);
        if (sessionExists && sessionExists.id) return sessionExists.id;

        const newSessionId = randomUUID();
        this.sessions.push(new Session(newSessionId, agentWs));

        return newSessionId;
    }

    getSession(id: UUID): Session | undefined {
        const session = this.sessions.find(session => session.id === id);
        return session;
    }

    addBrowser(id: UUID, role: Role, browserSocket: WebSocket): boolean {
        const session = this.getSession(id);
        if (session) {
            session.browserSockets.set(browserSocket, role);
            return true;
        }
        return false;
    }

    removeBrowser(id: UUID, browserSocket: WebSocket) {
        const session = this.getSession(id);
        if (session) {
            session.browserSockets.delete(browserSocket);
        }
        return;
    }

    appendScrollback(id: UUID, data: AgentMessage) {
        const session = this.getSession(id);
        if (session && data.type === 'output') {
            session.buffer += data.data;
        }
    }

    appendRecording(id: UUID, data: string) {
        const session = this.getSession(id);
        if(!session) return;

        session.recording.push({ t: Date.now()-session.startTime, data});
    }
    
    destroySession(id: UUID) {
        const filteredSessions = this.sessions.filter(session => session.id !== id);
        this.sessions = filteredSessions;
    }
};

export default SessionManager.getSessionManager();