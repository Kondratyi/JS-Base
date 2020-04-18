'use strict';
let slider = document.querySelector('.slider');
let loadIcon = document.createElement('i');
loadIcon.classList.add('fas', 'fa-spinner', 'fa-spin');
slider.insertAdjacentElement('afterbegin', loadIcon);
let leftArrow = document.createElement('i');
leftArrow.classList.add('fas', 'fa-angle-double-left', 'slider__leftArrow');
slider.insertAdjacentElement('beforeend', leftArrow);
let rightArrow = document.createElement('i');
rightArrow.classList.add('fas', 'fa-angle-double-right', 'slider__rightArrow');
slider.insertAdjacentElement('beforeend', rightArrow);
window.addEventListener('load', function () {
    leftArrow.addEventListener('click', function () {
        images.setNextLeftImage();
    });
    rightArrow.addEventListener('click', function () {
        images.setNextRightImage();
    });
    images.init();
    loadIcon.style.display = "none";
});
let images = {
    currentIndex: 0
    , slides: []
    , init() {
        this.slides = document.querySelectorAll('.slider__item');
        this.showImageWithCurrentIndex();
    }
    , showImageWithCurrentIndex() {
        this.slides[this.currentIndex].classList.remove('hidden');
        
    }
    , hideVisibleImage() {
        this.slides.forEach(function (slide) {
            if (!slide.classList.contains('.hidden')) {
                slide.classList.add('hidden');
            }
        });
    }
    , setNextLeftImage() {
        this.hideVisibleImage();
        if (this.currentIndex == 0) {
            this.currentIndex = this.slides.length - 1;
        }
        else {
            this.currentIndex--;
        }
        const currentSlide = this.slides[this.currentIndex];
        currentSlide.classList.add('slider__toLeft');
        currentSlide.classList.remove('hidden');
        setTimeout (() => {
            currentSlide.classList.remove('slider__toLeft');
        }, 1000); 
        
    }
    , setNextRightImage() {
        this.hideVisibleImage();
        if (this.currentIndex == this.slides.length - 1) {
            this.currentIndex = 0;
        }
        else {
            this.currentIndex++;
        }
        const currentSlide = this.slides[this.currentIndex];
        currentSlide.classList.add('slider__toRight');
        currentSlide.classList.remove('hidden');
        setTimeout (() => {
            currentSlide.classList.remove('slider__toRight');
        }, 1000); 
    },
 };