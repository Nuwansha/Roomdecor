"use client";

import { useMemo, useRef, useState } from "react";
import { useDesignerStore } from "@/lib/store";
import { clamp } from "@/lib/utils";

type DragState =
  | { kind: "none" }
  | { kind: "drag-item"; id: string; offsetPxX: number; offsetPxZ: number; startRoomX: number; startRoomZ: number }
  | { kind: "pan"; startX: number; startY: number; startScrollLeft: number; startScrollTop: number };

export function Editor2D() {
  const { draft, selectedItemId, selectItem, updateItem } = useDesignerStore();
  const room = draft.room;

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<DragState>({ kind: "none" });

  const scale = useMemo(() => {
    // px per meter, fit room within the viewport with padding
    const vp = viewportRef.current;
    const w = vp?.clientWidth ?? 800;
    const h = vp?.clientHeight ?? 520;
    const pad = 48;
    const s = Math.min((w - pad) / room.width, (h - pad) / room.length);
    return clamp(s, 40, 140);
  }, [room.width, room.length]);

  const roomPxW = room.width * scale;
  const roomPxH = room.length * scale;

  function pxToRoom(px: number) {
    return px / scale;
  }

  return (
    <div className="h-[640px] bg-gradient-to-b from-zinc-950 to-zinc-950">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div>
          <div className="font-semibold">2D Layout</div>
          <div className="text-xs text-zinc-400">Drag items. Click to edit. Scale happens automatically to fit the room.</div>
        </div>
        <div className="text-xs text-zinc-400">
          Room: <span className="text-zinc-100 font-medium">{room.width}m × {room.length}m</span>
        </div>
      </div>

      <div ref={viewportRef} className="relative h-[calc(640px-56px)] overflow-auto p-8">
        <div
          className="relative rounded-2xl border border-zinc-700 shadow-soft"
          style={{ width: roomPxW, height: roomPxH, background: room.floorColor }}
          onMouseDown={(e) => {
            // click empty room clears selection
            if ((e.target as HTMLElement).dataset.kind === "item") return;
            selectItem(null);
          }}
        >
          {/* subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: `${scale}px ${scale}px`,
              borderRadius: "16px",
            }}
          />

          {/* items */}
          {draft.items.map((it) => {
            const left = it.x * scale;
            const top = it.z * scale;
            const w = it.w * scale;
            const h = it.d * scale;
            const deg = (it.rotY * 180) / Math.PI;

            return (
              <div
                key={it.id}
                data-kind="item"
                className={`absolute rounded-xl border cursor-move select-none transition ${
                  it.id === selectedItemId ? "border-zinc-200 ring-2 ring-zinc-200/20" : "border-zinc-700 hover:border-zinc-400"
                }`}
                style={{
                  left,
                  top,
                  width: w,
                  height: h,
                  background: it.color,
                  transform: `rotate(${deg}deg)`,
                  transformOrigin: "center",
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  selectItem(it.id);

                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  const offsetPxX = e.clientX - rect.left;
                  const offsetPxZ = e.clientY - rect.top;

                  setDrag({
                    kind: "drag-item",
                    id: it.id,
                    offsetPxX,
                    offsetPxZ,
                    startRoomX: it.x,
                    startRoomZ: it.z,
                  });
                }}
                onDoubleClick={() => selectItem(it.id)}
                title={`${it.name} (${it.w.toFixed(2)}×${it.d.toFixed(2)}m)`}
              >
                <div className="px-2 py-1 text-[11px] font-medium text-zinc-950/90 bg-white/70 rounded-t-xl">
                  {it.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* drag handling */}
        <div
          className="absolute inset-0"
          onMouseMove={(e) => {
            if (drag.kind !== "drag-item") return;
            const vp = viewportRef.current;
            if (!vp) return;

            const roomRect = vp.querySelector("[data-room]") as HTMLElement | null;
            // we can compute relative to the main room container:
            const roomEl = vp.firstElementChild?.firstElementChild as HTMLElement | null;
            if (!roomEl) return;

            const r = roomEl.getBoundingClientRect();
            const pxX = e.clientX - r.left - drag.offsetPxX;
            const pxZ = e.clientY - r.top - drag.offsetPxZ;

            const nextX = pxToRoom(pxX);
            const nextZ = pxToRoom(pxZ);

            updateItem(drag.id, { x: nextX, z: nextZ });
          }}
          onMouseUp={() => setDrag({ kind: "none" })}
          onMouseLeave={() => setDrag({ kind: "none" })}
        />
      </div>
    </div>
  );
}
