import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    credits: v.number(),
    orderId: v.optional(v.string()),
  }),
  userAiAssistants: defineTable({
    id: v.number(),
    name: v.string(),
    title: v.string(),
    image: v.string(),
    instruction: v.string(),
    userInstruction: v.string(),
    sampleQuestions: v.any(),
    aiModelId:v.optional(v.string()),
    uid: v.id("users"),
  }),
});
