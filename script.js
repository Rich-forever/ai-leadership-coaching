// Read referral from URL
const urlParams = new URLSearchParams(window.location.search);
const referral = urlParams.get('referral');

if(referral) {
    document.getElementById('referral').value = referral;
}

// Section elements
const sections = {
    intro: document.getElementById('introSection'),
    demographics: document.getElementById('demographicsSection'),
    knowledge: document.getElementById('knowledgeSection'),
    familiarity: document.getElementById('familiaritySection'),
    beliefs: document.getElementById('beliefsSection'),
    scenarios: document.getElementById('scenariosSection'),
    experience: document.getElementById('experienceSection'),
    completion: document.getElementById('completionSection'),
    thankYou: document.getElementById('thankYouSection')
};

// Step elements
const steps = document.querySelectorAll('.step');
const progressBar = document.querySelector('.progress');

// Current section tracking
let currentSection = 'intro';

// Consent logic
const consentCheckbox = document.getElementById('consentCheckbox');
const nextBtn = document.getElementById('nextBtn');

consentCheckbox?.addEventListener('change', function() {
    nextBtn.disabled = !this.checked;
});

// Navigation functions
function showSection(sectionName) {
    Object.values(sections).forEach(section => {
        if (section) section.style.display = 'none';
    });
    
    if (sections[sectionName]) {
        sections[sectionName].style.display = 'block';
    }
    
    currentSection = sectionName;
    window.scrollTo(0, 0);
}

function updateProgress(stepIndex) {
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index < stepIndex) {
            step.classList.add('completed');
        } else if (index === stepIndex) {
            step.classList.add('active');
        }
    });
    
    const progressPercentage = (stepIndex / (steps.length - 1)) * 100;
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }
}

// Navigation event listeners
function setupNavigation() {
    // Intro to Demographics
    nextBtn?.addEventListener('click', function() {
        showSection('demographics');
        updateProgress(1);
    });

    // Back to Intro
    document.getElementById('backToIntro')?.addEventListener('click', function() {
        showSection('intro');
        updateProgress(0);
    });

    // Demographics to Knowledge
    document.getElementById('nextToKnowledge')?.addEventListener('click', function() {
        if (validateForm('demographicsForm')) {
            showSection('knowledge');
            updateProgress(2);
        }
    });

    // Back to Demographics
    document.getElementById('backToDemographics')?.addEventListener('click', function() {
        showSection('demographics');
        updateProgress(1);
    });

    // Knowledge to Familiarity
    document.getElementById('nextToFamiliarity')?.addEventListener('click', function() {
        if (validateForm('knowledgeForm')) {
            showSection('familiarity');
            updateProgress(3);
        }
    });

    // Back to Knowledge
    document.getElementById('backToKnowledge')?.addEventListener('click', function() {
        showSection('knowledge');
        updateProgress(2);
    });

    // Familiarity to Beliefs
    document.getElementById('nextToBeliefs')?.addEventListener('click', function() {
        if (validateForm('familiarityForm')) {
            showSection('beliefs');
            updateProgress(4);
        }
    });

    // Back to Familiarity
    document.getElementById('backToFamiliarity')?.addEventListener('click', function() {
        showSection('familiarity');
        updateProgress(3);
    });

    // Beliefs to Scenarios
    document.getElementById('nextToScenarios')?.addEventListener('click', function() {
        if (validateForm('beliefsForm')) {
            showSection('scenarios');
            updateProgress(5);
        }
    });

    // Back to Beliefs
    document.getElementById('backToBeliefs')?.addEventListener('click', function() {
        showSection('beliefs');
        updateProgress(4);
    });

    // Scenarios to Experience
    document.getElementById('nextToExperience')?.addEventListener('click', function() {
        if (validateForm('scenariosSection')) {
            showSection('experience');
            updateProgress(6);
        }
    });

    // Back to Scenarios
    document.getElementById('backToScenarios')?.addEventListener('click', function() {
        showSection('scenarios');
        updateProgress(5);
    });

    // Experience to Completion
    document.getElementById('nextToCompletion')?.addEventListener('click', function() {
        if (validateForm('experienceForm')) {
            showSection('completion');
            updateProgress(7);
        }
    });

    // Back to Experience
    document.getElementById('backToExperience')?.addEventListener('click', function() {
        showSection('experience');
        updateProgress(6);
    });
}

// Form validation function
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value || (field.type === 'radio' && !form.querySelector(`[name="${field.name}"]:checked`))) {
            isValid = false;
            field.classList.add('error');
            
            if (!field.nextElementSibling?.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                errorMsg.style.color = '#e74c3c';
                errorMsg.style.fontSize = '0.85rem';
                errorMsg.style.marginTop = '0.25rem';
                field.parentNode.appendChild(errorMsg);
            }
        } else {
            field.classList.remove('error');
            const errorMsg = field.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    });
    
    if (!isValid) {
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        alert('Please complete all required fields before proceeding.');
    }
    
    return isValid;
}

// Slider value display enhancement
function setupSliders() {
    document.querySelectorAll('.slider').forEach(slider => {
        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'slider-value';
        valueDisplay.style.textAlign = 'center';
        valueDisplay.style.marginTop = '0.5rem';
        valueDisplay.style.fontWeight = '600';
        valueDisplay.style.color = '#667eea';
        valueDisplay.textContent = `Value: ${slider.value}/10`;
        
        slider.parentNode.appendChild(valueDisplay);
        
        slider.addEventListener('input', function() {
            valueDisplay.textContent = `Value: ${this.value}/10`;
        });
    });
}

// Function to collect all form data as individual fields
function collectAllFormData() {
    const allData = {};
    const timestamp = new Date().toISOString();

    // Function to collect data from a specific form
    function collectFromForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            const formData = new FormData(form);
            for (let [key, value] of formData.entries()) {
                if (value && value.trim() !== '') {
                    if (allData[key]) {
                        allData[key] += ', ' + value;
                    } else {
                        allData[key] = value;
                    }
                }
            }
        }
    }

    // Add timestamp
    allData.timestamp = timestamp;

    // Collect from all section forms
    collectFromForm('demographicsForm');
    collectFromForm('knowledgeForm');
    collectFromForm('familiarityForm');
    collectFromForm('beliefsForm');
    collectFromForm('experienceForm');
    
    // Handle scenarios separately
    const scenarioInputs = document.querySelectorAll('#scenariosSection input, #scenariosSection select');
    scenarioInputs.forEach(input => {
        if (input.name && input.value) {
            allData[input.name] = input.value;
        }
    });

    // Handle textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        if (textarea.name && textarea.value) {
            allData[textarea.name] = textarea.value;
        }
    });

    return allData;
}

// FORMSPREE SUBMISSION
function setupFormSubmission() {
    const completionForm = document.getElementById('completionForm');
    if (!completionForm) return;

    completionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!document.getElementById('completionCheckbox')?.checked) {
            alert('Please confirm the terms before submitting.');
            return;
        }

        const participantName = document.getElementById('name')?.value || '';
        const participantEmail = document.getElementById('email')?.value || '';

        if (!participantName) {
            alert('Please enter your name to complete the survey.');
            document.getElementById('name').focus();
            return;
        }

        // Collect all data
        const allFormData = collectAllFormData();
        
        // Clear previous dynamic fields
        document.querySelectorAll('input.dynamic-field').forEach(input => input.remove());
        
        // Create hidden inputs for participant info
        createHiddenInput(completionForm, 'participant_name', participantName);
        if (participantEmail) {
            createHiddenInput(completionForm, 'participant_email', participantEmail);
        }

        // Create hidden inputs for all form data
        for (const [key, value] of Object.entries(allFormData)) {
            createHiddenInput(completionForm, key, value);
        }

        // Show loading state
        const submitBtn = document.getElementById('submitSurvey');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Show thank you page and submit
        setTimeout(() => {
            showSection('thankYou');
            updateProgress(8);
            completionForm.submit();
        }, 500);
    });
}

// Helper function to create hidden inputs
function createHiddenInput(form, name, value) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    input.className = 'dynamic-field';
    form.appendChild(input);
}

// View Leaderboard
document.getElementById('viewLeaderboard')?.addEventListener('click', function() {
    alert('Leaderboard functionality would be implemented here. In a real application, this would show the full leaderboard with all participant scores.');
});

// Restart survey
document.getElementById('restartSurvey')?.addEventListener('click', function() {
    if (confirm('Are you sure you want to restart the survey? All your progress will be lost.')) {
        // Reset all forms
        document.querySelectorAll('form').forEach(form => form.reset());
        
        // Remove error classes and messages
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Reset slider displays
        document.querySelectorAll('.slider-value').forEach(display => {
            display.textContent = 'Value: 5/10';
        });
        
        // Remove dynamic hidden fields
        document.querySelectorAll('input.dynamic-field').forEach(input => input.remove());
        
        // Show intro section
        showSection('intro');
        updateProgress(0);
        
        // Reset consent checkbox
        if (consentCheckbox) {
            consentCheckbox.checked = false;
            nextBtn.disabled = true;
        }
    }
});

// Enhanced form field interactions
function setupFormInteractions() {
    // Radio button styling
    document.querySelectorAll('.radio-option input').forEach(radio => {
        radio.addEventListener('change', function() {
            this.classList.remove('error');
            const errorMsg = this.closest('.form-group')?.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });

    // Input validation styling
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.remove('error');
                const errorMsg = this.parentNode?.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupSliders();
    setupFormSubmission();
    setupFormInteractions();
    updateProgress(0);
    
    console.log('Survey script initialized successfully');
});

// Fallback initialization for older browsers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setupNavigation();
        setupSliders();
        setupFormSubmission();
        setupFormInteractions();
        updateProgress(0);
    });
} else {
    setupNavigation();
    setupSliders();
    setupFormSubmission();
    setupFormInteractions();
    updateProgress(0);
}