import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists in the database
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (user?.length === 0) {
      // If not, add the user
      const data = {
        name: args.name,
        email: args.email,
        picture: args.picture,
        credits: 5000,
      };
      const result = await ctx.db.insert("users", data);
      return data;
    }

    return user[0];
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    return user[0];
  },
});

export const UpdateTokens = mutation({
  args: {
    credits: v.number(),
    uid: v.id("users"),
    orderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.orderId) {
      const result = await ctx.db.patch(args.uid, {
        credits: args.credits,
      });
    } else {
      const result = await ctx.db.patch(args.uid, {
        credits: args.credits,
        orderId: args.orderId,
      });
    }
  },
});
