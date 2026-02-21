/**
 * navigator.js
 * State machine: tracks currentIndex, isAnimating, and handles all input events.
 * Supports fast-forward: clicking during a forward animation skips to end.
 */
window.Navigator = {
  currentIndex: 0,
  isAnimating: false,
  transitions: [],
  totalSlides: 0,
  lastWheelTime: 0,
  WHEEL_COOLDOWN: 900, // ms
  _activeTimeline: null,
  _activeDirection: null,

  init(transitions, totalSlides) {
    this.transitions  = transitions;
    this.totalSlides  = totalSlides;
    this.currentIndex = 0;
    this.isAnimating  = false;
    this._activeTimeline  = null;
    this._activeDirection = null;

    this._bindEvents();
    this._updateUI();
  },

  goNext() {
    // Fast-forward: if already animating forward, skip to end
    if (this.isAnimating) {
      if (this._activeTimeline && this._activeDirection === 'forward') {
        this._activeTimeline.progress(1);
      }
      return;
    }

    if (this.currentIndex >= this.totalSlides - 1) return;

    this.isAnimating = true;
    this._updateButtons();

    const tl = this.transitions[this.currentIndex];
    this._activeTimeline  = tl;
    this._activeDirection = 'forward';

    tl.eventCallback('onComplete', () => {
      this.currentIndex++;
      this.isAnimating = false;
      this._activeTimeline  = null;
      this._activeDirection = null;
      this._updateUI();
    });

    tl.play();
  },

  goPrev() {
    if (this.isAnimating || this.currentIndex <= 0) return;

    this.isAnimating = true;
    this._updateButtons();

    const tl = this.transitions[this.currentIndex - 1];
    this._activeTimeline  = tl;
    this._activeDirection = 'reverse';

    tl.eventCallback('onReverseComplete', () => {
      this.currentIndex--;
      this.isAnimating = false;
      this._activeTimeline  = null;
      this._activeDirection = null;
      this._updateUI();
    });

    tl.reverse();
  },

  goTo(index) {
    if (index === this.currentIndex || this.isAnimating) return;
    if (index < 0 || index >= this.totalSlides) return;

    this.isAnimating = true;
    this._updateButtons();

    const step = index > this.currentIndex ? 1 : -1;
    const playSequence = () => {
      if (this.currentIndex === index) {
        this.isAnimating = false;
        this._activeTimeline  = null;
        this._activeDirection = null;
        this._updateUI();
        return;
      }

      if (step > 0) {
        const tl = this.transitions[this.currentIndex];
        this._activeTimeline  = tl;
        this._activeDirection = 'forward';
        tl.eventCallback('onComplete', () => {
          this.currentIndex++;
          playSequence();
        });
        tl.play();
      } else {
        const tl = this.transitions[this.currentIndex - 1];
        this._activeTimeline  = tl;
        this._activeDirection = 'reverse';
        tl.eventCallback('onReverseComplete', () => {
          this.currentIndex--;
          playSequence();
        });
        tl.reverse();
      }
    };

    playSequence();
  },

  _bindEvents() {
    // Arrow keys
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        this.goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.goPrev();
      }
    });

    // Mouse wheel — rate-limited
    window.addEventListener('wheel', (e) => {
      const now = Date.now();
      if (now - this.lastWheelTime < this.WHEEL_COOLDOWN) return;
      this.lastWheelTime = now;

      if (e.deltaY > 0) {
        this.goNext();
      } else {
        this.goPrev();
      }
    }, { passive: true });

    // Touch swipe
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return; // minimum swipe distance
      if (delta > 0) {
        this.goNext();
      } else {
        this.goPrev();
      }
    }, { passive: true });

    // Nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.dir;
        if (dir === 'next') this.goNext();
        if (dir === 'prev') this.goPrev();
      });
    });

    // Progress dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.addEventListener('click', () => this.goTo(i));
    });
  },

  _updateUI() {
    this._updateDots();
    this._updateButtons();
  },

  _updateDots() {
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  },

  _updateButtons() {
    const prevBtn = document.querySelector('.nav-btn[data-dir="prev"]');
    const nextBtn = document.querySelector('.nav-btn[data-dir="next"]');

    if (prevBtn) prevBtn.disabled = this.currentIndex === 0 || this.isAnimating;
    if (nextBtn) nextBtn.disabled = this.currentIndex === this.totalSlides - 1 || this.isAnimating;
  }
};
