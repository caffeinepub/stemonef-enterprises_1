import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CollaborationRequest,
  FeedEntry,
  Pillar,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllPillars() {
  const { actor, isFetching } = useActor();
  return useQuery<Pillar[]>({
    queryKey: ["pillars"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPillars();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetPublicFeeds() {
  const { actor, isFetching } = useActor();
  return useQuery<FeedEntry[]>({
    queryKey: ["publicFeeds"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublicFeeds();
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetFeaturedFeeds() {
  const { actor, isFetching } = useActor();
  return useQuery<FeedEntry[]>({
    queryKey: ["featuredFeeds"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedFeeds();
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetCollaborationRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<CollaborationRequest[]>({
    queryKey: ["collaborationRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCollaborationRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPathwayStats() {
  const { actor, isFetching } = useActor();
  return useQuery<[string, bigint][]>({
    queryKey: ["pathwayStats"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPathwayStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogPathwayInterest() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (pathway: string) => {
      if (!actor) return;
      return actor.logPathwayInterest(pathway);
    },
  });
}

export function useSubmitCollaborationRequest() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      pathway,
      message,
    }: {
      name: string;
      email: string;
      pathway: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitCollaborationRequest(name, email, pathway, message);
    },
  });
}

export function useCreateFeed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      summary: string;
      domain: string;
      isPublic: boolean;
      isFeatured: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createFeed(
        data.title,
        data.summary,
        data.domain,
        data.isPublic,
        data.isFeatured,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["publicFeeds"] });
      void queryClient.invalidateQueries({ queryKey: ["featuredFeeds"] });
    },
  });
}

export function useUpdateFeed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      summary: string;
      domain: string;
      isPublic: boolean;
      isFeatured: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateFeed(
        data.id,
        data.title,
        data.summary,
        data.domain,
        data.isPublic,
        data.isFeatured,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["publicFeeds"] });
      void queryClient.invalidateQueries({ queryKey: ["featuredFeeds"] });
    },
  });
}

export function useDeleteFeed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteFeed(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["publicFeeds"] });
      void queryClient.invalidateQueries({ queryKey: ["featuredFeeds"] });
    },
  });
}

export function useToggleFeatured() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleFeatured(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["publicFeeds"] });
      void queryClient.invalidateQueries({ queryKey: ["featuredFeeds"] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

// ── HUMANON Query Hooks ──────────────────────────────────────────────────────

import type {
  HumanonMentor,
  HumanonPartner,
  HumanonProject,
  HumanonStats,
} from "../backend.d";

export function useGetHumanonMentors() {
  const { actor, isFetching } = useActor();
  return useQuery<HumanonMentor[]>({
    queryKey: ["humanonMentors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHumanonMentors();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3 * 60 * 1000,
  });
}

export function useGetHumanonProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<HumanonProject[]>({
    queryKey: ["humanonProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHumanonProjects();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3 * 60 * 1000,
  });
}

export function useGetHumanonPartners() {
  const { actor, isFetching } = useActor();
  return useQuery<HumanonPartner[]>({
    queryKey: ["humanonPartners"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHumanonPartners();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3 * 60 * 1000,
  });
}

export function useGetHumanonStats() {
  const { actor, isFetching } = useActor();
  return useQuery<HumanonStats | null>({
    queryKey: ["humanonStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHumanonStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateHumanonMentor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      domain: string;
      organization: string;
      role: string;
      profileUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createHumanonMentor(
        data.name,
        data.domain,
        data.organization,
        data.role,
        data.profileUrl,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["humanonMentors"] });
    },
  });
}

export function useDeleteHumanonMentor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteHumanonMentor(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["humanonMentors"] });
    },
  });
}

export function useCreateHumanonProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      researchDomain: string;
      participantTeam: string;
      summary: string;
      outcome: string;
      mentorsInvolved: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createHumanonProject(
        data.title,
        data.researchDomain,
        data.participantTeam,
        data.summary,
        data.outcome,
        data.mentorsInvolved,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["humanonProjects"] });
    },
  });
}

export function useUpdateHumanonProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      researchDomain: string;
      participantTeam: string;
      summary: string;
      outcome: string;
      mentorsInvolved: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateHumanonProject(
        data.id,
        data.title,
        data.researchDomain,
        data.participantTeam,
        data.summary,
        data.outcome,
        data.mentorsInvolved,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["humanonProjects"] });
    },
  });
}

export function useDeleteHumanonProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteHumanonProject(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["humanonProjects"] });
    },
  });
}

export function useCreateHumanonPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      sector: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createHumanonPartner(
        data.name,
        data.sector,
        data.description,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["humanonPartners"] });
    },
  });
}

export function useDeleteHumanonPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteHumanonPartner(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["humanonPartners"] });
    },
  });
}

export function useUpdateHumanonStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      participantsEnrolled: bigint;
      projectsCompleted: bigint;
      industryPartners: bigint;
      careerPlacements: bigint;
      countriesRepresented: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateHumanonStats(
        data.participantsEnrolled,
        data.projectsCompleted,
        data.industryPartners,
        data.careerPlacements,
        data.countriesRepresented,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["humanonStats"] });
    },
  });
}

// ── ELPIS Query Hooks ────────────────────────────────────────────────────────

import type {
  ElpisAnnouncement,
  ElpisCouncilMember,
  ElpisGuidanceArea,
} from "../backend.d";

export function useGetElpisCouncilMembers() {
  const { actor, isFetching } = useActor();
  return useQuery<ElpisCouncilMember[]>({
    queryKey: ["elpisCouncilMembers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getElpisCouncilMembers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetElpisGuidanceAreas() {
  const { actor, isFetching } = useActor();
  return useQuery<ElpisGuidanceArea[]>({
    queryKey: ["elpisGuidanceAreas"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getElpisGuidanceAreas();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetElpisAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery<ElpisAnnouncement[]>({
    queryKey: ["elpisAnnouncements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getElpisAnnouncements();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3 * 60 * 1000,
  });
}

export function useGetAllElpisAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery<ElpisAnnouncement[]>({
    queryKey: ["allElpisAnnouncements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllElpisAnnouncements();
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateElpisCouncilMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      domain: string;
      organization: string;
      role: string;
      biography: string;
      expertise: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createElpisCouncilMember(
        data.name,
        data.domain,
        data.organization,
        data.role,
        data.biography,
        data.expertise,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["elpisCouncilMembers"] });
    },
  });
}

export function useDeleteElpisCouncilMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteElpisCouncilMember(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["elpisCouncilMembers"] });
    },
  });
}

export function useCreateElpisGuidanceArea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      domain: string;
      description: string;
      contribution: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createElpisGuidanceArea(
        data.domain,
        data.description,
        data.contribution,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["elpisGuidanceAreas"] });
    },
  });
}

export function useDeleteElpisGuidanceArea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteElpisGuidanceArea(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["elpisGuidanceAreas"] });
    },
  });
}

export function useCreateElpisAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      summary: string;
      category: string;
      isPublic: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createElpisAnnouncement(
        data.title,
        data.summary,
        data.category,
        data.isPublic,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["elpisAnnouncements"] });
      void queryClient.invalidateQueries({
        queryKey: ["allElpisAnnouncements"],
      });
    },
  });
}

export function useDeleteElpisAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteElpisAnnouncement(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["elpisAnnouncements"] });
      void queryClient.invalidateQueries({
        queryKey: ["allElpisAnnouncements"],
      });
    },
  });
}
