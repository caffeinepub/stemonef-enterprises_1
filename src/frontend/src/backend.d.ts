import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Pillar {
    id: bigint;
    mandate: string;
    operationalModel: string;
    name: string;
    strategicRole: string;
    governanceNote: string;
    initiatives: string;
    futureDirection: string;
}
export interface FeedEntry {
    id: bigint;
    title: string;
    domain: string;
    summary: string;
    isFeatured: boolean;
    timestamp: bigint;
    isPublic: boolean;
}
export interface CollaborationRequest {
    id: bigint;
    pathway: string;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createFeed(title: string, summary: string, domain: string, isPublic: boolean, isFeatured: boolean): Promise<void>;
    deleteFeed(id: bigint): Promise<void>;
    getAllPillars(): Promise<Array<Pillar>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCollaborationRequests(): Promise<Array<CollaborationRequest>>;
    getFeaturedFeeds(): Promise<Array<FeedEntry>>;
    getPathwayStats(): Promise<Array<[string, bigint]>>;
    getPublicFeeds(): Promise<Array<FeedEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    logPathwayInterest(pathway: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitCollaborationRequest(name: string, email: string, pathway: string, message: string): Promise<void>;
    toggleFeatured(id: bigint): Promise<void>;
    updateFeed(id: bigint, title: string, summary: string, domain: string, isPublic: boolean, isFeatured: boolean): Promise<void>;
}
