import {CollectionFromAPI} from "@/lib/collections";
import {Vibrant} from "node-vibrant/node";
import {hexToRgb} from "@vibrant/color";
import sizeOf from 'image-size';

type PaletteType =
    | "Vibrant"
    | "Muted"
    | "DarkVibrant"
    | "DarkMuted"
    | "LightVibrant"
    | "LightMuted";

export type HexPalette = Partial<Record<PaletteType, string>>;

export async function getPaletteFromCollection(collection: CollectionFromAPI): Promise<HexPalette> {
    if (collection.artworks.length === 0) {
        return {};
    }
    const palette = await Vibrant.from(collection.artworks[0].thumbnail).getPalette();
    const hexPalette: HexPalette = {};

    for (const type of Object.keys(palette) as PaletteType[]) {
        const swatch = palette[type];
        if (swatch) {
            hexPalette[type] = swatch.hex;
        }
    }

    return hexPalette;
}

export function pickBackgroundForTextCard(palette: HexPalette): string {
    const priorityOrder: PaletteType[] = [
        "LightMuted",
        "LightVibrant",
        "Muted",
        "Vibrant",
    ];

    for (const key of priorityOrder) {
        if (palette[key]) return palette[key]!;
    }

    return "#f5f5f5";
}

export function getTextColor(backgroundHex: string): "white" | "black" {
    const { r, g, b } = hexToRgb(backgroundHex);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "black" : "white";
}

export async function getImageFormat(
    url: string,
    tolerance: number = 0.05
): Promise<"portrait" | "landscape" | "square"> {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();

    const { width, height } = sizeOf(Buffer.from(buffer));

    if (!width || !height) throw new Error("Impossible de déterminer les dimensions de l'image.");

    const aspectRatio = width / height;

    if (Math.abs(aspectRatio - 1) <= tolerance) {
        return "square";
    } else if (aspectRatio > 1) {
        return "landscape";
    } else {
        return "portrait";
    }
}
