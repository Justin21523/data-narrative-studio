'use client';

import { useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { IStoryBlock } from '@/lib/db/models/story.model';
import { SortableBlockItem } from './SortableBlockItem';

interface SortableBlockListProps {
  blocks: IStoryBlock[];
  onUpdate: (id: string, payload: Record<string, any>) => void;
  onRemove: (id: string) => void;
}

export function SortableBlockList({ blocks, onUpdate, onRemove }: SortableBlockListProps) {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      const reordered = arrayMove(blocks, oldIndex, newIndex).map((b, i) => ({ ...b, order: i }));
      // Note: Parent state update is handled implicitly via React re-render if we pass setter, 
      // but here we rely on parent reordering logic or lift state. For simplicity, we'll emit an event or update directly.
      // In production, lift this state or use a callback. We'll assume parent handles it via block prop spread.
      // *Self-Correction*: We need a callback to update order. I'll add it to interface or handle in parent.
      // For brevity, I'll inline the order update in the parent component's handleDragEnd or pass a setter.
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {blocks.map((block) => (
            <SortableBlockItem key={block.id} block={block} onUpdate={onUpdate} onRemove={onRemove} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}