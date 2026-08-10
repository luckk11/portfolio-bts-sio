(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* thème sombre, mémorisé */
  var root = document.documentElement, tBtn = document.getElementById('theme');
  try{
    var saved = localStorage.getItem('theme');
    if(saved) root.dataset.theme = saved;
    else if(window.matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';
  }catch(e){}
  tBtn.addEventListener('click', function(){
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try{ localStorage.setItem('theme', next); }catch(e){}
  });

  /* sous-menus : survol au bureau, clic au clavier et sur écran tactile */
  document.querySelectorAll('.has-sub').forEach(function(item){
    var toggle = item.querySelector('.nl-toggle');
    if(!toggle) return;
    toggle.addEventListener('click', function(e){
      e.preventDefault();
      var open = item.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    item.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){ item.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.focus(); }
    });
  });
  document.addEventListener('click', function(e){
    document.querySelectorAll('.has-sub.open').forEach(function(item){
      if(!item.contains(e.target)){
        item.classList.remove('open');
        item.querySelector('.nl-toggle').setAttribute('aria-expanded','false');
      }
    });
  });

  /* menu mobile */
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  /* header compact + barre de progression */
  var hdr = document.getElementById('hdr'), bar = document.getElementById('progress');
  function onScroll(){
    hdr.classList.toggle('compact', window.scrollY > 80);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* révélation au scroll */
  var items = document.querySelectorAll('.rv');
  if(reduce || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en, i){
        if(en.isIntersecting){
          setTimeout(function(){ en.target.classList.add('in'); }, i * 70);
          io.unobserve(en.target);
        }
      });
    }, {threshold:.14, rootMargin:'0px 0px -60px 0px'});
    items.forEach(function(el){ io.observe(el); });
  }

  /* compteurs */
  function runCount(el){
    var to = +el.dataset.to, sfx = el.dataset.suffix || '', start = performance.now(), dur = 1500;
    if(reduce){ el.textContent = to + sfx; return; }
    function frame(now){
      var p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(2, -9 * p))) + sfx;
      if(p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counts = document.querySelectorAll('.count');
  if(!('IntersectionObserver' in window)){ counts.forEach(runCount); }
  else {
    var ioC = new IntersectionObserver(function(en){
      en.forEach(function(e){ if(e.isIntersecting){ runCount(e.target); ioC.unobserve(e.target); } });
    }, {threshold:.6});
    counts.forEach(function(el){ ioC.observe(el); });
  }

  /* accordéons */
  document.querySelectorAll('.acc').forEach(function(acc){
    acc.querySelectorAll('.acc-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var item = btn.parentElement, isOpen = item.classList.contains('open');
        acc.querySelectorAll('.acc-item').forEach(function(i){
          i.classList.remove('open');
          i.querySelector('.acc-btn').setAttribute('aria-expanded','false');
        });
        if(!isOpen){ item.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
      });
    });
  });

  /* ---------- formulaire de contact ---------- */
  var form = document.getElementById('form-contact');
  if(form){
    var msg = document.getElementById('form-msg');
    var bouton = form.querySelector('button[type="submit"]');
    var libelle = bouton ? bouton.querySelector('.libelle') : null;

    function erreur(champ, texte){
      var bloc = champ.closest('.field');
      bloc.classList.add('invalide');
      bloc.querySelector('.field-err').textContent = texte;
      champ.setAttribute('aria-invalid','true');
    }
    function nettoyer(champ){
      var bloc = champ.closest('.field');
      if(bloc){ bloc.classList.remove('invalide'); champ.removeAttribute('aria-invalid'); }
    }
    form.querySelectorAll('input,select,textarea').forEach(function(c){
      c.addEventListener('input', function(){ nettoyer(c); });
    });

    function valider(){
      var ok = true, premier = null;
      form.querySelectorAll('[required]').forEach(function(c){
        nettoyer(c);
        var v = (c.value || '').trim();
        if(c.type === 'checkbox' ? !c.checked : !v){
          erreur(c, c.type === 'checkbox' ? 'Cette case doit être cochée.' : 'Ce champ est obligatoire.');
          ok = false; premier = premier || c;
        } else if(c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){
          erreur(c, 'Cette adresse ne semble pas valide.');
          ok = false; premier = premier || c;
        }
      });
      if(premier) premier.focus();
      return ok;
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      msg.className = 'form-msg';
      if(form.querySelector('.hp input').value) return;      /* piège à robots */
      if(!valider()) return;

      var donnees = Object.fromEntries(new FormData(form).entries());
      var endpoint = form.dataset.endpoint || '';
      var configure = endpoint && endpoint.indexOf('VOTRE_ID') === -1;

      /* Sans service d'envoi configuré : bascule sur le client e-mail. */
      if(!configure){
        var corps = 'Nom : ' + donnees.nom + '\n'
                  + 'E-mail : ' + donnees.email + '\n'
                  + 'Organisation : ' + (donnees.organisation || '—') + '\n'
                  + 'Objet : ' + donnees.objet + '\n\n'
                  + donnees.message;
        window.location.href = 'mailto:zhg.luc2909@gmail.com'
          + '?subject=' + encodeURIComponent('[Portfolio] ' + donnees.objet)
          + '&body=' + encodeURIComponent(corps);
        msg.className = 'form-msg ok';
        msg.textContent = 'Votre logiciel de messagerie va s\'ouvrir avec le message pré-rempli. Il ne reste qu\'à l\'envoyer.';
        return;
      }

      if(libelle) libelle.textContent = 'Envoi…';
      if(bouton) bouton.disabled = true;

      fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(donnees)
      }).then(function(r){
        if(!r.ok) throw new Error('reponse ' + r.status);
        form.reset();
        msg.className = 'form-msg ok';
        msg.textContent = 'Message envoyé. Une réponse suivra sous 48 heures.';
      }).catch(function(){
        msg.className = 'form-msg ko';
        msg.innerHTML = 'L\'envoi a échoué. Écrivez directement à <a href="mailto:zhg.luc2909@gmail.com">zhg.luc2909@gmail.com</a>.';
      }).then(function(){
        if(libelle) libelle.textContent = 'Envoyer le message';
        if(bouton) bouton.disabled = false;
      });
    });
  }
})();
