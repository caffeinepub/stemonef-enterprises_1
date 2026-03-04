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
