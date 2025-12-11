import { MockThemeService } from '../services/mock-theme.service';

export function initThemeSwitcher(): void {
    
    const themeButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent?.trim() === 'Change theme');
    
    if (!themeButton) {
        console.warn('Кнопка переключения темы не найдена');
        return;
    }

    const themeService = new MockThemeService();

    themeButton.addEventListener('click', async () => {
        const currentTheme = await themeService.getCurrentTheme();
        const themes = await themeService.getThemes();
        
        if (currentTheme === null) {
            if (themes.length > 0) {
                await themeService.setCurrentTheme(themes[0].id);
            }
        } else {
            await themeService.setCurrentTheme('dark');
        }
    });

    loadSavedTheme();
}

async function loadSavedTheme(): Promise<void> {
    const themeService = new MockThemeService();
    const currentTheme = await themeService.getCurrentTheme();
    
    if (currentTheme) {
        await themeService.setCurrentTheme(currentTheme.id);
    }
}