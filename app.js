'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeBtn');
    const themeText = themeBtn.querySelector('.theme-text');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeText.textContent = 'Light Mode';
    }
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let targetTheme = 'light';
        
        if (currentTheme !== 'dark') {
            targetTheme = 'dark';
        }
        
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
        
        if (targetTheme === 'dark') {
            themeText.textContent = 'Light Mode';
        } else {
            themeText.textContent = 'Dark Mode';
        }
    });

    // Handle form submission
    const form = document.querySelector('.inquiry-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Settings have been modernized! Thank you for your inquiry.');
            form.reset();
        });
    }
});
