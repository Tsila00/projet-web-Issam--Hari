// permet d'avoir un conteur automatique sur l'acceuil
const stats = document.querySelectorAll('.stat-value');

stats.forEach(stat => {
    const target = parseInt(stat.innerText); // Récupère le nombre (ex: 2000)
    let count = 0;
    const speed = target / 100; // la vitesse de l'animation

    const updateCount = () => {
        if (count < target) {
            count += Math.ceil(speed);
            stat.innerText = count + (stat.innerText.includes('+') ? '+' : '');
            setTimeout(updateCount, 20);
        } else {
            stat.innerText = target + (stat.innerText.includes('+') ? '+' : '');
        }
    };

    updateCount();
});

// permet d'avoir les blocs fondu qui apparaissent
// On utilise l'Intersection Observer 
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 });

// On applique l'effet aux blocs de cours et aux cartes
document.querySelectorAll('.course-section, .stat-card').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s ease-out";
    observer.observe(el);
});

// C'est pour le carousel de l'acceuil
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

if (slides.length && dots.length) {
    showSlide(currentSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 4500);
}

function loadQuote() {
    const quoteText = document.querySelector('.quote-text');
    const quoteAuthor = document.querySelector('.quote-author');
    if (!quoteText || !quoteAuthor) return;

    quoteText.textContent = 'Chargement...';
    quoteAuthor.textContent = '';

    fetch('https://api.quotable.io/random')
        .then(response => {
            if (!response.ok) throw new Error('API Quotable non disponible');
            return response.json();
        })
        .then(data => {
            quoteText.textContent = data.content;
            quoteAuthor.textContent = data.author ? `— ${data.author}` : '';
        })
        .catch((error) => {
            console.warn('Quotable failed:', error);
            return fetch('https://api.adviceslip.com/advice')
                .then(response => response.json())
                .then(data => {
                    quoteText.textContent = data.slip?.advice || 'Impossible de charger le contenu.';
                    quoteAuthor.textContent = '— Conseil du jour';
                })
                .catch((fallbackError) => {
                    console.error('Fallback quote API failed:', fallbackError);
                    quoteText.textContent = 'Impossible de charger la citation pour le moment.';
                    quoteAuthor.textContent = '';
                });
        });
}

const refreshQuoteButton = document.getElementById('refreshQuote');
if (refreshQuoteButton) {
    refreshQuoteButton.addEventListener('click', loadQuote);
}

loadQuote();

// Effet sticky header et bouton retour en haut
const header = document.querySelector('.header');
const backToTopButton = document.createElement('button');
backToTopButton.id = 'backToTop';
backToTopButton.type = 'button';
backToTopButton.title = 'Retour en haut';
backToTopButton.innerHTML = '↑';
backToTopButton.style.display = 'none';
document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (header) {
        if (scrollY > 70) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }

    if (scrollY > 400) {
        backToTopButton.classList.add('visible');
        backToTopButton.style.display = 'flex';
    } else {
        backToTopButton.classList.remove('visible');
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Validation du formulaire de contact
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    const prenomField = document.getElementById('prenom');
    const nomField = document.getElementById('nom');
    const emailField = document.getElementById('email');
    const telephoneField = document.getElementById('telephone');
    const profilField = document.getElementById('profil');
    const sujetField = document.getElementById('sujet');
    const messageField = document.getElementById('message');
    const checkboxField = contactForm.querySelector('input[type="checkbox"]');

    const isValidEmail = (value) => {
        return value.includes('@') && value.includes('.') && value.indexOf('@') === value.lastIndexOf('@');
    };

    const isValidPhone = (value) => {
        return /^[0-9\s\.\-()+]+$/.test(value);
    };

    const createError = (field, message) => {
        field.parentElement.classList.add('invalid');
        let error = field.parentElement.querySelector('.error-message');
        if (!error) {
            error = document.createElement('div');
            error.className = 'error-message';
            field.parentElement.appendChild(error);
        }
        error.textContent = message;
    };

    const clearError = (field) => {
        field.parentElement.classList.remove('invalid');
        const error = field.parentElement.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    };

    const validateField = (field) => {
        if (!field) return true;
        clearError(field);
        const value = field.value.trim();

        if (field === prenomField && !value) {
            createError(field, 'Le prénom est obligatoire.');
            return false;
        }
        if (field === nomField && !value) {
            createError(field, 'Le nom est obligatoire.');
            return false;
        }
        if (field === emailField) {
            if (!value) {
                createError(field, 'L’adresse email est obligatoire.');
                return false;
            }
            if (!isValidEmail(value)) {
                createError(field, 'Entrez une adresse email valide avec @ et un domaine.');
                return false;
            }
        }
        if (field === telephoneField && value && !isValidPhone(value)) {
            createError(field, 'Numéro de téléphone invalide. Utilisez chiffres, +, espaces ou tirets.');
            return false;
        }
        if (field === profilField && !value) {
            createError(field, 'Veuillez choisir votre profil.');
            return false;
        }
        if (field === sujetField && !value) {
            createError(field, 'Veuillez choisir un sujet.');
            return false;
        }
        if (field === messageField) {
            if (!value) {
                createError(field, 'Le message est obligatoire.');
                return false;
            }
            if (value.length < 20) {
                createError(field, 'Le message doit contenir au moins 20 caractères.');
                return false;
            }
        }
        if (field === checkboxField && !field.checked) {
            const label = field.parentElement;
            label.classList.add('invalid');
            let error = label.querySelector('.error-message');
            if (!error) {
                error = document.createElement('div');
                error.className = 'error-message';
                label.appendChild(error);
            }
            error.textContent = 'Vous devez accepter d’être recontacté(e).';
            return false;
        }

        return true;
    };

    [prenomField, nomField, emailField, telephoneField, profilField, sujetField, messageField, checkboxField].forEach(field => {
        if (!field) return;
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('blur', () => validateField(field));
    });

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let isValid = true;

        [prenomField, nomField, emailField, telephoneField, profilField, sujetField, messageField, checkboxField].forEach(field => {
            if (field && !validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            const firstInvalid = contactForm.querySelector('.invalid input, .invalid select, .invalid textarea, .invalid');
            if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.textContent = 'Votre message a bien été pris en compte. Nous vous répondrons sous 48h ouvrées.';
        contactForm.prepend(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 5000);

        contactForm.reset();
    });
}

// Mise en évidence du lien actif dans le menu
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('header .menu a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active-link');
    }
});

// Mise à jour automatique de l'année dans le footer
const year = new Date().getFullYear();
document.querySelectorAll('.footer-section p').forEach(paragraph => {
    if (paragraph.textContent.includes('2026')) {
        paragraph.textContent = paragraph.textContent.replace('2026', year);
    }
}); 