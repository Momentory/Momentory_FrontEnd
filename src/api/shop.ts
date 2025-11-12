import { api } from './client';
import type {
  ItemCategory,
  ShopItemsResponse,
  PurchaseItemResponse,
  PointResponse,
  MyItemsResponse
} from '../types/shop';

export const getShopItems = async (category?: ItemCategory) => {
  const params = category ? { category } : {};
  const { data } = await api.get<ShopItemsResponse>('/api/shop/items', { params });
  return data.result;
};

export const purchaseItem = async (itemId: number) => {
  const { data } = await api.post<PurchaseItemResponse>(`/api/shop/buy/${itemId}`);
  return data.result;
};

export const getRecentItems = async () => {
  const { data } = await api.get<ShopItemsResponse>('/api/shop/recent-items');
  return data.result;
}

export const getShopEvents = async () => {
  const { data } = await api.get<ShopItemsResponse>('/api/shop/events');
  return data.result;
}

export const getUserPoint = async () => {
  const { data } = await api.get<PointResponse>('/api/point');
  return data.result;
}

export const getMyItems = async (category?: ItemCategory) => {
  const params = category ? { category } : {};
  const { data } = await api.get<MyItemsResponse>('/api/items/mine', { params });
  return data.result;
}

export const getWardrobeList = async () => {
  const { data } = await api.get<import('../types/shop').WardrobeListResponse>('/api/wardrobe');
  return data.result;
}

export const saveWardrobe = async () => {
  const { data } = await api.post<import('../types/shop').WardrobeSaveResponse>('/api/wardrobe');
  return data.result;
}

export const applyWardrobe = async (wardrobeId: number) => {
  const { data } = await api.patch<import('../types/shop').WardrobeApplyResponse>(`/api/wardrobe/${wardrobeId}/apply`);
  return data.result;
}