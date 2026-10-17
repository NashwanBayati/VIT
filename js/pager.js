(function () {
    'use strict';

    var mq = window.matchMedia('(min-width: 992px) and (min-height: 560px)');
    mq.addListener(function () { location.reload(); });

    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('.navbar-nav a');
        var col = document.getElementById('navbarCollapse') || document.querySelector('.navbar-collapse');
        if (a && col && col.classList.contains('show') && !a.classList.contains('dropdown-toggle')) {
            if (window.jQuery) window.jQuery(col).collapse('hide');
            else col.classList.remove('show');
        }
    });
    if (!mq.matches || typeof Swiper === 'undefined') return;

    var ids = ['home', 'about', 'skills', 'service', 'experience', 'portfolio', 'blog'];
    var secs = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (!secs.length) return;

    var footer = document.querySelector('.footer');
    var wrap = document.createElement('div');
    wrap.className = 'swiper pager';
    var list = document.createElement('div');
    list.className = 'swiper-wrapper';
    wrap.appendChild(list);
    secs[0].parentNode.insertBefore(wrap, secs[0]);

    var labels = {};
    secs.forEach(function (s, i) {
        var link = document.querySelector('.navbar-nav a[href="#' + s.id + '"]');
        labels[i] = link ? link.textContent.trim() : s.id;
        var slide = document.createElement('div');
        slide.className = 'swiper-slide';
        var scroll = document.createElement('div');
        scroll.className = 'pager-scroll';
        scroll.appendChild(s);
        if (i === secs.length - 1 && footer) scroll.appendChild(footer);
        slide.appendChild(scroll);
        list.appendChild(slide);
    });

    var dots = document.createElement('div');
    dots.className = 'swiper-pagination pager-dots';
    wrap.appendChild(dots);
    document.body.classList.add('pager-on');

    var sw = new Swiper(wrap, {
        direction: 'vertical',
        speed: 800,
        mousewheel: { thresholdDelta: 5, thresholdTime: 400 },
        pagination: {
            el: dots,
            clickable: true,
            renderBullet: function (i, cls) {
                return '<span class="' + cls + '" data-label="' + labels[i] + '"></span>';
            }
        }
    });

    var lastInner = 0;
    function canScroll(el, dir) {
        if (el.scrollHeight <= el.clientHeight + 1) return false;
        return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0;
    }

    Array.prototype.forEach.call(list.querySelectorAll('.pager-scroll'), function (el) {
        el.addEventListener('wheel', function (e) {
            var now = Date.now();
            if (canScroll(el, e.deltaY)) {
                lastInner = now;
                e.stopPropagation();
            } else if (now - lastInner < 450) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });
    });

    function activeScroll() {
        return sw.slides[sw.activeIndex].querySelector('.pager-scroll');
    }

    document.addEventListener('keydown', function (e) {
        if (/input|textarea|select/i.test(e.target.tagName)) return;
        var dir = 0, step = 90;
        if (e.key === 'ArrowDown') dir = 1;
        else if (e.key === 'ArrowUp') dir = -1;
        else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) { dir = 1; step = innerHeight * 0.8; }
        else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) { dir = -1; step = innerHeight * 0.8; }
        else if (e.key === 'Home') { e.preventDefault(); sw.slideTo(0); return; }
        else if (e.key === 'End') { e.preventDefault(); sw.slideTo(secs.length - 1); return; }
        if (!dir) return;
        e.preventDefault();
        var el = activeScroll();
        if (canScroll(el, dir)) {
            lastInner = Date.now();
            el.scrollBy({ top: dir * step, behavior: 'smooth' });
        } else if (dir > 0) sw.slideNext();
        else sw.slidePrev();
    });

    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || a.hash.length < 2) return;
        var idx = ids.indexOf(a.hash.slice(1));
        if (idx < 0) return;
        idx = secs.indexOf(document.getElementById(ids[idx]));
        e.preventDefault();
        e.stopPropagation();
        sw.slideTo(idx);
    }, true);

    Array.prototype.forEach.call(document.querySelectorAll('.navbar-nav a[href^="#"]'), function (a) {
        if (a.hash.length > 1 && !document.getElementById(a.hash.slice(1))) a.style.display = 'none';
    });

    function sync() {
        var cur = secs[sw.activeIndex];
        Array.prototype.forEach.call(document.querySelectorAll('.navbar-nav a.nav-link'), function (a) {
            a.classList.toggle('active', a.hash === '#' + cur.id);
        });
        Array.prototype.forEach.call(document.querySelectorAll('.progress-bar'), function (b) {
            var on = b.closest('.swiper-slide') === sw.slides[sw.activeIndex];
            b.style.width = on ? b.getAttribute('aria-valuenow') + '%' : '0%';
        });
        activeScroll().scrollTop = 0;
    }
    sw.on('slideChange', sync);
    sync();

    window.addEventListener('load', function () {
        if (window.jQuery && jQuery.fn.isotope) jQuery('.portfolio-container').isotope('layout');
    });
})();
