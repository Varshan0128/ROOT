// Form submission handler
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const notes = document.getElementById('notes').value.trim();
      const msg = document.getElementById('msg');

      if (!name || !email) { 
        msg.textContent = 'Please enter name and email.'; 
        return; 
      }

      msg.textContent = 'Sending...';
      try {
        const response = await fetch('http://localhost:3001/api/early-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, notes })
        });
        
        const result = await response.json();
        
        if (result.status === 'ok') {
          msg.textContent = 'Thanks! We received your request.';
          document.getElementById('name').value = '';
          document.getElementById('email').value = '';
          document.getElementById('phone').value = '';
          document.getElementById('notes').value = '';
        } else {
          msg.textContent = 'Error: ' + (result.message || 'Unknown error occurred');
        }
      } catch (error) {
        console.error('Error:', error);
        msg.textContent = 'Network error - please try again later.';
      }
    });
  }
});
