import { create } from 'zustand';
import requirementData from '@/static/requirements.json';
import type { SystemComponentMapping } from '@/lib/types';

interface Entity {
  id: string;
  name: string;
  components: Record<string, unknown>;
}

interface WorldState {
  requirementsFile: SystemComponentMapping;
  activeSystems: string[];
  entities: Record<string, Entity>;

  toggleSystem: (systemName: string) => void;
  addEntity: (entity: Entity) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  requirementsFile: requirementData,
  activeSystems: [],
  entities: {},

  toggleSystem: (systemName) =>
    set((state) => ({
      activeSystems: state.activeSystems.includes(systemName)
        ? state.activeSystems.filter((p) => p !== systemName)
        : [...state.activeSystems, systemName],
    })),

  addEntity: (entity) =>
    set((state) => ({
      entities: {
        ...state.entities,
        [entity.id]: entity,
      },
    })),

  updateEntity: (id, updates) =>
    set((state) => ({
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          ...updates,
        },
      },
    })),

}));