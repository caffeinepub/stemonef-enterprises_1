import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitCollaborationRequest } from "../hooks/useQueries";

const PATHWAYS = [
  "Research & Innovation",
  "Talent & Field Growth",
  "Intelligence & Policy",
  "Climate & Sustainability",
  "Media & Storytelling",
  "Equity & Support",
];

interface CollabFormProps {
  type: "Collaborate" | "Partner";
  onClose: () => void;
}

function CollaborationForm({ type, onClose }: CollabFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pathway, setPathway] = useState("");
  const [message, setMessage] = useState("");

  const submit = useSubmitCollaborationRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !pathway || !message) {
      toast.error("Please complete all fields.");
      return;
    }
    try {
      await submit.mutateAsync({ name, email, pathway, message });
      toast.success("Request submitted. We will be in touch.");
      onClose();
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{
            color: "rgba(212,160,23,0.7)",
            fontFamily: "Geist Mono, monospace",
          }}
        >
          Full Name
        </Label>
        <Input
          data-ocid="cta.input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="mt-1.5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "Sora, sans-serif",
          }}
          required
        />
      </div>

      <div>
        <Label
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{
            color: "rgba(212,160,23,0.7)",
            fontFamily: "Geist Mono, monospace",
          }}
        >
          Email Address
        </Label>
        <Input
          data-ocid="cta.input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="mt-1.5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "Sora, sans-serif",
          }}
          required
        />
      </div>

      <div>
        <Label
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{
            color: "rgba(212,160,23,0.7)",
            fontFamily: "Geist Mono, monospace",
          }}
        >
          Engagement Pathway
        </Label>
        <Select value={pathway} onValueChange={setPathway}>
          <SelectTrigger
            data-ocid="cta.select"
            className="mt-1.5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.8)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            <SelectValue placeholder="Select pathway" />
          </SelectTrigger>
          <SelectContent
            style={{
              background: "rgba(8,10,24,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {PATHWAYS.map((p) => (
              <SelectItem
                key={p}
                value={p}
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{
            color: "rgba(212,160,23,0.7)",
            fontFamily: "Geist Mono, monospace",
          }}
        >
          Message
        </Label>
        <Textarea
          data-ocid="cta.textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your interest or proposal..."
          rows={4}
          className="mt-1.5 resize-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "Sora, sans-serif",
          }}
          required
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          data-ocid="cta.submit_button"
          disabled={submit.isPending}
          className="flex-1 py-3 text-xs tracking-widest uppercase transition-all duration-200"
          style={{
            background: submit.isPending
              ? "rgba(212,160,23,0.05)"
              : "rgba(212,160,23,0.12)",
            border: "1px solid rgba(212,160,23,0.5)",
            color: submit.isPending ? "rgba(212,160,23,0.4)" : "#d4a017",
            fontFamily: "Geist Mono, monospace",
            letterSpacing: "0.2em",
            cursor: submit.isPending ? "not-allowed" : "pointer",
            borderRadius: "2px",
          }}
        >
          {submit.isPending ? "SUBMITTING..." : `SUBMIT ${type.toUpperCase()}`}
        </button>
        <button
          type="button"
          data-ocid="cta.cancel_button"
          onClick={onClose}
          className="px-6 py-3 text-xs tracking-widest uppercase transition-all duration-200"
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
          CANCEL
        </button>
      </div>
    </form>
  );
}

export default function CTASection() {
  const [modalType, setModalType] = useState<"Collaborate" | "Partner" | null>(
    null,
  );

  return (
    <section
      data-ocid="cta.section"
      id="cta"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(4,5,14,0.8)",
          backdropFilter: "blur(8px)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,160,23,0.04) 0%, transparent 70%)",
        }}
      />
      {/* Animated grid lines */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,126,247,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(74,126,247,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Label */}
        <div
          className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-6"
          style={{ color: "rgba(212,160,23,0.7)" }}
        >
          ◆ ENGAGE WITH STEMONEF
        </div>

        {/* Headline */}
        <h2
          className="font-display font-light mb-6"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            letterSpacing: "0.08em",
            lineHeight: 1,
          }}
        >
          <span className="text-gradient-hero">Build the Future</span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>With Us.</span>
        </h2>

        {/* Subtext */}
        <p
          className="max-w-lg mx-auto text-sm leading-relaxed mb-12"
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          STEMONEF operates through structured institutional alliances. Select
          your engagement pathway below.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            data-ocid="cta.collaborate_button"
            onClick={() => setModalType("Collaborate")}
            className="px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300 glow-yellow-hover"
            style={{
              background: "rgba(212,160,23,0.1)",
              border: "1px solid rgba(212,160,23,0.5)",
              color: "#d4a017",
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.25em",
              cursor: "pointer",
              borderRadius: "2px",
              minWidth: "200px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(212,160,23,0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(212,160,23,0.1)";
            }}
          >
            Collaborate
          </button>

          <button
            type="button"
            data-ocid="cta.partner_button"
            onClick={() => setModalType("Partner")}
            className="px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              background: "rgba(74,126,247,0.08)",
              border: "1px solid rgba(74,126,247,0.4)",
              color: "rgba(74,126,247,0.9)",
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.25em",
              cursor: "pointer",
              borderRadius: "2px",
              minWidth: "200px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(74,126,247,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(74,126,247,0.65)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(74,126,247,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(74,126,247,0.4)";
            }}
          >
            Partner
          </button>

          <button
            type="button"
            data-ocid="cta.support_button"
            onClick={() =>
              document
                .getElementById("pathway")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.25em",
              cursor: "pointer",
              borderRadius: "2px",
              minWidth: "200px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.03)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.5)";
            }}
          >
            Support
          </button>
        </div>
      </div>

      {/* Collaboration Modal */}
      <Dialog
        open={!!modalType}
        onOpenChange={(open) => !open && setModalType(null)}
      >
        <DialogContent
          data-ocid="cta.dialog"
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          style={{
            background: "rgba(4,6,18,0.98)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(212,160,23,0.2)",
            boxShadow:
              "0 0 60px rgba(212,160,23,0.1), 0 24px 64px rgba(0,0,0,0.9)",
          }}
        >
          {modalType && (
            <>
              <DialogHeader>
                <div
                  className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-2"
                  style={{ color: "rgba(212,160,23,0.7)" }}
                >
                  ENGAGEMENT REQUEST
                </div>
                <DialogTitle
                  className="font-display text-2xl font-light"
                  style={{
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {modalType === "Collaborate"
                    ? "Collaboration"
                    : "Partnership"}{" "}
                  Inquiry
                </DialogTitle>
              </DialogHeader>
              <CollaborationForm
                type={modalType}
                onClose={() => setModalType(null)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
