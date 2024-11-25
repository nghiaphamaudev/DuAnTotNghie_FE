export type ResponseData<T = unknown> = {
    status: boolean,
    message: string,
    data: T
};