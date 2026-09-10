document.addEventListener('DOMContentLoaded', function () {
    const page = document.querySelector('.research-detail-page');
    const navbar = document.querySelector('.navbar-modern');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('[data-current-year]').forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });

    const updateNavbar = function () {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        }
    };
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    const revealItems = document.querySelectorAll('.reveal-item');
    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(function (item) { item.classList.add('is-visible'); });
    } else {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.14, rootMargin: '0px 0px -40px' });

        revealItems.forEach(function (item, index) {
            item.style.transitionDelay = String((index % 3) * 80) + 'ms';
            revealObserver.observe(item);
        });
    }

    const rotatingPhrase = document.querySelector('.rotating-phrase');
    if (rotatingPhrase && !reducedMotion) {
        const phrases = (rotatingPhrase.dataset.words || '').split('|').filter(Boolean);
        let phraseIndex = 0;
        if (phrases.length > 1) {
            window.setInterval(function () {
                rotatingPhrase.classList.add('is-changing');
                window.setTimeout(function () {
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    rotatingPhrase.textContent = phrases[phraseIndex];
                    rotatingPhrase.classList.remove('is-changing');
                }, 220);
            }, 2600);
        }
    }

    const canvas = document.getElementById('researchCanvas');
    if (!canvas || !page) return;

    const context = canvas.getContext('2d');
    const theme = page.dataset.theme || 'sensing';
    const styles = getComputedStyle(page);
    const accent = styles.getPropertyValue('--detail-accent').trim() || '#12a594';
    const warm = styles.getPropertyValue('--detail-warm').trim() || '#f2a33a';
    let width = 0;
    let height = 0;
    let pointerX = 0;
    let pointerY = 0;
    let animationFrame = 0;

    const resizeCanvas = function () {
        const bounds = canvas.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = Math.max(1, bounds.width);
        height = Math.max(1, bounds.height);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        if (reducedMotion) drawFrame(0);
    };

    const rgba = function (hex, alpha) {
        const value = hex.replace('#', '');
        const normalized = value.length === 3
            ? value.split('').map(function (char) { return char + char; }).join('')
            : value;
        const number = parseInt(normalized, 16);
        return 'rgba(' + ((number >> 16) & 255) + ',' + ((number >> 8) & 255) + ',' + (number & 255) + ',' + alpha + ')';
    };

    const line = function (x1, y1, x2, y2, color, lineWidth) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.strokeStyle = color;
        context.lineWidth = lineWidth || 1;
        context.stroke();
    };

    const node = function (x, y, radius, color, glow) {
        context.save();
        if (glow) {
            context.shadowBlur = glow;
            context.shadowColor = color;
        }
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.restore();
    };

    const pulseOnLine = function (x1, y1, x2, y2, progress, color) {
        const x = x1 + (x2 - x1) * progress;
        const y = y1 + (y2 - y1) * progress;
        node(x, y, 3.2, color, 12);
    };

    const drawSensing = function (time) {
        const center = { x: width * 0.57, y: height * 0.5 };
        const inputs = [
            { x: width * 0.15, y: height * 0.23 },
            { x: width * 0.11, y: height * 0.5 },
            { x: width * 0.16, y: height * 0.77 }
        ];
        inputs.forEach(function (input, index) {
            line(input.x, input.y, center.x, center.y, rgba(accent, 0.34), 1.2);
            pulseOnLine(input.x, input.y, center.x, center.y, (time * 0.0002 + index * 0.27) % 1, accent);
            node(input.x, input.y, 5, index === 1 ? warm : accent, 12);
        });
        [45, 72, 100].forEach(function (radius, index) {
            context.beginPath();
            context.arc(center.x, center.y, radius + Math.sin(time * 0.0015 + index) * 3, 0, Math.PI * 2);
            context.strokeStyle = rgba(index === 1 ? warm : accent, 0.2 + index * 0.08);
            context.lineWidth = 1;
            context.stroke();
        });
        node(center.x, center.y, 9, '#ffffff', 20);
        const targetAngle = time * 0.0005;
        node(center.x + Math.cos(targetAngle) * 78, center.y + Math.sin(targetAngle) * 48, 4, warm, 14);
    };

    const drawIsac = function (time) {
        const left = { x: width * 0.18, y: height * 0.56 };
        const target = { x: width * 0.53, y: height * 0.31 };
        const right = { x: width * 0.82, y: height * 0.62 };
        line(left.x, left.y, target.x, target.y, rgba(accent, 0.45), 1.5);
        line(target.x, target.y, right.x, right.y, rgba(warm, 0.42), 1.5);
        line(left.x, left.y, right.x, right.y, rgba(accent, 0.2), 1);
        [0, 0.24, 0.48, 0.72].forEach(function (offset) {
            const progress = (time * 0.00025 + offset) % 1;
            pulseOnLine(left.x, left.y, right.x, right.y, progress, accent);
        });
        [28, 48, 68].forEach(function (radius) {
            context.beginPath();
            context.arc(target.x, target.y, radius, Math.PI * 0.1, Math.PI * 0.9);
            context.strokeStyle = rgba(warm, 0.22);
            context.stroke();
        });
        node(left.x, left.y, 8, accent, 18);
        node(target.x, target.y, 7, warm, 18);
        node(right.x, right.y, 8, '#ffffff', 18);
    };

    const drawNetwork = function (time, dense) {
        const center = { x: width * 0.5, y: height * 0.5 };
        const count = dense ? 10 : 7;
        for (let index = 0; index < count; index += 1) {
            const angle = (Math.PI * 2 * index / count) - Math.PI / 2;
            const radiusX = width * (dense ? 0.34 : 0.31);
            const radiusY = height * (dense ? 0.32 : 0.29);
            const x = center.x + Math.cos(angle) * radiusX;
            const y = center.y + Math.sin(angle) * radiusY;
            line(center.x, center.y, x, y, rgba(accent, 0.24), 1);
            pulseOnLine(center.x, center.y, x, y, (time * 0.00018 + index / count) % 1, index % 3 === 0 ? warm : accent);
            node(x, y, dense ? 4 : 6, index % 3 === 0 ? warm : accent, 10);
            if (dense && index > 0) {
                const previousAngle = (Math.PI * 2 * (index - 1) / count) - Math.PI / 2;
                line(
                    center.x + Math.cos(previousAngle) * radiusX,
                    center.y + Math.sin(previousAngle) * radiusY,
                    x,
                    y,
                    rgba(accent, 0.13),
                    1
                );
            }
        }
        context.beginPath();
        context.arc(center.x, center.y, 34 + Math.sin(time * 0.002) * 4, 0, Math.PI * 2);
        context.strokeStyle = rgba(warm, 0.38);
        context.stroke();
        node(center.x, center.y, 10, '#ffffff', 22);
    };

    const drawEmbodied = function (time) {
        const center = { x: width * 0.5, y: height * 0.48 };
        const orbit = 104;
        ['sense', 'reason', 'act'].forEach(function (_, index) {
            const angle = time * 0.00035 + index * Math.PI * 2 / 3;
            const x = center.x + Math.cos(angle) * orbit;
            const y = center.y + Math.sin(angle) * orbit * 0.65;
            line(center.x, center.y, x, y, rgba(accent, 0.25), 1);
            node(x, y, 6, index === 1 ? warm : accent, 14);
        });
        context.beginPath();
        context.arc(center.x, center.y, orbit, 0, Math.PI * 2);
        context.strokeStyle = rgba(accent, 0.16);
        context.stroke();
        context.strokeStyle = rgba('#ffffff', 0.65);
        context.lineWidth = 2;
        context.strokeRect(center.x - 24, center.y - 30, 48, 54);
        node(center.x - 10, center.y - 8, 3, accent, 10);
        node(center.x + 10, center.y - 8, 3, accent, 10);
        line(center.x - 11, center.y + 8, center.x + 11, center.y + 8, rgba('#ffffff', 0.65), 2);
    };

    const drawLowAltitude = function (time) {
        const groundY = height * 0.79;
        line(width * 0.08, groundY, width * 0.92, groundY, rgba(accent, 0.28), 1);
        const stations = [0.18, 0.48, 0.79];
        stations.forEach(function (position, index) {
            const x = width * position;
            line(x, groundY, x, groundY - 28, rgba(accent, 0.5), 1.5);
            node(x, groundY - 31, 5, index === 1 ? warm : accent, 12);
        });
        const progress = (time * 0.00008) % 1;
        const x = width * (0.08 + progress * 0.84);
        const y = height * (0.38 - Math.sin(progress * Math.PI) * 0.16);
        context.save();
        context.translate(x, y);
        context.beginPath();
        context.moveTo(12, 0);
        context.lineTo(-9, -7);
        context.lineTo(-5, 0);
        context.lineTo(-9, 7);
        context.closePath();
        context.fillStyle = '#ffffff';
        context.shadowBlur = 18;
        context.shadowColor = accent;
        context.fill();
        context.restore();
        stations.forEach(function (position) {
            const stationX = width * position;
            line(stationX, groundY - 31, x, y, rgba(accent, 0.16), 1);
        });
        context.beginPath();
        context.ellipse(width * 0.5, height * 0.47, width * 0.41, height * 0.2, 0, Math.PI, Math.PI * 2);
        context.strokeStyle = rgba(warm, 0.22);
        context.setLineDash([5, 9]);
        context.stroke();
        context.setLineDash([]);
    };

    function drawFrame(time) {
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(pointerX * 7, pointerY * 7);
        if (theme === 'sensing') drawSensing(time);
        else if (theme === 'isac') drawIsac(time);
        else if (theme === 'edge-networks') drawNetwork(time, false);
        else if (theme === 'iot') drawNetwork(time, true);
        else if (theme === 'embodied-ai') drawEmbodied(time);
        else drawLowAltitude(time);
        context.restore();

        if (!reducedMotion) animationFrame = window.requestAnimationFrame(drawFrame);
    }

    canvas.addEventListener('pointermove', function (event) {
        const bounds = canvas.getBoundingClientRect();
        pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
        pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
    });
    canvas.addEventListener('pointerleave', function () {
        pointerX = 0;
        pointerY = 0;
    });

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    if (!reducedMotion) animationFrame = window.requestAnimationFrame(drawFrame);

    window.addEventListener('pagehide', function () {
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
    });
});
