export {};

declare global {
  type OnlyProperties<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: T[K];
  };
  type StrictOmit<T, K extends keyof T> = Omit<T, K>;
}
