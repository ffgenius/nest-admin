export type CommonRes<T> = {
  code: number;
  message: string;
  data: T;
};
