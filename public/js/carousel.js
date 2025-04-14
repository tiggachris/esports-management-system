document.addEventListener('DOMContentLoaded', () => {
    const carousel = {
        wrapper: document.querySelector('.carousel-wrapper'),
        slides: document.querySelectorAll('.carousel-slide'),
        prevBtn: document.querySelector('.carousel-button.prev'),
        nextBtn: document.querySelector('.carousel-button.next'),
        indicators: document.querySelector('.carousel-indicators'),
        currentSlide: 0,
        slideCount: document.querySelectorAll('.carousel-slide').length,
        autoPlayInterval: null,

        init() {
            // Create indicators
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('carousel-indicator');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.indicators.appendChild(dot);
            });

            // Add event listeners
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());

            // Start autoplay
            this.startAutoPlay();

            // Pause autoplay on hover
            this.wrapper.parentElement.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.wrapper.parentElement.addEventListener('mouseleave', () => this.startAutoPlay());
        },

        updateSlide() {
            this.wrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
            
            // Update indicators
            const dots = this.indicators.querySelectorAll('.carousel-indicator');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });
        },

        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.slideCount;
            this.updateSlide();
        },

        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
            this.updateSlide();
        },

        goToSlide(index) {
            this.currentSlide = index;
            this.updateSlide();
        },

        startAutoPlay() {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
        },

        stopAutoPlay() {
            clearInterval(this.autoPlayInterval);
        }
    };

    carousel.init();
});