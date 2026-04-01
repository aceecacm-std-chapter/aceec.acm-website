// main.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (navLinks) navLinks.classList.remove('active'); // close mobile menu on click
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Form submission simulation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const status = document.getElementById('form-status');

            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                if (response.ok) {
                    status.innerHTML = '<span style="color: #00d2ff;">Message sent successfully! We will get back to you soon.</span>';
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.innerHTML = '<span style="color: #ff4d4d;">' + data["errors"].map(error => error["message"]).join(", ") + '</span>';
                        } else {
                            status.innerHTML = '<span style="color: #ff4d4d;">Oops! There was a problem submitting your form.</span>';
                        }
                    });
                }
            }).catch(error => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                status.innerHTML = '<span style="color: #ff4d4d;">Oops! There was a problem submitting your form.</span>';
            }).finally(() => {
                setTimeout(() => {
                    status.innerHTML = '';
                }, 5000);
            });
        });
    }

    // Lightbox functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');

    // Select all images we want to be clickable
    const images = document.querySelectorAll('.avatar-container:not(#hodPhoto):not(#bhargaviPhoto) img, .gallery-item img, .event-img img');

    images.forEach(img => {
        img.style.cursor = 'pointer'; // Make it clear it's clickable
        img.addEventListener('click', function () {
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('show'), 10);
            modalImg.src = this.src;
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', function () {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        });
    }

    // Close modal when clicking outside the image
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        });
    }

    // HOD Modal Interactive Typewriter Effect
    const hodPhoto = document.getElementById('hodPhoto');
    const hodInfoModal = document.getElementById('hodInfoModal');
    const closeHodModal = document.querySelector('.close-hod-modal');
    const hodTypingText = document.getElementById('hodTypingText');

    const hodInfoText = `About
Dr.Kavitha Soppari is a highly qualified professional with an impressive 27 years of teaching experience in the field of Computer Science and Engineering. Over the years, she has made significant contributions to both undergraduate and postgraduate education, particularly in specialized areas such as Information Security and Image Processing.

Her expertise extends beyond the classroom, as she has been actively involved in research focusing on practical implementation and application of her findings. Her work bridges the gap between theoretical concepts and real-world solutions, enriching both her teaching and the academic community.

Dr.Kavitha’s long-standing academic journey reflects her deep commitment to education, her mastery of subject matter, and her ability to inspire students and colleagues alike with her insights and experience.

Educational Details

PhD (Computer Science & Engineering), JNTU College of Engineering, Hyderabad – July 2023
M.Tech (CSE), JNTU College of Engineering, Hyderabad – February 2005
B.Tech (CSE), Kakatiya Institute of Technology & Science, Warangal
SSC, CBSE – Warangal Public School, Warangal – April 1991`;

    let typingInterval;
    let isModalOpen = false;

    const closeHodInfoModal = () => {
        if (!isModalOpen) return;
        isModalOpen = false;
        hodInfoModal.classList.remove('show');
        clearInterval(typingInterval);
        hodTypingText.classList.remove('typing-cursor');
        setTimeout(() => {
            if (!isModalOpen) {
                hodTypingText.textContent = '';
                hodInfoModal.style.display = 'none';
            }
        }, 400); // Wait for fade out animation
    };

    if (hodPhoto && hodInfoModal && hodTypingText) {
        hodPhoto.addEventListener('click', () => {
            if (isModalOpen) return;
            isModalOpen = true;
            hodInfoModal.style.display = 'block';
            setTimeout(() => hodInfoModal.classList.add('show'), 10);

            hodTypingText.classList.add('typing-cursor');
            hodTypingText.textContent = '';
            let i = 0;
            clearInterval(typingInterval);

            // Wait for slide up animation before typing
            setTimeout(() => {
                if (!isModalOpen) return;
                typingInterval = setInterval(() => {
                    if (i < hodInfoText.length) {
                        hodTypingText.textContent += hodInfoText.charAt(i);
                        i++;
                    } else {
                        clearInterval(typingInterval);
                        hodTypingText.classList.remove('typing-cursor');
                    }
                }, 5);
            }, 500);
        });

        if (closeHodModal) {
            closeHodModal.addEventListener('click', closeHodInfoModal);
        }

        hodInfoModal.addEventListener('click', (e) => {
            if (e.target === hodInfoModal) {
                closeHodInfoModal();
            }
        });
    }

    // Bhargavi Modal Interactive Typewriter Effect
    const bhargaviPhoto = document.getElementById('bhargaviPhoto');
    const bhargaviInfoModal = document.getElementById('bhargaviInfoModal');
    const closeBhargaviModalBtn = document.getElementById('closeBhargaviModalBtn');
    const bhargaviTypingText = document.getElementById('bhargaviTypingText');

    const bhargaviInfoText = `About
    
Mrs.J.Bhargavi has over 13 years of professional experience, including 11 years in teaching and 2 years in industry.She has achieved multiple academic and professional certifications such as Microsoft Technology Associate, NVIDIA certification, and Oracle Academy Trainer.She qualified national - level exams like NET(2019, 2024) and SET(2017).She has completed several courses through NPTEL, Coursera, and Infosys Springboard.Additionally, she is a certified AI mentor by TCS and has published 2 UGC papers and 2 conference papers.`;

    let bhargaviTypingInterval;
    let isBhargaviModalOpen = false;

    const closeBhargaviInfoModal = () => {
        if (!isBhargaviModalOpen) return;
        isBhargaviModalOpen = false;
        bhargaviInfoModal.classList.remove('show');
        clearInterval(bhargaviTypingInterval);
        bhargaviTypingText.classList.remove('typing-cursor');
        setTimeout(() => {
            if (!isBhargaviModalOpen) {
                bhargaviTypingText.textContent = '';
                bhargaviInfoModal.style.display = 'none';
            }
        }, 400); // Wait for fade out animation
    };

    if (bhargaviPhoto && bhargaviInfoModal && bhargaviTypingText) {
        bhargaviPhoto.addEventListener('click', () => {
            if (isBhargaviModalOpen) return;
            isBhargaviModalOpen = true;
            bhargaviInfoModal.style.display = 'block';
            setTimeout(() => bhargaviInfoModal.classList.add('show'), 10);

            bhargaviTypingText.classList.add('typing-cursor');
            bhargaviTypingText.textContent = '';
            let i = 0;
            clearInterval(bhargaviTypingInterval);

            // Wait for slide up animation before typing
            setTimeout(() => {
                if (!isBhargaviModalOpen) return;
                bhargaviTypingInterval = setInterval(() => {
                    if (i < bhargaviInfoText.length) {
                        bhargaviTypingText.textContent += bhargaviInfoText.charAt(i);
                        i++;
                    } else {
                        clearInterval(bhargaviTypingInterval);
                        bhargaviTypingText.classList.remove('typing-cursor');
                    }
                }, 5); // Typing speed
            }, 500);
        });

        if (closeBhargaviModalBtn) {
            closeBhargaviModalBtn.addEventListener('click', closeBhargaviInfoModal);
        }

        bhargaviInfoModal.addEventListener('click', (e) => {
            if (e.target === bhargaviInfoModal) {
                closeBhargaviInfoModal();
            }
        });
    }
});
