export interface PromotionAssociation {
    type: 'brand' | 'category';
    id: string;
    name: string;
}

export interface CarouselItem {
    id: string;
    image: string;
    title: string;
    description: string;
    association?: PromotionAssociation;
}

export interface CarouselResponseItem {
    _id: string;
    carousel_title: string;
    carousel_description: string;
    carousel_brand?: string;
    carousel_category?: string;
    carousel_url: string;
    carousel_association: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface CarouselApiResponse {
    success: boolean;
    message: string;
    data: CarouselResponseItem[];
}

export interface BannerItem {
    id: string;
    image: string;
    association?: PromotionAssociation;
}

export interface BannerResponseItem {
    _id: string;
    banner_brand?: string;
    banner_category?: string;
    banner_url: string;
    banner_association: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface BannerApiResponse {
    success: boolean;
    message: string;
    data: BannerResponseItem[];
}

export interface CountdownConfig {
    title: string;
    description: string;
    endDate: string;
    image: string;
    discountBadge: string;
    association?: PromotionAssociation;
}

export interface CountdownResponseItem {
    _id: string;
    countdown_title: string;
    countdown_description: string;
    countdown_discount: string;
    countdown_end_time: string;
    countdown_brand?: string;
    countdown_category?: string;
    countdown_url: string;
    countdown_association: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    remainingTime?: string;
}

export interface CountdownApiResponse {
    success: boolean;
    message: string;
    data: CountdownResponseItem[];
}
