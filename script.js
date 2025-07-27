// Prevent multiple script executions
if (!window.spacetimeVisualizationInitialized) {
    window.spacetimeVisualizationInitialized = true;

const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Create custom grid of boxes (quads) without diagonals
const gridSize = 150;
const divisions = 50;
const cellSize = gridSize / divisions;
const gridGeometry = new THREE.BufferGeometry();
const vertices = [];
const indices = [];

// Generate vertices and indices for a grid of quads
for (let i = 0; i <= divisions; i++) {
    for (let j = 0; j <= divisions; j++) {
        const x = -gridSize / 2 + i * cellSize;
        const y = -gridSize / 2 + j * cellSize;
        const distance = Math.sqrt(x * x + y * y);
        const z = -7 / (distance + 3); // Curvature for spacetime warping
        vertices.push(x, y, z);
    }
}

for (let i = 0; i < divisions; i++) {
    for (let j = 0; j < divisions; j++) {
        const a = i * (divisions + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (divisions + 1) + j;
        const d = c + 1;
        indices.push(a, b, c);
        indices.push(b, d, c);
    }
}

gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
gridGeometry.setIndex(indices);
const gridMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000, // Black grid
    wireframe: true,
    transparent: true,
    opacity: 0.5
});
const grid = new THREE.Mesh(gridGeometry, gridMaterial);
scene.add(grid);

// Create large central massive object (sun-like glowing sphere)
const sphereGeometry = new THREE.SphereGeometry(3.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa500, // Orange base color
    emissive: 0xffa500, // Bright yellow emissive for sun-like glow
    emissiveIntensity: 1 // Stronger emissive intensity
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 2.5);
scene.add(sphere);

// Add strong point light for intense glow
const pointLight = new THREE.PointLight(0xFFA500, 3, 30); // Bright yellow, high intensity, extended range
pointLight.position.set(0, 0, 2.5);
scene.add(pointLight);



// Function to generate radial gradient texture for glow
function generateGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    return canvas;
}

// Add ambient light to ensure grid visibility
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Camera setup
camera.position.set(7, 7, 7);
camera.lookAt(0, 0, 0);

// OrbitControls for fluid camera movement
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 2.5); // Set orbit target above grid
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.enableZoom = false;
controls.enablePan = false;
controls.minPolarAngle = 0.1; // Allow rotation from top
controls.maxPolarAngle = Math.PI - 0.1; // Prevent rotation below horizon

const zoomSlider = document.getElementById('zoomSlider');
let timeoutId = null;
zoomSlider.addEventListener('input', (event) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        radius = parseFloat(event.target.value);
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position.clone().sub(controls.target));
        spherical.radius = radius;
        camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
        camera.lookAt(controls.target);
    }, 10); // Small delay for smoother updates
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight - 20; // 20px gap
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background opacity on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (scrolled > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all content sections
document.querySelectorAll('.content-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const spiralBg = document.querySelector('.spiral-bg');
    
    if (hero && spiralBg) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
        spiralBg.style.transform = `translateY(${rate * 0.3}px) rotate(${scrolled * 0.1}deg)`;
    }
});

// Add hover effects to cards
document.querySelectorAll('.card, .scientist-card, .research-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Dynamic text animation for hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 500);
        }
    };
    
    // Start typing animation after a short delay
    setTimeout(typeWriter, 0);
}

// Add floating particles effect
function createParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '2px';
    particle.style.height = '2px';
    particle.style.background = '#8a2be2';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.opacity = '0.7';
    particle.style.zIndex = '1';
    
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 10;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    document.body.appendChild(particle);
    
    const duration = Math.random() * 3000 + 2000;
    const endY = -10;
    const endX = startX + (Math.random() - 0.5) * 100;
    
    particle.animate([
        { transform: `translate(0, 0)`, opacity: 0 },
        { transform: `translate(0, -50px)`, opacity: 0.7, offset: 0.1 },
        { transform: `translate(${endX - startX}px, ${endY - startY}px)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'linear'
    }).onfinish = () => {
        particle.remove();
    };
}

// Create particles periodically
setInterval(createParticle, 300);

// Add active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - navbarHeight - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #8a2be2 !important;
        background: rgba(138, 43, 226, 0.2) !important;
    }
`;
document.head.appendChild(style);

} // End of initialization check