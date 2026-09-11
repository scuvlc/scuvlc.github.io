document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar-modern');
    const updateNavbar = function () {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    document.querySelectorAll('[data-current-year]').forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });

    const reveals = document.querySelectorAll('.overview-scroll-reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
        reveals.forEach(function (item, index) {
            item.style.transitionDelay = String((index % 2) * 90) + 'ms';
            observer.observe(item);
        });
    } else {
        reveals.forEach(function (item) { item.classList.add('is-visible'); });
    }

    const rotating = document.querySelector('.overview-rotating');
    if (rotating) {
        const words = (rotating.dataset.words || '').split('|').filter(Boolean);
        let wordIndex = 0;
        if (words.length > 1) {
            window.setInterval(function () {
                rotating.classList.add('is-changing');
                window.setTimeout(function () {
                    wordIndex = (wordIndex + 1) % words.length;
                    rotating.textContent = words[wordIndex];
                    rotating.classList.remove('is-changing');
                }, 220);
            }, 2500);
        }
    }

    const canvas = document.getElementById('overviewCanvas');
    if (!canvas) return;
    const context = canvas.getContext('2d');
    const colors = ['#12a594', '#16a1c5', '#2f9e63', '#008c82', '#d85b78', '#3a8ed8'];
    const labels = ['先进感知', '通感一体化', '边缘网络', '物联网', '具身智能', '低空智联网'];
    let width = 1;
    let height = 1;
    let pointerX = 0;
    let pointerY = 0;
    let frameId = 0;

    const resize = function () {
        const bounds = canvas.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = Math.max(1, bounds.width);
        height = Math.max(1, bounds.height);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const rgba = function (hex, alpha) {
        const number = parseInt(hex.slice(1), 16);
        return 'rgba(' + ((number >> 16) & 255) + ',' + ((number >> 8) & 255) + ',' + (number & 255) + ',' + alpha + ')';
    };

    const drawNode = function (x, y, radius, color, glow) {
        context.save();
        context.shadowBlur = glow;
        context.shadowColor = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.restore();
    };

    const draw = function (time) {
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(pointerX * 6, pointerY * 6);

        const centerX = width * .51;
        const centerY = height * .49;
        const radiusX = Math.min(width * .37, 220);
        const radiusY = Math.min(height * .34, 145);
        const nodes = colors.map(function (color, index) {
            const angle = -Math.PI / 2 + index * Math.PI * 2 / colors.length;
            return {
                x: centerX + Math.cos(angle) * radiusX,
                y: centerY + Math.sin(angle) * radiusY,
                color: color,
                label: labels[index]
            };
        });

        [52, 92, 136].forEach(function (radius, index) {
            context.beginPath();
            context.arc(centerX, centerY, radius + Math.sin(time * .0014 + index) * 2.5, 0, Math.PI * 2);
            context.strokeStyle = rgba(index === 1 ? '#f2a33a' : '#12a594', .12 + index * .05);
            context.lineWidth = 1;
            context.stroke();
        });

        nodes.forEach(function (node, index) {
            const next = nodes[(index + 1) % nodes.length];
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(centerX, centerY);
            context.strokeStyle = rgba(node.color, .3);
            context.lineWidth = 1;
            context.stroke();

            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(next.x, next.y);
            context.strokeStyle = rgba(node.color, .12);
            context.stroke();

            const progress = (time * .00014 + index / nodes.length) % 1;
            drawNode(
                node.x + (centerX - node.x) * progress,
                node.y + (centerY - node.y) * progress,
                2.8,
                node.color,
                11
            );
            drawNode(node.x, node.y, 5.2, node.color, 14);

            context.fillStyle = 'rgba(255,255,255,.7)';
            context.font = '600 11px -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif';
            context.textAlign = node.x < centerX - 12 ? 'right' : node.x > centerX + 12 ? 'left' : 'center';
            context.textBaseline = node.y < centerY ? 'bottom' : 'top';
            const offsetX = node.x < centerX - 12 ? -12 : node.x > centerX + 12 ? 12 : 0;
            const offsetY = node.y < centerY ? -11 : 11;
            context.fillText(node.label, node.x + offsetX, node.y + offsetY);
        });

        const orbitAngle = time * .00035;
        drawNode(centerX + Math.cos(orbitAngle) * 92, centerY + Math.sin(orbitAngle) * 56, 3.4, '#f2a33a', 14);
        drawNode(centerX, centerY, 9, '#ffffff', 22);
        context.fillStyle = 'rgba(255,255,255,.72)';
        context.font = '800 10px SFMono-Regular, Consolas, monospace';
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillText('ASCEND', centerX, centerY + 18);
        context.restore();
        frameId = window.requestAnimationFrame(draw);
    };

    canvas.addEventListener('pointermove', function (event) {
        const bounds = canvas.getBoundingClientRect();
        pointerX = (event.clientX - bounds.left) / bounds.width - .5;
        pointerY = (event.clientY - bounds.top) / bounds.height - .5;
    });
    canvas.addEventListener('pointerleave', function () {
        pointerX = 0;
        pointerY = 0;
    });

    resize();
    window.addEventListener('resize', resize);
    frameId = window.requestAnimationFrame(draw);
    window.addEventListener('pagehide', function () {
        window.cancelAnimationFrame(frameId);
    });
});
