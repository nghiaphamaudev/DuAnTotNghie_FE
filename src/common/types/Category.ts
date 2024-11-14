export interface Category {
    _id: string,
    name: string,
    active: boolean,
}

export interface CategoryRequest {
    name: string,
}