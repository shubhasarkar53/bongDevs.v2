const { z } = require("zod");

const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required."),
  videoUrl: z.string().url("Invalid lesson video url"),
  duration: z.number().min(0, "Lesson duration must be positive").optional(),
  isFreePreview: z.boolean().optional(),
});

const sectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  description: z.string().optional(),
  lessons: z.array(lessonSchema).optional(),
});

const updateCourseSchema = z.object({
  title: z
    .string()
    .min(1, "Lesson title is required")
    .max(100, "Title must not exceed 100 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description can't be empty")
    .max(1000, "Title must not exceed 100 characters")
    .optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  videoUrl: z.string().url("Invalid video URL").optional(),
  regularPrice: z.number().min(1).optional(),
  currentPrice: z.number().min(1).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  language: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  sections: z.array(sectionSchema).optional(),
  isPublished: z.boolean().optional(),
});

const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, "Lesson title is required")
    .max(100, "Title must not exceed 100 characters")
    ,
  description: z
    .string()
    .min(1, "Description can't be empty")
    .max(1000, "Title must not exceed 100 characters")
    ,
  imageUrl: z.string().url("Invalid image URL").optional(),
  videoUrl: z.string().url("Invalid video URL").optional(),
  regularPrice: z.number().min(1),
  currentPrice: z.number().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdBy: z.string().min(1),
  language: z.string().optional().default("English"),
  prerequisites: z.array(z.string()).optional().default([]),
  sections: z.array(sectionSchema).optional(),
  isPublished: z.boolean().optional(),
})

module.exports = {
  updateCourseSchema,createCourseSchema
};
