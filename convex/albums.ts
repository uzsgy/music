import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const archive = mutation({
  args: { id: v.id("albums") },
  handler: async (ctx, args) => {
    const existingAlbum = await ctx.db.get(args.id);

    if (!existingAlbum) {
      throw new Error("Not found");
    }

    const album = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    return album;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const album = await ctx.db.insert("albums", {
      name: args.name,
      isArchived: false,
    });

    return album;
  },
});

export const remove = mutation({
  args: { id: v.id("albums") },
  handler: async (ctx, args) => {
    const existingAlbum = await ctx.db.get(args.id);

    if (!existingAlbum) {
      throw new Error("Not found");
    }

    const album = await ctx.db.delete(args.id);

    return album;
  },
});

export const getAlbums = query({
  handler: async (ctx) => {
    const albums = await ctx.db.query("albums").order("asc").collect();

    return albums;
  },
});

export const getById = query({
  args: { albumId: v.id("albums") },
  handler: async (ctx, args) => {
    const album = await ctx.db.get(args.albumId);

    if (!album) {
      throw new Error("Not found");
    }

    return album;
  },
});

export const update = mutation({
  args: {
    id: v.id("albums"),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;

    const existingAlbum = await ctx.db.get(args.id);

    if (!existingAlbum) {
      throw new Error("Not found");
    }

    const album = await ctx.db.patch(args.id, {
      ...rest,
    });

    return album;
  },
});

export const addSong = mutation({
  args: {
    songId: v.id("songs"),
    albumId: v.id("albums"),
  },
  handler: async (ctx, args) => {
    const existingAlbum = await ctx.db.get(args.albumId);

    if (!existingAlbum) {
      throw new Error("Not found");
    }

    const existingSong = await ctx.db.get(args.songId);

    if (!existingSong) {
      throw new Error("Not found");
    }

    const song = await ctx.db.insert("songs", {
      title: existingSong.title,
      objectId: existingSong.objectId,
      duration: existingSong.duration,
      isArchived: false,
      process: 0,
      albumId: existingAlbum._id,
    });

    return song;
  },
});

export const removeSong = mutation({
  args: {
    objectId: v.string(),
    albumId: v.id("albums"),
  },
  handler: async (ctx, args) => {
    const existingSongs = await ctx.db
      .query("songs")
      .filter((q) =>
        q.and(
          q.eq(q.field("albumId"), args.albumId),
          q.eq(q.field("objectId"), args.objectId)
        )
      )
      .collect();

    await Promise.all(
      existingSongs.map(async (song) => {
        ctx.db.delete(song._id);
      })
    );
  },
});
