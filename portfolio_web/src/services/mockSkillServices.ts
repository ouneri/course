import  type { skillServicesInterface } from "./skill.services.interface";
import type { skillInterface } from "../models/skill.interface"



export class MockSkillServices implements skillServicesInterface {
    private readonly mockSkills: readonly skillInterface[] = [
        {id: 1, name: "HTML", level: "Advanced", category: "Frontend"},
        {id: 2, name: "CSS", level: "Advanced", category: "Frontend"},
        {id: 3, name: "JavaScript", level: "Advanced", category: "Frontend"},
        {id: 4, name: "React", level: "Advanced", category: "Frontend"},
        {id: 5, name: "Node.js", level: "Advanced", category: "Backend"},
        {id: 6, name: "Express", level: "Advanced", category: "Backend"},
        {id: 7, name: "MongoDB", level: "Advanced", category: "Backend"},
        {id: 8, name: "PostgreSQL", level: "Advanced", category: "Backend"},
        {id: 9, name: "Redis", level: "Advanced", category: "Backend"},
        {id: 10, name: "Docker", level: "Advanced", category: "Backend"},
    ];

    async getSkills(): Promise<readonly skillInterface[]> {
        return this.mockSkills;
    }
}