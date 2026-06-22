import { Role } from "@sheltr/shared";
import { UUID } from "node:crypto";

export type Participant = {
    role: Role;
    id: UUID;
}