/* EVE.DIGITAL — edit mode: mark an element/text, describe the fix,
   the note lands in edits.jsonl (and clipboard) for the agent. */
(() => {
  const CSS = `
    .em-btn{position:fixed;right:18px;bottom:18px;z-index:9999;font:500 11px/1 'JetBrains Mono',monospace;
      letter-spacing:.14em;color:#0d1117;background:rgba(255,255,255,.7);border:1px solid rgba(13,17,23,.25);
      border-radius:999px;padding:11px 16px;cursor:pointer;backdrop-filter:blur(10px);transition:all .25s}
    .em-btn:hover{border-color:#00ffff;box-shadow:0 0 18px rgba(0,255,255,.4)}
    .em-btn.is-on{background:#00ffff;border-color:#00ffff}
    .em-tag{position:fixed;z-index:9998;pointer-events:none;border:1.5px solid #00ffff;border-radius:6px;
      background:rgba(0,255,255,.08);box-shadow:0 0 0 4000px rgba(244,244,244,.35);transition:all .08s}
    .em-tag__label{position:absolute;top:-20px;left:-1.5px;font:500 9px/16px 'JetBrains Mono',monospace;
      letter-spacing:.06em;color:#003c40;background:#00ffff;padding:0 7px;border-radius:4px 4px 4px 0;white-space:nowrap}
    .em-modal{position:fixed;z-index:10000;left:50%;bottom:74px;transform:translateX(-50%);
      width:min(440px,92vw);background:rgba(255,255,255,.92);border:1px solid rgba(13,17,23,.15);
      border-radius:16px;backdrop-filter:blur(16px);box-shadow:0 24px 60px rgba(13,17,23,.18);
      padding:16px;display:none;font-family:'Inter',sans-serif}
    .em-modal.is-open{display:block}
    .em-modal__sel{font:500 10px/1.5 'JetBrains Mono',monospace;color:#00a0a8;word-break:break-all;margin-bottom:8px}
    .em-modal textarea{width:100%;min-height:72px;resize:vertical;border:1px solid rgba(13,17,23,.18);
      border-radius:10px;padding:10px;font:13px/1.5 'Inter',sans-serif;background:#fff;outline:none}
    .em-modal textarea:focus{border-color:#00ffff;box-shadow:0 0 12px rgba(0,255,255,.3)}
    .em-modal__row{display:flex;gap:8px;margin-top:10px}
    .em-modal button{flex:1;font:500 12px/1 'Space Grotesk',sans-serif;padding:11px;border-radius:999px;
      border:none;cursor:pointer;transition:all .2s}
    .em-send{background:#00ffff;color:#003c40}.em-send:hover{box-shadow:0 0 18px rgba(0,255,255,.7)}
    .em-cancel{background:rgba(13,17,23,.07);color:#0d1117}
    .em-toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%) translateY(80px);z-index:10001;
      font:500 11px/1 'JetBrains Mono',monospace;letter-spacing:.08em;color:#003c40;background:#00ffff;
      padding:11px 18px;border-radius:999px;box-shadow:0 8px 30px rgba(0,200,210,.4);
      transition:transform .35s cubic-bezier(.2,.9,.3,1.2)}
    .em-toast.is-show{transform:translateX(-50%) translateY(0)}
    body.em-on{cursor:crosshair}
    body.em-on a,body.em-on button{pointer-events:none}
    body.em-on .em-btn,body.em-on .em-modal,body.em-on .em-modal *{pointer-events:auto}
  `;

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.className = 'em-btn';
  btn.textContent = '◈ ПРАВКИ';
  const tag = document.createElement('div');
  tag.className = 'em-tag';
  tag.innerHTML = '<span class="em-tag__label"></span>';
  tag.style.display = 'none';
  const modal = document.createElement('div');
  modal.className = 'em-modal';
  modal.innerHTML = `
    <div class="em-modal__sel"></div>
    <textarea placeholder="Что исправить? Например: сделай заголовок крупнее или поменяй текст на…"></textarea>
    <div class="em-modal__row">
      <button class="em-send">Отправить Девину</button>
      <button class="em-cancel">Отмена</button>
    </div>`;
  const toast = document.createElement('div');
  toast.className = 'em-toast';
  for (const el of [btn, tag, modal, toast]) {
    el.dataset.inspector = '1';
    document.body.appendChild(el);
  }

  let on = false, target = null;

  /* unique-ish selector path: tag.class#id + nth-child */
  function selectorOf(el) {
    const parts = [];
    while (el && el !== document.body && parts.length < 6) {
      let p = el.tagName.toLowerCase();
      if (el.id) { parts.unshift(p + '#' + el.id); break; }
      const cls = [...el.classList].filter(c => !c.startsWith('em-')).slice(0, 2);
      if (cls.length) p += '.' + cls.join('.');
      const sib = el.parentElement
        ? [...el.parentElement.children].filter(c => c.tagName === el.tagName)
        : [];
      if (sib.length > 1) p += `:nth-of-type(${sib.indexOf(el) + 1})`;
      parts.unshift(p);
      el = el.parentElement;
    }
    return parts.join(' > ');
  }

  function describe(el) {
    const txt = (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 90);
    return { selector: selectorOf(el), text: txt, tag: el.tagName.toLowerCase() };
  }

  function highlight(el) {
    if (!el || el.dataset.inspector) { tag.style.display = 'none'; return; }
    const r = el.getBoundingClientRect();
    Object.assign(tag.style, {
      display: 'block',
      left: r.left + 'px', top: r.top + 'px',
      width: r.width + 'px', height: r.height + 'px',
    });
    tag.querySelector('.em-tag__label').textContent =
      el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
        ? '.' + String(el.className).trim().split(/\s+/)[0] : '');
  }

  function toast_(msg) {
    toast.textContent = msg;
    toast.classList.add('is-show');
    setTimeout(() => toast.classList.remove('is-show'), 2600);
  }

  btn.addEventListener('click', () => {
    on = !on;
    btn.classList.toggle('is-on', on);
    document.body.classList.toggle('em-on', on);
    if (!on) { tag.style.display = 'none'; modal.classList.remove('is-open'); }
  });

  document.addEventListener('pointermove', e => {
    if (on && !modal.classList.contains('is-open')) highlight(e.target);
  }, true);

  document.addEventListener('click', e => {
    if (!on || e.target.dataset.inspector || e.target.closest('[data-inspector]')) return;
    e.preventDefault();
    e.stopPropagation();
    target = e.target;
    const sel = window.getSelection();
    const d = describe(target);
    if (sel && String(sel).trim()) d.selectedText = String(sel).trim().slice(0, 200);
    modal.querySelector('.em-modal__sel').textContent = d.selector;
    modal.dataset.info = JSON.stringify(d);
    modal.classList.add('is-open');
    modal.querySelector('textarea').focus();
  }, true);

  modal.querySelector('.em-cancel').addEventListener('click', () => {
    modal.classList.remove('is-open');
    modal.querySelector('textarea').value = '';
  });

  modal.querySelector('.em-send').addEventListener('click', async () => {
    const comment = modal.querySelector('textarea').value.trim();
    if (!comment) { modal.querySelector('textarea').focus(); return; }
    const payload = {
      page: location.pathname,
      ...JSON.parse(modal.dataset.info || '{}'),
      comment,
    };
    const report = `ПРАВКА | ${payload.selector}\nтекст: "${payload.text || payload.selectedText || ''}"\nпросьба: ${comment}`;
    let sent = false;
    try {
      const r = await fetch('/__edits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      sent = r.ok;
    } catch (_) {}
    try { await navigator.clipboard.writeText(report); } catch (_) {}
    const stash = JSON.parse(localStorage.getItem('eve-edits') || '[]');
    stash.push(payload);
    localStorage.setItem('eve-edits', JSON.stringify(stash));
    modal.classList.remove('is-open');
    modal.querySelector('textarea').value = '';
    toast_(sent
      ? 'Записано в edits.jsonl — скажи Девину: «примени правки»'
      : 'Скопировано в буфер — вставь в чат');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && on) btn.click();
  });
})();
