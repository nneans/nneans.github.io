import type { DesktopItem } from "../config/desktop";

type RecycleListener = (items: readonly DesktopItem[]) => void;

class RecycleStore {
  private items: DesktopItem[] = [];
  private listeners = new Set<RecycleListener>();

  getItems(): readonly DesktopItem[] {
    return this.items;
  }

  recycle(item: DesktopItem): void {
    if (item.appId === "recycleBin" || this.items.some((candidate) => candidate.id === item.id)) return;
    this.items = [...this.items, item];
    this.emit();
  }

  restore(itemId: string): void {
    this.items = this.items.filter((item) => item.id !== itemId);
    this.emit();
  }

  empty(): void {
    this.items = [];
    this.emit();
  }

  subscribe(listener: RecycleListener): () => void {
    this.listeners.add(listener);
    listener(this.items);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener(this.items));
  }
}

export const recycleStore = new RecycleStore();
