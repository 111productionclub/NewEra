export type Product = {
    id: string;
    slug: string;
    name: string;
    price: number;
    status: "in-stock" | "sold-out" | "few-left";
    images: string[];
    sizes: string[];
    description: string[];
    vkUrl: string;
}

