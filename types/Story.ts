import { z } from "zod";

export const HookTypeSchema = z.enum([
    "question",
    "shocking_fact",
    "mistake",
    "relatable_statement",
    "story_start",
]);
export type HookType = z.infer<typeof HookTypeSchema>;

export const HookSchema = z.object({
    text: z.string(),
    type: HookTypeSchema,
});
export type Hook = z.infer<typeof HookSchema>;

export const CoreMessageSchema = z.object({
    main_message: z.string(),
    problem: z.string(),
    resolution: z.string(),
    takeaway: z.string(),
});
export type CoreMessage = z.infer<typeof CoreMessageSchema>;

export const ScriptSegmentSchema = z.object({
    order: z.number(),
    narration: z.string(),
    visual_idea: z.string(),
    image_prompt_seed: z.string(),
});
export type ScriptSegment = z.infer<typeof ScriptSegmentSchema>;

export const ScriptSchema = z.object({
    title: z.string(),
    intent: z.string(),
    hook: HookSchema,
    message: CoreMessageSchema,
    segments: z.array(ScriptSegmentSchema),
    hashtags: z.array(z.string()),
    estimated_total_duration: z.number(),
});
export type Script = z.infer<typeof ScriptSchema>;

export const StorySchema = z.object({
    id: z.string(),
    script: ScriptSchema,
});
export type Story = z.infer<typeof StorySchema>;
