import { api } from './client';
import type {
  ItemCategory,
  ShopItemsResponse,
  PurchaseItemResponse
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