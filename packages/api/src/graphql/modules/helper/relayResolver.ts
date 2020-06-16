import { toGlobalId } from 'graphql-relay';

export function idResolver<T extends object>(key: keyof T, type: string) {
  return function simpleIdResolver(parent: T) {
    return toGlobalId(type, (parent[key] as unknown) as string);
  };
}
