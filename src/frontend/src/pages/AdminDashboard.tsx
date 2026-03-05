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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { FeedEntry } from "../backend.d";
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

function FeedTab() {
  const { data: feeds, isLoading } = useGetPublicFeeds();
  const createFeed = useCreateFeed();
  const updateFeed = useUpdateFeed();
  const deleteFeed = useDeleteFeed();
  const toggleFeatured = useToggleFeatured();

  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [newFeed, setNewFeed] = useState({
    title: "",
    summary: "",
    domain: "",
    isPublic: true,
    isFeatured: false,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeed.title || !newFeed.summary || !newFeed.domain) {
      toast.error("All fields required");
      return;
    }
    try {
      await createFeed.mutateAsync(newFeed);
      setNewFeed({
        title: "",
        summary: "",
        domain: "",
        isPublic: true,
        isFeatured: false,
      });
      toast.success("Feed created");
    } catch {
      toast.error("Failed to create feed");
    }
  };

  const [editData, setEditData] = useState<Partial<FeedEntry>>({});
  const startEdit = (feed: FeedEntry) => {
    setEditingId(feed.id);
    setEditData({
      title: feed.title,
      summary: feed.summary,
      domain: feed.domain,
      isPublic: feed.isPublic,
      isFeatured: feed.isFeatured,
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
      setEditingId(null);
      toast.success("Feed updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this feed entry?")) return;
    try {
      await deleteFeed.mutateAsync(id);
      toast.success("Feed deleted");
    } catch {
      toast.error("Delete failed");
    }
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
          CREATE INTELLIGENCE ENTRY
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
              data-ocid="admin.feed.input"
              value={newFeed.title}
              onChange={(e) =>
                setNewFeed((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Intelligence brief title"
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
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Domain
            </Label>
            <Input
              data-ocid="admin.feed.input"
              value={newFeed.domain}
              onChange={(e) =>
                setNewFeed((p) => ({ ...p, domain: e.target.value }))
              }
              placeholder="Climate / AI / Research / Health / Ethics"
              className="mt-1"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.8)",
              }}
            />
          </div>
          <div className="md:col-span-2">
            <Label
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Summary
            </Label>
            <Textarea
              data-ocid="admin.feed.textarea"
              value={newFeed.summary}
              onChange={(e) =>
                setNewFeed((p) => ({ ...p, summary: e.target.value }))
              }
              placeholder="Intelligence brief summary..."
              rows={3}
              className="mt-1 resize-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.8)",
              }}
            />
          </div>
          <div className="flex items-center gap-6">
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
                Public
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
                Featured
              </Label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              data-ocid="admin.feed.submit_button"
              disabled={createFeed.isPending}
              style={{
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.4)",
                color: "#d4a017",
                fontFamily: "Geist Mono, monospace",
                letterSpacing: "0.15em",
                fontSize: "11px",
              }}
            >
              {createFeed.isPending ? "CREATING..." : "CREATE ENTRY"}
            </Button>
          </div>
        </form>
      </div>

      {/* Feed table */}
      <div
        className="rounded-sm overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {isLoading ? (
          <div
            data-ocid="admin.feed.loading_state"
            className="p-8 text-center font-mono-geist text-xs"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Loading feed entries...
          </div>
        ) : (
          <Table data-ocid="admin.feed.table">
            <TableHeader>
              <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {[
                  "Domain",
                  "Title",
                  "Featured",
                  "Public",
                  "Created",
                  "Actions",
                ].map((h) => (
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
              {(feeds || []).map((feed, i) => (
                <TableRow
                  key={String(feed.id)}
                  data-ocid={`admin.feed.row.${i + 1}`}
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  {editingId === feed.id ? (
                    <>
                      <TableCell>
                        <Input
                          value={editData.domain || ""}
                          onChange={(e) =>
                            setEditData((p) => ({
                              ...p,
                              domain: e.target.value,
                            }))
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
                        <Input
                          value={editData.title || ""}
                          onChange={(e) =>
                            setEditData((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
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
                        <Switch
                          checked={editData.isFeatured}
                          onCheckedChange={(v) =>
                            setEditData((p) => ({ ...p, isFeatured: v }))
                          }
                        />
                      </TableCell>
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
                      <TableCell>
                        <span
                          className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                          style={{
                            color: "rgba(74,126,247,0.8)",
                            background: "rgba(74,126,247,0.08)",
                            fontFamily: "Geist Mono, monospace",
                          }}
                        >
                          {feed.domain}
                        </span>
                      </TableCell>
                      <TableCell
                        className="text-xs max-w-[200px] truncate"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        {feed.title}
                      </TableCell>
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
                      <TableCell
                        className="text-xs"
                        style={{
                          color: feed.isPublic
                            ? "rgba(52,211,153,0.7)"
                            : "rgba(255,255,255,0.25)",
                        }}
                      >
                        {feed.isPublic ? "PUBLIC" : "RESTRICTED"}
                      </TableCell>
                      <TableCell
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {formatDate(feed.timestamp)}
                      </TableCell>
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
                    No feed entries. Create the first intelligence brief above.
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

const adminInputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.8)",
};

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

export default function AdminDashboard({
  onGoHome,
}: {
  onGoHome: () => void;
}) {
  const { data: isAdmin, isLoading } = useIsAdmin();

  useEffect(() => {
    if (!isLoading && isAdmin === false) {
      onGoHome();
    }
  }, [isAdmin, isLoading, onGoHome]);

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

  if (!isAdmin) return null;

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--neural-bg)", paddingTop: "80px" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div
              className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-2"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ ADMIN CONSOLE
            </div>
            <h1
              className="font-display text-3xl font-light"
              style={{
                letterSpacing: "0.12em",
                background: "linear-gradient(135deg, #4a7ef7, #ffffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Intelligence Dashboard
            </h1>
          </div>
          <button
            type="button"
            data-ocid="admin.secondary_button"
            onClick={onGoHome}
            className="px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.15em",
              cursor: "pointer",
              borderRadius: "2px",
            }}
          >
            ← HOMEPAGE
          </button>
        </div>

        {/* Tabs */}
        <Tabs data-ocid="admin.tab" defaultValue="feed">
          <TabsList
            className="mb-8 flex-wrap h-auto gap-1"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "2px",
            }}
          >
            {[
              { value: "feed", label: "Intelligence Feed" },
              { value: "requests", label: "Collaboration Requests" },
              { value: "stats", label: "Pathway Statistics" },
              { value: "research", label: "EPOCHS Research" },
              { value: "humanon", label: "HUMANON" },
              { value: "steami", label: "STEAMI" },
              { value: "elpis", label: "ELPIS Council" },
            ].map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                data-ocid={`admin.${value}.tab`}
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

          <TabsContent value="feed">
            <FeedTab />
          </TabsContent>

          <TabsContent value="requests">
            <RequestsTab />
          </TabsContent>

          <TabsContent value="stats">
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
          </TabsContent>

          <TabsContent value="research">
            <div
              className="p-1 rounded-sm"
              style={{
                background: "rgba(255,255,255,0.01)",
              }}
            >
              <div
                className="font-mono-geist text-xs tracking-[0.3em] uppercase mb-6"
                style={{ color: "rgba(212,160,23,0.7)" }}
              >
                EPOCHS RESEARCH LIBRARY MANAGER
              </div>
              <EpochsResearchTab />
            </div>
          </TabsContent>

          <TabsContent value="humanon">
            <div
              className="p-1 rounded-sm"
              style={{ background: "rgba(255,255,255,0.01)" }}
            >
              <div
                className="font-mono-geist text-xs tracking-[0.3em] uppercase mb-6"
                style={{ color: "rgba(34,211,176,0.7)" }}
              >
                HUMANON ECOSYSTEM MANAGER
              </div>
              <HumanonManagerTab />
            </div>
          </TabsContent>

          <TabsContent value="steami">
            <SteamiAdminTab />
          </TabsContent>

          <TabsContent value="elpis">
            <div
              className="p-1 rounded-sm"
              style={{ background: "rgba(255,255,255,0.01)" }}
            >
              <div
                className="font-mono-geist text-xs tracking-[0.3em] uppercase mb-6"
                style={{ color: "rgba(212,160,23,0.7)" }}
              >
                E.L.P.I.S COUNCIL MANAGER
              </div>
              <ElpisAdminTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
