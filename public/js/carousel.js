class Carousel {
    constructor(container) {
        this.container = container;
        this.wrapper = container.querySelector('.carousel-wrapper');
        this.slides = container.querySelectorAll('.carousel-slide');
        this.prevButton = container.querySelector('.carousel-button.prev');
        this.nextButton = container.querySelector('.carousel-button.next');
        this.indicatorsContainer = container.querySelector('.carousel-indicators');
        
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.isTransitioning = false;

        this.initializeCarousel();
        this.setupEventListeners();
        this.createIndicators();
        this.updateIndicators();
        this.startAutoPlay();
    }

    initializeCarousel() {
        this.wrapper.style.transform = 'translateX(0)';
        this.slides.forEach((slide, index) => {
            if (slide.classList.contains('video-slide')) {
                const video = slide.querySelector('video');
                if (video) {
                    video.play().catch(() => {});
                }
            }
        });
    }

    createIndicators() {
        for (let i = 0; i < this.slideCount; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    updateIndicators() {
        const indicators = this.indicatorsContainer.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    setupEventListeners() {
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());
        this.wrapper.addEventListener('transitionend', () => {
            this.isTransitioning = false;
        });
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        this.isTransitioning = true;
        this.currentSlide = index;
        this.updateSlide();
    }

    prevSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentSlide = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
        this.updateSlide();
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentSlide = (this.currentSlide + 1) % this.slideCount;
        this.updateSlide();
    }

    updateSlide() {
        this.wrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        this.updateIndicators();

        // Handle video playback
        this.slides.forEach((slide, index) => {
            if (slide.classList.contains('video-slide')) {
                const video = slide.querySelector('video');
                if (video) {
                    if (index === this.currentSlide) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                        video.currentTime = 0;
                    }
                }
            }
        });
    }

    startAutoPlay() {
        setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        new Carousel(carouselContainer);
    }
});