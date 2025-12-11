import { HexColor } from '../utils/hex-color.class';

export interface Theme {
    id: string;
    name: string;
    colors: {
        primary: HexColor;
        secondary: HexColor;
        background: HexColor;
        text: HexColor;
        accent?: HexColor;
    };
    isCustom?: boolean;
}