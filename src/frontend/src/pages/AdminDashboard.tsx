import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { FeedEntry } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateElpisAnnouncement,
  useCreateElpisCouncilMember,
  useCreateElpisGuidanceArea,
  useCreateFeed,
  useCreateHumanonMentor,
  useCreateHumanonPartner,
  useCreateHumanonProject,
  useDeleteElpisAnnouncement,
  useDeleteElpisCouncilMember,
  useDeleteElpisGuidanceArea,
  useDeleteFeed,
  useDeleteHumanonMentor,
  useDeleteHumanonPartner,
  useDeleteHumanonProject,
  useGetAllElpisAnnouncements,
  useGetCollaborationRequests,
  useGetElpisCouncilMembers,
  useGetElpisGuidanceAreas,
  useGetHumanonMentors,
  useGetHumanonPartners,
  useGetHumanonProjects,
  useGetHumanonStats,
  useGetPathwayStats,
  useGetPublicFeeds,
  useIsAdmin,
  useToggleFeatured,
  useUpdateFeed,
  useUpdateHumanonProject,
  useUpdateHumanonStats,
} from "../hooks/useQueries";

function formatDate(ts: bigint): string {
  const ms = Number(ts);
  if (ms > 1e12) {
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return "—";
}

// ─── Category colours for admin ──────────────────────────────────────────────
const SIGNAL_CATEGORIES = [
  "AI",
  "Climate",
  "Technology",
  "Policy",
  "Research",
  "Global Systems",
] as const;
type SignalCategory = (typeof SIGNAL_CATEGORIES)[number];

const SIGNAL_CATEGORY_COLORS: Record<SignalCategory, string> = {
  AI: "#4a7ef7",
  Climate: "#34d399",
  Technology: "#22d3ee",
  Policy: "#a78bfa",
  Research: "#f59e0b",
  "Global Systems": "#d4a017",
};

// Local storage key for extended signal metadata
const SIGNAL_META_KEY = "stemonef_signal_meta";

interface SignalMeta {
  source: string;
  detailedInsight: string;
}

function loadSignalMeta(): Record<string, SignalMeta> {
  try {
    const raw = localStorage.getItem(SIGNAL_META_KEY);
    return raw ? (JSON.parse(raw) as Record<string, SignalMeta>) : {};
  } catch {
    return {};
  }
}

function saveSignalMeta(meta: Record<string, SignalMeta>) {
  localStorage.setItem(SIGNAL_META_KEY, JSON.stringify(meta));
}

const adminInputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.8)",
};

const selectTriggerStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.8)",
};

function FeedTab() {
  const { data: feeds, isLoading } = useGetPublicFeeds();
  const createFeed = useCreateFeed();
  const updateFeed = useUpdateFeed();
  const deleteFeed = useDeleteFeed();
  const toggleFeatured = useToggleFeatured();

  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [signalMeta, setSignalMeta] =
    useState<Record<string, SignalMeta>>(loadSignalMeta);
  const [newFeed, setNewFeed] = useState({
    title: "",
    summary: "",
    domain: "" as SignalCategory | "",
    isPublic: true,
    isFeatured: false,
    source: "",
    detailedInsight: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeed.title || !newFeed.summary || !newFeed.domain) {
      toast.error("Title, summary and category are required");
      return;
    }
    try {
      await createFeed.mutateAsync({
        title: newFeed.title,
        summary: newFeed.summary,
        domain: newFeed.domain,
        isPublic: newFeed.isPublic,
        isFeatured: newFeed.isFeatured,
      });
      setNewFeed({
        title: "",
        summary: "",
        domain: "",
        isPublic: true,
        isFeatured: false,
        source: "",
        detailedInsight: "",
      });
      toast.success("Signal published");
    } catch {
      toast.error("Failed to publish signal");
    }
  };

  const [editData, setEditData] = useState<
    Partial<FeedEntry & { source: string; detailedInsight: string }>
  >({});
  const startEdit = (feed: FeedEntry) => {
    const meta = signalMeta[String(feed.id)] || {
      source: "",
      detailedInsight: "",
    };
    setEditingId(feed.id);
    setEditData({
      title: feed.title,
      summary: feed.summary,
      domain: feed.domain,
      isPublic: feed.isPublic,
      isFeatured: feed.isFeatured,
      source: meta.source,
      detailedInsight: meta.detailedInsight,
    });
  };

  const handleUpdate = async () => {
    if (!editingId || !editData.title || !editData.summary || !editData.domain)
      return;
    try {
      await updateFeed.mutateAsync({
        id: editingId,
        title: editData.title!,
        summary: editData.summary!,
        domain: editData.domain!,
        isPublic: editData.isPublic ?? true,
        isFeatured: editData.isFeatured ?? false,
      });
      // Update local meta
      const updated = {
        ...signalMeta,
        [String(editingId)]: {
          source: editData.source || "",
          detailedInsight: editData.detailedInsight || "",
        },
      };
      setSignalMeta(updated);
      saveSignalMeta(updated);
      setEditingId(null);
      toast.success("Signal updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this intelligence signal?")) return;
    try {
      await deleteFeed.mutateAsync(id);
      const updated = { ...signalMeta };
      delete updated[String(id)];
      setSignalMeta(updated);
      saveSignalMeta(updated);
      toast.success("Signal deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const categoryColor = (domain: string) =>
    SIGNAL_CATEGORY_COLORS[domain as SignalCategory] || "#94a3b8";

  return (
    <div className="space-y-8">
      {/* ── Create form ── */}
      <div
        className="p-6 rounded-sm"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(212,160,23,0.15)",
        }}
      >
        {/* Form header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            style={{
              width: 3,
              height: 28,
              background:
                "linear-gradient(180deg, #d4a017, rgba(212,160,23,0.1))",
              borderRadius: "2px",
            }}
          />
          <div>
            <div
              className="text-xs tracking-[0.3em] uppercase"
              style={{
                color: "rgba(212,160,23,0.8)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              ADD INTELLIGENCE SIGNAL
            </div>
            <div
              className="text-[9px] tracking-[0.1em] mt-0.5"
              style={{
                color: "rgba(255,255,255,0.25)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              STEAMI Intelligence Feed Manager
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => void handleCreate(e)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Title */}
          <div>
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Signal Title
            </Label>
            <Input
              data-ocid="admin.feed.input"
              value={newFeed.title}
              onChange={(e) =>
                setNewFeed((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="e.g. AI Governance Landscape"
              className="mt-1"
              style={adminInputStyle}
            />
          </div>

          {/* Category / Domain */}
          <div>
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Category
            </Label>
            <Select
              value={newFeed.domain}
              onValueChange={(v) =>
                setNewFeed((p) => ({ ...p, domain: v as SignalCategory }))
              }
            >
              <SelectTrigger
                data-ocid="admin.feed.select"
                className="mt-1"
                style={selectTriggerStyle}
              >
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {SIGNAL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: categoryColor(cat),
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      {cat}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Source */}
          <div>
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Source
            </Label>
            <Input
              value={newFeed.source}
              onChange={(e) =>
                setNewFeed((p) => ({ ...p, source: e.target.value }))
              }
              placeholder="e.g. STEAMI Intelligence"
              className="mt-1"
              style={adminInputStyle}
            />
          </div>

          {/* Switches */}
          <div className="flex items-end gap-6 pb-1">
            <div className="flex items-center gap-2">
              <Switch
                data-ocid="admin.feed.switch"
                checked={newFeed.isPublic}
                onCheckedChange={(v) =>
                  setNewFeed((p) => ({ ...p, isPublic: v }))
                }
              />
              <Label
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Published
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                data-ocid="admin.feed.switch"
                checked={newFeed.isFeatured}
                onCheckedChange={(v) =>
                  setNewFeed((p) => ({ ...p, isFeatured: v }))
                }
              />
              <Label
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Featured Signal
              </Label>
            </div>
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Signal Summary
            </Label>
            <Textarea
              data-ocid="admin.feed.textarea"
              value={newFeed.summary}
              onChange={(e) =>
                setNewFeed((p) => ({ ...p, summary: e.target.value }))
              }
              placeholder="Short intelligence summary shown on signal card..."
              rows={3}
              className="mt-1 resize-none"
              style={adminInputStyle}
            />
          </div>

          {/* Detailed insight */}
          <div className="md:col-span-2">
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Detailed Insight (Expanded View)
            </Label>
            <Textarea
              value={newFeed.detailedInsight}
              onChange={(e) =>
                setNewFeed((p) => ({ ...p, detailedInsight: e.target.value }))
              }
              placeholder="Extended intelligence brief for expanded view..."
              rows={4}
              className="mt-1 resize-none"
              style={adminInputStyle}
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              data-ocid="admin.feed.submit_button"
              disabled={createFeed.isPending}
              style={{
                background: newFeed.isPublic
                  ? "rgba(212,160,23,0.12)"
                  : "rgba(255,255,255,0.05)",
                border: newFeed.isPublic
                  ? "1px solid rgba(212,160,23,0.4)"
                  : "1px solid rgba(255,255,255,0.15)",
                color: newFeed.isPublic ? "#d4a017" : "rgba(255,255,255,0.5)",
                fontFamily: "Geist Mono, monospace",
                letterSpacing: "0.15em",
                fontSize: "11px",
              }}
            >
              {createFeed.isPending
                ? "PROCESSING..."
                : newFeed.isPublic
                  ? "◆ PUBLISH SIGNAL"
                  : "◇ SAVE AS DRAFT"}
            </Button>
          </div>
        </form>
      </div>

      {/* ── Signal table ── */}
      <div
        className="rounded-sm overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Table header */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <span
            className="text-[9px] tracking-[0.25em] uppercase"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            INTELLIGENCE SIGNALS
          </span>
          {!isLoading && (
            <span
              className="text-[9px] tracking-[0.15em]"
              style={{
                color: "rgba(74,126,247,0.6)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              {(feeds || []).length} TOTAL
            </span>
          )}
        </div>

        {isLoading ? (
          <div
            data-ocid="admin.feed.loading_state"
            className="p-8 text-center font-mono-geist text-xs"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Loading signals...
          </div>
        ) : (
          <Table data-ocid="admin.feed.table">
            <TableHeader>
              <TableRow style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {[
                  "Category",
                  "Title",
                  "Featured",
                  "Status",
                  "Published",
                  "Actions",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="font-mono-geist text-[9px] tracking-[0.25em] uppercase"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(feeds || []).map((feed, i) => (
                <TableRow
                  key={String(feed.id)}
                  data-ocid={`admin.feed.row.${i + 1}`}
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  {editingId === feed.id ? (
                    <>
                      {/* Edit: category select */}
                      <TableCell>
                        <Select
                          value={editData.domain || ""}
                          onValueChange={(v) =>
                            setEditData((p) => ({ ...p, domain: v }))
                          }
                        >
                          <SelectTrigger
                            className="h-7 text-xs min-w-[120px]"
                            style={selectTriggerStyle}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SIGNAL_CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                <span className="flex items-center gap-2">
                                  <span
                                    style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: "50%",
                                      background: categoryColor(cat),
                                      display: "inline-block",
                                    }}
                                  />
                                  {cat}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      {/* Edit: title */}
                      <TableCell>
                        <Input
                          value={editData.title || ""}
                          onChange={(e) =>
                            setEditData((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
                          }
                          className="h-7 text-xs"
                          style={adminInputStyle}
                        />
                      </TableCell>
                      {/* Edit: featured */}
                      <TableCell>
                        <Switch
                          checked={editData.isFeatured}
                          onCheckedChange={(v) =>
                            setEditData((p) => ({ ...p, isFeatured: v }))
                          }
                        />
                      </TableCell>
                      {/* Edit: published */}
                      <TableCell>
                        <Switch
                          checked={editData.isPublic}
                          onCheckedChange={(v) =>
                            setEditData((p) => ({ ...p, isPublic: v }))
                          }
                        />
                      </TableCell>
                      <TableCell
                        style={{ color: "rgba(255,255,255,0.3)" }}
                        className="text-xs"
                      >
                        {formatDate(feed.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            data-ocid="admin.feed.save_button"
                            onClick={() => void handleUpdate()}
                            className="px-3 py-1 text-[10px] tracking-widest uppercase"
                            style={{
                              background: "rgba(52,211,153,0.1)",
                              border: "1px solid rgba(52,211,153,0.3)",
                              color: "rgba(52,211,153,0.8)",
                              fontFamily: "Geist Mono, monospace",
                              cursor: "pointer",
                              borderRadius: "2px",
                            }}
                          >
                            SAVE
                          </button>
                          <button
                            type="button"
                            data-ocid="admin.feed.cancel_button"
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 text-[10px] tracking-widest uppercase"
                            style={{
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "rgba(255,255,255,0.4)",
                              fontFamily: "Geist Mono, monospace",
                              cursor: "pointer",
                              borderRadius: "2px",
                            }}
                          >
                            CANCEL
                          </button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      {/* Domain cell with colour dot */}
                      <TableCell>
                        <span className="flex items-center gap-1.5">
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: categoryColor(feed.domain),
                              display: "inline-block",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            className="text-[9px] tracking-widest uppercase"
                            style={{
                              color: categoryColor(feed.domain),
                              fontFamily: "Geist Mono, monospace",
                            }}
                          >
                            {feed.domain}
                          </span>
                        </span>
                      </TableCell>
                      {/* Title + DRAFT badge */}
                      <TableCell
                        className="text-xs max-w-[180px]"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="truncate">{feed.title}</span>
                          {!feed.isPublic && (
                            <span
                              className="text-[7px] tracking-[0.2em] uppercase px-1.5 py-0.5 rounded-[1px] flex-shrink-0"
                              style={{
                                background: "rgba(248,113,113,0.1)",
                                border: "1px solid rgba(248,113,113,0.3)",
                                color: "rgba(248,113,113,0.8)",
                                fontFamily: "Geist Mono, monospace",
                              }}
                            >
                              DRAFT
                            </span>
                          )}
                        </div>
                      </TableCell>
                      {/* Featured toggle */}
                      <TableCell>
                        <button
                          type="button"
                          data-ocid="admin.feed.toggle"
                          onClick={() =>
                            void toggleFeatured.mutateAsync(feed.id)
                          }
                          className="text-[10px] tracking-widest uppercase"
                          style={{
                            background: "none",
                            border: "none",
                            color: feed.isFeatured
                              ? "#d4a017"
                              : "rgba(255,255,255,0.25)",
                            cursor: "pointer",
                            fontFamily: "Geist Mono, monospace",
                          }}
                        >
                          {feed.isFeatured ? "◆ YES" : "◇ NO"}
                        </button>
                      </TableCell>
                      {/* Published status */}
                      <TableCell
                        className="text-xs"
                        style={{
                          color: feed.isPublic
                            ? "rgba(52,211,153,0.7)"
                            : "rgba(255,255,255,0.25)",
                          fontFamily: "Geist Mono, monospace",
                        }}
                      >
                        {feed.isPublic ? "PUBLISHED" : "DRAFT"}
                      </TableCell>
                      {/* Date */}
                      <TableCell
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {formatDate(feed.timestamp)}
                      </TableCell>
                      {/* Actions */}
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            data-ocid={`admin.feed.edit_button.${i + 1}`}
                            onClick={() => startEdit(feed)}
                            className="px-3 py-1 text-[10px] tracking-widest uppercase"
                            style={{
                              background: "rgba(74,126,247,0.08)",
                              border: "1px solid rgba(74,126,247,0.2)",
                              color: "rgba(74,126,247,0.7)",
                              fontFamily: "Geist Mono, monospace",
                              cursor: "pointer",
                              borderRadius: "2px",
                            }}
                          >
                            EDIT
                          </button>
                          <button
                            type="button"
                            data-ocid={`admin.feed.delete_button.${i + 1}`}
                            onClick={() => void handleDelete(feed.id)}
                            className="px-3 py-1 text-[10px] tracking-widest uppercase"
                            style={{
                              background: "rgba(248,113,113,0.08)",
                              border: "1px solid rgba(248,113,113,0.2)",
                              color: "rgba(248,113,113,0.7)",
                              fontFamily: "Geist Mono, monospace",
                              cursor: "pointer",
                              borderRadius: "2px",
                            }}
                          >
                            DELETE
                          </button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {(feeds || []).length === 0 && (
                <TableRow>
                  <TableCell
                    data-ocid="admin.feed.empty_state"
                    colSpan={6}
                    className="text-center py-8 text-xs"
                    style={{
                      color: "rgba(255,255,255,0.25)",
                      fontFamily: "Geist Mono, monospace",
                    }}
                  >
                    No intelligence signals. Create the first signal above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function RequestsTab() {
  const { data: requests, isLoading } = useGetCollaborationRequests();

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {isLoading ? (
        <div
          data-ocid="admin.requests.loading_state"
          className="p-8 text-center font-mono-geist text-xs"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Loading requests...
        </div>
      ) : (
        <Table data-ocid="admin.requests.table">
          <TableHeader>
            <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {["Name", "Email", "Pathway", "Message", "Received"].map((h) => (
                <TableHead
                  key={h}
                  className="font-mono-geist text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {(requests || []).map((req, i) => (
              <TableRow
                key={String(req.id)}
                data-ocid={`admin.requests.row.${i + 1}`}
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                <TableCell
                  className="text-xs font-medium"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {req.name}
                </TableCell>
                <TableCell
                  className="text-xs"
                  style={{ color: "rgba(74,126,247,0.7)" }}
                >
                  {req.email}
                </TableCell>
                <TableCell>
                  <span
                    className="text-[9px] tracking-widest uppercase px-2 py-0.5"
                    style={{
                      color: "rgba(212,160,23,0.8)",
                      background: "rgba(212,160,23,0.08)",
                      fontFamily: "Geist Mono, monospace",
                      borderRadius: "2px",
                    }}
                  >
                    {req.pathway}
                  </span>
                </TableCell>
                <TableCell
                  className="text-xs max-w-[250px] truncate"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {req.message}
                </TableCell>
                <TableCell
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {formatDate(req.timestamp)}
                </TableCell>
              </TableRow>
            ))}
            {(requests || []).length === 0 && (
              <TableRow>
                <TableCell
                  data-ocid="admin.requests.empty_state"
                  colSpan={5}
                  className="text-center py-8 text-xs"
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  No collaboration requests yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function PathwayStatsTab() {
  const { data: stats, isLoading } = useGetPathwayStats();

  const maxCount = stats
    ? Math.max(...stats.map(([, count]) => Number(count)), 1)
    : 1;

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div
          data-ocid="admin.stats.loading_state"
          className="p-8 text-center font-mono-geist text-xs"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Loading pathway data...
        </div>
      ) : (
        <>
          {(stats || []).map(([pathway, count], i) => {
            const pct = (Number(count) / maxCount) * 100;
            return (
              <div
                key={pathway}
                data-ocid={`admin.stats.item.${i + 1}`}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span
                    className="font-mono-geist text-xs"
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {pathway}
                  </span>
                  <span
                    className="font-mono-geist text-xs"
                    style={{ color: "rgba(212,160,23,0.8)" }}
                  >
                    {String(count)}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="h-full transition-all duration-700 rounded-full"
                    style={{
                      width: `${pct}%`,
                      background:
                        "linear-gradient(90deg, rgba(74,126,247,0.7), rgba(212,160,23,0.7))",
                    }}
                  />
                </div>
              </div>
            );
          })}
          {(stats || []).length === 0 && (
            <div
              data-ocid="admin.stats.empty_state"
              className="p-8 text-center font-mono-geist text-xs"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              No pathway interest data yet.
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── HUMANON Manager ─────────────────────────────────────────────────────────

const TEAL = "#22d3b0";
const GOLD = "#d4a017";
const BLUE = "#4a7ef7";

function HumanonMentorsTab() {
  const { data: mentors, isLoading } = useGetHumanonMentors();
  const createMentor = useCreateHumanonMentor();
  const deleteMentor = useDeleteHumanonMentor();
  const [form, setForm] = useState({
    name: "",
    domain: "",
    organization: "",
    role: "",
    profileUrl: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.domain || !form.organization || !form.role) {
      toast.error("Name, domain, organization, and role are required");
      return;
    }
    try {
      await createMentor.mutateAsync(form);
      setForm({
        name: "",
        domain: "",
        organization: "",
        role: "",
        profileUrl: "",
      });
      toast.success("Mentor created");
    } catch {
      toast.error("Failed to create mentor");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this mentor?")) return;
    try {
      await deleteMentor.mutateAsync(id);
      toast.success("Mentor deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div
        className="p-6 rounded-sm"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="font-mono-geist text-xs tracking-[0.3em] uppercase mb-5"
          style={{ color: `${TEAL}b3` }}
        >
          ADD MENTOR
        </div>
        <form
          onSubmit={(e) => void handleCreate(e)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { key: "name", label: "Full Name", placeholder: "Dr. Jane Smith" },
            {
              key: "domain",
              label: "Research Domain",
              placeholder: "Climate Systems",
            },
            {
              key: "organization",
              label: "Organization",
              placeholder: "EPOCHS Research",
            },
            { key: "role", label: "Role", placeholder: "Senior Research Lead" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <Label
                className="text-[10px] tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {label}
              </Label>
              <Input
                data-ocid="admin.humanon.mentor.input"
                value={form[key as keyof typeof form]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [key]: e.target.value }))
                }
                placeholder={placeholder}
                className="mt-1"
                style={adminInputStyle}
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Profile URL (optional)
            </Label>
            <Input
              data-ocid="admin.humanon.mentor.input"
              value={form.profileUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, profileUrl: e.target.value }))
              }
              placeholder="https://..."
              className="mt-1"
              style={adminInputStyle}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              data-ocid="admin.humanon.mentor.submit_button"
              disabled={createMentor.isPending}
              style={{
                background: "rgba(34,211,176,0.1)",
                border: "1px solid rgba(34,211,176,0.4)",
                color: TEAL,
                fontFamily: "Geist Mono, monospace",
                letterSpacing: "0.15em",
                fontSize: "11px",
              }}
            >
              {createMentor.isPending ? "ADDING..." : "ADD MENTOR"}
            </Button>
          </div>
        </form>
      </div>

      <div
        className="rounded-sm overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {isLoading ? (
          <div
            data-ocid="admin.humanon.mentor.loading_state"
            className="p-8 text-center font-mono-geist text-xs"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Loading mentors...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {["Name", "Domain", "Organization", "Role", "Actions"].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="font-mono-geist text-[9px] tracking-[0.3em] uppercase"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {h}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(mentors || []).map((m, i) => (
                <TableRow
                  key={String(m.id)}
                  data-ocid={`admin.humanon.mentor.row.${i + 1}`}
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <TableCell
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {m.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                      style={{
                        color: `${TEAL}cc`,
                        background: `${TEAL}18`,
                        fontFamily: "Geist Mono, monospace",
                      }}
                    >
                      {m.domain}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {m.organization}
                  </TableCell>
                  <TableCell
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {m.role}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      data-ocid={`admin.humanon.mentor.delete_button.${i + 1}`}
                      onClick={() => void handleDelete(m.id)}
                      className="px-3 py-1 text-[10px] tracking-widest uppercase"
                      style={{
                        background: "rgba(248,113,113,0.08)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        color: "rgba(248,113,113,0.7)",
                        fontFamily: "Geist Mono, monospace",
                        cursor: "pointer",
                        borderRadius: "2px",
                      }}
                    >
                      DELETE
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {(mentors || []).length === 0 && (
                <TableRow>
                  <TableCell
                    data-ocid="admin.humanon.mentor.empty_state"
                    colSpan={5}
                    className="text-center py-8 text-xs"
                    style={{
                      color: "rgba(255,255,255,0.25)",
                      fontFamily: "Geist Mono, monospace",
                    }}
                  >
                    No mentors yet. Add the first mentor above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function HumanonProjectsTab() {
  const { data: projects, isLoading } = useGetHumanonProjects();
  const createProject = useCreateHumanonProject();
  const updateProject = useUpdateHumanonProject();
  const deleteProject = useDeleteHumanonProject();

  const emptyForm = {
    title: "",
    researchDomain: "",
    participantTeam: "",
    summary: "",
    outcome: "",
    mentorsInvolved: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.researchDomain || !form.summary) {
      toast.error("Title, domain, and summary are required");
      return;
    }
    try {
      await createProject.mutateAsync(form);
      setForm(emptyForm);
      toast.success("Project created");
    } catch {
      toast.error("Failed to create project");
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editForm.title || !editForm.summary) return;
    try {
      await updateProject.mutateAsync({ id: editingId, ...editForm });
      setEditingId(null);
      toast.success("Project updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Project deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const formFields = [
    {
      key: "title",
      label: "Project Title",
      placeholder: "Research project title",
      span: 2,
    },
    {
      key: "researchDomain",
      label: "Research Domain",
      placeholder: "Climate, Ethical AI, etc.",
      span: 1,
    },
    {
      key: "participantTeam",
      label: "Participant Team",
      placeholder: "Cohort 1 — 3 researchers",
      span: 1,
    },
    {
      key: "mentorsInvolved",
      label: "Mentors Involved",
      placeholder: "Dr. Smith, Dr. Jones",
      span: 2,
    },
  ];

  return (
    <div className="space-y-8">
      <div
        className="p-6 rounded-sm"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="font-mono-geist text-xs tracking-[0.3em] uppercase mb-5"
          style={{ color: `${GOLD}b3` }}
        >
          ADD PROJECT
        </div>
        <form
          onSubmit={(e) => void handleCreate(e)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {formFields.map(({ key, label, placeholder, span }) => (
            <div key={key} className={span === 2 ? "md:col-span-2" : ""}>
              <Label
                className="text-[10px] tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {label}
              </Label>
              <Input
                data-ocid="admin.humanon.project.input"
                value={form[key as keyof typeof emptyForm]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [key]: e.target.value }))
                }
                placeholder={placeholder}
                className="mt-1"
                style={adminInputStyle}
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Summary
            </Label>
            <Textarea
              data-ocid="admin.humanon.project.textarea"
              value={form.summary}
              onChange={(e) =>
                setForm((p) => ({ ...p, summary: e.target.value }))
              }
              placeholder="Research summary..."
              rows={3}
              className="mt-1 resize-none"
              style={adminInputStyle}
            />
          </div>
          <div className="md:col-span-2">
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Outcome
            </Label>
            <Textarea
              data-ocid="admin.humanon.project.textarea"
              value={form.outcome}
              onChange={(e) =>
                setForm((p) => ({ ...p, outcome: e.target.value }))
              }
              placeholder="Research outcome and impact..."
              rows={2}
              className="mt-1 resize-none"
              style={adminInputStyle}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              data-ocid="admin.humanon.project.submit_button"
              disabled={createProject.isPending}
              style={{
                background: "rgba(212,160,23,0.1)",
                border: "1px solid rgba(212,160,23,0.4)",
                color: GOLD,
                fontFamily: "Geist Mono, monospace",
                letterSpacing: "0.15em",
                fontSize: "11px",
              }}
            >
              {createProject.isPending ? "ADDING..." : "ADD PROJECT"}
            </Button>
          </div>
        </form>
      </div>

      <div
        className="rounded-sm overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {isLoading ? (
          <div
            className="p-8 text-center font-mono-geist text-xs"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Loading projects...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {["Title", "Domain", "Team", "Actions"].map((h) => (
                  <TableHead
                    key={h}
                    className="font-mono-geist text-[9px] tracking-[0.3em] uppercase"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(projects || []).map((p, i) => (
                <TableRow
                  key={String(p.id)}
                  data-ocid={`admin.humanon.project.row.${i + 1}`}
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  {editingId === p.id ? (
                    <>
                      <TableCell>
                        <Input
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((x) => ({
                              ...x,
                              title: e.target.value,
                            }))
                          }
                          className="h-7 text-xs"
                          style={adminInputStyle}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.researchDomain}
                          onChange={(e) =>
                            setEditForm((x) => ({
                              ...x,
                              researchDomain: e.target.value,
                            }))
                          }
                          className="h-7 text-xs"
                          style={adminInputStyle}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.participantTeam}
                          onChange={(e) =>
                            setEditForm((x) => ({
                              ...x,
                              participantTeam: e.target.value,
                            }))
                          }
                          className="h-7 text-xs"
                          style={adminInputStyle}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            data-ocid="admin.humanon.project.save_button"
                            onClick={() => void handleUpdate()}
                            className="px-3 py-1 text-[10px] tracking-widest uppercase"
                            style={{
                              background: "rgba(52,211,153,0.1)",
                              border: "1px solid rgba(52,211,153,0.3)",
                              color: "rgba(52,211,153,0.8)",
                              fontFamily: "Geist Mono, monospace",
                              cursor: "pointer",
                              borderRadius: "2px",
                            }}
                          >
                            SAVE
                          </button>
                          <button
                            type="button"
                            data-ocid="admin.humanon.project.cancel_button"
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 text-[10px] tracking-widest uppercase"
                            style={{
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "rgba(255,255,255,0.4)",
                              fontFamily: "Geist Mono, monospace",
                              cursor: "pointer",
                              borderRadius: "2px",
                            }}
                          >
                            CANCEL
                          </button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell
                        className="text-xs max-w-[180px] truncate"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {p.title}
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                          style={{
                            color: `${BLUE}cc`,
                            background: `${BLUE}18`,
                            fontFamily: "Geist Mono, monospace",
                          }}
                        >
                          {p.researchDomain}
                        </span>
                      </TableCell>
                      <TableCell
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {p.participantTeam}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            data-ocid={`admin.humanon.project.edit_button.${i + 1}`}
                            onClick={() => {
                              setEditingId(p.id);
                              setEditForm({
                                title: p.title,
                                researchDomain: p.researchDomain,
                                participantTeam: p.participantTeam,
                                summary: p.summary,
                                outcome: p.outcome,
                                mentorsInvolved: p.mentorsInvolved,
                              });
                            }}
                            className="px-3 py-1 text-[10px] tracking-widest uppercase"
                            style={{
                              background: "rgba(74,126,247,0.08)",
                              border: "1px solid rgba(74,126,247,0.2)",
                              color: "rgba(74,126,247,0.7)",
                              fontFamily: "Geist Mono, monospace",
                              cursor: "pointer",
                              borderRadius: "2px",
                            }}
                          >
                            EDIT
                          </button>
                          <button
                            type="button"
                            data-ocid={`admin.humanon.project.delete_button.${i + 1}`}
                            onClick={() => void handleDelete(p.id)}
                            className="px-3 py-1 text-[10px] tracking-widest uppercase"
                            style={{
                              background: "rgba(248,113,113,0.08)",
                              border: "1px solid rgba(248,113,113,0.2)",
                              color: "rgba(248,113,113,0.7)",
                              fontFamily: "Geist Mono, monospace",
                              cursor: "pointer",
                              borderRadius: "2px",
                            }}
                          >
                            DELETE
                          </button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {(projects || []).length === 0 && (
                <TableRow>
                  <TableCell
                    data-ocid="admin.humanon.project.empty_state"
                    colSpan={4}
                    className="text-center py-8 text-xs"
                    style={{
                      color: "rgba(255,255,255,0.25)",
                      fontFamily: "Geist Mono, monospace",
                    }}
                  >
                    No projects yet. Add the first project above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function HumanonPartnersTab() {
  const { data: partners, isLoading } = useGetHumanonPartners();
  const createPartner = useCreateHumanonPartner();
  const deletePartner = useDeleteHumanonPartner();
  const [form, setForm] = useState({ name: "", sector: "", description: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.sector || !form.description) {
      toast.error("All fields are required");
      return;
    }
    try {
      await createPartner.mutateAsync(form);
      setForm({ name: "", sector: "", description: "" });
      toast.success("Partner created");
    } catch {
      toast.error("Failed to create partner");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this partner?")) return;
    try {
      await deletePartner.mutateAsync(id);
      toast.success("Partner deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div
        className="p-6 rounded-sm"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="font-mono-geist text-xs tracking-[0.3em] uppercase mb-5"
          style={{ color: `${BLUE}b3` }}
        >
          ADD INDUSTRY PARTNER
        </div>
        <form
          onSubmit={(e) => void handleCreate(e)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Organization Name
            </Label>
            <Input
              data-ocid="admin.humanon.partner.input"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Partner organization"
              className="mt-1"
              style={adminInputStyle}
            />
          </div>
          <div>
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Industry Sector
            </Label>
            <Input
              data-ocid="admin.humanon.partner.input"
              value={form.sector}
              onChange={(e) =>
                setForm((p) => ({ ...p, sector: e.target.value }))
              }
              placeholder="Healthcare, Energy, Technology..."
              className="mt-1"
              style={adminInputStyle}
            />
          </div>
          <div className="md:col-span-2">
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Description
            </Label>
            <Textarea
              data-ocid="admin.humanon.partner.textarea"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Partnership description..."
              rows={2}
              className="mt-1 resize-none"
              style={adminInputStyle}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              disabled={createPartner.isPending}
              style={{
                background: "rgba(74,126,247,0.1)",
                border: "1px solid rgba(74,126,247,0.4)",
                color: BLUE,
                fontFamily: "Geist Mono, monospace",
                letterSpacing: "0.15em",
                fontSize: "11px",
              }}
            >
              {createPartner.isPending ? "ADDING..." : "ADD PARTNER"}
            </Button>
          </div>
        </form>
      </div>

      <div
        className="rounded-sm overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {isLoading ? (
          <div
            className="p-8 text-center font-mono-geist text-xs"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Loading partners...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {["Name", "Sector", "Description", "Actions"].map((h) => (
                  <TableHead
                    key={h}
                    className="font-mono-geist text-[9px] tracking-[0.3em] uppercase"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(partners || []).map((p, i) => (
                <TableRow
                  key={String(p.id)}
                  data-ocid={`admin.humanon.partner.row.${i + 1}`}
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <TableCell
                    className="text-xs font-medium"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {p.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                      style={{
                        color: `${BLUE}cc`,
                        background: `${BLUE}18`,
                        fontFamily: "Geist Mono, monospace",
                      }}
                    >
                      {p.sector}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-xs max-w-[200px] truncate"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {p.description}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      data-ocid={`admin.humanon.partner.delete_button.${i + 1}`}
                      onClick={() => void handleDelete(p.id)}
                      className="px-3 py-1 text-[10px] tracking-widest uppercase"
                      style={{
                        background: "rgba(248,113,113,0.08)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        color: "rgba(248,113,113,0.7)",
                        fontFamily: "Geist Mono, monospace",
                        cursor: "pointer",
                        borderRadius: "2px",
                      }}
                    >
                      DELETE
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {(partners || []).length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-xs"
                    style={{
                      color: "rgba(255,255,255,0.25)",
                      fontFamily: "Geist Mono, monospace",
                    }}
                  >
                    No partners yet. Add the first partner above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function HumanonStatsTab() {
  const { data: stats, isLoading } = useGetHumanonStats();
  const updateStats = useUpdateHumanonStats();
  const [form, setForm] = useState({
    participantsEnrolled: "30",
    projectsCompleted: "8",
    industryPartners: "4",
    careerPlacements: "22",
    countriesRepresented: "6",
  });

  useEffect(() => {
    if (stats) {
      setForm({
        participantsEnrolled: String(Number(stats.participantsEnrolled)),
        projectsCompleted: String(Number(stats.projectsCompleted)),
        industryPartners: String(Number(stats.industryPartners)),
        careerPlacements: String(Number(stats.careerPlacements)),
        countriesRepresented: String(Number(stats.countriesRepresented)),
      });
    }
  }, [stats]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStats.mutateAsync({
        participantsEnrolled: BigInt(Number(form.participantsEnrolled) || 0),
        projectsCompleted: BigInt(Number(form.projectsCompleted) || 0),
        industryPartners: BigInt(Number(form.industryPartners) || 0),
        careerPlacements: BigInt(Number(form.careerPlacements) || 0),
        countriesRepresented: BigInt(Number(form.countriesRepresented) || 0),
      });
      toast.success("Stats updated");
    } catch {
      toast.error("Failed to update stats");
    }
  };

  const statFields = [
    {
      key: "participantsEnrolled",
      label: "Participants Enrolled",
      color: "#22d3b0",
    },
    { key: "projectsCompleted", label: "Projects Completed", color: BLUE },
    { key: "industryPartners", label: "Industry Partners", color: GOLD },
    { key: "careerPlacements", label: "Career Placements", color: "#a78bfa" },
    {
      key: "countriesRepresented",
      label: "Countries Represented",
      color: "#34d399",
    },
  ] as const;

  if (isLoading) {
    return (
      <div
        className="p-8 text-center font-mono-geist text-xs"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        Loading stats...
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-sm max-w-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="font-mono-geist text-xs tracking-[0.3em] uppercase mb-6"
        style={{ color: `${GOLD}b3` }}
      >
        UPDATE HUMANON STATISTICS
      </div>
      <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
        {statFields.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-4">
            <div
              className="w-2 h-8 rounded-full shrink-0"
              style={{ background: color }}
            />
            <div className="flex-1">
              <Label
                className="text-[10px] tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {label}
              </Label>
              <Input
                data-ocid="admin.humanon.stats.input"
                type="number"
                min="0"
                value={form[key]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [key]: e.target.value }))
                }
                className="mt-1"
                style={adminInputStyle}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            data-ocid="admin.humanon.stats.submit_button"
            disabled={updateStats.isPending}
            style={{
              background: "rgba(212,160,23,0.1)",
              border: "1px solid rgba(212,160,23,0.4)",
              color: GOLD,
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.15em",
              fontSize: "11px",
            }}
          >
            {updateStats.isPending ? "SAVING..." : "SAVE STATS"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function HumanonManagerTab() {
  return (
    <Tabs defaultValue="mentors">
      <TabsList
        className="mb-8 flex-wrap h-auto gap-1"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "2px",
        }}
      >
        {[
          { value: "mentors", label: "Mentors" },
          { value: "projects", label: "Projects" },
          { value: "partners", label: "Partners" },
          { value: "stats", label: "Statistics" },
        ].map(({ value, label }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="text-xs tracking-widest uppercase"
            style={{
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.12em",
            }}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="mentors">
        <HumanonMentorsTab />
      </TabsContent>
      <TabsContent value="projects">
        <HumanonProjectsTab />
      </TabsContent>
      <TabsContent value="partners">
        <HumanonPartnersTab />
      </TabsContent>
      <TabsContent value="stats">
        <HumanonStatsTab />
      </TabsContent>
    </Tabs>
  );
}

// ── EPOCHS Research Manager ──────────────────────────────────────────────────
const RESEARCH_STORAGE_KEY = "stemonef_research_library";

interface ResearchEntry {
  id: number;
  title: string;
  description: string;
  domain: string;
  project: string;
  authors: string;
  publicationDate: string;
  tags: string;
  isPublic: boolean;
}

const EMPTY_ENTRY: Omit<ResearchEntry, "id"> = {
  title: "",
  description: "",
  domain: "Climate",
  project: "GAIA",
  authors: "",
  publicationDate: "",
  tags: "",
  isPublic: true,
};

function loadResearch(): ResearchEntry[] {
  try {
    const raw = localStorage.getItem(RESEARCH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ResearchEntry[]) : [];
  } catch {
    return [];
  }
}

function saveResearch(entries: ResearchEntry[]) {
  localStorage.setItem(RESEARCH_STORAGE_KEY, JSON.stringify(entries));
}

function EpochsResearchTab() {
  const [entries, setEntries] = useState<ResearchEntry[]>(loadResearch);
  const [form, setForm] = useState<Omit<ResearchEntry, "id">>(EMPTY_ENTRY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] =
    useState<Omit<ResearchEntry, "id">>(EMPTY_ENTRY);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.authors) {
      toast.error("Title, description, and authors are required");
      return;
    }
    const newEntry: ResearchEntry = { id: Date.now(), ...form };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveResearch(updated);
    setForm(EMPTY_ENTRY);
    toast.success("Research entry created");
  };

  const startEdit = (entry: ResearchEntry) => {
    setEditingId(entry.id);
    setEditForm({
      title: entry.title,
      description: entry.description,
      domain: entry.domain,
      project: entry.project,
      authors: entry.authors,
      publicationDate: entry.publicationDate,
      tags: entry.tags,
      isPublic: entry.isPublic,
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    if (!editForm.title || !editForm.description) {
      toast.error("Title and description are required");
      return;
    }
    const updated = entries.map((e) =>
      e.id === editingId ? { ...editForm, id: editingId } : e,
    );
    setEntries(updated);
    saveResearch(updated);
    setEditingId(null);
    toast.success("Research entry updated");
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this research entry?")) return;
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveResearch(updated);
    toast.success("Entry deleted");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.8)",
  };

  const selectTriggerStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.8)",
  };

  return (
    <div className="space-y-8">
      {/* Create form */}
      <div
        className="p-6 rounded-sm"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="font-mono-geist text-xs tracking-[0.3em] uppercase mb-5"
          style={{ color: "rgba(212,160,23,0.7)" }}
        >
          ADD RESEARCH ENTRY
        </div>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Title
            </Label>
            <Input
              data-ocid="admin.research.input"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Research publication title"
              className="mt-1"
              style={inputStyle}
            />
          </div>

          <div>
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Domain
            </Label>
            <Select
              value={form.domain}
              onValueChange={(v) => setForm((p) => ({ ...p, domain: v }))}
            >
              <SelectTrigger
                data-ocid="admin.research.select"
                className="mt-1"
                style={selectTriggerStyle}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Climate",
                  "Deep Technology",
                  "Ethical AI",
                  "Environmental Intelligence",
                  "Medical Systems",
                ].map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Project
            </Label>
            <Select
              value={form.project}
              onValueChange={(v) => setForm((p) => ({ ...p, project: v }))}
            >
              <SelectTrigger
                data-ocid="admin.research.select"
                className="mt-1"
                style={selectTriggerStyle}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["GAIA", "EIOS", "STEMESA", "General"].map((pr) => (
                  <SelectItem key={pr} value={pr}>
                    {pr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Authors
            </Label>
            <Input
              data-ocid="admin.research.input"
              value={form.authors}
              onChange={(e) =>
                setForm((p) => ({ ...p, authors: e.target.value }))
              }
              placeholder="EPOCHS Research Team"
              className="mt-1"
              style={inputStyle}
            />
          </div>

          <div>
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Publication Date (YYYY-MM)
            </Label>
            <Input
              data-ocid="admin.research.input"
              value={form.publicationDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, publicationDate: e.target.value }))
              }
              placeholder="2025-11"
              className="mt-1"
              style={inputStyle}
            />
          </div>

          <div>
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Tags (comma-separated)
            </Label>
            <Input
              data-ocid="admin.research.input"
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              placeholder="climate, modeling, prediction"
              className="mt-1"
              style={inputStyle}
            />
          </div>

          <div className="md:col-span-2">
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Description
            </Label>
            <Textarea
              data-ocid="admin.research.textarea"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Research description and findings..."
              rows={3}
              className="mt-1 resize-none"
              style={inputStyle}
            />
          </div>

          <div className="flex items-center gap-4">
            <Switch
              data-ocid="admin.research.switch"
              checked={form.isPublic}
              onCheckedChange={(v) => setForm((p) => ({ ...p, isPublic: v }))}
            />
            <Label
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Public
            </Label>
          </div>

          <div className="flex justify-end items-end">
            <Button
              type="submit"
              data-ocid="admin.research.submit_button"
              style={{
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.4)",
                color: "#d4a017",
                fontFamily: "Geist Mono, monospace",
                letterSpacing: "0.15em",
                fontSize: "11px",
              }}
            >
              ADD ENTRY
            </Button>
          </div>
        </form>
      </div>

      {/* Research table */}
      <div
        className="rounded-sm overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Table data-ocid="admin.research.table">
          <TableHeader>
            <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {["Title", "Domain", "Project", "Public", "Date", "Actions"].map(
                (h) => (
                  <TableHead
                    key={h}
                    className="font-mono-geist text-[9px] tracking-[0.3em] uppercase"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {h}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, i) => (
              <TableRow
                key={entry.id}
                data-ocid={`admin.research.row.${i + 1}`}
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                {editingId === entry.id ? (
                  <>
                    <TableCell>
                      <Input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, title: e.target.value }))
                        }
                        className="h-7 text-xs"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.8)",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editForm.domain}
                        onValueChange={(v) =>
                          setEditForm((p) => ({ ...p, domain: v }))
                        }
                      >
                        <SelectTrigger
                          className="h-7 text-xs"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.8)",
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Climate",
                            "Deep Technology",
                            "Ethical AI",
                            "Environmental Intelligence",
                            "Medical Systems",
                          ].map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editForm.project}
                        onValueChange={(v) =>
                          setEditForm((p) => ({ ...p, project: v }))
                        }
                      >
                        <SelectTrigger
                          className="h-7 text-xs"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.8)",
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["GAIA", "EIOS", "STEMESA", "General"].map((pr) => (
                            <SelectItem key={pr} value={pr}>
                              {pr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={editForm.isPublic}
                        onCheckedChange={(v) =>
                          setEditForm((p) => ({ ...p, isPublic: v }))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editForm.publicationDate}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            publicationDate: e.target.value,
                          }))
                        }
                        className="h-7 text-xs w-24"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.8)",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          data-ocid="admin.research.save_button"
                          onClick={handleUpdate}
                          className="px-3 py-1 text-[10px] tracking-widest uppercase"
                          style={{
                            background: "rgba(52,211,153,0.1)",
                            border: "1px solid rgba(52,211,153,0.3)",
                            color: "rgba(52,211,153,0.8)",
                            fontFamily: "Geist Mono, monospace",
                            cursor: "pointer",
                            borderRadius: "2px",
                          }}
                        >
                          SAVE
                        </button>
                        <button
                          type="button"
                          data-ocid="admin.research.cancel_button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-[10px] tracking-widest uppercase"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.4)",
                            fontFamily: "Geist Mono, monospace",
                            cursor: "pointer",
                            borderRadius: "2px",
                          }}
                        >
                          CANCEL
                        </button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell
                      className="text-xs max-w-[180px] truncate"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      {entry.title}
                    </TableCell>
                    <TableCell>
                      <span
                        className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                        style={{
                          color: "rgba(74,126,247,0.8)",
                          background: "rgba(74,126,247,0.08)",
                          fontFamily: "Geist Mono, monospace",
                        }}
                      >
                        {entry.domain}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                        style={{
                          color: "rgba(212,160,23,0.8)",
                          background: "rgba(212,160,23,0.08)",
                          fontFamily: "Geist Mono, monospace",
                        }}
                      >
                        {entry.project}
                      </span>
                    </TableCell>
                    <TableCell
                      className="text-xs"
                      style={{
                        color: entry.isPublic
                          ? "rgba(52,211,153,0.7)"
                          : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {entry.isPublic ? "PUBLIC" : "RESTRICTED"}
                    </TableCell>
                    <TableCell
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {entry.publicationDate || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          data-ocid={`admin.research.edit_button.${i + 1}`}
                          onClick={() => startEdit(entry)}
                          className="px-3 py-1 text-[10px] tracking-widest uppercase"
                          style={{
                            background: "rgba(74,126,247,0.08)",
                            border: "1px solid rgba(74,126,247,0.2)",
                            color: "rgba(74,126,247,0.7)",
                            fontFamily: "Geist Mono, monospace",
                            cursor: "pointer",
                            borderRadius: "2px",
                          }}
                        >
                          EDIT
                        </button>
                        <button
                          type="button"
                          data-ocid={`admin.research.delete_button.${i + 1}`}
                          onClick={() => handleDelete(entry.id)}
                          className="px-3 py-1 text-[10px] tracking-widest uppercase"
                          style={{
                            background: "rgba(248,113,113,0.08)",
                            border: "1px solid rgba(248,113,113,0.2)",
                            color: "rgba(248,113,113,0.7)",
                            fontFamily: "Geist Mono, monospace",
                            cursor: "pointer",
                            borderRadius: "2px",
                          }}
                        >
                          DELETE
                        </button>
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
            {entries.length === 0 && (
              <TableRow>
                <TableCell
                  data-ocid="admin.research.empty_state"
                  colSpan={6}
                  className="text-center py-8 text-xs"
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  No research entries yet. Add the first entry above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── STEAMI Intelligence Manager ──────────────────────────────────────────────

function SteamiAdminTab() {
  return (
    <div
      className="p-1 rounded-sm"
      style={{ background: "rgba(255,255,255,0.01)" }}
    >
      <div className="mb-6">
        <div
          className="font-mono-geist text-xs tracking-[0.3em] uppercase mb-1"
          style={{ color: "rgba(212,160,23,0.7)" }}
        >
          STEAMI INTELLIGENCE MANAGER
        </div>
        <p
          className="font-mono-geist text-[10px]"
          style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}
        >
          Publish and manage intelligence briefs distributed through the STEAMI
          platform.
        </p>
      </div>

      <Tabs defaultValue="briefs">
        <TabsList
          className="mb-8 flex-wrap h-auto gap-1"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "2px",
          }}
        >
          <TabsTrigger
            value="briefs"
            data-ocid="admin.steami.tab"
            className="text-xs tracking-widest uppercase"
            style={{
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.12em",
            }}
          >
            Intelligence Briefs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="briefs">
          <FeedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── ELPIS Admin Tab ──────────────────────────────────────────────────────────
function ElpisAdminTab() {
  const { data: members, isLoading: membersLoading } =
    useGetElpisCouncilMembers();
  const { data: guidanceAreas, isLoading: guidanceLoading } =
    useGetElpisGuidanceAreas();
  const { data: announcements, isLoading: announcementsLoading } =
    useGetAllElpisAnnouncements();

  const createMember = useCreateElpisCouncilMember();
  const deleteMember = useDeleteElpisCouncilMember();
  const createGuidance = useCreateElpisGuidanceArea();
  const deleteGuidance = useDeleteElpisGuidanceArea();
  const createAnnouncement = useCreateElpisAnnouncement();
  const deleteAnnouncement = useDeleteElpisAnnouncement();

  const GOLD = "#d4a017";

  // ── Member form state
  const [memberForm, setMemberForm] = useState({
    name: "",
    domain: "",
    organization: "",
    role: "",
    biography: "",
    expertise: "",
  });

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !memberForm.name ||
      !memberForm.domain ||
      !memberForm.organization ||
      !memberForm.role
    ) {
      toast.error("Name, domain, organization, and role are required");
      return;
    }
    try {
      await createMember.mutateAsync(memberForm);
      setMemberForm({
        name: "",
        domain: "",
        organization: "",
        role: "",
        biography: "",
        expertise: "",
      });
      toast.success("Council member added");
    } catch {
      toast.error("Failed to add member");
    }
  };

  // ── Guidance area form state
  const [guidanceForm, setGuidanceForm] = useState({
    domain: "",
    description: "",
    contribution: "",
  });

  const handleCreateGuidance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !guidanceForm.domain ||
      !guidanceForm.description ||
      !guidanceForm.contribution
    ) {
      toast.error("All fields required");
      return;
    }
    try {
      await createGuidance.mutateAsync(guidanceForm);
      setGuidanceForm({ domain: "", description: "", contribution: "" });
      toast.success("Guidance area added");
    } catch {
      toast.error("Failed to add guidance area");
    }
  };

  // ── Announcement form state
  const [annForm, setAnnForm] = useState({
    title: "",
    summary: "",
    category: "",
    isPublic: true,
  });

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annForm.title || !annForm.summary || !annForm.category) {
      toast.error("Title, summary, and category required");
      return;
    }
    try {
      await createAnnouncement.mutateAsync(annForm);
      setAnnForm({ title: "", summary: "", category: "", isPublic: true });
      toast.success("Announcement published");
    } catch {
      toast.error("Failed to publish announcement");
    }
  };

  const formatDate = (ts: bigint) => {
    const ms = Number(ts);
    if (ms > 1e12)
      return new Date(ms).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    return "—";
  };

  const adminRowStyle = {
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  };

  const adminFormStyle = {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "2px",
    padding: "20px",
    marginBottom: "24px",
  };

  const adminInputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Geist Mono, monospace",
    fontSize: "11px",
  };

  return (
    <Tabs defaultValue="members">
      <TabsList
        className="mb-6 flex-wrap h-auto gap-1"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "2px",
        }}
      >
        {[
          { value: "members", label: "Council Members" },
          { value: "guidance", label: "Guidance Areas" },
          { value: "announcements", label: "Announcements" },
        ].map(({ value, label }) => (
          <TabsTrigger
            key={value}
            value={value}
            data-ocid={`admin.elpis.${value}.tab`}
            className="text-xs tracking-widest uppercase"
            style={{
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.12em",
            }}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Members sub-tab */}
      <TabsContent value="members">
        <form
          onSubmit={handleCreateMember}
          style={adminFormStyle}
          data-ocid="admin.elpis.member.dialog"
        >
          <div
            className="font-mono-geist text-[10px] tracking-[0.3em] uppercase mb-4"
            style={{ color: `${GOLD}88` }}
          >
            Add Council Member
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                Name *
              </Label>
              <Input
                data-ocid="admin.elpis.member.input"
                value={memberForm.name}
                onChange={(e) =>
                  setMemberForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Full name"
                style={adminInputStyle}
                required
              />
            </div>
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                Domain *
              </Label>
              <Input
                value={memberForm.domain}
                onChange={(e) =>
                  setMemberForm((f) => ({ ...f, domain: e.target.value }))
                }
                placeholder="e.g. AI Ethics, Climate Science"
                style={adminInputStyle}
                required
              />
            </div>
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                Organization *
              </Label>
              <Input
                value={memberForm.organization}
                onChange={(e) =>
                  setMemberForm((f) => ({ ...f, organization: e.target.value }))
                }
                placeholder="Institution or organization"
                style={adminInputStyle}
                required
              />
            </div>
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                Role *
              </Label>
              <Input
                value={memberForm.role}
                onChange={(e) =>
                  setMemberForm((f) => ({ ...f, role: e.target.value }))
                }
                placeholder="Role within council"
                style={adminInputStyle}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                Biography
              </Label>
              <Textarea
                data-ocid="admin.elpis.member.textarea"
                value={memberForm.biography}
                onChange={(e) =>
                  setMemberForm((f) => ({ ...f, biography: e.target.value }))
                }
                placeholder="Short biography..."
                rows={3}
                style={{ ...adminInputStyle, resize: "none" }}
              />
            </div>
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                Expertise (comma-separated)
              </Label>
              <Textarea
                value={memberForm.expertise}
                onChange={(e) =>
                  setMemberForm((f) => ({ ...f, expertise: e.target.value }))
                }
                placeholder="e.g. Machine Learning, Policy Design, Climate Modeling"
                rows={3}
                style={{ ...adminInputStyle, resize: "none" }}
              />
            </div>
          </div>
          <Button
            type="submit"
            data-ocid="admin.elpis.member.submit_button"
            disabled={createMember.isPending}
            size="sm"
            style={{
              background: `${GOLD}20`,
              border: `1px solid ${GOLD}44`,
              color: GOLD,
              fontFamily: "Geist Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              cursor: "pointer",
            }}
          >
            {createMember.isPending ? "Adding…" : "Add Member"}
          </Button>
        </form>

        {/* Members table */}
        {membersLoading ? (
          <div
            data-ocid="admin.elpis.members.loading_state"
            className="text-xs"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            Loading members…
          </div>
        ) : !members || members.length === 0 ? (
          <div
            data-ocid="admin.elpis.members.empty_state"
            className="text-xs"
            style={{
              color: "rgba(255,255,255,0.25)",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            No council members yet.
          </div>
        ) : (
          <Table data-ocid="admin.elpis.members.table">
            <TableHeader>
              <TableRow style={adminRowStyle}>
                <TableHead
                  className="text-xs"
                  style={{
                    color: `${GOLD}88`,
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  Name
                </TableHead>
                <TableHead
                  className="text-xs"
                  style={{
                    color: `${GOLD}88`,
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  Domain
                </TableHead>
                <TableHead
                  className="text-xs"
                  style={{
                    color: `${GOLD}88`,
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  Organization
                </TableHead>
                <TableHead
                  className="text-xs"
                  style={{
                    color: `${GOLD}88`,
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  Role
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m, i) => (
                <TableRow
                  key={String(m.id)}
                  data-ocid={`admin.elpis.member.row.${i + 1}`}
                  style={adminRowStyle}
                >
                  <TableCell
                    className="text-xs"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {m.name}
                  </TableCell>
                  <TableCell
                    className="text-xs"
                    style={{ color: GOLD, fontFamily: "Geist Mono, monospace" }}
                  >
                    {m.domain}
                  </TableCell>
                  <TableCell
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {m.organization}
                  </TableCell>
                  <TableCell
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {m.role}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      data-ocid={`admin.elpis.member.delete_button.${i + 1}`}
                      variant="ghost"
                      size="sm"
                      disabled={deleteMember.isPending}
                      onClick={async () => {
                        try {
                          await deleteMember.mutateAsync(m.id);
                          toast.success("Member removed");
                        } catch {
                          toast.error("Failed to remove member");
                        }
                      }}
                      style={{
                        color: "rgba(255,80,80,0.6)",
                        fontSize: "10px",
                        fontFamily: "Geist Mono, monospace",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TabsContent>

      {/* Guidance Areas sub-tab */}
      <TabsContent value="guidance">
        <form
          onSubmit={handleCreateGuidance}
          style={adminFormStyle}
          data-ocid="admin.elpis.guidance.dialog"
        >
          <div
            className="font-mono-geist text-[10px] tracking-[0.3em] uppercase mb-4"
            style={{ color: `${GOLD}88` }}
          >
            Add Policy Guidance Area
          </div>
          <div className="mb-3">
            <Label
              className="text-xs mb-1 block"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              Domain *
            </Label>
            <Input
              data-ocid="admin.elpis.guidance.input"
              value={guidanceForm.domain}
              onChange={(e) =>
                setGuidanceForm((f) => ({ ...f, domain: e.target.value }))
              }
              placeholder="e.g. AI Ethics, Climate Policy"
              style={adminInputStyle}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                Description *
              </Label>
              <Textarea
                data-ocid="admin.elpis.guidance.textarea"
                value={guidanceForm.description}
                onChange={(e) =>
                  setGuidanceForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the guidance area..."
                rows={4}
                style={{ ...adminInputStyle, resize: "none" }}
                required
              />
            </div>
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                How the Council Contributes *
              </Label>
              <Textarea
                value={guidanceForm.contribution}
                onChange={(e) =>
                  setGuidanceForm((f) => ({
                    ...f,
                    contribution: e.target.value,
                  }))
                }
                placeholder="Describe council contributions..."
                rows={4}
                style={{ ...adminInputStyle, resize: "none" }}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            data-ocid="admin.elpis.guidance.submit_button"
            disabled={createGuidance.isPending}
            size="sm"
            style={{
              background: `${GOLD}20`,
              border: `1px solid ${GOLD}44`,
              color: GOLD,
              fontFamily: "Geist Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              cursor: "pointer",
            }}
          >
            {createGuidance.isPending ? "Adding…" : "Add Guidance Area"}
          </Button>
        </form>

        {guidanceLoading ? (
          <div
            data-ocid="admin.elpis.guidance.loading_state"
            className="text-xs"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            Loading…
          </div>
        ) : !guidanceAreas || guidanceAreas.length === 0 ? (
          <div
            data-ocid="admin.elpis.guidance.empty_state"
            className="text-xs"
            style={{
              color: "rgba(255,255,255,0.25)",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            No guidance areas yet.
          </div>
        ) : (
          <Table data-ocid="admin.elpis.guidance.table">
            <TableHeader>
              <TableRow style={adminRowStyle}>
                <TableHead
                  className="text-xs"
                  style={{
                    color: `${GOLD}88`,
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  Domain
                </TableHead>
                <TableHead
                  className="text-xs"
                  style={{
                    color: `${GOLD}88`,
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  Description
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {guidanceAreas.map((g, i) => (
                <TableRow
                  key={String(g.id)}
                  data-ocid={`admin.elpis.guidance.row.${i + 1}`}
                  style={adminRowStyle}
                >
                  <TableCell
                    className="text-xs font-semibold"
                    style={{ color: GOLD, fontFamily: "Geist Mono, monospace" }}
                  >
                    {g.domain}
                  </TableCell>
                  <TableCell
                    className="text-xs max-w-xs truncate"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {g.description}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      data-ocid={`admin.elpis.guidance.delete_button.${i + 1}`}
                      variant="ghost"
                      size="sm"
                      disabled={deleteGuidance.isPending}
                      onClick={async () => {
                        try {
                          await deleteGuidance.mutateAsync(g.id);
                          toast.success("Guidance area removed");
                        } catch {
                          toast.error("Failed to remove guidance area");
                        }
                      }}
                      style={{
                        color: "rgba(255,80,80,0.6)",
                        fontSize: "10px",
                        fontFamily: "Geist Mono, monospace",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TabsContent>

      {/* Announcements sub-tab */}
      <TabsContent value="announcements">
        <form
          onSubmit={handleCreateAnnouncement}
          style={adminFormStyle}
          data-ocid="admin.elpis.announcement.dialog"
        >
          <div
            className="font-mono-geist text-[10px] tracking-[0.3em] uppercase mb-4"
            style={{ color: `${GOLD}88` }}
          >
            Publish Announcement
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                Title *
              </Label>
              <Input
                data-ocid="admin.elpis.announcement.input"
                value={annForm.title}
                onChange={(e) =>
                  setAnnForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Announcement title"
                style={adminInputStyle}
                required
              />
            </div>
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                Category *
              </Label>
              <Input
                value={annForm.category}
                onChange={(e) =>
                  setAnnForm((f) => ({ ...f, category: e.target.value }))
                }
                placeholder="e.g. Advisory Opinion, Policy Guidance"
                style={adminInputStyle}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <Label
              className="text-xs mb-1 block"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              Summary *
            </Label>
            <Textarea
              data-ocid="admin.elpis.announcement.textarea"
              value={annForm.summary}
              onChange={(e) =>
                setAnnForm((f) => ({ ...f, summary: e.target.value }))
              }
              placeholder="Brief summary of the announcement..."
              rows={3}
              style={{ ...adminInputStyle, resize: "none" }}
              required
            />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Switch
              data-ocid="admin.elpis.announcement.switch"
              checked={annForm.isPublic}
              onCheckedChange={(v) =>
                setAnnForm((f) => ({ ...f, isPublic: v }))
              }
            />
            <Label
              className="text-xs"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              {annForm.isPublic
                ? "Public (visible on ELPIS page)"
                : "Internal only"}
            </Label>
          </div>
          <Button
            type="submit"
            data-ocid="admin.elpis.announcement.submit_button"
            disabled={createAnnouncement.isPending}
            size="sm"
            style={{
              background: `${GOLD}20`,
              border: `1px solid ${GOLD}44`,
              color: GOLD,
              fontFamily: "Geist Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              cursor: "pointer",
            }}
          >
            {createAnnouncement.isPending
              ? "Publishing…"
              : "Publish Announcement"}
          </Button>
        </form>

        {announcementsLoading ? (
          <div
            data-ocid="admin.elpis.announcements.loading_state"
            className="text-xs"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            Loading…
          </div>
        ) : !announcements || announcements.length === 0 ? (
          <div
            data-ocid="admin.elpis.announcements.empty_state"
            className="text-xs"
            style={{
              color: "rgba(255,255,255,0.25)",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            No announcements yet.
          </div>
        ) : (
          <Table data-ocid="admin.elpis.announcements.table">
            <TableHeader>
              <TableRow style={adminRowStyle}>
                <TableHead
                  className="text-xs"
                  style={{
                    color: `${GOLD}88`,
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  Title
                </TableHead>
                <TableHead
                  className="text-xs"
                  style={{
                    color: `${GOLD}88`,
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  Category
                </TableHead>
                <TableHead
                  className="text-xs"
                  style={{
                    color: `${GOLD}88`,
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  Status
                </TableHead>
                <TableHead
                  className="text-xs"
                  style={{
                    color: `${GOLD}88`,
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  Published
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((ann, i) => (
                <TableRow
                  key={String(ann.id)}
                  data-ocid={`admin.elpis.announcement.row.${i + 1}`}
                  style={adminRowStyle}
                >
                  <TableCell
                    className="text-xs max-w-xs truncate"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {ann.title}
                  </TableCell>
                  <TableCell
                    className="text-xs"
                    style={{ color: GOLD, fontFamily: "Geist Mono, monospace" }}
                  >
                    {ann.category}
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-[9px] font-mono-geist tracking-widest uppercase px-1.5 py-0.5 rounded-sm"
                      style={{
                        background: ann.isPublic
                          ? "rgba(34,211,176,0.1)"
                          : "rgba(255,255,255,0.04)",
                        border: `1px solid ${ann.isPublic ? "rgba(34,211,176,0.3)" : "rgba(255,255,255,0.1)"}`,
                        color: ann.isPublic
                          ? "#22d3b0"
                          : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {ann.isPublic ? "Public" : "Internal"}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-xs"
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: "Geist Mono, monospace",
                    }}
                  >
                    {formatDate(ann.publishedAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      data-ocid={`admin.elpis.announcement.delete_button.${i + 1}`}
                      variant="ghost"
                      size="sm"
                      disabled={deleteAnnouncement.isPending}
                      onClick={async () => {
                        try {
                          await deleteAnnouncement.mutateAsync(ann.id);
                          toast.success("Announcement removed");
                        } catch {
                          toast.error("Failed to remove announcement");
                        }
                      }}
                      style={{
                        color: "rgba(255,80,80,0.6)",
                        fontSize: "10px",
                        fontFamily: "Geist Mono, monospace",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TabsContent>
    </Tabs>
  );
}

// ── Admin action logger ───────────────────────────────────────────────────────
const ADMIN_LOG_KEY = "stemonef_admin_log";
interface AdminLogEntry {
  action: string;
  ts: number;
}
function logAdminAction(action: string) {
  try {
    const raw = localStorage.getItem(ADMIN_LOG_KEY);
    const log: AdminLogEntry[] = raw
      ? (JSON.parse(raw) as AdminLogEntry[])
      : [];
    log.unshift({ action, ts: Date.now() });
    localStorage.setItem(ADMIN_LOG_KEY, JSON.stringify(log.slice(0, 20)));
  } catch {
    /* silent */
  }
}
function loadAdminLog(): AdminLogEntry[] {
  try {
    const raw = localStorage.getItem(ADMIN_LOG_KEY);
    return raw ? (JSON.parse(raw) as AdminLogEntry[]) : [];
  } catch {
    return [];
  }
}

// ── Enterprise Metrics (localStorage) ────────────────────────────────────────
const METRICS_KEY = "stemonef_enterprise_metrics";
interface EnterpriseMetrics {
  pathways: number;
  countries: number;
  beneficiaries: string;
  partners: number;
  status: string;
  progress: number;
}
const DEFAULT_METRICS: EnterpriseMetrics = {
  pathways: 5,
  countries: 2,
  beneficiaries: "1M+ reached through knowledge dissemination",
  partners: 4,
  status: "Development Phase",
  progress: 18,
};
function loadMetrics(): EnterpriseMetrics {
  try {
    const raw = localStorage.getItem(METRICS_KEY);
    return raw ? (JSON.parse(raw) as EnterpriseMetrics) : DEFAULT_METRICS;
  } catch {
    return DEFAULT_METRICS;
  }
}

// ── Sidebar module definitions ────────────────────────────────────────────────
type AdminModule =
  | "overview"
  | "metrics"
  | "feed"
  | "requests"
  | "stats"
  | "research"
  | "humanon"
  | "partners"
  | "steami"
  | "elpis";

interface SidebarItem {
  id: AdminModule;
  icon: string;
  label: string;
  group: string;
  color: string;
  description: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: "overview",
    icon: "◉",
    label: "Overview",
    group: "CORE",
    color: "#4a7ef7",
    description: "System dashboard & activity",
  },
  {
    id: "metrics",
    icon: "◈",
    label: "Enterprise Metrics",
    group: "CORE",
    color: "#d4a017",
    description: "Impact architecture data",
  },
  {
    id: "feed",
    icon: "◆",
    label: "Intelligence Feed",
    group: "INTELLIGENCE",
    color: "#d4a017",
    description: "Publish & manage signals",
  },
  {
    id: "requests",
    icon: "◇",
    label: "Collaboration Reqs",
    group: "INTELLIGENCE",
    color: "#4a7ef7",
    description: "Review inbound requests",
  },
  {
    id: "stats",
    icon: "▲",
    label: "Pathway Statistics",
    group: "INTELLIGENCE",
    color: "#a78bfa",
    description: "Visitor pathway data",
  },
  {
    id: "research",
    icon: "⬡",
    label: "EPOCHS Research",
    group: "RESEARCH",
    color: "#f59e0b",
    description: "Research library manager",
  },
  {
    id: "humanon",
    icon: "○",
    label: "HUMANON",
    group: "NETWORK",
    color: "#22d3b0",
    description: "Mentors, projects, partners",
  },
  {
    id: "partners",
    icon: "●",
    label: "Partner Network",
    group: "NETWORK",
    color: "#4a7ef7",
    description: "Institutional collaborations",
  },
  {
    id: "steami",
    icon: "▣",
    label: "STEAMI Intelligence",
    group: "GOVERNANCE",
    color: "#d4a017",
    description: "Intelligence briefs",
  },
  {
    id: "elpis",
    icon: "◫",
    label: "ELPIS Council",
    group: "GOVERNANCE",
    color: "#d4a017",
    description: "Council governance",
  },
];

const GROUP_ORDER = [
  "CORE",
  "INTELLIGENCE",
  "RESEARCH",
  "NETWORK",
  "GOVERNANCE",
];

// ── Overview Module ───────────────────────────────────────────────────────────
function OverviewModule({
  onNavigate,
}: { onNavigate: (m: AdminModule) => void }) {
  const { data: feeds } = useGetPublicFeeds();
  const { data: requests } = useGetCollaborationRequests();
  const { data: mentors } = useGetHumanonMentors();
  const { data: projects } = useGetHumanonProjects();
  const { data: partners } = useGetHumanonPartners();
  const { data: members } = useGetElpisCouncilMembers();
  const [log, setLog] = useState<AdminLogEntry[]>([]);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [animating, setAnimating] = useState(false);

  // Load log
  useEffect(() => {
    setLog(loadAdminLog());
  }, []);

  // Count-up animation
  const researchEntries = (() => {
    try {
      const r = localStorage.getItem(RESEARCH_STORAGE_KEY);
      return r ? (JSON.parse(r) as unknown[]).length : 0;
    } catch {
      return 0;
    }
  })();

  const feedsLen = (feeds || []).length;
  const requestsLen = (requests || []).length;
  const mentorsLen = (mentors || []).length;
  const projectsLen = (projects || []).length;
  const partnersLen = (partners || []).length;
  const membersLen = (members || []).length;
  const featuredLen = (feeds || []).filter((f) => f.isFeatured).length;

  const targets = [
    feedsLen,
    requestsLen,
    mentorsLen,
    projectsLen,
    partnersLen,
    membersLen,
    researchEntries,
    featuredLen,
  ];

  useEffect(() => {
    setAnimating(true);
    const duration = 1200;
    const start = Date.now();
    const localTargets = [
      feedsLen,
      requestsLen,
      mentorsLen,
      projectsLen,
      partnersLen,
      membersLen,
      researchEntries,
      featuredLen,
    ];
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setCounts(localTargets.map((target) => Math.round(target * eased)));
      if (t < 1) requestAnimationFrame(tick);
      else setAnimating(false);
    };
    requestAnimationFrame(tick);
  }, [
    feedsLen,
    requestsLen,
    mentorsLen,
    projectsLen,
    partnersLen,
    membersLen,
    researchEntries,
    featuredLen,
  ]);

  const statCards = [
    {
      label: "Intelligence Signals",
      idx: 0,
      color: "#d4a017",
      module: "feed" as AdminModule,
      icon: "◆",
    },
    {
      label: "Collaboration Requests",
      idx: 1,
      color: "#4a7ef7",
      module: "requests" as AdminModule,
      icon: "◇",
    },
    {
      label: "Mentors",
      idx: 2,
      color: "#22d3b0",
      module: "humanon" as AdminModule,
      icon: "○",
    },
    {
      label: "Research Projects",
      idx: 3,
      color: "#f59e0b",
      module: "humanon" as AdminModule,
      icon: "⬡",
    },
    {
      label: "Industry Partners",
      idx: 4,
      color: "#4a7ef7",
      module: "partners" as AdminModule,
      icon: "●",
    },
    {
      label: "Council Members",
      idx: 5,
      color: "#d4a017",
      module: "elpis" as AdminModule,
      icon: "◫",
    },
    {
      label: "Research Entries",
      idx: 6,
      color: "#a78bfa",
      module: "research" as AdminModule,
      icon: "▣",
    },
    {
      label: "Featured Signals",
      idx: 7,
      color: "#34d399",
      module: "feed" as AdminModule,
      icon: "◆",
    },
  ];

  const relTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, idx, color, module, icon }, i) => (
          <button
            type="button"
            key={label}
            data-ocid={`admin.overview.card.${i + 1}`}
            className="p-5 rounded-sm cursor-pointer transition-all duration-300 group text-left w-full"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderTop: `2px solid ${color}40`,
              animationDelay: `${i * 60}ms`,
            }}
            onClick={() => onNavigate(module)}
          >
            <div className="flex items-start justify-between mb-3">
              <span style={{ color: `${color}99`, fontSize: "14px" }}>
                {icon}
              </span>
              <span
                className="text-[8px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color, fontFamily: "Geist Mono, monospace" }}
              >
                MANAGE →
              </span>
            </div>
            <div
              className="text-3xl font-light mb-1"
              style={{
                color,
                fontFamily: "Fraunces, serif",
                letterSpacing: "0.05em",
              }}
            >
              {animating ? counts[idx] : targets[idx]}
            </div>
            <div
              className="text-[9px] tracking-[0.2em] uppercase"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              {label}
            </div>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div
        className="p-6 rounded-sm"
        style={{
          background: "rgba(255,255,255,0.015)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="text-[9px] tracking-[0.3em] uppercase mb-4"
          style={{
            color: "rgba(212,160,23,0.6)",
            fontFamily: "Geist Mono, monospace",
          }}
        >
          QUICK ACTIONS
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            {
              label: "◆ Publish Intelligence Signal",
              module: "feed" as AdminModule,
              color: "#d4a017",
            },
            {
              label: "⬡ Add Research Entry",
              module: "research" as AdminModule,
              color: "#f59e0b",
            },
            {
              label: "◇ Review Collaboration Requests",
              module: "requests" as AdminModule,
              color: "#4a7ef7",
            },
            {
              label: "○ Add Mentor",
              module: "humanon" as AdminModule,
              color: "#22d3b0",
            },
            {
              label: "◈ Update Enterprise Metrics",
              module: "metrics" as AdminModule,
              color: "#d4a017",
            },
          ].map(({ label, module, color }) => (
            <button
              key={label}
              type="button"
              data-ocid="admin.overview.primary_button"
              onClick={() => onNavigate(module)}
              className="px-4 py-2 text-[10px] tracking-widest uppercase transition-all duration-200"
              style={{
                background: `${color}10`,
                border: `1px solid ${color}30`,
                color: `${color}cc`,
                fontFamily: "Geist Mono, monospace",
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity log */}
      <div
        className="p-6 rounded-sm"
        style={{
          background: "rgba(255,255,255,0.015)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className="text-[9px] tracking-[0.3em] uppercase"
            style={{
              color: "rgba(74,126,247,0.6)",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            SYSTEM ACTIVITY LOG
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(ADMIN_LOG_KEY);
              setLog([]);
            }}
            className="text-[8px] tracking-widest uppercase opacity-30 hover:opacity-60 transition-opacity"
            style={{
              background: "none",
              border: "none",
              color: "rgba(248,113,113,0.8)",
              fontFamily: "Geist Mono, monospace",
              cursor: "pointer",
            }}
          >
            CLEAR
          </button>
        </div>
        {log.length === 0 ? (
          <div
            data-ocid="admin.overview.empty_state"
            className="text-[10px] text-center py-4"
            style={{
              color: "rgba(255,255,255,0.2)",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            No admin actions recorded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {log.slice(0, 10).map((entry, i) => (
              <div
                key={`${entry.ts}-${i}`}
                data-ocid={`admin.overview.item.${i + 1}`}
                className="flex items-center justify-between py-2 px-3 rounded-sm"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderLeft: "2px solid rgba(74,126,247,0.3)",
                }}
              >
                <span
                  className="text-[10px]"
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {entry.action}
                </span>
                <span
                  className="text-[8px] tracking-widest"
                  style={{
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  {relTime(entry.ts)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Enterprise Metrics Module ─────────────────────────────────────────────────
function EnterpriseMetricsModule() {
  const [form, setForm] = useState<EnterpriseMetrics>(loadMetrics);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(METRICS_KEY, JSON.stringify(form));
    logAdminAction("Enterprise metrics updated");
    toast.success("Metrics saved — homepage will reflect changes on next load");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <div
        className="p-6 rounded-sm"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(212,160,23,0.15)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            style={{
              width: 3,
              height: 28,
              background:
                "linear-gradient(180deg,#d4a017,rgba(212,160,23,0.1))",
              borderRadius: 2,
            }}
          />
          <div>
            <div
              className="text-[9px] tracking-[0.3em] uppercase"
              style={{
                color: "rgba(212,160,23,0.7)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              ENTERPRISE METRICS MANAGER
            </div>
            <div
              className="text-[8px] mt-0.5"
              style={{
                color: "rgba(255,255,255,0.25)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              Controls Impact Architecture numbers on homepage
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {[
            {
              key: "pathways",
              label: "Active Impact Pathways",
              type: "number",
            },
            { key: "countries", label: "Countries Active", type: "number" },
            {
              key: "partners",
              label: "Institutional Collaborations",
              type: "number",
            },
            {
              key: "progress",
              label: "Model Development Progress (%)",
              type: "number",
            },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <Label
                className="text-[9px] tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {label}
              </Label>
              <Input
                data-ocid="admin.metrics.input"
                type={type}
                value={form[key as keyof EnterpriseMetrics] as string | number}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    [key]:
                      type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  }))
                }
                className="mt-1"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                }}
              />
            </div>
          ))}
          <div>
            <Label
              className="text-[9px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Beneficiaries Description
            </Label>
            <Input
              data-ocid="admin.metrics.input"
              value={form.beneficiaries}
              onChange={(e) =>
                setForm((p) => ({ ...p, beneficiaries: e.target.value }))
              }
              className="mt-1"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.8)",
              }}
            />
          </div>
          <div>
            <Label
              className="text-[9px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Enterprise Status
            </Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
            >
              <SelectTrigger
                data-ocid="admin.metrics.select"
                className="mt-1"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Development Phase",
                  "Launch Phase",
                  "Operational",
                  "Scaling",
                ].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              data-ocid="admin.metrics.submit_button"
              style={{
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.4)",
                color: "#d4a017",
                fontFamily: "Geist Mono, monospace",
                letterSpacing: "0.15em",
                fontSize: "11px",
              }}
            >
              ◆ SAVE METRICS
            </Button>
          </div>
        </form>
      </div>

      {/* Live preview */}
      <div
        className="p-6 rounded-sm"
        style={{
          background: "rgba(255,255,255,0.015)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="text-[9px] tracking-[0.3em] uppercase mb-5"
          style={{
            color: "rgba(255,255,255,0.25)",
            fontFamily: "Geist Mono, monospace",
          }}
        >
          LIVE PREVIEW — IMPACT ARCHITECTURE CARD
        </div>
        <div
          className="p-5 rounded-sm space-y-4"
          style={{
            background: "rgba(4,5,14,0.8)",
            border: "1px solid rgba(74,126,247,0.15)",
          }}
        >
          {[
            {
              label: "ACTIVE IMPACT PATHWAYS",
              value: String(form.pathways).padStart(2, "0"),
              color: "#4a7ef7",
            },
            {
              label: "GLOBAL REACH",
              value: `${form.countries} countries active`,
              color: "#d4a017",
            },
            {
              label: "BENEFICIARIES",
              value: form.beneficiaries,
              color: "#22d3b0",
            },
            {
              label: "PARTNERS",
              value: `${form.partners} institutional collaborations`,
              color: "#a78bfa",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-start gap-3">
              <div
                style={{
                  width: 2,
                  height: 32,
                  background: color,
                  borderRadius: 1,
                  flexShrink: 0,
                  marginTop: 4,
                }}
              />
              <div>
                <div
                  className="text-[8px] tracking-[0.25em] uppercase"
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  {label}
                </div>
                <div
                  className="text-sm font-light mt-0.5"
                  style={{ color, fontFamily: "Fraunces, serif" }}
                >
                  {value}
                </div>
              </div>
            </div>
          ))}
          <div
            className="mt-4 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[8px] tracking-widest uppercase"
                style={{
                  color: "rgba(255,255,255,0.25)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                MODEL DEVELOPMENT PROGRESS
              </span>
              <span
                className="text-[8px]"
                style={{
                  color: "rgba(212,160,23,0.6)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                {form.progress}%
              </span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${form.progress}%`,
                  background:
                    "linear-gradient(90deg,rgba(74,126,247,0.7),rgba(212,160,23,0.7))",
                }}
              />
            </div>
            <div
              className="mt-2 text-[8px] tracking-widest uppercase"
              style={{
                color: "rgba(212,160,23,0.5)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              STATUS: {form.status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Module container wrapper ──────────────────────────────────────────────────
function ModuleWrapper({
  title,
  subtitle,
  color,
  children,
}: {
  title: string;
  subtitle: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-4 mb-8 pb-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          style={{
            width: 3,
            height: 40,
            background: `linear-gradient(180deg,${color},${color}20)`,
            borderRadius: 2,
          }}
        />
        <div>
          <div
            className="text-[9px] tracking-[0.35em] uppercase mb-1"
            style={{ color: `${color}99`, fontFamily: "Geist Mono, monospace" }}
          >
            CONTROL MODULE
          </div>
          <h2
            className="text-xl font-light"
            style={{
              fontFamily: "Fraunces, serif",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {title}
          </h2>
          <p
            className="text-[10px] mt-1"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Live clock ────────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(() =>
    new Date().toISOString().substring(11, 19),
  );
  useEffect(() => {
    const id = setInterval(
      () => setTime(new Date().toISOString().substring(11, 19)),
      1000,
    );
    return () => clearInterval(id);
  }, []);
  return <span>{time} UTC</span>;
}

// ── MAIN ADMIN DASHBOARD ──────────────────────────────────────────────────────
export default function AdminDashboard({
  onGoHome,
}: {
  onGoHome: () => void;
}) {
  const { identity, login, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsAdmin();
  const queryClient = useQueryClient();
  const [activeModule, setActiveModule] = useState<AdminModule>("overview");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Admin token input state
  const [adminSecret, setAdminSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [tokenStored, setTokenStored] = useState(false);

  // Only redirect to home if backend definitively says NOT admin (after loading finishes)
  // Never redirect during loading or before token has been submitted
  useEffect(() => {
    const hasToken = !!sessionStorage.getItem("caffeineAdminToken");
    if (
      !isLoading &&
      identity &&
      isAdmin === false &&
      hasToken &&
      tokenStored
    ) {
      toast.error("ACCESS DENIED — Principal is not registered as admin");
      onGoHome();
    }
  }, [isAdmin, isLoading, identity, onGoHome, tokenStored]);

  const navigateTo = useCallback(
    (module: AdminModule) => {
      if (module === activeModule) return;
      setTransitioning(true);
      setTimeout(() => {
        setActiveModule(module);
        setTransitioning(false);
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
    },
    [activeModule],
  );

  // Store token then invalidate actor + isAdmin queries so they rebuild with the new token
  const handleAdminLogin = () => {
    if (!adminSecret.trim()) {
      setTokenError("ADMIN TOKEN REQUIRED — Enter your secret access key");
      return;
    }
    setTokenError("");
    try {
      sessionStorage.setItem("caffeineAdminToken", adminSecret.trim());
      setTokenStored(true);
    } catch {
      setTokenError("STORAGE ERROR — Unable to store token. Please try again.");
      return;
    }
    if (identity) {
      // Already authenticated — invalidate the actor and isAdmin queries so they
      // rebuild with the new token. No page reload needed (which would reset the view).
      queryClient.invalidateQueries({ queryKey: ["actor"] });
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    } else {
      login();
    }
  };

  // Show boot spinner while Internet Identity SDK is initialising
  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--neural-bg)" }}
      >
        <div
          data-ocid="admin.loading_state"
          className="font-mono-geist text-xs tracking-[0.3em] uppercase"
          style={{ color: "rgba(74,126,247,0.6)" }}
        >
          INITIALIZING...
        </div>
      </div>
    );
  }

  // ── Cinematic auth gate ────────────────────────────────────────────────────
  // Show the gate if: not logged in, OR logged in but no token stored yet
  if (!identity || !sessionStorage.getItem("caffeineAdminToken")) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: "var(--neural-bg)" }}
      >
        {/* Animated dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(74,126,247,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Drifting glow orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(74,126,247,0.04) 0%,transparent 70%)",
            animation: "pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(212,160,23,0.04) 0%,transparent 70%)",
            animation: "pulse 8s ease-in-out infinite reverse",
          }}
        />

        <div
          className="relative flex flex-col items-center gap-6 p-10 rounded-sm max-w-md w-full mx-4 overflow-hidden"
          style={{
            background: "rgba(4,5,14,0.92)",
            border: "1px solid rgba(212,160,23,0.25)",
            backdropFilter: "blur(16px)",
            boxShadow:
              "0 0 60px rgba(212,160,23,0.05), 0 0 120px rgba(74,126,247,0.04)",
          }}
        >
          {/* Scan-line animation */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg,transparent 0%,rgba(74,126,247,0.04) 50%,transparent 100%)",
              backgroundSize: "100% 60px",
              animation: "scanMove 3s linear infinite",
            }}
          />
          {/* Top gold accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(212,160,23,0.6),transparent)",
            }}
          />

          {/* Concentric rings icon */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: 100, height: 100 }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: 36 + i * 26,
                  height: 36 + i * 26,
                  borderColor: `rgba(212,160,23,${0.18 - i * 0.05})`,
                  animation: `pulse ${2.5 + i * 0.8}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
            <div
              className="relative w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(212,160,23,0.1)",
                border: "1px solid rgba(212,160,23,0.5)",
                boxShadow: "0 0 20px rgba(212,160,23,0.2)",
              }}
            >
              <span style={{ color: "#d4a017", fontSize: "16px" }}>◆</span>
            </div>
          </div>

          {/* Title block */}
          <div className="text-center space-y-2">
            <div
              className="text-[8px] tracking-[0.5em] uppercase"
              style={{
                color: "rgba(212,160,23,0.55)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              SECURE ACCESS PROTOCOL · LEVEL 5 CLEARANCE
            </div>
            <h1
              className="font-display text-2xl font-light"
              style={{
                letterSpacing: "0.1em",
                background: "linear-gradient(135deg,#4a7ef7,#ffffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              STEMONEF
              <br />
              ADMIN CONTROL CENTER
            </h1>
            <p
              className="text-[11px] leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.28)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Enter your admin secret key, then verify your identity. This panel
              controls all content, research, intelligence, and operational
              systems.
            </p>
          </div>

          {/* ── Admin Token Input ── */}
          <div className="w-full space-y-2">
            <div
              className="text-[8px] tracking-[0.3em] uppercase mb-1"
              style={{
                color: "rgba(212,160,23,0.5)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              ADMIN SECRET KEY
            </div>
            <div className="relative w-full">
              <input
                data-ocid="admin.login.input"
                type={showSecret ? "text" : "password"}
                value={adminSecret}
                onChange={(e) => {
                  setAdminSecret(e.target.value);
                  if (tokenError) setTokenError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdminLogin();
                }}
                placeholder="Enter admin secret key..."
                className="w-full pr-10 py-3 px-4 text-xs rounded-sm outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: tokenError
                    ? "1px solid rgba(239,68,68,0.6)"
                    : tokenStored
                      ? "1px solid rgba(52,211,153,0.4)"
                      : "1px solid rgba(212,160,23,0.2)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: showSecret ? "0.05em" : "0.2em",
                  boxShadow: tokenError
                    ? "0 0 12px rgba(239,68,68,0.1)"
                    : "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowSecret((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] transition-opacity opacity-40 hover:opacity-80"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                {showSecret ? "HIDE" : "SHOW"}
              </button>
            </div>
            {tokenError && (
              <div
                className="text-[9px] tracking-[0.15em] uppercase"
                style={{
                  color: "rgba(239,68,68,0.8)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                ⚠ {tokenError}
              </div>
            )}
            {tokenStored && !tokenError && (
              <div
                className="text-[9px] tracking-[0.15em] uppercase"
                style={{
                  color: "rgba(52,211,153,0.7)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                ✓ TOKEN STORED · PROCEEDING TO IDENTITY VERIFICATION
              </div>
            )}
          </div>

          {/* Divider */}
          <div
            className="w-full h-px"
            style={{ background: "rgba(255,255,255,0.04)" }}
          />

          {/* Action buttons */}
          <div className="w-full space-y-3">
            <button
              type="button"
              data-ocid="admin.login.primary_button"
              onClick={handleAdminLogin}
              className="w-full py-3.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 relative overflow-hidden"
              style={{
                background: "rgba(212,160,23,0.1)",
                border: "1px solid rgba(212,160,23,0.5)",
                color: "#d4a017",
                fontFamily: "Geist Mono, monospace",
                cursor: "pointer",
                borderRadius: "2px",
                boxShadow: "0 0 20px rgba(212,160,23,0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(212,160,23,0.18)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 30px rgba(212,160,23,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(212,160,23,0.1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 20px rgba(212,160,23,0.08)";
              }}
            >
              {identity
                ? "◆ SUBMIT TOKEN & ENTER CONTROL CENTER"
                : "◆ AUTHENTICATE WITH INTERNET IDENTITY"}
            </button>
            <button
              type="button"
              data-ocid="admin.login.cancel_button"
              onClick={onGoHome}
              className="w-full py-2 text-[10px] tracking-[0.2em] uppercase transition-opacity duration-200 opacity-40 hover:opacity-70"
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "Geist Mono, monospace",
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              ← RETURN TO HOMEPAGE
            </button>
          </div>

          {/* Instructions */}
          <div
            className="w-full p-3 rounded-sm space-y-1"
            style={{
              background: "rgba(74,126,247,0.04)",
              border: "1px solid rgba(74,126,247,0.1)",
            }}
          >
            <div
              className="text-[8px] tracking-[0.3em] uppercase mb-1"
              style={{
                color: "rgba(74,126,247,0.6)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              HOW TO ACCESS
            </div>
            {(identity
              ? [
                  "1. Enter the admin secret key in the field above",
                  "2. Click Submit — you are already authenticated",
                  "3. The console will open immediately",
                ]
              : [
                  "1. Enter the admin secret key provided during system setup",
                  "2. Click Authenticate — Internet Identity will open",
                  "3. Complete identity verification in the popup",
                  "4. First-time setup: the first principal to use the correct key becomes admin",
                ]
            ).map((line) => (
              <div
                key={line}
                className="text-[10px] leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.25)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Bottom telemetry */}
          <div
            className="text-[7px] tracking-[0.2em] uppercase"
            style={{
              color: "rgba(255,255,255,0.12)",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            ENCRYPTION ACTIVE · AUDIT LOGGING ENABLED · SESSION MONITORED
          </div>
        </div>

        <style>{`
          @keyframes scanMove { 0%{background-position:0 -60px} 100%{background-position:0 100vh} }
        `}</style>
      </div>
    );
  }

  // Logged in but admin status still loading
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--neural-bg)" }}
      >
        <div
          data-ocid="admin.loading_state"
          className="font-mono-geist text-xs tracking-[0.3em] uppercase"
          style={{ color: "rgba(74,126,247,0.6)" }}
        >
          VERIFYING ACCESS...
        </div>
      </div>
    );
  }

  // isAdmin is still undefined (query hasn't run yet or is fetching) — show loading
  if (isAdmin === undefined || isAdmin === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--neural-bg)" }}
      >
        <div
          data-ocid="admin.loading_state"
          className="font-mono-geist text-xs tracking-[0.3em] uppercase"
          style={{ color: "rgba(74,126,247,0.6)" }}
        >
          LOADING CONTROL CENTER...
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const activeItem =
    SIDEBAR_ITEMS.find((i) => i.id === activeModule) ?? SIDEBAR_ITEMS[0];
  const groups = GROUP_ORDER.map((g) => ({
    group: g,
    items: SIDEBAR_ITEMS.filter((i) => i.group === g),
  }));

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--neural-bg)" }}
    >
      {/* ── TOP HEADER BAR ── */}
      <div
        className="relative z-40 flex items-center justify-between px-6 overflow-hidden"
        style={{
          height: 70,
          background: "rgba(4,5,14,0.97)",
          borderBottom: "1px solid rgba(212,160,23,0.12)",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 1px 0 rgba(212,160,23,0.08), 0 4px 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* Animated scan-line */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(74,126,247,0.08),transparent)",
            backgroundSize: "200% 100%",
            animation: "headerScan 4s ease-in-out infinite",
          }}
        />
        {/* Gold bottom line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(212,160,23,0.4),transparent)",
          }}
        />

        {/* Left: branding */}
        <div className="flex items-center gap-3 z-10">
          <div
            className="w-7 h-7 rounded-sm flex items-center justify-center"
            style={{
              background: "rgba(212,160,23,0.1)",
              border: "1px solid rgba(212,160,23,0.3)",
            }}
          >
            <span style={{ color: "#d4a017", fontSize: "12px" }}>◆</span>
          </div>
          <div>
            <div
              className="text-[7px] tracking-[0.4em] uppercase"
              style={{
                color: "rgba(212,160,23,0.5)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              STEMONEF ENTERPRISES
            </div>
            <div
              className="text-sm font-light hidden sm:block"
              style={{
                fontFamily: "Fraunces, serif",
                letterSpacing: "0.15em",
                background: "linear-gradient(135deg,#4a7ef7,#fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ADMIN CONTROL CENTER
            </div>
          </div>
        </div>

        {/* Center: telemetry */}
        <div
          className="hidden md:flex items-center gap-2 text-[8px] tracking-[0.2em] uppercase z-10"
          style={{
            color: "rgba(255,255,255,0.25)",
            fontFamily: "Geist Mono, monospace",
          }}
        >
          <span style={{ color: "rgba(52,211,153,0.7)" }}>◉</span>
          <span>SYSTEM: ONLINE</span>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
          <span>MODULES: {SIDEBAR_ITEMS.length} ACTIVE</span>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
          <LiveClock />
          <span
            className="animate-pulse"
            style={{ color: "rgba(74,126,247,0.6)" }}
          >
            ▌
          </span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3 z-10">
          <div
            className="px-2.5 py-1 text-[8px] tracking-[0.2em] uppercase"
            style={{
              background: "rgba(74,126,247,0.1)",
              border: "1px solid rgba(74,126,247,0.25)",
              color: "rgba(74,126,247,0.8)",
              fontFamily: "Geist Mono, monospace",
              borderRadius: "2px",
            }}
          >
            ADMIN
          </div>
          <button
            type="button"
            data-ocid="admin.secondary_button"
            onClick={onGoHome}
            className="px-3 py-1.5 text-[9px] tracking-widest uppercase transition-all duration-200 opacity-60 hover:opacity-100"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "Geist Mono, monospace",
              cursor: "pointer",
              borderRadius: "2px",
            }}
          >
            ← HOMEPAGE
          </button>
        </div>
      </div>

      <style>{`
        @keyframes headerScan { 0%{background-position:-100% 0} 100%{background-position:200% 0} }
      `}</style>

      {/* ── BODY: sidebar + content ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR ── */}
        <div
          className="flex-shrink-0 overflow-y-auto overflow-x-hidden transition-all duration-200 relative"
          style={{
            width: sidebarExpanded ? 220 : 56,
            background: "rgba(4,5,14,0.95)",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            minHeight: "calc(100vh - 70px)",
          }}
        >
          {/* Gold left accent */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(180deg,rgba(212,160,23,0.3),rgba(212,160,23,0.05),transparent)",
            }}
          />

          {/* Collapse toggle */}
          <button
            type="button"
            data-ocid="admin.sidebar.toggle"
            onClick={() => setSidebarExpanded((p) => !p)}
            className="w-full flex items-center justify-end px-3 py-3 transition-opacity hover:opacity-80"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: "10px",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              {sidebarExpanded ? "◂" : "▸"}
            </span>
          </button>

          {/* Navigation groups */}
          <div className="py-2">
            {groups.map(({ group, items }) => (
              <div key={group} className="mb-1">
                {sidebarExpanded && (
                  <div
                    className="px-4 py-2 text-[7px] tracking-[0.35em] uppercase"
                    style={{
                      color: "rgba(255,255,255,0.18)",
                      fontFamily: "Geist Mono, monospace",
                    }}
                  >
                    {group}
                  </div>
                )}
                {items.map((item) => {
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-ocid={`admin.${item.id}.link`}
                      onClick={() => navigateTo(item.id)}
                      title={!sidebarExpanded ? item.label : undefined}
                      className="w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-150 relative"
                      style={{
                        background: isActive ? `${item.color}10` : "none",
                        border: "none",
                        cursor: "pointer",
                        borderLeft: isActive
                          ? `2px solid ${item.color}`
                          : "2px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "rgba(74,126,247,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "none";
                      }}
                    >
                      <span
                        className="flex-shrink-0 text-sm"
                        style={{
                          color: isActive
                            ? item.color
                            : "rgba(255,255,255,0.3)",
                          width: 20,
                          textAlign: "center",
                          transition: "color 0.15s",
                        }}
                      >
                        {item.icon}
                      </span>
                      {sidebarExpanded && (
                        <span
                          className="text-[10px] tracking-wide truncate"
                          style={{
                            color: isActive
                              ? "rgba(255,255,255,0.85)"
                              : "rgba(255,255,255,0.45)",
                            fontFamily: "Geist Mono, monospace",
                            letterSpacing: "0.06em",
                            transition: "color 0.15s",
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar footer */}
          {sidebarExpanded && (
            <div
              className="absolute bottom-0 left-0 right-0 p-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div
                className="text-[7px] tracking-[0.2em] uppercase text-center"
                style={{
                  color: "rgba(255,255,255,0.12)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                STEMONEF v3.0
                <br />
                ADMIN CONSOLE
              </div>
            </div>
          )}
        </div>

        {/* ── MAIN CONTENT AREA ── */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 70px)" }}
        >
          {/* Module sub-header */}
          <div
            className="sticky top-0 z-20 flex items-center gap-4 px-8 py-4"
            style={{
              background: "rgba(4,5,14,0.95)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ color: activeItem.color, fontSize: "14px" }}>
              {activeItem.icon}
            </span>
            <div>
              <div
                className="text-[8px] tracking-[0.35em] uppercase"
                style={{
                  color: `${activeItem.color}70`,
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                {activeItem.group} MODULE
              </div>
              <div
                className="text-sm"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: "0.08em",
                }}
              >
                {activeItem.label}
              </div>
            </div>
            <div
              className="ml-auto text-[8px] tracking-widest uppercase"
              style={{
                color: "rgba(255,255,255,0.2)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              {activeItem.description}
            </div>
          </div>

          {/* Module content with fade transition */}
          <div
            className="p-8"
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "translateY(8px)" : "translateY(0)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            {activeModule === "overview" && (
              <OverviewModule onNavigate={navigateTo} />
            )}

            {activeModule === "metrics" && (
              <ModuleWrapper
                title="Enterprise Metrics Manager"
                subtitle="Control the Impact Architecture data displayed on the homepage Enterprise Engine section."
                color="#d4a017"
              >
                <EnterpriseMetricsModule />
              </ModuleWrapper>
            )}

            {activeModule === "feed" && (
              <ModuleWrapper
                title="Intelligence Feed Manager"
                subtitle="Publish, edit, and manage intelligence signals displayed in the Live Intelligence Feed section."
                color="#d4a017"
              >
                <FeedTab />
              </ModuleWrapper>
            )}

            {activeModule === "requests" && (
              <ModuleWrapper
                title="Collaboration Requests"
                subtitle="Review inbound collaboration and pathway interest requests submitted through the website."
                color="#4a7ef7"
              >
                <RequestsTab />
              </ModuleWrapper>
            )}

            {activeModule === "stats" && (
              <ModuleWrapper
                title="Pathway Statistics"
                subtitle="Visualize visitor interest distribution across STEMONEF engagement pathways."
                color="#a78bfa"
              >
                <div
                  className="p-8 rounded-sm"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="font-mono-geist text-xs tracking-[0.3em] uppercase mb-6"
                    style={{ color: "rgba(212,160,23,0.7)" }}
                  >
                    PATHWAY INTEREST DISTRIBUTION
                  </div>
                  <PathwayStatsTab />
                </div>
              </ModuleWrapper>
            )}

            {activeModule === "research" && (
              <ModuleWrapper
                title="EPOCHS Research Library"
                subtitle="Manage the EPOCHS research library — upload, edit, and publish research entries, datasets, and working papers."
                color="#f59e0b"
              >
                <EpochsResearchTab />
              </ModuleWrapper>
            )}

            {activeModule === "humanon" && (
              <ModuleWrapper
                title="HUMANON Ecosystem Manager"
                subtitle="Manage mentors, participant projects, industry partners, and program statistics for the HUMANON pillar."
                color="#22d3b0"
              >
                <HumanonManagerTab />
              </ModuleWrapper>
            )}

            {activeModule === "partners" && (
              <ModuleWrapper
                title="Partner Network Manager"
                subtitle="Manage institutional and industry partners contributing to the STEMONEF mission."
                color="#4a7ef7"
              >
                <HumanonPartnersTab />
              </ModuleWrapper>
            )}

            {activeModule === "steami" && (
              <ModuleWrapper
                title="STEAMI Intelligence Manager"
                subtitle="Publish and manage intelligence briefs distributed through the STEAMI platform."
                color="#d4a017"
              >
                <SteamiAdminTab />
              </ModuleWrapper>
            )}

            {activeModule === "elpis" && (
              <ModuleWrapper
                title="E.L.P.I.S Council Manager"
                subtitle="Manage council members, policy guidance areas, and governance announcements for E.L.P.I.S."
                color="#d4a017"
              >
                <ElpisAdminTab />
              </ModuleWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
