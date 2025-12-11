import { skillInterface } from "../models/skill.interface";


export interface skillServicesInterface {
    getSkills(): Promise<readonly skillInterface[]>;
}