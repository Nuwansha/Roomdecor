"use client";

import { useDesignerStore } from "@/lib/store";
import { Editor2D } from "@/components/editor/Editor2D";
import { Preview3D } from "@/components/editor/Preview3D";

export function Workspace() {
  const { view } = useDesignerStore();

  return (
    <div>
      {view === "2d" ? <Editor2D /> : <Preview3D />}
    </div>
  );
}
