
// Плавность по бергер меню

document.addEventListener('DOMContentLoaded', () => {
    const menubar = document.querySelector('nav ul')
    
    if (!menubar) return
    

    function smoothScrollTo(targetPosition, duration = 800) {
        const startPosition = window.pageYOffset
        const distance = targetPosition - startPosition
        let startTime = null
        
        function animation(currentTime) {
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
        const link = e.target.closest('a')
        
        if(link && link.getAttribute('href')?.startsWith('#')) {
            e.preventDefault()
            
            const sectionId = link.getAttribute('href').replace('#', '')
            const element = document.getElementById(sectionId)
            
            if (element) {
                const header = document.querySelector('.header')
                const headerHeight = header ? header.offsetHeight : 0
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
    
   
    function removeErrorMessages() {
        const existingErrors = emailInput.parentElement.querySelectorAll('.error-form');
        existingErrors.forEach(error => error.remove());
    }
    
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        removeErrorMessages();
        
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailValue || !emailRegex.test(emailValue)) {
            const errorForm = document.createElement('div');
            errorForm.className = 'error-form';
            errorForm.textContent = 'Введи нормально да?';
            errorForm.style.color = 'red';
            errorForm.style.fontSize = '12px';
            emailInput.parentElement.appendChild(errorForm);
            return false;
        }
        
        if (!email.value.trim()) errorForm('Введи нормально да?');
  
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
    
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('nav-menu-open')) {
            if (!navMenu.contains(e.target) && !burgerMenu.contains(e.target)) {
                navMenu.classList.remove('nav-menu-open');
            }
        }
    });
});

//самописная хуйня

