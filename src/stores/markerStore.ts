import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Marker } from '../types/map/map';

interface MarkerStore {
  markers: Marker[];
  addMarker: (marker: Omit<Marker, 'id'>) => void;
  updateMarker: (location: string, updates: Partial<Marker>) => void;
  getMarkerByLocation: (location: string) => Marker | undefined;
  clearMarkers: () => void;
}

export const useMarkerStore = create<MarkerStore>()(
  persist(
    (set, get) => ({
      markers: [],

      addMarker: (markerData) => {
        const { markers } = get();
        // 같은 위치에 마커가 있는지 확인
        const existingIndex = markers.findIndex(
          (m) => m.location === markerData.location
        );

        if (existingIndex >= 0) {
          // 기존 마커 업데이트
          const updated = [...markers];
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...markerData,
            id: updated[existingIndex].id,
          };
          set({ markers: updated });
        } else {
          // 새 마커 추가
          const newId = markers.length > 0 ? Math.max(...markers.map((m) => m.id)) + 1 : 1;
          set({
            markers: [
              ...markers,
              {
                ...markerData,
                id: newId,
              },
            ],
          });
        }
      },

      updateMarker: (location, updates) => {
        const { markers } = get();
        const updated = markers.map((m) =>
          m.location === location ? { ...m, ...updates } : m
        );
        set({ markers: updated });
      },

      getMarkerByLocation: (location) => {
        return get().markers.find((m) => m.location === location);
      },

      clearMarkers: () => {
        set({ markers: [] });
      },
    }),
    {
      name: 'marker-storage', // localStorage 키
      storage: createJSONStorage(() => localStorage),
    }
  )
);

