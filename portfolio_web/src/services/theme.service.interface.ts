import { Theme } from '../models/theme.interface';


export interface IThemeService {
    getThemes(): Promise<readonly Theme[]>;
    getCurrentTheme(): Promise<Theme | null>;
    setCurrentTheme(ThemeId: string): Promise<void>;

}

