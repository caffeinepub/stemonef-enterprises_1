import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ElpisCouncilMember {
    id: bigint;
    domain: string;
    name: string;
    role: string;
    biography: string;
    expertise: string;
    organization: string;
}
export interface HumanonPartner {
    id: bigint;
    name: string;
    description: string;
    sector: string;
}
export interface CollaborationRequest {
    id: bigint;
    pathway: string;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface ElpisAnnouncement {
    id: bigint;
    title: string;
    publishedAt: bigint;
    summary: string;
    category: string;
    isPublic: boolean;
}
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
export interface HumanonMentor {
    id: bigint;
    domain: string;
    name: string;
    role: string;
    organization: string;
    profileUrl: string;
}
export interface HumanonProject {
    id: bigint;
    title: string;
    participantTeam: string;
    publishedAt: bigint;
    summary: string;
    researchDomain: string;
    mentorsInvolved: string;
    outcome: string;
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
export interface ElpisGuidanceArea {
    id: bigint;
    domain: string;
    description: string;
    contribution: string;
}
export interface UserProfile {
    name: string;
}
export interface HumanonStats {
    participantsEnrolled: bigint;
    industryPartners: bigint;
    careerPlacements: bigint;
    countriesRepresented: bigint;
    projectsCompleted: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createElpisAnnouncement(title: string, summary: string, category: string, isPublic: boolean): Promise<void>;
    createElpisCouncilMember(name: string, domain: string, organization: string, role: string, biography: string, expertise: string): Promise<void>;
    createElpisGuidanceArea(domain: string, description: string, contribution: string): Promise<void>;
    createFeed(title: string, summary: string, domain: string, isPublic: boolean, isFeatured: boolean): Promise<void>;
    createHumanonMentor(name: string, domain: string, organization: string, role: string, profileUrl: string): Promise<void>;
    createHumanonPartner(name: string, sector: string, description: string): Promise<void>;
    createHumanonProject(title: string, researchDomain: string, participantTeam: string, summary: string, outcome: string, mentorsInvolved: string): Promise<void>;
    deleteElpisAnnouncement(id: bigint): Promise<void>;
    deleteElpisCouncilMember(id: bigint): Promise<void>;
    deleteElpisGuidanceArea(id: bigint): Promise<void>;
    deleteFeed(id: bigint): Promise<void>;
    deleteHumanonMentor(id: bigint): Promise<void>;
    deleteHumanonPartner(id: bigint): Promise<void>;
    deleteHumanonProject(id: bigint): Promise<void>;
    getAllElpisAnnouncements(): Promise<Array<ElpisAnnouncement>>;
    getAllPillars(): Promise<Array<Pillar>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCollaborationRequests(): Promise<Array<CollaborationRequest>>;
    getElpisAnnouncements(): Promise<Array<ElpisAnnouncement>>;
    getElpisCouncilMembers(): Promise<Array<ElpisCouncilMember>>;
    getElpisGuidanceAreas(): Promise<Array<ElpisGuidanceArea>>;
    getFeaturedFeeds(): Promise<Array<FeedEntry>>;
    getHumanonMentors(): Promise<Array<HumanonMentor>>;
    getHumanonPartners(): Promise<Array<HumanonPartner>>;
    getHumanonProjects(): Promise<Array<HumanonProject>>;
    getHumanonStats(): Promise<HumanonStats>;
    getPathwayStats(): Promise<Array<[string, bigint]>>;
    getPublicFeeds(): Promise<Array<FeedEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    logPathwayInterest(pathway: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitCollaborationRequest(name: string, email: string, pathway: string, message: string): Promise<void>;
    toggleFeatured(id: bigint): Promise<void>;
    updateFeed(id: bigint, title: string, summary: string, domain: string, isPublic: boolean, isFeatured: boolean): Promise<void>;
    updateHumanonProject(id: bigint, title: string, researchDomain: string, participantTeam: string, summary: string, outcome: string, mentorsInvolved: string): Promise<void>;
    updateHumanonStats(participantsEnrolled: bigint, projectsCompleted: bigint, industryPartners: bigint, careerPlacements: bigint, countriesRepresented: bigint): Promise<void>;
}
