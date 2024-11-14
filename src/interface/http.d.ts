export type ResponseData<T = unknown> = {
    status: boolean,
    message: string | null,
    data: T
};