export type Unarray<T, K = never> = T extends (infer U)[] ? U : K;
