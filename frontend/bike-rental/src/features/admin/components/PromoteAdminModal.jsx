import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "../../../ui";

// Deliberate two-step confirmation for granting/removing ADMIN — guards against accidental
// clicks: the confirm button stays disabled until the admin (1) ticks the acknowledgement
// AND (2) types the keyword exactly.
export function PromoteAdminModal({
  name,
  mode = "promote",
  onClose,
  onConfirm,
}) {
  const [ack, setAck] = useState(false);
  const [text, setText] = useState("");
  const isPromote = mode === "promote";
  const KEYWORD = isPromote ? "PROMOTE" : "REMOVE";
  const ready = ack && text.trim().toUpperCase() === KEYWORD;

  return (
    <Modal
      title={isPromote ? "Promote to admin" : "Remove admin role"}
      subtitle={name}
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="br-ghost br-display rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => ready && onConfirm()}
            disabled={!ready}
            className="br-display rounded-xl px-5 py-2.5 text-sm font-semibold"
            style={
              ready
                ? {
                    background: isPromote ? "var(--brand)" : "#dc2626",
                    color: "#fff",
                  }
                : {
                    background: "#c7d2ce",
                    color: "#fff",
                    cursor: "not-allowed",
                  }
            }
          >
            {isPromote ? "Promote to admin" : "Remove admin"}
          </button>
        </div>
      }
    >
      <div
        className="flex items-start gap-2.5 rounded-xl p-3"
        style={{
          background: isPromote ? "#fff7ed" : "#fee2e2",
          border: `1px solid ${isPromote ? "#fed7aa" : "#fecaca"}`,
        }}
      >
        <AlertTriangle
          size={16}
          className="mt-0.5 shrink-0"
          style={{ color: isPromote ? "#b45309" : "#b91c1c" }}
        />
        <p
          className="text-xs"
          style={{ color: isPromote ? "#7c2d12" : "#7f1d1d" }}
        >
          {isPromote ? (
            <>
              <span className="font-bold">{name}</span> will gain full admin
              access — verifying KYC, blocking users, and managing other admins.
              Only promote people you trust.
            </>
          ) : (
            <>
              <span className="font-bold">{name}</span> will lose all admin
              access immediately.
            </>
          )}
        </p>
      </div>

      <label
        className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm"
        style={{ color: "#3a4d55" }}
      >
        <input
          type="checkbox"
          className="br-check mt-0.5"
          checked={ack}
          onChange={(e) => setAck(e.target.checked)}
        />
        <span>
          I understand this {isPromote ? "grants" : "revokes"} admin privileges.
        </span>
      </label>

      <p
        className="br-display mt-4 mb-1.5 text-xs font-semibold"
        style={{ color: "#334155" }}
      >
        Type{" "}
        <span style={{ color: isPromote ? "var(--brand-strong)" : "#b91c1c" }}>
          {KEYWORD}
        </span>{" "}
        to confirm
      </p>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        placeholder={KEYWORD}
        className="br-input br-field w-full rounded-xl px-3.5 py-2.5 text-sm tracking-[0.2em]"
      />
    </Modal>
  );
}
