import { initThemeSwitcher } from './utils/theme-switcher';
import { MockSkillServices } from "./services/mockSkillServices";
// Плавность по бергер меню

document.addEventListener('DOMContentLoaded', () => {
    const menubar = document.querySelector('nav ul')
    
    if (!menubar) return
    

    function smoothScrollTo(targetPosition: number, duration: number = 800) {
        const startPosition = window.pageYOffset
        const distance = targetPosition - startPosition
        let startTime: number | null = null
        
        function animation(currentTime: number) {
            if (startTime === null) startTime = currentTime
            const timeElapsed = currentTime - startTime
            const progress = Math.min(timeElapsed / duration, 1)
            
            
            const ease = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2
            
            window.scrollTo(0, startPosition + distance * ease)
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation)
            }
        }
        
        requestAnimationFrame(animation)
    }
    
    menubar.addEventListener('click', (e) => {
        const link = (e.target as HTMLElement).closest('a');
        
        if(link && link.getAttribute('href')?.startsWith('#')) {
            e.preventDefault()
            
            const sectionId = link.getAttribute('href')?.replace('#', '')
            const element = sectionId ? document.getElementById(sectionId) : null
            
            if (element) {
                const header = document.querySelector<HTMLElement>('.header')
                const headerHeight = header ? header.offsetHeight: 0
                const elementTop = element.getBoundingClientRect().top + window.pageYOffset
                const targetPosition = elementTop - headerHeight
                
                
                smoothScrollTo(targetPosition)
            }
        }
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const form = document.querySelector('.form');
    
    if (!emailInput || !form) return;
    
   
    function removeErrorMessages(): void {
        const existingErrors = emailInput?.parentElement?.querySelectorAll('.error-form');
        existingErrors?.forEach(error => error.remove());
    }
    
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        removeErrorMessages();
        
        const emailValue = (emailInput as HTMLInputElement).value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailValue || !emailRegex.test(emailValue)) {
            const errorForm = document.createElement('div');
            errorForm.className = 'error-form';
            errorForm.textContent = 'Введи нормально да?';
            errorForm.style.color = 'red';
            errorForm.style.fontSize = '12px';
            emailInput?.parentElement?.appendChild(errorForm);
            return false;
        }
        
       
  
    });
})

document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('nav ul');
    
    if (!burgerMenu || !navMenu) {
        console.log('Бургер-меню или навигация не найдены');
        return;
    }
    
    burgerMenu.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navMenu.classList.toggle('nav-menu-open');
        console.log('Меню переключено, класс:', navMenu.classList.contains('nav-menu-open'));
    });
    
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('nav-menu-open');
        });
    });
    
    document.addEventListener('click', (e: MouseEvent) => {
        if (navMenu.classList.contains('nav-menu-open')) {
            const target = e.target as HTMLElement;
            if (!navMenu.contains(target) && !burgerMenu.contains(target)) {
                navMenu.classList.remove('nav-menu-open');
            }
        }
    });
});


// список скиллов  




async function loadSkills(): Promise<void> {
    const skillServices = new MockSkillServices();
    const skills = await skillServices.getSkills();
    const skillList = document.querySelector('#skills-list');

    skills.forEach((skill, index) => {
        setTimeout(() => {
            const li = document.createElement('li');
            li.textContent = skill.name;
            li.className = 'skill-fade-in'; 
            skillList?.appendChild(li);
        }, index * 300); 
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadSkills();
    initThemeSwitcher();

});


const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        
        if (entry.isIntersecting) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        } else {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px'
});


const  viewAboutMe = document.querySelector<HTMLElement>('#about');

if (viewAboutMe) {
    viewAboutMe.style.opacity = '0';
    viewAboutMe.style.transform = 'translateY(20px)';
    viewAboutMe.style.transition = 'opacity 3s ease, transform 1s ease';
    observer.observe(viewAboutMe)
}

const viewSecondHeader = document.querySelector<HTMLElement>('#second_header');
if (viewSecondHeader) {
    viewSecondHeader.style.opacity = '0';
    viewSecondHeader.style.transform = 'translateY(20px)';
    viewSecondHeader.style.transition = 'opacity 1s ease, transform 1s ease';
    observer.observe(viewSecondHeader)
}


const viewWork = document.querySelector<HTMLElement>('#work');

if (viewWork) {
    viewWork.style.opacity = '0';
    viewWork.style.transform = 'translateY(20px)';
    viewWork.style.transition = 'opacity 3s ease, transform 1s ease';
    observer.observe(viewWork)
}


const viewBlog  = document.querySelector<HTMLElement>('#blog');

if (viewBlog) {
    viewBlog.style.opacity = '0';
    viewBlog.style.transform = 'translateY(20px)';
    viewBlog.style.transition = 'opacity 3s ease, transform 1s ease';
//                                                         
    observer.observe(viewBlog)   
}


const viewCoop = document.querySelector<HTMLElement>('#coop');

if (viewCoop) {
    viewCoop.style.opacity = '0';
    viewCoop.style.transform = 'translateY(20px)';
    viewCoop.style.transition = 'opacity 3s ease, transform 1s ease';
    observer.observe(viewCoop)
    
}




