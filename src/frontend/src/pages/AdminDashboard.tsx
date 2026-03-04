import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useCreateFeed,
  useDeleteFeed,
  useGetCollaborationRequests,
  useGetPathwayStats,
  useGetPublicFeeds,
  useIsAdmin,
  useToggleFeatured,
  useUpdateFeed,
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
            className="mb-8"
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
        </Tabs>
      </div>
    </div>
  );
}
