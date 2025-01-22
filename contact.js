// Initialize EmailJS
(function() {
    // Replace with your EmailJS public key
    emailjs.init("YOUR_PUBLIC_KEY");
})();

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const inputs = form.querySelectorAll('input, textarea');
    
    // Add loading animation to button
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.textContent = 'TRANSMITTING...';
            submitBtn.disabled = true;
            submitBtn.style.background = 'var(--cyber-gradient)';
            submitBtn.style.opacity = '0.7';
        } else {
            submitBtn.textContent = 'TRANSMIT';
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            submitBtn.style.opacity = '1';
        }
    }

    // Add success animation
    function showSuccess() {
        submitBtn.textContent = 'TRANSMITTED!';
        submitBtn.style.background = 'linear-gradient(90deg, #00ff00, #00ffaa)';
        
        setTimeout(() => {
            submitBtn.textContent = 'TRANSMIT';
            submitBtn.style.background = '';
        }, 2000);
    }

    // Add error animation
    function showError() {
        submitBtn.textContent = 'ERROR!';
        submitBtn.style.background = 'linear-gradient(90deg, #ff0000, #ff6600)';
        
        setTimeout(() => {
            submitBtn.textContent = 'TRANSMIT';
            submitBtn.style.background = '';
        }, 2000);
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        inputs.forEach(input => {
            const value = input.value.trim();
            const container = input.parentElement;
            
            if (!value) {
                isValid = false;
                container.classList.add('invalid');
                container.classList.remove('valid');
                showTooltip(input, 'This field is required');
            } else if (input.type === 'email' && !emailRegex.test(value)) {
                isValid = false;
                container.classList.add('invalid');
                container.classList.remove('valid');
                showTooltip(input, 'Please enter a valid email address');
            } else {
                container.classList.add('valid');
                container.classList.remove('invalid');
            }
        });
        
        return isValid;
    }

    // Show tooltip
    function showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'input-tooltip';
        tooltip.textContent = message;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;
        
        document.body.appendChild(tooltip);
        setTimeout(() => tooltip.remove(), 3000);
    }

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showError();
            return;
        }
        
        setLoadingState(true);
        
        try {
            // Send email using EmailJS
            await emailjs.sendForm(
                'service_eilzbba', // Replace with your EmailJS service ID
                'template_81axwmo', // Replace with your EmailJS template ID
                form,
                'VCVt39pI9qwXMI6iB' // Replace with your EmailJS public key
            );
            
            showSuccess();
            form.reset();
            inputs.forEach(input => {
                input.parentElement.classList.remove('valid', 'invalid');
            });
            
            // Add success message to collaboration feed
            if (window.updateCollaborationFeed) {
                window.updateCollaborationFeed('Message transmitted successfully');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            showError();
            showTooltip(submitBtn, 'Failed to send message. Please try again.');
            
            // Add error message to collaboration feed
            if (window.updateCollaborationFeed) {
                window.updateCollaborationFeed('Message transmission failed');
            }
        } finally {
            setLoadingState(false);
        }
    });

    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const container = this.parentElement;
            const value = this.value.trim();
            
            if (value) {
                container.classList.add('valid');
                container.classList.remove('invalid');
            } else {
                container.classList.remove('valid');
            }
        });

        // Add focus effects
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 15px rgba(0, 195, 255, 0.5)';
            this.style.borderColor = 'rgba(0, 195, 255, 0.8)';
        });

        input.addEventListener('blur', function() {
            this.style.boxShadow = '';
            this.style.borderColor = 'var(--neon-border-color)';
            
            // Validate on blur
            const container = this.parentElement;
            const value = this.value.trim();
            
            if (!value) {
                container.classList.add('invalid');
                container.classList.remove('valid');
                showTooltip(this, 'This field is required');
            } else if (this.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                container.classList.add('invalid');
                container.classList.remove('valid');
                showTooltip(this, 'Please enter a valid email address');
            }
        });

        // Add glitch effect on input
        input.addEventListener('input', function() {
            this.style.transform = 'translateX(2px)';
            setTimeout(() => {
                this.style.transform = 'translateX(-1px)';
                setTimeout(() => {
                    this.style.transform = 'translateX(0)';
                }, 50);
            }, 50);
        });
    });
}); 