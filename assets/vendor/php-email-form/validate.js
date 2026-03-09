/**
 * Formspree AJAX handler - adapted for JSON response
 */
(function () {
  "use strict";
  let forms = document.querySelectorAll('.php-email-form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let thisForm = this;
      let action = thisForm.getAttribute('action');

      if (!action) {
        displayError(thisForm, 'Form action not set!');
        return;
      }

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => response.json())
      .then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.ok) {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(data.errors ? data.errors.map(e => e.message).join(', ') : 'Submission failed');
        }
      })
      .catch(error => {
        displayError(thisForm, error.message || 'Error sending message');
      });
    });
  });

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }
})();