import { apiClient } from "@/lib/api/client";
import { TestimonialResponse, TestimonialInput } from "@/types/api";

export const TestimonialService = {
  getPublicTestimonials: async (): Promise<TestimonialResponse[]> => {
    return apiClient.public.getTestimonials();
  },

  getAdminTestimonials: async (): Promise<TestimonialResponse[]> => {
    return apiClient.admin.testimonials.list();
  },

  createTestimonial: async (input: TestimonialInput): Promise<TestimonialResponse> => {
    return apiClient.admin.testimonials.create(input);
  },

  updateTestimonial: async (id: string, input: TestimonialInput): Promise<TestimonialResponse> => {
    return apiClient.admin.testimonials.update(id, input);
  },

  deleteTestimonial: async (id: string): Promise<void> => {
    return apiClient.admin.testimonials.delete(id);
  },
};
