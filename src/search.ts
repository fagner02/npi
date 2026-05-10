import puppeteer, { Browser, Page } from "puppeteer";
import fs from "fs/promises";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import type { Category, Product } from "./components/Main.vue";
const API_URL = "http://localhost:8080";

interface ImageResult {
    img: Buffer<ArrayBufferLike>;
    filename: string;
    contentType: string;
}

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class GoogleImageScraper {
    private browser: Browser | null = null;
    private page: Page | null = null;
    async initBrowser(): Promise<void> {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: false,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
            this.page = await this.browser.newPage();
        }
    }

    async dispose(): Promise<void> {
        if (this.page) {
            await this.page.close();
            this.page = null;
        }
        await this.closeBrowser();
    }

    async searchAndDownloadImage(productName: string): Promise<ImageResult> {
        if (!this.browser || !this.page) {
            throw new Error("Browser not initialized");
        }

        try {
            const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(
                productName,
            )}&udm=2`;
            console.log(`Searching for images at: ${searchUrl}`);
            await wait(300);
            this.page.goto(searchUrl);
            await wait(5000);

            console.log("Extracting image URLs from the page");
            const imageUrls: string[] = await this.page.evaluate(() => {
                const imgElements = Array.from(
                    document.querySelectorAll("img"),
                );
                return imgElements
                    .filter((x) => x.classList.contains("mimg"))
                    .map((img) => img.src);
            });
            if (imageUrls.length === 0) {
                throw new Error("No valid image URLs found");
            }

            for (const imageUrl of imageUrls) {
                try {
                    console.log(
                        `Attempting to download image: ${imageUrl.substring(
                            0,
                            10,
                        )}`,
                    );
                    const response = await fetch(imageUrl);

                    if (!response.ok || response.status !== 200) {
                        continue;
                    }

                    const contentType = response.headers.get("content-type");
                    if (!contentType?.startsWith("image/")) {
                        continue;
                    }

                    const arrayBuffer = await response.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    const extension =
                        this.getExtensionFromContentType(contentType) ||
                        this.getExtensionFromUrl(imageUrl) ||
                        "jpg";

                    await fs
                        .writeFile(
                            path.join(
                                "./downloads",
                                productName + "." + extension,
                            ),
                            buffer,
                        )
                        .catch((err) => {
                            console.error("Error saving image:", err);
                        });
                    return {
                        img: buffer,
                        filename: productName + "." + extension,
                        contentType: contentType,
                    };
                } catch (error: any) {
                    console.log(error);
                    console.warn(
                        `Failed to download ${imageUrl}:`,
                        error.message,
                    );
                    continue;
                }
            }

            throw new Error("All image download attempts failed");
        } catch (error) {
            await this.page.close();
            await this.closeBrowser();
            throw error;
        }
    }

    private getExtensionFromContentType(contentType: string): string | null {
        const types: Record<string, string> = {
            "image/jpeg": "jpg",
            "image/jpg": "jpg",
            "image/png": "png",
            "image/gif": "gif",
            "image/webp": "webp",
        };

        return types[contentType.toLowerCase()] || null;
    }

    private getExtensionFromUrl(url: string): string | null {
        const match = url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i);
        if (match) {
            const ext = match[1].toLowerCase();
            return ext === "jpeg" ? "jpg" : ext;
        }
        return null;
    }

    private async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

export const mockProducts: (Partial<Product> & { categoryId: number })[] = [
    {
        name: "iPhone 14 Pro",
        id: 1,
        description: "Latest Apple smartphone with advanced camera system",
        quantity: 25,
        price: 999.99,
        categoryId: 1,
    },
    {
        name: "Samsung Galaxy S23",
        id: 2,
        description: "Premium Android smartphone with excellent display",
        quantity: 18,
        price: 899.99,
        categoryId: 1,
    },
    {
        name: "MacBook Air M2",
        id: 3,
        description: "Ultra-thin laptop with Apple's M2 chip",
        quantity: 12,
        price: 1199.99,
        categoryId: 2,
    },
    {
        name: "Dell XPS 13",
        id: 4,
        description: "Compact Windows laptop with InfinityEdge display",
        quantity: 8,
        price: 949.99,
        categoryId: 2,
    },
    {
        name: "Sony WH-1000XM5",
        id: 5,
        description: "Premium noise-cancelling headphones",
        quantity: 30,
        price: 399.99,
        categoryId: 3,
    },
    {
        name: "Apple AirPods Pro",
        id: 6,
        description: "Wireless earbuds with active noise cancellation",
        quantity: 45,
        price: 249.99,
        categoryId: 3,
    },
    {
        name: 'iPad Pro 12.9"',
        id: 7,
        description:
            "Professional tablet with M2 chip and Liquid Retina XDR display",
        quantity: 15,
        price: 1099.99,
        categoryId: 4,
    },
    {
        name: "Samsung Galaxy Tab S9",
        id: 8,
        description: "Premium Android tablet with S Pen included",
        quantity: 22,
        price: 849.99,
        categoryId: 4,
    },
    {
        name: "Apple Watch Series 8",
        id: 9,
        description: "Advanced smartwatch with health monitoring features",
        quantity: 35,
        price: 399.99,
        categoryId: 5,
    },
    {
        name: "Fitbit Charge 5",
        id: 10,
        description: "Fitness tracker with GPS and stress management tools",
        quantity: 28,
        price: 179.99,
        categoryId: 5,
    },
    {
        name: "Canon EOS R5",
        id: 11,
        description: "Professional full-frame mirrorless camera with 8K video",
        quantity: 7,
        price: 3899.99,
        categoryId: 6,
    },
    {
        name: "PlayStation 5",
        id: 12,
        description: "Next-generation gaming console with ultra-high-speed SSD",
        quantity: 15,
        price: 499.99,
        categoryId: 7,
    },
    {
        name: "Xbox Series X",
        id: 13,
        description: "Most powerful Xbox console with 4K gaming at 60fps",
        quantity: 12,
        price: 499.99,
        categoryId: 7,
    },
    {
        name: 'Samsung 65" QLED TV',
        id: 14,
        description: "65-inch 4K QLED smart TV with Quantum HDR",
        quantity: 20,
        price: 1299.99,
        categoryId: 8,
    },
    {
        name: "LG OLED C2 Series",
        id: 15,
        description: "65-inch OLED 4K smart TV with perfect blacks",
        quantity: 18,
        price: 1499.99,
        categoryId: 8,
    },
    {
        name: "NVIDIA GeForce RTX 4080",
        id: 16,
        description:
            "High-performance graphics card for gaming and content creation",
        quantity: 5,
        price: 1199.99,
        categoryId: 9,
    },
    {
        name: "AMD Ryzen 9 7950X",
        id: 17,
        description: "16-core desktop processor for extreme performance",
        quantity: 8,
        price: 699.99,
        categoryId: 9,
    },
    {
        name: "HP LaserJet Pro MFP",
        id: 18,
        description: "All-in-one laser printer with scanning and copying",
        quantity: 25,
        price: 249.99,
        categoryId: 10,
    },
    {
        name: "Epson EcoTank ET-4760",
        id: 19,
        description: "Cartridge-free supertank printer with high-capacity ink",
        quantity: 30,
        price: 279.99,
        categoryId: 10,
    },
    {
        name: "GoPro HERO11 Black",
        id: 20,
        description:
            "Waterproof action camera with 5.3K video and HyperSmooth stabilization",
        quantity: 22,
        price: 399.99,
        categoryId: 6,
    },
];
export const mockCategories: Category[] = [
    {
        id: 1,
        name: "Smartphones",
        description: "Mobile phones, smartphones, and accessories",
    },
    {
        id: 2,
        name: "Laptops & Computers",
        description: "Laptops, desktops, and computer accessories",
    },
    {
        id: 3,
        name: "Audio & Headphones",
        description: "Headphones, earbuds, speakers, and audio equipment",
    },
    {
        id: 4,
        name: "Tablets",
        description: "Tablets, e-readers, and tablet accessories",
    },
    {
        id: 5,
        name: "Wearables",
        description: "Smartwatches, fitness trackers, and wearable technology",
    },
    {
        id: 6,
        name: "Cameras & Photography",
        description: "Digital cameras, lenses, and photography equipment",
    },
    {
        id: 7,
        name: "Gaming",
        description: "Gaming consoles, accessories, and gaming peripherals",
    },
    {
        id: 8,
        name: "Home Electronics",
        description: "Smart home devices, TVs, and home entertainment systems",
    },
    {
        id: 9,
        name: "Computer Components",
        description: "CPUs, GPUs, RAM, storage, and other PC components",
    },
    {
        id: 10,
        name: "Office Equipment",
        description: "Printers, scanners, and office productivity devices",
    },
];

export async function main(): Promise<void> {
    // const scraper = new GoogleImageScraper();
    // await scraper.initBrowser();

    try {
        let res = await axios.post("http://localhost:8080/users/login", {
            email: "g@eu",
            password: "123",
        });
        const token = res.data.token;

        res = await axios.get(API_URL + "/categorias", {
            headers: { Authorization: `Bearer ${token}` },
        });
        for (let x of res.data.data.content) {
            await axios.delete(API_URL + "/categorias/" + x.id, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        res = await axios.get(API_URL + "/produtos", {
            headers: { Authorization: `Bearer ${token}` },
        });
        for (let x of res.data.data.content) {
            await axios.delete(API_URL + "/produtos/" + x.id, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        for (const cat of mockCategories) {
            await axios.post(API_URL + "/categorias", cat, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        res = await axios.get(API_URL + "/categorias", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const cats = res.data.data.content;
        for (const prod of mockProducts) {
            const randId = Math.floor(Math.random() * cats.length);
            prod.categoryId = cats[randId].id;
            await axios.post(API_URL + "/produtos", prod, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }

        res = await axios.get(API_URL + "/produtos", {
            headers: { Authorization: `Bearer ${token}` },
        });
        let paths: string[] = [];
        const files = await fs.readdir("./downloads");

        for (const file of files) {
            console.log(file);
            paths.push(path.join("./downloads", file));
        }

        console.log(paths);
        for (let prod of res.data.data.content) {
            try {
                const path = paths.find((x) => x.includes(prod.name));
                const blob = fs.readFile(path as string);
                let result: ImageResult = {
                    img: await blob,
                    filename:
                        prod.name + path?.substring(path.lastIndexOf(".")),
                    contentType:
                        "image/" + path?.substring(path.lastIndexOf(".") + 1),
                };
                let form = new FormData();
                form.append("image", result.img, {
                    filename: result.filename,
                    contentType: result.contentType,
                });
                form.append("id", prod.id);
                await axios.post("http://localhost:8080/produtos/image", form, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        ...form.getHeaders(),
                    },
                });
                console.log("Successfully uploaded:", result.filename);
                await wait(200);
            } catch (e) {
                console.log(e);
                // scraper.dispose();
            }
        }
        // scraper.dispose();
    } catch (error: any) {
        console.log(error.response);
    }
}
main();
export default GoogleImageScraper;
