"use client";

import { useEffect, useMemo, useState } from "react";
import { useDesignerStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Range } from "@/components/ui/Range";
import { Trash2, Plus, Save, FilePlus } from "lucide-react";

import type { ItemType } from "@/lib/types";

export function Sidebar() {
  const {
    view,
    setView,
    designs,
    activeId,
    draft,
    selectedItemId,
    load,
    newDesign,
    setActive,
    renameDraft,
    updateRoom,
    setShade,
    addItem,
    selectItem,
    updateItem,
    removeItem,
    saveDraftAsNew,
    overwriteActive,
    deleteDesign,
  } = useDesignerStore();

  const [itemType, setItemType] = useState<ItemType>("sofa");

  useEffect(() => {
    load();
  }, [load]);

  const selectedItem = useMemo(
    () => draft.items.find((i) => i.id === selectedItemId) ?? null,
    [draft.items, selectedItemId]
  );

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-soft overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-gradient-to-b from-zinc-900/40 to-zinc-950">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Designs</div>
            <div className="text-xs text-zinc-400">Saved locally (dummy DB)</div>
          </div>
          <Button variant="ghost" size="sm" onClick={newDesign}>
          <FilePlus size={16} className="mr-2" />

            New
          </Button>
        </div>

        <div className="mt-3">
          <Label>Current design name</Label>
          <Input
            value={draft.name}
            onChange={(e) => renameDraft(e.target.value)}
            placeholder="e.g., Customer living room"
          />
        </div>

        <div className="mt-3 flex gap-2">
          <Button className="flex-1" size="sm" onClick={overwriteActive} title="Save changes to selected design">
            <Save size={16} className="mr-2" />
            Save
          </Button>
          <Button
            className="flex-1"
            variant="ghost"
            size="sm"
            onClick={saveDraftAsNew}
            title="Save as a new design"
          >
            <Plus size={16} className="mr-2" />
            Save as new
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* View toggle */}
        <div className="grid grid-cols-2 gap-2">
       <Button variant={view === "2d" ? "primary" : "ghost"} size="sm" onClick={() => setView("2d")}>
  <span className="mr-2">▦</span> 2D
</Button>
<Button variant={view === "3d" ? "primary" : "ghost"} size="sm" onClick={() => setView("3d")}>
  <span className="mr-2">⬛</span> 3D
</Button>

        </div>

        {/* Saved designs list */}
        <div className="space-y-2">
          <Label>Saved designs</Label>
          <div className="space-y-2 max-h-44 overflow-auto pr-1">
            {designs.length === 0 && <div className="text-sm text-zinc-500">No saved designs yet.</div>}
            {designs.map((d) => (
              <div
                key={d.id}
                className={`rounded-xl border px-3 py-2 text-sm cursor-pointer transition ${
                  d.id === activeId ? "border-zinc-500 bg-zinc-900/50" : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900/30"
                }`}
                onClick={() => setActive(d.id)}
              >
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-zinc-500">
                  {d.room.width}m × {d.room.length}m · {d.items.length} items
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDesign(d.id);
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room settings */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">Room</div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label>Width (m)</Label>
              <Input
                inputMode="decimal"
                value={String(draft.room.width)}
                onChange={(e) => updateRoom({ width: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <Label>Length (m)</Label>
              <Input
                inputMode="decimal"
                value={String(draft.room.length)}
                onChange={(e) => updateRoom({ length: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <Label>Height (m)</Label>
              <Input
                inputMode="decimal"
                value={String(draft.room.height)}
                onChange={(e) => updateRoom({ height: Number(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Wall color</Label>
              <Input
                type="color"
                className="h-10 p-1"
                value={draft.room.wallColor}
                onChange={(e) => updateRoom({ wallColor: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Floor color</Label>
              <Input
                type="color"
                className="h-10 p-1"
                value={draft.room.floorColor}
                onChange={(e) => updateRoom({ floorColor: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Shade (lighting)</Label>
            <Range min={0} max={1} step={0.01} value={draft.shade} onChange={(e) => setShade(Number(e.target.value))} />
          </div>
        </div>

        {/* Add item */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">Furniture</div>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Select value={itemType} onChange={(e) => setItemType(e.target.value as ItemType)}>
              <option value="sofa">Sofa</option>
              <option value="table">Table</option>
              <option value="bed">Bed</option>
              <option value="chair">Chair</option>
              <option value="cabinet">Cabinet</option>
            </Select>
            <Button size="sm" onClick={() => addItem(itemType)}>
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>

          <div className="text-xs text-zinc-500">
            Items are simple boxes (good enough for prototype). Drag in 2D, preview in 3D.
          </div>
        </div>

        {/* Selected item controls */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">Selected item</div>
          {!selectedItem ? (
            <div className="text-sm text-zinc-500">
              Click an item in 2D to edit it. (Or select from the list below.)
              <div className="mt-2 space-y-2">
                {draft.items.map((it) => (
                  <button
                    key={it.id}
                    className={`w-full text-left rounded-xl border px-3 py-2 text-sm transition ${
                      it.id === selectedItemId ? "border-zinc-500 bg-zinc-900/50" : "border-zinc-800 hover:bg-zinc-900/30"
                    }`}
                    onClick={() => selectItem(it.id)}
                  >
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-zinc-500">{it.type} · {it.w}×{it.d}m</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input
                    value={selectedItem.name}
                    onChange={(e) => updateItem(selectedItem.id, { name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Color</Label>
                  <Input
                    type="color"
                    className="h-10 p-1"
                    value={selectedItem.color}
                    onChange={(e) => updateItem(selectedItem.id, { color: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label>W (m)</Label>
                  <Input
                    inputMode="decimal"
                    value={String(selectedItem.w)}
                    onChange={(e) => updateItem(selectedItem.id, { w: Number(e.target.value) || 0.2 })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>D (m)</Label>
                  <Input
                    inputMode="decimal"
                    value={String(selectedItem.d)}
                    onChange={(e) => updateItem(selectedItem.id, { d: Number(e.target.value) || 0.2 })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>H (m)</Label>
                  <Input
                    inputMode="decimal"
                    value={String(selectedItem.h)}
                    onChange={(e) => updateItem(selectedItem.id, { h: Number(e.target.value) || 0.2 })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Rotate (°)</Label>
                <Range
                  min={-180}
                  max={180}
                  step={1}
                  value={Math.round((selectedItem.rotY * 180) / Math.PI)}
                  onChange={(e) => updateItem(selectedItem.id, { rotY: (Number(e.target.value) * Math.PI) / 180 })}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => selectItem(null)} className="flex-1">
                  Done
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeItem(selectedItem.id)}
                  className="flex-1"
                >
                  <Trash2 size={16} className="mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-zinc-800">
          <div className="text-xs text-zinc-500">
            Tip: For your report, screenshot the 2D layout + 3D preview, and describe how your UI supports the designer workflow.
          </div>
        </div>
      </div>
    </div>
  );
}
