import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const archive = mutation({
  args: { id: v.id("songs") },
  handler: async (ctx, args) => {
    const existingSong = await ctx.db.get(args.id);

    if (!existingSong) {
      throw new Error("Not found");
    }

    const song = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    return song;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    url: v.string(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const song = await ctx.db.insert("songs", {
      url: args.url,
      title: args.title,
      duration: args.duration,
      process: 0,
      isArchived: false,
    });

    return song;
  },
});

export const remove = mutation({
  args: { id: v.id("songs") },
  handler: async (ctx, args) => {
    const existingsong = await ctx.db.get(args.id);

    if (!existingsong) {
      throw new Error("Not found");
    }

    const song = await ctx.db.delete(args.id);

    return song;
  },
});

export const getSongs = query({
  handler: async (ctx) => {
    const songs = await ctx.db
      .query("songs")
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("asc")
      .collect();

    return songs;
  },
});

export const getById = query({
  args: { songId: v.id("songs") },
  handler: async (ctx, args) => {
    const song = await ctx.db.get(args.songId);

    if (!song) {
      throw new Error("Not found");
    }

    return song;
  },
});

export const update = mutation({
  args: {
    id: v.id("songs"),
    url: v.optional(v.string()),
    process: v.optional(v.number()),
    isArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;

    const existingsong = await ctx.db.get(args.id);

    if (!existingsong) {
      throw new Error("Not found");
    }

    const song = await ctx.db.patch(args.id, {
      ...rest,
    });

    return song;
  },
});
