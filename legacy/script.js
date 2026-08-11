document.addEventListener('DOMContentLoaded', () => {
    
    // Header Scroll Effect
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Form Submission Handling
    const leadForm = document.getElementById('leadCaptureForm');
    const formMessage = document.getElementById('formMessage');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = leadForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            btn.innerText = 'Processing...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                formMessage.innerText = 'Thank you! Your spot has been reserved. We will contact you soon.';
                formMessage.className = 'form-message success';
                
                // Reset form
                leadForm.reset();
                
                btn.innerText = originalText;
                btn.disabled = false;
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    formMessage.innerText = '';
                    formMessage.className = 'form-message';
                }, 5000);
            }, 1500);
        });
    }

    // Video Placeholder Interaction (Simulation)
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', () => {
            alert('BTS Video Player will open here.');
        });
    }

    // Before & After Slider Logic
    const sliderInput = document.getElementById('comparisonSlider');
    const polishedImage = document.querySelector('.polished-image');
    const sliderHandle = document.querySelector('.slider-handle');

    if (sliderInput) {
        sliderInput.addEventListener('input', (e) => {
            const sliderValue = e.target.value;
            polishedImage.style.width = `${sliderValue}%`;
            sliderHandle.style.left = `${sliderValue}%`;
        });
    }

    // 3D Tilt Effect for Audience Cards
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            
            // Get mouse position relative to the element
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation (center is 0, edges are max rotation)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Max rotation in degrees
            const maxTilt = 10;
            
            const rotateX = ((y - centerY) / centerY) * -maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            el.style.transition = 'transform 0.5s ease';
        });
        
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'none';
        });
    });
});
