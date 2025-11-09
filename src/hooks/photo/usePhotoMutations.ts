import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import {
  uploadPhoto,
  updatePhoto,
  deletePhoto,
  updatePhotoVisibility,
  updatePhotoNearby,
} from '../../api/photo';
import type {
  UploadPhotoRequest,
  UploadPhotoResponse,
  PhotoResponse,
  DeletePhotoResponse,
  UpdatePhotoVisibilityResponse,
  NearbySpotsResponse,
  UpdatePhotoRequest,
} from '../../types/photo';

const PHOTO_QUERY_KEYS = {
  detail: (photoId: number) => ['photo', photoId] as const,
  nearby: (photoId: number) => ['photo', 'nearby', photoId] as const,
};

export function useUploadPhotoMutation(
  options?: UseMutationOptions<
    UploadPhotoResponse,
    unknown,
    UploadPhotoRequest,
    unknown
  >
) {
  const queryClient = useQueryClient();

  return useMutation<UploadPhotoResponse, unknown, UploadPhotoRequest, unknown>(
    {
      mutationFn: uploadPhoto,
      onSuccess: (data, variables, context, mutation) => {
        queryClient.invalidateQueries({
          queryKey: PHOTO_QUERY_KEYS.detail(data.result.photoId),
        });
        options?.onSuccess?.(data, variables, context, mutation);
      },
      ...options,
    }
  );
}

export function useUpdatePhotoMutation(
  photoId: number,
  options?: UseMutationOptions<
    PhotoResponse,
    unknown,
    UpdatePhotoRequest,
    unknown
  >
) {
  const queryClient = useQueryClient();

  return useMutation<PhotoResponse, unknown, UpdatePhotoRequest, unknown>({
    mutationFn: (payload: UpdatePhotoRequest) => updatePhoto(photoId, payload),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: PHOTO_QUERY_KEYS.detail(photoId),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
    ...options,
  });
}

export function useDeletePhotoMutation(
  photoId: number,
  options?: UseMutationOptions<DeletePhotoResponse, unknown, void, unknown>
) {
  const queryClient = useQueryClient();

  return useMutation<DeletePhotoResponse, unknown, void, unknown>({
    mutationFn: () => deletePhoto(photoId),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.removeQueries({
        queryKey: PHOTO_QUERY_KEYS.detail(photoId),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
    ...options,
  });
}

export function useUpdatePhotoVisibilityMutation(
  photoId: number,
  options?: UseMutationOptions<
    UpdatePhotoVisibilityResponse,
    unknown,
    boolean,
    unknown
  >
) {
  const queryClient = useQueryClient();

  return useMutation<UpdatePhotoVisibilityResponse, unknown, boolean, unknown>({
    mutationFn: (visibility: boolean) =>
      updatePhotoVisibility(photoId, visibility),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: PHOTO_QUERY_KEYS.detail(photoId),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
    ...options,
  });
}

export type UpdatePhotoNearbyVariables = {
  photoId: number;
  limit?: number;
};

export function useUpdatePhotoNearbyMutation(
  options?: UseMutationOptions<
    NearbySpotsResponse,
    unknown,
    UpdatePhotoNearbyVariables,
    unknown
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    NearbySpotsResponse,
    unknown,
    UpdatePhotoNearbyVariables,
    unknown
  >({
    mutationFn: ({ photoId, limit = 4 }) => updatePhotoNearby(photoId, limit),
    onSuccess: (data, variables, context, mutation) => {
      if (variables?.photoId) {
        queryClient.invalidateQueries({
          queryKey: PHOTO_QUERY_KEYS.nearby(variables.photoId),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
    ...options,
  });
}
