import axios from "axios";
import type {
  SocialPost,
  SocialAccount,
  HashtagGroup,
} from "@/types/socialBuffer";

const api = axios.create({
  baseURL: "/api/social-buffer",
  headers: {
    "Content-Type": "application/json",
  },
});

export const socialBufferApi = {
  // Posts
  getPosts: (params?: { status?: string; page?: number }) =>
    api.get<{ data: SocialPost[] }>("/posts", { params }),

  getPost: (id: string) => api.get<SocialPost>(`/posts/${id}`),

  createPost: (data: Partial<SocialPost>) =>
    api.post<SocialPost>("/posts", data),

  updatePost: (id: string, data: Partial<SocialPost>) =>
    api.put<SocialPost>(`/posts/${id}`, data),

  deletePost: (id: string) => api.delete(`/posts/${id}`),

  publishPost: (id: string) => api.post(`/posts/${id}/publish`),

  schedulePost: (id: string, scheduledAt: string) =>
    api.post(`/posts/${id}/schedule`, { scheduled_at: scheduledAt }),

  // Social Accounts
  getAccounts: () => api.get<{ data: SocialAccount[] }>("/accounts"),

  getAccount: (id: string) => api.get<SocialAccount>(`/accounts/${id}`),

  createAccount: (data: Partial<SocialAccount>) =>
    api.post<SocialAccount>("/accounts", data),

  updateAccount: (id: string, data: Partial<SocialAccount>) =>
    api.put<SocialAccount>(`/accounts/${id}`, data),

  deleteAccount: (id: string) => api.delete(`/accounts/${id}`),

  // Hashtags
  getHashtagGroups: () => api.get<{ data: HashtagGroup[] }>("/hashtags"),

  createHashtagGroup: (data: Partial<HashtagGroup>) =>
    api.post<HashtagGroup>("/hashtags", data),

  // Media
  uploadMedia: (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    return api.post("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  },

  // Analytics
  getAnalytics: (postId: string) => api.get(`/posts/${postId}/analytics`),};
