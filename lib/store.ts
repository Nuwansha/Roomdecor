"use client";

import { create } from "zustand";
import { Design, DesignItem, ItemType, Room, ViewMode } from "./types";
import { loadDesigns, saveDesigns } from "./storage";
import { clamp, uid } from "./utils";

function defaultRoom(): Room {
  return {
    width: 4,
    length: 5,
    height: 2.7,
    wallColor: "#2a2a2f",
    floorColor: "#1b1b1e",
  };
}

function defaultDesign(): Design {
  return {
    id: uid("design"),
    name: "New design",
    room: defaultRoom(),
    items: [],
    shade: 0.65,
    updatedAt: Date.now(),
  };
}

function presetFor(type: ItemType) {
  switch (type) {
    case "sofa":
      return { w: 2.2, d: 0.9, h: 0.8, color: "#5a4b86", name: "Sofa" };
    case "table":
      return { w: 1.2, d: 0.7, h: 0.75, color: "#7b5b3a", name: "Table" };
    case "bed":
      return { w: 2.0, d: 1.6, h: 0.6, color: "#2f6b5a", name: "Bed" };
    case "chair":
      return { w: 0.5, d: 0.5, h: 0.9, color: "#3a6b8a", name: "Chair" };
    case "cabinet":
      return { w: 1.0, d: 0.45, h: 1.2, color: "#6b3a3a", name: "Cabinet" };
  }
}

type State = {
  view: ViewMode;
  designs: Design[];
  activeId: string | null;

  draft: Design; // current editable design (unsaved edits)
  selectedItemId: string | null;

  setView: (v: ViewMode) => void;

  load: () => void;

  newDesign: () => void;
  setActive: (id: string) => void;

  updateRoom: (patch: Partial<Room>) => void;
  setShade: (shade: number) => void;

  addItem: (type: ItemType) => void;
  selectItem: (id: string | null) => void;
  updateItem: (id: string, patch: Partial<DesignItem>) => void;
  removeItem: (id: string) => void;

  saveDraftAsNew: () => void;
  overwriteActive: () => void;
  deleteDesign: (id: string) => void;
  renameDraft: (name: string) => void;
};

export const useDesignerStore = create<State>((set, get) => ({
  view: "2d",
  designs: [],
  activeId: null,

  draft: defaultDesign(),
  selectedItemId: null,

  setView: (v) => set({ view: v }),

  load: () => {
    const designs = loadDesigns().sort((a, b) => b.updatedAt - a.updatedAt);
    if (designs.length === 0) {
      const d = defaultDesign();
      set({ designs: [], activeId: null, draft: d, selectedItemId: null });
      return;
    }
    const activeId = designs[0].id;
    set({ designs, activeId, draft: structuredClone(designs[0]), selectedItemId: null });
  },

  newDesign: () => {
    set({ activeId: null, draft: defaultDesign(), selectedItemId: null, view: "2d" });
  },

  setActive: (id) => {
    const found = get().designs.find((d) => d.id === id);
    if (!found) return;
    set({ activeId: id, draft: structuredClone(found), selectedItemId: null });
  },

  updateRoom: (patch) => {
    const s = get();
    set({ draft: { ...s.draft, room: { ...s.draft.room, ...patch }, updatedAt: Date.now() } });
  },

  setShade: (shade) => {
    const s = get();
    set({ draft: { ...s.draft, shade: clamp(shade, 0, 1), updatedAt: Date.now() } });
  },

  addItem: (type) => {
    const s = get();
    const p = presetFor(type);
    const id = uid("item");
    const x = clamp(s.draft.room.width * 0.5 - p.w * 0.5, 0.05, s.draft.room.width - p.w - 0.05);
    const z = clamp(s.draft.room.length * 0.5 - p.d * 0.5, 0.05, s.draft.room.length - p.d - 0.05);
    const item: DesignItem = {
      id,
      type,
      name: p.name,
      x,
      z,
      w: p.w,
      d: p.d,
      h: p.h,
      rotY: 0,
      color: p.color,
    };
    set({
      draft: { ...s.draft, items: [...s.draft.items, item], updatedAt: Date.now() },
      selectedItemId: id,
    });
  },

  selectItem: (id) => set({ selectedItemId: id }),

  updateItem: (id, patch) => {
    const s = get();
    const room = s.draft.room;
    const items = s.draft.items.map((it) => {
      if (it.id !== id) return it;
      const next = { ...it, ...patch };
      // keep within room in top-down projection using x,z and size
      next.x = clamp(next.x, 0, Math.max(0, room.width - next.w));
      next.z = clamp(next.z, 0, Math.max(0, room.length - next.d));
      next.w = clamp(next.w, 0.2, Math.max(0.2, room.width));
      next.d = clamp(next.d, 0.2, Math.max(0.2, room.length));
      next.h = clamp(next.h, 0.2, 3.0);
      return next;
    });
    set({ draft: { ...s.draft, items, updatedAt: Date.now() } });
  },

  removeItem: (id) => {
    const s = get();
    const items = s.draft.items.filter((it) => it.id !== id);
    set({
      draft: { ...s.draft, items, updatedAt: Date.now() },
      selectedItemId: s.selectedItemId === id ? null : s.selectedItemId,
    });
  },

  saveDraftAsNew: () => {
    const s = get();
    const designs = [...s.designs];
    const newDesign: Design = { ...s.draft, id: uid("design"), updatedAt: Date.now() };
    designs.unshift(newDesign);
    saveDesigns(designs);
    set({ designs, activeId: newDesign.id, draft: structuredClone(newDesign), selectedItemId: null });
  },

  overwriteActive: () => {
    const s = get();
    if (!s.activeId) {
      get().saveDraftAsNew();
      return;
    }
    const designs = s.designs.map((d) =>
      d.id === s.activeId ? { ...s.draft, id: s.activeId, updatedAt: Date.now() } : d
    );
    saveDesigns(designs);
    const updated = designs.find((d) => d.id === s.activeId)!;
    set({ designs, draft: structuredClone(updated), selectedItemId: null });
  },

  deleteDesign: (id) => {
    const s = get();
    const designs = s.designs.filter((d) => d.id !== id);
    saveDesigns(designs);
    if (s.activeId === id) {
      if (designs.length > 0) {
        set({ designs, activeId: designs[0].id, draft: structuredClone(designs[0]), selectedItemId: null });
      } else {
        set({ designs: [], activeId: null, draft: defaultDesign(), selectedItemId: null });
      }
    } else {
      set({ designs });
    }
  },

  renameDraft: (name) => {
    const s = get();
    set({ draft: { ...s.draft, name, updatedAt: Date.now() } });
  },
}));
