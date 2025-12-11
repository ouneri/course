import { IThemeService } from './theme.service.interface';
import { Theme } from '../models/theme.interface';
import { HexColor } from '../utils/hex-color.class';

export class MockThemeService implements IThemeService {
    
    private readonly themes: readonly Theme[] = [
        {
            id: 'light',
            name: 'Светлая',
            colors: {
                primary: new HexColor('#000000'),
                secondary: new HexColor('#666666'),
                background: new HexColor('#ffffff'),
                text: new HexColor('#000000'),
            }
        }
    ];

    async getThemes(): Promise<readonly Theme[]> {
        return this.themes;
    }

    async getCurrentTheme(): Promise<Theme | null> {
        const savedThemeId = localStorage.getItem('current_theme');
        
        if (!savedThemeId || savedThemeId === 'dark') {
            return null; 
        }
        
        return this.themes.find(theme => theme.id === savedThemeId) || null;
    }

    async setCurrentTheme(themeId: string): Promise<void> {
        if (themeId === 'dark') {
            localStorage.removeItem('current_theme');
            this.applyDarkTheme();
            return;
        }
        
        const theme = this.themes.find(t => t.id === themeId);
        if (theme) {
            localStorage.setItem('current_theme', themeId);
            this.applyTheme(theme);
        }
    }

    private applyTheme(theme: Theme): void {
        const primaryColor = theme.colors.primary.toString();
        const textColor = theme.colors.text.toString();
        const bgColor = theme.colors.background.toString();
        const secondaryColor = theme.colors.secondary.toString();

        document.body.style.backgroundColor = bgColor;
        document.body.style.color = textColor;

        const matrixContainer = document.querySelector('.matrix-container');
        if (matrixContainer) {
            const container = matrixContainer as HTMLElement;
            container.style.backgroundColor = bgColor;
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100vh';
            container.style.display = 'flex';
            container.style.setProperty('z-index', '-1');
            container.style.overflow = 'hidden';
            container.style.pointerEvents = 'none';
        }
        
        const oldStyle = document.getElementById('light-theme-matrix-style');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        const style = document.createElement('style');
        style.id = 'light-theme-matrix-style';
        style.textContent = `
            .matrix-column::before {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                background: linear-gradient(
                    to bottom,
                    #0066ff 0%,
                    #0066ff 5%,
                    #0088ff 10%,
                    #0055cc 20%,
                    #0077dd 30%,
                    #0044aa 40%,
                    #0066ff 50%,
                    #0055cc 60%,
                    #0088ff 70%,
                    #0044aa 80%,
                    rgba(0, 68, 170, 0.95) 90%,
                    transparent 100%
                ) !important;
                -webkit-background-clip: text !important;
                background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                filter: brightness(1.2) !important;
                writing-mode: vertical-lr !important;
                letter-spacing: 1px !important;
                text-rendering: optimizeLegibility !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }
        `;
        document.head.appendChild(style);

        const sections = document.querySelectorAll('section, .About_me, .second_header, #work, #blog, #coop');
        sections.forEach(section => {
            (section as HTMLElement).style.backgroundColor = 'transparent';
        });

        const h1Elements = document.querySelectorAll('h1, .second_header h1');
        h1Elements.forEach(el => {
            (el as HTMLElement).style.color = primaryColor;
        });

        const h2Elements = document.querySelectorAll('h2, .About_me h2');
        h2Elements.forEach(el => {
            (el as HTMLElement).style.color = primaryColor;
        });

        const h3Elements = document.querySelectorAll('h3, .About_me h3');
        h3Elements.forEach(el => {
            (el as HTMLElement).style.color = secondaryColor;
        });

        const h4Elements = document.querySelectorAll('h4, .skills-content h4');
        h4Elements.forEach(el => {
            (el as HTMLElement).style.color = primaryColor;
        });

        const pElements = document.querySelectorAll('p, .About_me p');
        pElements.forEach(el => {
            (el as HTMLElement).style.color = textColor;
        });

        const links = document.querySelectorAll('a, .header nav a');
        links.forEach(el => {
            (el as HTMLElement).style.color = primaryColor;
        });

        const navUl = document.querySelectorAll('.header nav ul');
        navUl.forEach(el => {
            (el as HTMLElement).style.color = textColor;
        });

        const skillsList = document.querySelector('.skills ul');
        if (skillsList) {
            (skillsList as HTMLElement).style.color = textColor;
        }
        const skills = document.querySelectorAll('.skills ul li');
        skills.forEach(el => {
            (el as HTMLElement).style.color = textColor;
        });

        const header = document.querySelector('.header');
        if (header) {
            (header as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        }

        const buttons = document.querySelectorAll('button, .header button');
        buttons.forEach(el => {
            (el as HTMLElement).style.color = primaryColor;
            (el as HTMLElement).style.borderColor = primaryColor;
        });
    }

    private applyDarkTheme(): void {
        document.body.style.removeProperty('background-color');
        document.body.style.removeProperty('color');

        const matrixContainer = document.querySelector('.matrix-container');
        if (matrixContainer) {
            const container = matrixContainer as HTMLElement;
            container.style.removeProperty('background-color');
            container.style.removeProperty('position');
            container.style.removeProperty('top');
            container.style.removeProperty('left');
            container.style.removeProperty('width');
            container.style.removeProperty('height');
            container.style.removeProperty('display');
            container.style.removeProperty('z-index');
            container.style.removeProperty('overflow');
            container.style.removeProperty('pointer-events');
        }
        
        const lightThemeStyle = document.getElementById('light-theme-matrix-style');
        if (lightThemeStyle) {
            lightThemeStyle.remove();
        }

        const sections = document.querySelectorAll('section, .About_me, .second_header, #work, #blog, #coop');
        sections.forEach(section => {
            (section as HTMLElement).style.removeProperty('background-color');
        });

        const allElements = document.querySelectorAll('h1, h2, h3, h4, p, a, .header nav ul, .skills ul, .skills ul li, button');
        allElements.forEach(el => {
            (el as HTMLElement).style.removeProperty('color');
        });

        const header = document.querySelector('.header');
        if (header) {
            (header as HTMLElement).style.removeProperty('background-color');
        }

        const buttons = document.querySelectorAll('button');
        buttons.forEach(el => {
            (el as HTMLElement).style.removeProperty('border-color');
        });
    }
}