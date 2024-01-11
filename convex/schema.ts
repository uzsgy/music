import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  songs: defineTable({
    title: v.optional(v.string()),
    url: v.string(),
    duration: v.number(),
    process: v.number(),
    isArchived: v.optional(v.boolean()),
  }),
});
