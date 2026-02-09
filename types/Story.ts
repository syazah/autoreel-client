export type HookType =
    | "question"
    | "shocking_fact"
    | "mistake"
    | "relatable_statement"
    | "story_start";

export type Hook = {
    text: string;
    type: HookType;
};

export type CoreMessage = {
    main_message: string;
    problem: string;
    resolution: string;
    takeaway: string;
};

export type ScriptSegment = {
    order: number;
    narration: string;
    visual_idea: string;
    image_prompt_seed: string;
};

export type Script = {
    title: string;
    intent: string;
    hook: Hook;
    message: CoreMessage;
    segments: ScriptSegment[];
    hashtags: string[];
    estimated_total_duration: number;
};

export type Story = {
    id: string;
    script: Script;
};
