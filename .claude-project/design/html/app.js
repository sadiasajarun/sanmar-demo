/* ===========================================================================
   Sanmar Lead Intelligence & Sales CRM — prototype behaviour
   Vanilla JS, no dependencies, works from file://
   Everything is driven by data attributes so one file serves all 11 pages.
   =========================================================================== */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------- toast -- */
  var toastHost;
  function toast(msg, kind) {
    if (!toastHost) {
      toastHost = document.createElement('div');
      toastHost.className = 'toast-host';
      document.body.appendChild(toastHost);
    }
    var t = document.createElement('div');
    t.className = 'toast' + (kind ? ' ' + kind : '');
    t.innerHTML = '<span class="toast-i">' + (kind === 'warn'
      ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/></svg>'
      : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="m5 13 4 4 10-10"/></svg>') + '</span>' + msg;
    toastHost.appendChild(t);
    setTimeout(function () { t.classList.add('in'); }, 10);
    setTimeout(function () {
      t.classList.remove('in');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 260);
    }, 3200);
  }
  window.sanmarToast = toast;

  /* ----------------------------------------------------------- filters --
     One combined engine per group: chip tag AND select facets AND search text.
     Rows opt in with data-filter-item="<key>", plus data-tags and data-<facet>. */
  var FSTATE = {};
  function fstate(key) {
    if (!FSTATE[key]) FSTATE[key] = { tag: '*', facets: {}, q: '' };
    return FSTATE[key];
  }

  function activeCount(st) {
    var n = (st.tag !== '*' ? 1 : 0) + (st.q ? 1 : 0);
    for (var f in st.facets) if (st.facets[f] && st.facets[f] !== '*') n++;
    return n;
  }

  function applyCombined(key, announce) {
    var st = fstate(key);
    var items = $$('[data-filter-item="' + key + '"]');
    var shown = 0;
    items.forEach(function (el) {
      var ok = true;
      if (st.tag !== '*') {
        var tags = (el.getAttribute('data-tags') || '').split(/\s+/);
        if (tags.indexOf(st.tag) === -1) ok = false;
      }
      if (ok) {
        for (var f in st.facets) {
          var v = st.facets[f];
          if (v && v !== '*' && el.getAttribute('data-' + f) !== v) { ok = false; break; }
        }
      }
      if (ok && st.q && (el.textContent || '').toLowerCase().indexOf(st.q) === -1) ok = false;
      el.hidden = !ok;
      if (ok) shown++;
    });

    $$('[data-filter-empty="' + key + '"]').forEach(function (e) { e.hidden = shown > 0; });
    $$('[data-filter-count="' + key + '"]').forEach(function (e) { e.textContent = shown; });

    var n = activeCount(st);
    $$('[data-filter-active="' + key + '"]').forEach(function (e) {
      e.hidden = n === 0;
      e.textContent = n + (n === 1 ? ' filter active' : ' filters active');
    });
    $$('[data-filter-clear="' + key + '"]').forEach(function (e) { e.hidden = n === 0; });

    if (announce) {
      toast(shown === 0
        ? 'No rows match — <b>' + announce + '</b> left nothing'
        : '<b>' + announce + '</b> — ' + shown + (shown === 1 ? ' row' : ' rows'));
    }
    return shown;
  }

  function clearFilters(key) {
    var st = fstate(key);
    st.tag = '*'; st.facets = {}; st.q = '';
    $$('[data-filter-group="' + key + '"] [data-filter]').forEach(function (c) {
      c.classList.toggle('on', c.getAttribute('data-filter') === '*');
    });
    $$('[data-select-filter="' + key + '"]').forEach(function (sl) { sl.selectedIndex = 0; });
    $$('[data-search="' + key + '"]').forEach(function (i) { i.value = ''; });
    applyCombined(key);
    toast('Filters cleared');
  }

  function initFilters() {
    /* chips bound to a target set */
    $$('[data-filter-group]').forEach(function (group) {
      var key = group.getAttribute('data-filter-group');
      var chips = $$('[data-filter]', group);
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (c) { c.classList.remove('on'); });
          chip.classList.add('on');
          fstate(key).tag = chip.getAttribute('data-filter');
          applyCombined(key, (chip.textContent || '').replace(/\d+$/, '').trim());
        });
      });
    });

    /* select dropdowns as facet filters */
    $$('[data-select-filter]').forEach(function (sl) {
      var key   = sl.getAttribute('data-select-filter');
      var facet = sl.getAttribute('data-facet');
      sl.addEventListener('change', function () {
        fstate(key).facets[facet] = sl.value;
        var label = sl.options[sl.selectedIndex].text;
        applyCombined(key, sl.value === '*' ? 'Cleared ' + facet : label);
      });
    });

    /* clear-all buttons */
    $$('[data-filter-clear]').forEach(function (b) {
      b.addEventListener('click', function () { clearFilters(b.getAttribute('data-filter-clear')); });
    });

    /* chip rows with no target set still toggle so nothing looks dead */
    $$('.filters').forEach(function (g) {
      if (g.hasAttribute('data-filter-group')) return;
      var chips = $$('.fchip', g);
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (c) { c.classList.remove('on'); });
          chip.classList.add('on');
        });
      });
    });

    /* selects that are decorative only should still not look broken */
    $$('.field select').forEach(function (sl) {
      if (sl.hasAttribute('data-select-filter')) return;
      sl.addEventListener('change', function () {
        toast('<b>' + sl.options[sl.selectedIndex].text + '</b> — this control is specified but not wired in the prototype', 'warn');
      });
    });
  }

  /* ------------------------------------------------------------ search -- */
  function initSearch() {
    $$('[data-search]').forEach(function (input) {
      var key = input.getAttribute('data-search');
      input.addEventListener('input', function () {
        fstate(key).q = input.value.trim().toLowerCase();
        applyCombined(key);
      });
    });

    $$('.top .search input').forEach(function (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && input.value.trim()) {
          toast('Global search is not indexed in a static prototype — use the filters on each list', 'warn');
        }
      });
    });
  }

  /* ------------------------------------------------------------ modals -- */
  var STAGES = ['New', 'Contacted', 'Qualified', 'Site Visit Scheduled',
                'Site Visit Done', 'Negotiation', 'Booked', 'Lost'];

  function field(label, inner) {
    return '<label class="mfield"><span class="mlabel">' + label + '</span>' + inner + '</label>';
  }
  function sel(opts, selected) {
    return '<select>' + opts.map(function (o) {
      return '<option' + (o === selected ? ' selected' : '') + '>' + o + '</option>';
    }).join('') + '</select>';
  }

  var MODALS = {
    call: function (ctx) {
      return {
        title: 'Call ' + ctx.name,
        body:
          '<div class="dialer">' +
            '<div class="dialer-av">' + ctx.initials + '</div>' +
            '<div class="dialer-num">' + ctx.phone + '</div>' +
            '<div class="dialer-state"><span class="dot"></span>Dialling via the sales line…</div>' +
          '</div>' +
          '<div class="mnote">The call is recorded and sent to the call-intelligence provider automatically. ' +
          'Its summary and score delta appear on this lead within about 90 seconds of hanging up.</div>' +
          field('Outcome', sel(['Connected', 'No answer', 'Busy', 'Wrong number', 'Callback requested'])) +
          field('Notes while you talk', '<textarea rows="3" placeholder="Anything the AI summary will not capture…"></textarea>'),
        confirm: 'Log call',
        done: 'Call logged — awaiting provider analysis'
      };
    },
    email: function (ctx) {
      return {
        title: 'Email ' + ctx.name,
        body:
          field('Template', sel(['Orchard Garden 3BR overview',
                                 'Inside the B tower — walkthrough',
                                 'Payment schedule and bank tie-ups',
                                 'Site visit reminder',
                                 'Post-visit specification pack',
                                 'Write from scratch'])) +
          field('Subject', '<input type="text" value="Your 3-bed options at Sanmar Orchard Garden">') +
          field('Preview',
            '<div class="mpreview">Dear ' + ctx.first + ',<br><br>' +
            'Thank you for your interest in Sanmar Orchard Garden at Yakub Future Park, West Khulshi. ' +
            'I have attached the 3-bed floor plan for the B tower along with the per-square-foot comparison you asked for.<br><br>' +
            'Warm regards,<br>Farhana Akter<br>Sanmar Properties Ltd</div>') +
          '<div class="mnote">Merge fields resolved: lead name, preferred area, matched unit, agent name. ' +
          'Sending pauses all automation on this lead for 48 hours.</div>',
        confirm: 'Send email',
        done: 'Email sent — automation paused on this lead for 48 hours'
      };
    },
    visit: function (ctx) {
      return {
        title: 'Schedule a site visit',
        body:
          field('Project', sel(['Sanmar Orchard Garden — West Khulshi',
                                'Sanmar Ocean City — East Nasirabad',
                                'Sanmar Sardinia — Nasirabad',
                                'Sanmar Hyde Park',
                                'Sanmar Avenue Tower — CDA Avenue'])) +
          field('Unit to show', sel(['B-1104 — 1,650 sqft, 3 bed', 'A-0903 — 1,480 sqft, 3 bed', 'Show unit only'])) +
          '<div class="mrow">' +
            field('Date', '<input type="date" value="2026-09-11">') +
            field('Time', '<input type="time" value="16:00">') +
          '</div>' +
          '<div class="mnote">A reminder with directions goes out 48 hours before, and a post-visit follow-up ' +
          'task is created for you automatically once the visit is marked done.</div>',
        confirm: 'Book visit',
        done: 'Site visit booked — reminder scheduled, stage moved to Site Visit Scheduled'
      };
    },
    note: function (ctx) {
      return {
        title: 'Add a note',
        body: field('Note', '<textarea rows="5" placeholder="What should the next person to open this lead know?"></textarea>') +
              '<div class="mnote">Notes appear in the communication timeline alongside calls and emails.</div>',
        confirm: 'Save note',
        done: 'Note added to the timeline'
      };
    },
    stage: function (ctx) {
      return {
        title: 'Change stage',
        body:
          '<div class="mstages">' + STAGES.map(function (s) {
            var on = s === (ctx.stage || 'Site Visit Scheduled');
            return '<button type="button" class="mstage' + (on ? ' on' : '') + '">' + s + '</button>';
          }).join('') + '</div>' +
          field('Reason (required for Booked and Lost)', '<input type="text" placeholder="Why is it moving?">') +
          '<div class="mnote">Advancing to Site Visit Scheduled requires a date. Booked and Lost require a reason.</div>',
        confirm: 'Update stage',
        done: 'Stage updated — change recorded in the timeline'
      };
    },
    task: function (ctx) {
      return {
        title: 'Create a task',
        body:
          field('Type', sel(['Call back', 'Send email', 'Site visit', 'Collect document', 'Other'])) +
          '<div class="mrow">' +
            field('Due date', '<input type="date" value="2026-09-09">') +
            field('Due time', '<input type="time" value="11:00">') +
          '</div>' +
          field('Detail', '<input type="text" placeholder="What needs doing?">'),
        confirm: 'Create task',
        done: 'Task created — it will appear under Follow-ups'
      };
    },
    garbage: function (ctx) {
      return {
        title: 'Mark ' + ctx.name + ' as garbage',
        danger: true,
        body:
          '<div class="mwarn">Nothing is deleted. The lead moves to the manager\'s Review Queue with the reason ' +
          'below, and can be restored in one click.</div>' +
          field('Reason', sel(['No purchase intent', 'Wrong number', 'Budget below minimum',
                               'Out of service area', 'Duplicate', 'Job seeker',
                               'Vendor or competitor', 'Spam or test'])) +
          field('Note for the manager', '<textarea rows="3" placeholder="Optional — helps calibrate the scoring model"></textarea>'),
        confirm: 'Move to Review Queue',
        done: 'Moved to the Review Queue — a manager can restore it at any time'
      };
    },
    restore: function (ctx) {
      return {
        title: 'Restore ' + ctx.name,
        body:
          field('Corrected verdict',
            '<div class="mstages"><button type="button" class="mstage on">Qualified — route to an agent</button>' +
            '<button type="button" class="mstage">Nurture — sequence only</button></div>') +
          field('Why was the engine wrong?', '<textarea rows="3" placeholder="Recorded as feedback against rule set v7"></textarea>') +
          '<div class="mnote">This is logged as a correction against the active rule set, not just an undo. ' +
          'Correction patterns are what tell you a threshold needs moving.</div>',
        confirm: 'Restore lead',
        done: 'Lead restored and routed — correction logged against rule set v7'
      };
    },
    assign: function (ctx) {
      return {
        title: 'Assign leads',
        body:
          field('Assign to', sel(['Distribute by routing rules',
                                  'Farhana Akter — 8 spare',
                                  'Imran Hossain — 6 spare',
                                  'Mahbub Alam — 8 spare',
                                  'Sadia Rahman — at capacity'])) +
          field('Reason', '<input type="text" placeholder="Recorded on each lead\'s timeline">') +
          '<div class="mnote">Agents at their ceiling are skipped. If everyone is full the leads stay in the ' +
          'unassigned pool rather than overloading anyone.</div>',
        confirm: 'Assign',
        done: 'Leads assigned — timeline entries written'
      };
    },
    rescore: function (ctx) {
      return {
        title: 'Re-score this lead',
        body: '<div class="mnote">Recomputes the composite against rule set <b>v7</b> using every call, the ' +
              'current requirement profile and the behavioural counters. Deterministic — the same inputs always ' +
              'produce the same score.</div>',
        confirm: 'Re-score now',
        done: 'Re-scored — no change, still 86 (Hot)'
      };
    },
    generic: function (ctx) {
      return {
        title: ctx.title || 'Not wired in this prototype',
        body: '<div class="mnote">This control is part of the specification but is not interactive in the ' +
              'static prototype. It is described in the PRD and will be built in the React implementation.</div>',
        confirm: 'Close',
        done: null
      };
    }
  };

  var overlay;
  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('in');
    setTimeout(function () { if (overlay) { overlay.hidden = true; } }, 180);
  }

  function openModal(kind, ctx) {
    var build = MODALS[kind] || MODALS.generic;
    var m = build(ctx || {});
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'moverlay';
      overlay.hidden = true;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
      });
    }
    overlay.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-label="' + m.title + '">' +
        '<div class="modal-h"><h3>' + m.title + '</h3>' +
          '<button type="button" class="icon-btn mclose" aria-label="Close">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
        '<div class="modal-b">' + m.body + '</div>' +
        '<div class="modal-f">' +
          '<button type="button" class="btn mcancel">Cancel</button>' +
          '<button type="button" class="btn ' + (m.danger ? 'dang' : 'pri') + ' mok">' + m.confirm + '</button>' +
        '</div>' +
      '</div>';
    overlay.hidden = false;
    setTimeout(function () { overlay.classList.add('in'); }, 10);

    $('.mclose', overlay).addEventListener('click', closeModal);
    $('.mcancel', overlay).addEventListener('click', closeModal);
    $('.mok', overlay).addEventListener('click', function () {
      closeModal();
      if (m.done) toast(m.done);
    });
    $$('.mstage', overlay).forEach(function (b) {
      b.addEventListener('click', function () {
        var sibs = b.parentNode.children;
        for (var i = 0; i < sibs.length; i++) sibs[i].classList.remove('on');
        b.classList.add('on');
      });
    });
    var first = $('input, select, textarea', overlay);
    if (first) first.focus();
  }
  window.sanmarModal = openModal;

  function initToasts() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('[data-toast]') : null;
      if (!el || el.disabled) return;
      toast(el.getAttribute('data-toast'));
    });
  }

  function initModals() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('[data-modal]') : null;
      if (!el) return;
      e.preventDefault();
      var ctx = {
        name:     el.getAttribute('data-name')  || 'this lead',
        phone:    el.getAttribute('data-phone') || '+8801711-2••-••8',
        stage:    el.getAttribute('data-stage') || '',
        title:    el.getAttribute('data-title') || ''
      };
      ctx.first = ctx.name.split(' ')[0];
      ctx.initials = ctx.name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
      openModal(el.getAttribute('data-modal'), ctx);
    });
  }

  /* ----------------------------------------------------------- toggles -- */
  function initToggles() {
    $$('.toggle').forEach(function (t) {
      function flip() {
        var on = t.classList.toggle('on');
        t.setAttribute('aria-checked', on ? 'true' : 'false');
        var row = t.closest('.rule');
        if (row) {
          row.style.opacity = on ? '' : '.62';
          var name = $('b', row);
          toast('<b>' + (name ? name.textContent : 'Rule') + '</b> ' + (on ? 'enabled' : 'paused'));
        }
      }
      t.addEventListener('click', flip);
      t.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
      });
    });
  }

  /* -------------------------------------------------------- checkboxes -- */
  function updateSelectionCount() {
    $$('[data-selection-count]').forEach(function (badge) {
      var scope = badge.closest('.card') || document;
      var n = $$('.cbx.on', scope).filter(function (c) {
        return !c.closest('thead');
      }).length;
      badge.textContent = n + ' selected';
      badge.hidden = n === 0;
      var bar = badge.closest('[data-selection-bar]');
      if (bar) bar.hidden = n === 0;
    });
  }

  function initCheckboxes() {
    $$('.cbx').forEach(function (c) {
      if (c.getAttribute('aria-checked') === 'true') c.classList.add('on');
      function flip() {
        var head = c.closest('thead');
        if (head) {
          var scope = c.closest('table');
          var all = $$('tbody .cbx', scope);
          var turnOn = !c.classList.contains('on');
          c.classList.toggle('on', turnOn);
          c.setAttribute('aria-checked', turnOn ? 'true' : 'false');
          all.forEach(function (x) {
            if (x.closest('tr').hidden) return;
            x.classList.toggle('on', turnOn);
            x.setAttribute('aria-checked', turnOn ? 'true' : 'false');
          });
        } else {
          var on = c.classList.toggle('on');
          c.setAttribute('aria-checked', on ? 'true' : 'false');
        }
        updateSelectionCount();
      }
      c.addEventListener('click', flip);
      c.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
      });
    });
    updateSelectionCount();
  }

  /* ------------------------------------------------------------ pagers -- */
  function initPagers() {
    $$('.pager').forEach(function (p) {
      var btns = $$('button', p);
      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          var t = b.textContent.trim();
          if (t === '‹' || t === '›' || t === '…') {
            toast('Pagination is illustrative in the prototype', 'warn');
            return;
          }
          btns.forEach(function (x) { x.classList.remove('on'); });
          b.classList.add('on');
          toast('Page ' + t + ' — the prototype holds one page of sample rows', 'warn');
        });
      });
    });
  }

  /* ------------------------------------------------- task completion --- */
  function initTaskDone() {
    $$('[data-task-done]').forEach(function (b) {
      b.addEventListener('click', function () {
        var row = b.closest('.unit');
        if (!row) return;
        row.classList.add('done');
        b.textContent = 'Done';
        b.disabled = true;
        var who = $('b', row);
        toast('Completed — <b>' + (who ? who.textContent.trim() : 'task') + '</b>');
      });
    });
    $$('[data-skip]').forEach(function (b) {
      b.addEventListener('click', function () {
        var row = b.closest('tr');
        if (row) { row.style.opacity = '.45'; }
        b.textContent = 'Skipped';
        b.disabled = true;
        toast('Scheduled email skipped for this lead');
      });
    });
  }

  /* ------------------------------------------- scoring weights + sim --- */
  var BASE = { total: 1284, qualified: 312, nurture: 268, garbage: 704 };

  function initWeights() {
    var sliders = $$('[data-weight]');
    if (!sliders.length) return;

    var totalEl   = $('[data-weight-total]');
    var stateEl   = $('[data-weight-state]');
    var saveBtn   = $('[data-weight-save]');
    var floorInp  = $('[data-floor]');
    var suggest   = $('[data-suggest]');

    function groupSum(g) {
      return sliders.filter(function (s) { return s.getAttribute('data-group') === g; })
                    .reduce(function (a, s) { return a + Number(s.value); }, 0);
    }

    function simulate() {
      var bw    = Number($('[data-weight][data-id="budget"]').value);
      var floor = floorInp ? Number(floorInp.value) : 45;
      var moved = Math.round((18 - bw) * 7 + (45 - floor) * 9);
      moved = Math.max(-300, Math.min(300, moved));

      var dQ = Math.round(moved * 0.35);
      var dN = moved - dQ;
      var q = BASE.qualified + dQ, n = BASE.nurture + dN, g = BASE.garbage - moved;

      function put(sel, now, delta) {
        var el = $(sel); if (!el) return;
        $('[data-sim-val]', el).textContent = now.toLocaleString();
        var d = $('[data-sim-delta]', el);
        d.textContent = (delta > 0 ? '+' : '') + delta;
        d.className = 'delta' + (delta === 0 ? ' zero' : (delta < 0 ? ' neg' : ''));
        $('[data-sim-bar]', el).style.width = Math.max(1, (now / BASE.total) * 100) + '%';
      }
      put('[data-sim="qualified"]', q, dQ);
      put('[data-sim="nurture"]',   n, dN);
      put('[data-sim="garbage"]',   g, -moved);

      var note = $('[data-sim-note]');
      if (note) {
        if (moved === 0) {
          note.innerHTML = '<b>No change yet.</b> Drag a weight or edit the budget floor and this panel re-scores ' +
            'all 1,284 leads from the last 30 days against your unsaved values.';
        } else if (moved > 0) {
          note.innerHTML = '<b>What this costs you.</b> ' + dQ + ' more leads reach agents each month. At the ' +
            'current 68% connect rate that is roughly <b>' + (dQ * 0.33).toFixed(1) + ' additional agent-hours</b>. ' +
            'Sadia Rahman is already at capacity, so this needs a capacity increase or a fifth agent — ' +
            '<a href="team.page.html">check the roster</a>.';
        } else {
          note.innerHTML = '<b>Tightening.</b> ' + Math.abs(dQ) + ' fewer leads reach agents each month and ' +
            Math.abs(moved) + ' more go to the Review Queue. Watch the restore rate — if it climbs above 5% the ' +
            'model is now binning real buyers.';
        }
      }
      var flip = $('[data-sim-flip]');
      if (flip) {
        flip.hidden = moved <= 0;
        var cnt = $('[data-sim-flipcount]');
        if (cnt) cnt.textContent = Math.abs(moved);
      }
    }

    function recalc() {
      var total = sliders.reduce(function (a, s) { return a + Number(s.value); }, 0);
      sliders.forEach(function (s) {
        var out = $('[data-weight-out="' + s.getAttribute('data-id') + '"]');
        if (out) out.textContent = s.value;
      });
      ['A', 'B', 'C'].forEach(function (g) {
        var el = $('[data-group-total="' + g + '"]');
        if (el) el.textContent = groupSum(g);
      });
      if (totalEl) totalEl.textContent = total;
      var ok = total === 100;
      if (stateEl) {
        stateEl.textContent = ok ? 'of 100 — balanced' : 'of 100 — must equal 100 before you can save';
        stateEl.className = ok ? 'ok' : 'bad';
      }
      var wrap = $('.wtot');
      if (wrap) wrap.classList.toggle('bad', !ok);
      if (saveBtn) {
        saveBtn.disabled = !ok;
        saveBtn.title = ok ? '' : 'Weights must sum to 100';
      }
      simulate();
    }

    sliders.forEach(function (s) { s.addEventListener('input', recalc); });
    if (floorInp) floorInp.addEventListener('input', recalc);

    if (suggest) {
      suggest.addEventListener('click', function () {
        var b = $('[data-weight][data-id="budget"]');
        var t = $('[data-weight][data-id="timeline"]');
        if (b) b.value = 14;
        if (t) t.value = 16;           // keep the total at 100
        if (floorInp) floorInp.value = 40;
        recalc();
        toast('Applied the suggested change — budget weight 14, timeline 16, floor ৳40 lakh');
      });
    }

    $$('[data-weight-save]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.disabled) return;
        toast('Saved as v8 — 1,284 leads re-scored, timelines updated');
      });
    });
    $$('[data-weight-reset]').forEach(function (b) {
      b.addEventListener('click', function () {
        sliders.forEach(function (s) { s.value = s.getAttribute('data-default'); });
        if (floorInp) floorInp.value = 45;
        recalc();
        toast('Changes discarded — back to rule set v7');
      });
    });

    recalc();
  }

  /* ------------------------------------------------------------ boot --- */
  function boot() {
    initFilters();
    initSearch();
    initToasts();
    initModals();
    initToggles();
    initCheckboxes();
    initPagers();
    initTaskDone();
    initWeights();

    /* any remaining button with no wiring gets an honest response rather than silence */
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null;
      if (!b || b.disabled) return;
      if (b.closest('.moverlay')) return;
      if (b.hasAttribute('data-modal') || b.hasAttribute('data-filter') ||
          b.hasAttribute('data-toast') ||
          b.hasAttribute('data-task-done') || b.hasAttribute('data-skip') ||
          b.hasAttribute('data-weight-save') || b.hasAttribute('data-weight-reset') ||
          b.hasAttribute('data-suggest') ||
          b.classList.contains('fchip') || b.classList.contains('mstage') ||
          b.closest('.pager') || b.classList.contains('play') ||
          b.classList.contains('icon-btn')) return;
      var label = (b.textContent || '').trim().replace(/\s+/g, ' ');
      if (!label) return;
      toast('<b>' + label + '</b> — specified in the PRD, not interactive in this prototype', 'warn');
    });

    /* recording players */
    $$('.play').forEach(function (p) {
      p.addEventListener('click', function () {
        var playing = p.classList.toggle('playing');
        p.innerHTML = playing
          ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>'
          : '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';
        toast(playing ? 'Playing the call recording' : 'Paused');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
