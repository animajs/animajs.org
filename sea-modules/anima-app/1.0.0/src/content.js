  var Content = function(el, options){
    this._wrapEl = el;
    this._cacheLength = Math.max(options.cacheLength, 1);
    this._cacheIndex = 0;

    var html = '';
    for (var i = 0; i < this._cacheLength; i++) {
      html += '<section class="inactive" index="' + i + '"></section>';
    }
    this._wrapEl.innerHTML = '<div class="wrap">' + html + '</div><div class="trans"><div></div></div>';
    this.contentEl = this._wrapEl.childNodes[0];
    this.transEl = this._wrapEl.childNodes[1];
    this.transShadeEl = this.transEl.childNodes[0];
    this.setClassName();
    app.scroll = new Scroll(this.contentEl).init();
  }

  var ContentProto = {

    switchTransition: function(x, callback){
      var _self = this;
      var offsetWidth = _self.contentEl.getBoundingClientRect().width;
      _self.transEl.style.display = 'block';
      _self.transShadeEl.style[( x == "backward" ? "right" : "left")] = offsetWidth + 'px';
      $(_self.transShadeEl).animate({
        translateX: ( x == "backward" ? "100%" : "-100%")
      }, app.transTimes, 'ease-in-out', function(){
        _self.transEl.style.cssText = " ";
        _self.transShadeEl.style.cssText = " ";
        callback && callback()
      })
    },
    switchTransitionIos: function(oldel, el, x, callback){
      var _self = this;
      var offsetWidth = _self.contentEl.getBoundingClientRect().width;
      el.style.cssText = "display: block;position: absolute; width: 100%; top: 0; bottom:0; z-index: 99;-webkit-transform: translateX(" + ( x == "backward" ? "-320px" : "320px") + "); -webkit-backface-visibility: hidden; -webkit-transform-style: preserve-3d;"
      $(oldel).animate({
        translateX: ( x == "backward" ? "100px" : "-100px")
      }, app.transTimes, 'ease-in-out', function(){
        oldel.style.cssText = " ";
        callback && callback()
      })
      $(el).animate({
        translateX: "0px"
      }, app.transTimes, 'ease-in-out', function(){
        el.style.cssText = " ";
        // callback && callback()
      })
    },

    setClassName: function() {
      this.getActive().className = 'active';
      if (this._cacheLength > 2) {
        this.getPrevious().className = 'inactive prev';
        this.getNext().className = 'inactive next';
      } else if (this._cacheLength > 1){
        this.getPrevious().className = 'inactive';
      }
    },

    getActive : function() {
      var index = this._cacheIndex;
      return this.contentEl.childNodes[index];
    },

    getNext: function() {
      var index = (this._cacheIndex + 1) % this._cacheLength;
      return this.contentEl.childNodes[index];
    },

    getPrevious: function() {
      var index = (this._cacheIndex - 1 + this._cacheLength) % this._cacheLength;
      return this.contentEl.childNodes[index];
    },

    next: function() {
      if (this._cacheLength > 2) {
        this.getPrevious().className = 'inactive';
      }
      this._cacheIndex = (this._cacheIndex + 1) % this._cacheLength;
    },

    previous: function() {
      if (this._cacheLength > 2) {
        this.getNext().className = 'inactive';
      }
      this._cacheIndex = (this._cacheIndex - 1 + this._cacheLength) % this._cacheLength;
    },

    html: function(html) {
      this.getActive().innerHTML = html;
    }
  }


  for (var p in ContentProto) {
    Content.prototype[p] = ContentProto[p];
  }

