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

setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}, 4500); 