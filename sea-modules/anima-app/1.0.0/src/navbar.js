  function Navbar(wrapEl, options) {
    this.options = options;
    this.wrapEl = wrapEl;
    this.wrapEl.appendChild(this.animWrapEl = doc.createElement('div'));
    this.animWrapEl.className = options.cls;
    this.animWrapEl.innerHTML = _.substitute(options.tpl.title, {title : ""});
    this.wrapEl.style.height = this.animWrapEl.offsetHeight + "px";
    this.animWrapEl.style.cssText = "position: absolute; width: 100%; top: 0; z-index: 99;";
  }

  _.extend(Navbar.prototype, {
    setTitle: function(title) {
      if (typeof title === 'string') {
        this.animWrapEl.innerHTML = _.substitute(this.options.tpl.title, {title : title});
      }
    },

    setButton: function(options) {
      var btn = $(_.substitute(this.options.tpl[(( options.type == "back" || options.type == "left") ? "btnLeft" : "btnRight")], options.text))[0];
      this.animWrapEl.appendChild(btn);

      (options.id != null) && btn.setAttribute('data-id', options.id);
      (options['class'] != null) && (btn.className = options['class']);
      (options.text != null) && (btn.innerHTML = options.text);
      (options.bg != null) && (btn.style.background = options.bg);
      (options.icon != null) && (btn.innerHTML = '<img src="' + options.icon + '" border="0" width="100%" height="100%" />');
      (options.hide === true) ? (btn.style.display = 'none'):(btn.style.display = '');
      options.onChange && options.onChange.call(btn, options);
      if (options.handler) {
        btn.handler && btn.removeEventListener('click', btn.handler, false);
        btn.addEventListener('click', (btn.handler = options.handler), false);
      }

    },

    switchNavbar: function(title, transition, buttons){
      var that = this;
      var oldHeader = this.animWrapEl;
      this.removeButton();
      this.wrapEl.appendChild(this.animWrapEl = doc.createElement('div'));
      this.animWrapEl.className = this.options.cls;
      this.animWrapEl.innerHTML = _.substitute(this.options.tpl.title, {title : title});
      this.wrapEl.style.height = this.animWrapEl.offsetHeight + "px";
      this.animWrapEl.style.cssText = "position: absolute; width: 100%; top: 0; z-index: 99;";



      var offsetWidth = oldHeader.getBoundingClientRect().width
      this.animWrapEl.style.zIndex = '999';
      this.animWrapEl.style[( transition == "backward" ? "right" : "left")] = offsetWidth + 'px';

      $(this.animWrapEl).trigger($.fx.animationEnd).off($.fx.animationEnd).animate({
        translateX: ( transition == "backward" ? "100%" : "-100%")
      }, app.transTimes, 'ease-in-out', function(){
        oldHeader.parentNode.removeChild(oldHeader);
        that.animWrapEl.style.cssText = "position: absolute; width: 100%; top: 0; z-index: 99;";
      })

      for (var i = 0; i < buttons.length; i++) {
        this.setButton(buttons[i]);
      }

    },
    resetNavbar: function(){
      this.removeButton();
      this.animWrapEl.innerHTML = "";
    },
    getButton: function(id) {
      return this.wrapEl.querySelector('a[data-id="' + id + '"]');
    },

    removeButton: function(id) {
      function remove(btn) {
        if (btn) {
          btn.handler && btn.removeEventListener('click', btn.handler);
          btn.parentNode.removeChild(btn);
        }
      }

      if (!id) {
        var btns = this.wrapEl.querySelectorAll('a');
        for (var i = 0; i < btns.length; i++) {
          remove(btns[i]);
        }
      } else {
        if (typeof id === 'string') {
          var btn = this.getButton(id);
        } else if (id instanceof HTMLElement) {
          var btn = id;
        }
        remove(btn);
      }
    }
  })
