// ===== FACE ID ENGINE — Optimised for speed =====
const FaceID = {
  modelsLoaded: false,
  modelsLoading: false,
  stream: null,
  videoEl: null,
  canvasEl: null,
  _rafId: null,          // requestAnimationFrame id for live loop
  MATCH_THRESHOLD: 0.46,
  STORAGE_KEY: 'innoverse_face_descriptors',

  // ── Load models — skip faceExpressions (not needed, saves ~2MB + time) ───
  async loadModels(statusEl) {
    if (this.modelsLoaded) return true;
    if (this.modelsLoading) return false;
    this.modelsLoading = true;
    if (statusEl) statusEl.innerHTML = '<span class="fid-status loading"><i class="fas fa-spinner fa-spin"></i> Loading AI models…</span>';

    // Use smaller inputSize model URL
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
    try {
      // Load only what we need — skip faceExpressionNet (saves ~600ms)
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      this.modelsLoaded = true;
      this.modelsLoading = false;
      if (statusEl) statusEl.innerHTML = '<span class="fid-status ok"><i class="fas fa-check-circle"></i> Ready</span>';
      return true;
    } catch (err) {
      this.modelsLoading = false;
      if (statusEl) statusEl.innerHTML = `<span class="fid-status error"><i class="fas fa-times-circle"></i> ${err.message}</span>`;
      return false;
    }
  },

  // ── Start webcam ──────────────────────────────────────────────────────────
  async startCamera(videoEl, statusEl) {
    this.videoEl = videoEl;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        // Smaller resolution = faster inference
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' }
      });
      videoEl.srcObject = this.stream;
      await new Promise(res => { videoEl.onloadedmetadata = res; });
      await videoEl.play();
      if (statusEl) statusEl.innerHTML = '<span class="fid-status ok"><i class="fas fa-video"></i> Camera active</span>';
      return true;
    } catch (err) {
      const msg = err.name === 'NotAllowedError' ? 'Camera permission denied.' : err.message;
      if (statusEl) statusEl.innerHTML = `<span class="fid-status error"><i class="fas fa-times-circle"></i> ${msg}</span>`;
      return false;
    }
  },

  stopCamera() {
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; }
    if (this.videoEl) { this.videoEl.srcObject = null; this.videoEl = null; }
  },

  // ── Single detection — inputSize 160 is 2x faster than 224 ───────────────
  async detectFace(videoEl, canvasEl) {
    if (!this.modelsLoaded || !videoEl || videoEl.readyState < 2) return null;

    // inputSize 160 = fastest, still accurate enough for recognition
    const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.45 });

    const result = await faceapi
      .detectSingleFace(videoEl, opts)
      .withFaceLandmarks(true)
      .withFaceDescriptor();   // no withFaceExpressions() — not needed

    if (canvasEl) {
      const ctx = canvasEl.getContext('2d');
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      if (result) {
        const dims = faceapi.matchDimensions(canvasEl, videoEl, true);
        const resized = faceapi.resizeResults(result, dims);
        this._drawFaceOverlay(ctx, resized, canvasEl.width, canvasEl.height);
      }
    }
    return result || null;
  },

  // ── Custom draw — faster than faceapi.draw (no DOM manipulation) ─────────
  _drawFaceOverlay(ctx, result, W, H) {
    const box = result.detection.box;
    const lms = result.landmarks.positions;

    ctx.save();
    // Face box
    ctx.strokeStyle = 'rgba(124,58,237,0.85)';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // Corner accents
    const cs = 14;
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    [[box.x, box.y], [box.x+box.width, box.y],
     [box.x, box.y+box.height], [box.x+box.width, box.y+box.height]].forEach(([cx,cy], i) => {
      ctx.beginPath();
      const sx = i % 2 === 0 ? 1 : -1;
      const sy = i < 2 ? 1 : -1;
      ctx.moveTo(cx, cy + sy * cs); ctx.lineTo(cx, cy); ctx.lineTo(cx + sx * cs, cy);
      ctx.stroke();
    });

    // Landmarks — just dots, no lines (faster)
    ctx.fillStyle = 'rgba(168,85,247,0.7)';
    lms.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  },

  // ── Capture — 3 samples in parallel instead of 5 sequential ─────────────
  async captureDescriptor(videoEl, canvasEl, statusEl) {
    if (statusEl) statusEl.innerHTML = '<span class="fid-status loading"><i class="fas fa-spinner fa-spin"></i> Scanning…</span>';

    // Take 3 samples with minimal delay (was 5 × 200ms = 1000ms, now ~300ms)
    const results = [];
    for (let i = 0; i < 3; i++) {
      const r = await this.detectFace(videoEl, canvasEl);
      if (r) results.push(r.descriptor);
      if (i < 2) await new Promise(res => setTimeout(res, 80)); // 80ms gap
    }

    if (results.length < 2) {
      if (statusEl) statusEl.innerHTML = '<span class="fid-status error"><i class="fas fa-times-circle"></i> No face detected. Look at the camera.</span>';
      return null;
    }

    // Average descriptors
    const avg = new Float32Array(128);
    results.forEach(d => d.forEach((v, i) => { avg[i] += v; }));
    avg.forEach((_, i) => { avg[i] /= results.length; });

    if (statusEl) statusEl.innerHTML = `<span class="fid-status ok"><i class="fas fa-check-circle"></i> Face captured!</span>`;
    return avg;
  },

  // ── Match — single shot, no loop needed ──────────────────────────────────
  async matchFace(videoEl, canvasEl, statusEl) {
    if (statusEl) statusEl.innerHTML = '<span class="fid-status loading"><i class="fas fa-spinner fa-spin"></i> Verifying…</span>';

    const result = await this.detectFace(videoEl, canvasEl);
    if (!result) {
      if (statusEl) statusEl.innerHTML = '<span class="fid-status error"><i class="fas fa-times-circle"></i> No face detected</span>';
      return { matched: false, userId: null, distance: 1 };
    }

    const stored = this.getAllDescriptors();
    let best = { userId: null, distance: 1 };
    Object.entries(stored).forEach(([uid, arr]) => {
      const d = faceapi.euclideanDistance(result.descriptor, new Float32Array(arr));
      if (d < best.distance) best = { userId: uid, distance: d };
    });

    const matched = best.distance < this.MATCH_THRESHOLD;
    const conf = Math.round((1 - best.distance) * 100);
    if (matched) {
      if (statusEl) statusEl.innerHTML = `<span class="fid-status ok"><i class="fas fa-check-circle"></i> Verified! ${conf}% confidence</span>`;
    } else {
      if (statusEl) statusEl.innerHTML = '<span class="fid-status error"><i class="fas fa-times-circle"></i> Face not recognised</span>';
    }
    return { matched, userId: best.userId, distance: best.distance };
  },

  // ── Live detection loop — rAF based (smoother than setInterval) ──────────
  startLiveDetection(videoEl, canvasEl, onFound, onLost) {
    let present = false;
    let lastRun = 0;
    const INTERVAL = 120; // ms between detections (was 150ms setInterval)

    const loop = async (ts) => {
      this._rafId = requestAnimationFrame(loop);
      if (ts - lastRun < INTERVAL) return;
      lastRun = ts;
      const r = await this.detectFace(videoEl, canvasEl);
      if (r && !present) { present = true; onFound && onFound(r); }
      else if (!r && present) { present = false; onLost && onLost(); }
    };
    this._rafId = requestAnimationFrame(loop);
  },

  // ── Storage helpers ───────────────────────────────────────────────────────
  saveDescriptor(userId, descriptor) {
    const all = this.getAllDescriptors();
    all[userId] = Array.from(descriptor);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
  },
  getAllDescriptors() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}'); }
    catch { return {}; }
  },
  getDescriptor(uid) {
    const all = this.getAllDescriptors();
    return all[uid] ? new Float32Array(all[uid]) : null;
  },
  hasDescriptor(uid) { return !!this.getDescriptor(uid); }
};
