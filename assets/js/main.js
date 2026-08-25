/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== ACCORDION SKILLS ====================*/
const skillsContent = document.getElementsByClassName('skills__content'),
      skillsHeader = document.querySelectorAll('.skills__header')

function toggleSkills() {
    let itemClass = this.parentNode.className

    for (let i = 0; i < skillsContent.length; i++) {
        skillsContent[i].className = 'skills__content skills__close'
    }
    if (itemClass === 'skills__content skills__close') {
        this.parentNode.className = 'skills__content skills__open'
    }
}

skillsHeader.forEach((el) => {
    el.addEventListener('click', toggleSkills)
})

/*==================== QUALIFICATION TABS ====================*/
const tabs = document.querySelectorAll('[data-target]'),
      tabContents = document.querySelectorAll('[data-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target)

        tabContents.forEach(tabContent => {
            tabContent.classList.remove('qualification__active')
        })
        target.classList.add('qualification__active')

        tabs.forEach(tab => {
            tab.classList.remove('qualification__active')
        })
        tab.classList.add('qualification__active')
    })
})

/*==================== SERVICES MODAL ====================*/
const modalViews = document.querySelectorAll('.services__modal'),
      modalBtns = document.querySelectorAll('.services__button'),
      modalCloses = document.querySelectorAll('.services__modal-close')

let modal = function (modalClick) {
    modalViews[modalClick].classList.add('active-modal')
}

modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener('click', () => {
        modal(i)
    })
})

modalCloses.forEach((modalClose) => {
    modalClose.addEventListener('click', () => {
        modalViews.forEach((modalView) => {
            modalView.classList.remove('active-modal')
        })
    })
})

/*==================== PORTFOLIO SWIPER  ====================*/
let swiperPortfolio = document.querySelector('.portfolio__container') && new Swiper('.portfolio__container', {
    cssMode: true,
    loop: true,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
})

/*==================== TESTIMONIAL ====================*/
let swiperTestimonial = document.querySelector('.testimonial__container') && new Swiper('.testimonial__container', {
    loop: true,
    grabCursor: true,
    spaceBetween: 48,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    breakpoints: {
        568: {
            slidesPerView: 2,
        }
    }
})

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50
        sectionId = current.getAttribute('id')

        const link = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        if (!link) return

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            link.classList.add('active-link')
        } else {
            link.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
    const nav = document.getElementById('header')
    // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
    if (this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if (this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'uil-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
if (themeButton) themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*==================== SCROLL REVEAL ====================*/
/* Replaces the template's ScrollReveal dependency (GPL-3.0) with the platform
   IntersectionObserver: same effect, no library, no licence question. */
;(function () {
    const targets = [
        '.home__data', '.home__img', '.home__social', '.home__scroll',
        '.about__img', '.about__data',
        '.skills__content',
        '.qualification__tabs', '.qualification__sections',
        '.services__content',
        '.portfolio__content',
        '.project__data', '.project__img',
        '.testimonial__content',
        '.post-card',
        '.insights__cta',
        '.contact__information', '.contact__form',
        '.post__header', '.post__cover', '.post__content'
    ]

    const nodes = document.querySelectorAll(targets.join(','))
    if (!nodes.length) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // No observer support, or the visitor asked for less motion: show everything.
    if (reduced || !('IntersectionObserver' in window)) {
        nodes.forEach(n => n.classList.add('reveal', 'is-visible'))
        return
    }

    nodes.forEach((node, i) => {
        node.classList.add('reveal')
        // Stagger siblings so grids cascade instead of popping in together.
        node.style.transitionDelay = (i % 4) * 70 + 'ms'
    })

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)   // reveal once, then stop watching
        })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

    nodes.forEach(n => observer.observe(n))
})()

/*==================== BLOG CATEGORY FILTER ====================*/
/* Filters client-side. Categories are free text, so there is no fixed list
   here — the chips are rendered from the posts and matched on a data attribute. */
;(function () {
    const filter = document.getElementById('blog-filter')
    const grid = document.getElementById('post-grid')
    if (!filter || !grid) return

    const chips = filter.querySelectorAll('.blog-filter__chip')
    const cards = grid.querySelectorAll('.post-card')
    const empty = document.getElementById('blog-no-match')

    function apply(wanted) {
        let shown = 0

        cards.forEach(card => {
            const match = wanted === 'all' || card.dataset.category === wanted
            card.hidden = !match
            if (match) shown++
        })

        if (empty) empty.hidden = shown > 0
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.toggle('is-active', c === chip))
            apply(chip.dataset.filter)
        })
    })
})()

/*==================== INSTAGRAM-STYLE TABS ====================*/
;(function () {
    const tabs = document.querySelectorAll('.gram-tab')
    if (!tabs.length) return

    const panels = document.querySelectorAll('.gram-panel')

    function show(name) {
        tabs.forEach(tab => {
            const on = tab.dataset.tab === name
            tab.classList.toggle('is-active', on)
            tab.setAttribute('aria-selected', on ? 'true' : 'false')
        })

        panels.forEach(panel => {
            const on = panel.id === 'panel-' + name
            panel.hidden = !on
            panel.classList.toggle('is-active', on)
        })

        // Deep-linkable without adding a history entry per click.
        history.replaceState(null, '', name === 'posts' ? location.pathname : '#' + name)
    }

    tabs.forEach(tab => tab.addEventListener('click', () => show(tab.dataset.tab)))

    // Honour /blog/#videos on arrival.
    const wanted = location.hash.replace('#', '')
    if (wanted && document.getElementById('panel-' + wanted)) show(wanted)
})()
