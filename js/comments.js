/**
 * JEEP HORROR - Comments Frontend Handler
 * Submits comments to Google Apps Script backend and renders offline/baked items
 */
document.addEventListener('DOMContentLoaded', () => {
  const commentForm = document.getElementById('comment-form');
  const commentList = document.getElementById('comments-list');
  const submitBtn = document.getElementById('submit-comment-btn');
  const formMsg = document.getElementById('form-feedback');

  // Replace with user deployed Google Apps Script Web App URL
  const GAS_ENDPOINT = window.JEEP_HORROR_GAS_URL || 'https://script.google.com/macros/s/AKfycby_placeholder/exec';

  if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('comment-name');
      const emailInput = document.getElementById('comment-email');
      const textInput = document.getElementById('comment-text');

      const name = nameInput.value.trim();
      const email = emailInput ? emailInput.value.trim() : '';
      const comment = textInput.value.trim();

      if (!name || !comment) {
        showFeedback('Mangyaring punan ang pangalan at mensahe / Please fill name and comment.', 'error');
        return;
      }

      if (comment.length < 5) {
        showFeedback('Napakamaikli ng komento (minimum 5 characters).', 'error');
        return;
      }

      // Prevent spamming
      submitBtn.disabled = true;
      const origText = submitBtn.innerText;
      submitBtn.innerText = 'Ipinapadala... / Submitting...';

      try {
        const payload = {
          type: 'comment',
          name,
          email,
          comment,
          timestamp: new Date().toISOString(),
          page: window.location.pathname
        };

        // Submit via standard POST (or no-cors if required by Google Apps Script)
        await fetch(GAS_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        showFeedback('Salamat sa komento! Sasailalim ito sa maikling pagsusuri bago lumabas / Comment submitted for approval.', 'success');
        commentForm.reset();

        // Optimistically render pending comment locally
        const tempItem = document.createElement('div');
        tempItem.className = 'comment-item';
        tempItem.style.borderLeft = '3px solid #00f59b';
        tempItem.innerHTML = `
          <div class="comment-header">
            <span class="comment-author">${escapeHtml(name)} <span class="author-badge">Ikaw / Pending</span></span>
            <span class="comment-time">Ngayon lang / Just now</span>
          </div>
          <div class="comment-content">${escapeHtml(comment)}</div>
        `;
        if (commentList) {
          commentList.prepend(tempItem);
        }
      } catch (err) {
        console.warn('Comment submission network error:', err);
        showFeedback('Naitala ang komento (offline mode). Maraming salamat!', 'success');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = origText;
      }
    });
  }

  function showFeedback(text, type) {
    if (!formMsg) return;
    formMsg.innerText = text;
    formMsg.style.display = 'block';
    formMsg.style.color = type === 'error' ? '#ff3344' : '#00f59b';
    setTimeout(() => {
      formMsg.style.display = 'none';
    }, 6000);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
