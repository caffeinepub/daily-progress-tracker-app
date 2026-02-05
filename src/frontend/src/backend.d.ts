import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    id: bigint;
    status: TaskStatus;
    title: string;
    date: string;
    notes?: string;
    category?: string;
}
export interface UserProfile {
    displayName: string;
    goalType: GoalType;
}
export enum GoalType {
    other = "other",
    study = "study",
    fitness = "fitness",
    coding = "coding"
}
export enum TaskStatus {
    pending = "pending",
    done = "done"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTask(title: string, date: string, category: string | null, notes: string | null): Promise<void>;
    deleteTask(taskId: bigint): Promise<void>;
    editTask(taskId: bigint, newTitle: string, newDate: string, newStatus: TaskStatus, newCategory: string | null, newNotes: string | null): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getStreakStatus(): Promise<[bigint, bigint]>;
    getTasksByDate(date: string): Promise<Array<Task>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
