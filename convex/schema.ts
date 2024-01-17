import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  songs: defineTable({
    title: v.optional(v.string()),
    objectId: v.string(),
    isArchived: v.optional(v.boolean()),
    albumId: v.optional(v.id("albums")),
    duration: v.number(),
    process: v.number(),
    startTime: v.optional(v.string()),
  }),
  albums: defineTable({
    name: v.string(),
    isArchived: v.optional(v.boolean()),
  }),
});
