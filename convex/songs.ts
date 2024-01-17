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
    objectId: v.string(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const song = await ctx.db.insert("songs", {
      objectId: args.objectId,
      title: args.title,
      duration: args.duration,
      process: 0,
      isArchived: false,
      albumId: undefined,
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

export const addToListById = mutation({
  args: { id: v.id("songs") },
  handler: async (ctx, args) => {
    const existingsong = await ctx.db.get(args.id);

    if (!existingsong) {
      throw new Error("Not found");
    }

    const song = await ctx.db.insert("songs", {
      objectId: existingsong.objectId,
      title: existingsong.title,
      duration: existingsong.duration,
      process: 0,
      isArchived: false,
      albumId: undefined,
    });

    return song;
  },
});

export const getSongs = query({
  handler: async (ctx) => {
    const songs = await ctx.db.query("songs").order("asc").collect();

    return songs;
  },
});

export const getArchivedSongs = query({
  handler: async (ctx) => {
    const songs = await ctx.db
      .query("songs")
      .filter((q) =>
        q.and(
          q.eq(q.field("isArchived"), true),
          q.eq(q.field("albumId"), undefined)
        )
      )
      .collect();

    return songs;
  },
});

export const getPlayingSongs = query({
  handler: async (ctx) => {
    const songs = await ctx.db
      .query("songs")
      .filter((q) =>
        q.and(
          q.eq(q.field("isArchived"), false),
          q.eq(q.field("albumId"), undefined)
        )
      )
      .collect();

    return songs;
  },
});

export const getByAlbumId = query({
  args: { id: v.optional(v.id("albums")) },
  handler: async (ctx, args) => {
    if (args.id === undefined) return [];

    const songs = await ctx.db
      .query("songs")
      .filter((q) => q.eq(q.field("albumId"), args.id))
      .collect();

    return songs;
  },
});

export const getByObjectId = query({
  args: { objectId: v.string() },
  handler: async (ctx, args) => {
    const songs = await ctx.db
      .query("songs")
      .filter((q) => q.eq(q.field("objectId"), args.objectId))
      .collect();

    return songs;
  },
});

export const getById = query({
  args: { id: v.id("songs") },
  handler: async (ctx, args) => {
    const song = await ctx.db.get(args.id);

    if (!song) {
      throw new Error("Not found");
    }

    return song;
  },
});

export const update = mutation({
  args: {
    id: v.id("songs"),
    objectId: v.optional(v.string()),
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

export const updateTime = mutation({
  args: {
    id: v.id("songs"),
    startTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;

    const existingsong = await ctx.db.get(args.id);

    if (!existingsong) {
      throw new Error("Not found");
    }

    const song = !!existingsong.startTime
      ? existingsong
      : await ctx.db.patch(args.id, {
          ...rest,
        });
    return song;
  },
});
