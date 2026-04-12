const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const articlePath = path.join(
  __dirname,
  '../public/blog/jbl-bar-1300-mk2-vs-mk1-differences-the-2026-upgrades-youll-actually-feel.html'
);
const feedbackJsPath = path.join(__dirname, '../public/blog/feedback.js');
const feedbackJs = fs.readFileSync(feedbackJsPath, 'utf8');

describe('Feedback button – HTML structure', () => {
  let document;

  beforeEach(() => {
    const html = fs.readFileSync(articlePath, 'utf8');
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  test('feedback section is present', () => {
    expect(document.getElementById('feedback-section')).not.toBeNull();
  });

  test('yes button is present', () => {
    expect(document.getElementById('feedback-yes')).not.toBeNull();
  });

  test('no button is present', () => {
    expect(document.getElementById('feedback-no')).not.toBeNull();
  });

  test('thank-you message is initially hidden', () => {
    const thanks = document.getElementById('feedback-thanks');
    expect(thanks).not.toBeNull();
    expect(thanks.style.display).toBe('none');
  });
});

describe('Feedback button – behaviour', () => {
  let window, document;

  beforeEach(() => {
    const dom = new JSDOM(
      `<!DOCTYPE html><html><body>
        <button id="feedback-yes">Yes</button>
        <button id="feedback-no">No</button>
        <p id="feedback-thanks" style="display:none">Thank you for your feedback!</p>
      </body></html>`,
      { runScripts: 'dangerously' }
    );
    window = dom.window;
    document = dom.window.document;

    const script = dom.window.document.createElement('script');
    script.textContent = feedbackJs;
    dom.window.document.head.appendChild(script);
  });

  test('clicking yes disables both buttons', () => {
    window.submitFeedback('yes');
    expect(document.getElementById('feedback-yes').disabled).toBe(true);
    expect(document.getElementById('feedback-no').disabled).toBe(true);
  });

  test('clicking no disables both buttons', () => {
    window.submitFeedback('no');
    expect(document.getElementById('feedback-yes').disabled).toBe(true);
    expect(document.getElementById('feedback-no').disabled).toBe(true);
  });

  test('submitting feedback reveals the thank-you message', () => {
    window.submitFeedback('yes');
    expect(document.getElementById('feedback-thanks').style.display).not.toBe('none');
  });

  test('thank-you message text is correct', () => {
    expect(document.getElementById('feedback-thanks').textContent.trim()).toBe(
      'Thank you for your feedback!'
    );
  });
});
