
    // scroll module
    // -----------------
    // Thanks to :
    // lib.scroll module: http://gitlab.alibaba-inc.com/mtb/lib-scroll/blob/master/src/scroll.js
    // lib.motion module: http://gitlab.alibaba-inc.com/mtb/lib-motion/blob/master/src/motion.js

    require('./gesture');

    var doc = window.document;
    var docEl = doc.documentElement;
    var prevented = false;
    var scrollObjs = {};
    var motion = function(config) {
        return new Motion(config);
    }

    // motion helper
    function Motion(config){

        this.v = config.v || 0;
        this.a = config.a || 0;
        
        if(typeof config.t !== 'undefined') {
            this.t = config.t;
        }

        if(typeof config.s !== 'undefined') {
            this.s = config.s;
        }

        if (typeof this.t === 'undefined') {
            if (typeof this.s === 'undefined') {
                this.t = - this.v / this.a;
            } else {
                var t1 = (Math.sqrt(this.v * this.v + 2 * this.a * this.s) - this.v) / this.a;
                var t2 = (-Math.sqrt(this.v * this.v + 2 * this.a * this.s) - this.v) / this.a;
                this.t = Math.min(t1, t2);
            }
        }

        if (typeof this.s === 'undefined') {
            this.s = this.a * this.t * this.t / 2 + this.v * this.t;
        }
        
        this.generateCubicBezier = function() {
            function quadratic2cubicBezier(a, b) {
                return [[(a / 3 + (a + b) / 3 - a) / (b - a), (a * a / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)],
                    [(b / 3 + (a + b) / 3 - a) / (b - a), (b * b / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)]];
            }
            return quadratic2cubicBezier( this.v / this.a , this.t + this.v / this.a );
        }
        
    }

    function getMinScrollTop(scrollObj) {
        return 0 - (scrollObj.options.paddingTop || 0);
    }

    function getMaxScrollTop(scrollObj) {
        var rect = scrollObj.element.getBoundingClientRect();
        var pRect = scrollObj.element.parentNode.getBoundingClientRect();
        var minTop = getMinScrollTop(scrollObj);
        var maxTop = 0 - rect.height + pRect.height;
        return Math.min(maxTop + (scrollObj.options.paddingBottom || 0), minTop);
    }

    function getBoundaryOffset(scrollObj, y) {
        if(y > scrollObj.minScrollTop) {
            return y - scrollObj.minScrollTop;
        } else if (y < scrollObj.maxScrollTop){
            return y - scrollObj.maxScrollTop;
        }
    }

    function touchBoundary(scrollObj, y) {
        if (y > scrollObj.minScrollTop) {
            y = scrollObj.minScrollTop;
        } else if (y < scrollObj.maxScrollTop) {
            y = scrollObj.maxScrollTop;
        }
        return y;
    }

    function fireEvent(scrollObj, eventName, extra) {
        var event = doc.createEvent('HTMLEvents');
        event.initEvent(eventName, false, true);
        event.scrollObj = scrollObj;
        if (extra) {
            for (var key in extra) {
                event[key] = extra[key];
            }
        }
        scrollObj.element.dispatchEvent(event);
    }

    function getTransformOffset(scrollObj) {
        var offset = {x: 0, y: 0}; 
        var transform = getComputedStyle(scrollObj.element).webkitTransform;
        var matched;

        if (transform !== 'none') {
            if ((matched = transform.match(/^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+), [-\d.]+, \d+\)/) ||
                    transform.match(/^matrix\(\d+, \d+, \d+, \d+, ([-\d.]+), ([-\d.]+)\)$/))) {
                offset.x = parseInt(matched[1]) || 0;
                offset.y = parseInt(matched[2]) || 0;
            }
        }

        return offset;
    }

    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();
    function getTranslate(x, y) {
        if (has3d) {
            return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
        } else {
            return 'translate(' + x + 'px, ' + y + 'px)';
        }
    }

    function Scroll(element, options){
        var that = this;

        options = options || {};
        if (!options.canMove) {
            document.addEventListener('touchmove', function(e) {
                e.preventDefault();
                return false;
            }, false);
        }
        if (options.padding) {
            options.paddingTop = options.padding.top || 0;
            options.paddingBottom = options.padding.bottom || 0;
        }
        options.isBounce = !!options.isBounce;
        if (options.bounceOffset) {
            options.isBounce = true;
            options.paddingTop = options.bounceOffset.top || 0;
            options.paddingBottom = options.bounceOffset.bottom || 0;
            delete options.bounceOffset;
        }
        if (!options.isBounce) {
            options.paddingTop = -options.paddingTop;
            options.paddingBottom = -options.paddingBottom;
        }

        this.options = options;
        this.element = element;
        this.viewport = element.parentNode;
        this.viewport.addEventListener('touchstart', touchstartHandler, false);
        this.viewport.addEventListener('touchend', touchendHandler, false);
        this.viewport.addEventListener('touchcancel', touchendHandler, false);
        this.viewport.addEventListener('panstart', panstartHandler, false);
        this.viewport.addEventListener('pan', panHandler, false);
        this.viewport.addEventListener('panend', panendHandler, false);
        this.viewport.addEventListener('flick', flickHandler, false);
        this.viewport.scrollId = setTimeout(function(){
            scrollObjs[that.viewport.scrollId + ''] = that;
        }, 0);


        var webkitTransitionEndHandler;
        element.addEventListener('webkitTransitionEnd', function(e) {
            if (webkitTransitionEndHandler) {
                var handler = webkitTransitionEndHandler;
                webkitTransitionEndHandler = null;
                handler(e); 
            }
        }, false);

        var webkitAnimationEndHandler;
        element.addEventListener('webkitAnimationEnd', function(e) {
            if (webkitAnimationEndHandler) {
                var handler = webkitAnimationEndHandler;
                webkitAnimationEndHandler = null;
                handler(e);
            }
        }, false);

        function touchstartHandler(e) {
            if (!that.enabled) {
                return;
            }

            element.style.webkitBackfaceVisibility = 'hidden';
            element.style.webkitTransformStyle = 'preserve-3d';
            element.style.webkitTransform = getComputedStyle(element).webkitTransform;
            element.style.webkitTransition = '';
            element.style.webkitAnimation = '';
            webkitTransitionEndHandler = null;
            webkitAnimationEndHandler = null;
        }

        function touchendHandler(e) {
            if (!that.enabled) {
                return;
            }

            var s0 = getTransformOffset(that).y;
            var boundaryffset = getBoundaryOffset(that, s0);
            var isBounce = that.options.isBounce;
            var top = that.options.paddingTop;
            var bottom = that.options.paddingBottom;
            if(element.style.webkitTransition === '' && element.style.webkitAnimation === '' && boundaryffset) {
                var s1;
                var endHandler;
                if (isBounce && boundaryffset > 0 && top && boundaryffset > top / 2) {
                    s1 = that.minScrollTop + top;
                    webkitTransitionEndHandler = function() {
                        fireEvent(that, 'pulldownend');
                    }
                } else if (isBounce && boundaryffset < 0 && bottom && Math.abs(boundaryffset) > bottom / 2) {
                    s1 = that.maxScrollTop - bottom;
                    webkitTransitionEndHandler = function() {
                        fireEvent(that, 'pullupend');
                    }
                } else {
                    s1 = touchBoundary(that, s0);
                    webkitTransitionEndHandler = scrollEnd;
                }
                element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                element.style.webkitTransform = 'translateY(' + s1.toFixed(0) + 'px)';
            } else {
                scrollEnd();
            }
        }

        function panstartHandler(e) {
            if (!that.enabled) {
                return;
            }

            e.stopPropagation();
            that.transformOffset = getTransformOffset(that);
            that.minScrollTop = getMinScrollTop(that);
            that.maxScrollTop = getMaxScrollTop(that);
            that.panFixRatio = 2.5;
            that.cancelScrollEnd = false;
            fireEvent(that, 'scrollstart');
        }

        function panHandler(e) {
            if (!that.enabled) {
                return;
            }

            e.stopPropagation();
            var y = that.transformOffset.y + e.displacementY;

            if(y > that.minScrollTop) {
                y = that.minScrollTop + (y - that.minScrollTop) / that.panFixRatio;
                that.panFixRatio *= 1.003;
            } else if(y < that.maxScrollTop) {
                y = that.maxScrollTop - (that.maxScrollTop - y) / that.panFixRatio;
                that.panFixRatio *= 1.003;
            }
            if (that.panFixRatio > 4) {
                that.panFixRatio = 4;
            }

            var boundaryOffset = getBoundaryOffset(that, y);
            if (boundaryOffset) {
                fireEvent(that, boundaryOffset > 0?'pulldown':'pullup', {
                    boundaryOffset: Math.abs(boundaryOffset)
                });
            }

            element.style.webkitAnimation = '';
            element.style.webkitTransition = '';
            element.style.webkitTransform = getTranslate(that.transformOffset.x, y);
        }

        function panendHandler(e) {
            if (!that.enabled) {
                return;
            }

            e.stopPropagation();
        }

        function flickHandler(e) {
            if (!that.enabled) {
                return;
            }
            e.stopPropagation();
            that.cancelScrollEnd = true;
        
            var v0, a0, t0, s0, s, motion0;
            var v1, a1, t1, s1, motion1,sign;
            var v2, a2, t2, s2, motion2, ft;
            
            s0 = getTransformOffset(that).y;
            var boundaryOffset0 = getBoundaryOffset(that, s0);
            if(!boundaryOffset0) {
                //手指离开屏幕时，已经超出滚动范围
                //不作处理，让touchend handler处理
                //手指离开屏幕时，在滚动范围内，做一下惯性计算
                v0 = e.velocityY;
                if (v0 > 2) { 
                    v0 = 2;
                }
                if (v0 < -2) {
                    v0 = -2;
                }
                a0 = 0.0015 * ( v0 / Math.abs(v0));
                motion0 = motion({
                    v: v0,
                    a: -a0
                });
                t0 = motion0.t;
                s = s0 + motion0.s;

                var boundaryOffset1 = getBoundaryOffset(that, s);
                if (boundaryOffset1) {
                    //惯性运动足够滑出屏幕边缘
                    v1 = v0;
                    a1 = a0;
                    if(boundaryOffset1 > 0) {
                        s1 = that.minScrollTop;
                        sign = 1;
                    } else {
                        s1 = that.maxScrollTop;
                        sign = -1;
                    }
                    motion1 = motion({
                        v: sign * v1, 
                        a: - sign * a1, 
                        s: Math.abs(s1 - s0)
                    });
                    t1 = motion1.t;

                    v2 = v1 - a1 * t1;
                    a2 = 0.01 * (v2 / Math.abs(v2));
                    motion2 = motion({
                        v: v2,
                        a: -a2
                    });
                    t2 = motion2.t;
                    s2 = s1 + motion2.s;

                    element.style.webkitTransition = '-webkit-transform ' + ((t1 + t2) / 1000).toFixed(2) + 's ease-out 0';                
                    element.style.webkitTransform = 'translateY(' + s2.toFixed(0) + 'px)';
                    webkitTransitionEndHandler = function(e) {
                        element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                        element.style.webkitTransform = 'translateY(' + s1.toFixed(0) + 'px)';
                        webkitTransitionEndHandler = scrollEnd;
                    }
                } else {
                    var timeFunction = motion0.generateCubicBezier();

                    element.style.webkitTransition = '-webkit-transform ' + (t0 / 1000).toFixed(2) + 's cubic-bezier(' + timeFunction + ') 0';
                    element.style.webkitTransform = 'translateY(' + s.toFixed(0) + 'px)';
                    webkitTransitionEndHandler = scrollEnd;
                }

            }
        }

        function scrollEnd(e) {
            if (!that.enabled) {
                return;
            }
            e && e.stopPropagation();
            that.cancelScrollEnd = false;

            setTimeout(function() {
                if (!that.cancelScrollEnd) {
                    // element.style.webkitBackfaceVisibility = '';
                    // element.style.webkitTransformStyle = '';
                    element.style.webkitTransition = '';
                    element.style.webkitAnimation = '';
                    fireEvent(that, 'scrollend');
                }
            }, 10);
        }
    }

    var proto = {
        init: function() {
            this.enable();
            this.refresh();
            this.scrollTo(0);

            return this;
        },

        enable: function() {
            this.enabled = true;
            return this;
            // if (!prevented) {
            //     prevented = true;
            //     doc.addEventListener('touchmove', function(e) {
            //         e.preventDefault();
            //         return false;
            //     }, false);
            // }
        },

        disable: function() {
            var el = this.element;
            this.enabled = false;

            setTimeout(function() {
                el.style.webkitTransform = getComputedStyle(el).webkitTransform;
                el.style.webkitAnimation = '';
            }, 50);

            return this;
        },

        getScrollHeight: function() {
            return this.element.getBoundingClientRect().height - (this.options.paddingTop||0) - (this.options.paddingBottom||0);
        },

        getScrollTop: function() {
            return -getTransformOffset(this).y - (this.options.paddingTop || 0);
        },

        refresh: function() {
            var el = this.element;

            //el.style.height = 'auto';
            //el.style.height = el.offsetHeight + 'px';

            this.transformOffset = getTransformOffset(this);
            this.minScrollTop = getMinScrollTop(this);
            this.maxScrollTop = getMaxScrollTop(this);
            this.scrollTo(-this.transformOffset.y - (this.options.paddingTop || 0));

            return this;
        },

        offset: function(childEl) {
            var elRect = this.element.getBoundingClientRect();
            var childRect = childEl.getBoundingClientRect();
            var offsetRect = {
                    top: childRect.top - ((this.options.paddingTop || 0) + elRect.top),
                    left: childRect.left - elRect.left,
                    right: elRect.right - childRect.right,
                    width: childRect.width,
                    height: childRect.height
                };

            offsetRect.bottom = offsetRect.top + childRect.height;
            return offsetRect;
        },

        scrollTo: function(y, isSmooth) {
            var x = getTransformOffset(this).x;
            var element = this.element;

            y = -y - (this.options.paddingTop || 0);
            y = touchBoundary(this, y);

            if (isSmooth === true) {
                element.style.webkitTransition = '-webkit-transform 0.4s ease 0';
                webkitTransitionEndHandler = function(){
                    element.style.webkitTransition = '';
                    element.style.webkitAnimation = '';
                }
            } else {
                element.style.webkitTransition = '';
                element.style.webkitAnimation = '';
            }
            element.style.webkitTransform = getTranslate(x, y);

            return this;
        },

        scrollToElement: function(childEl, isSmooth) {
            var offset = this.offset(childEl);
            return this.scrollTo(offset.top, isSmooth);
        },

        getViewHeight: function(el) {
            return this.viewport.getBoundingClientRect().height;
        }
    }

    for (var k in proto) {
        Scroll.prototype[k] = proto[k];
    }

    module.exports = Scroll;

    // module.exports = function(el, options) {
    //     if (!el.parentNode) {
    //         throw new Error('wrong dom tree');
    //     }

    //     var scroll;
    //     if (el.parentNode.scrollId) {
    //         scroll = scrollObjs[el.parentNode.scrollId];
    //     } else {
    //         scroll = new Scroll(el, options);
    //     }
    //     return scroll;
    // }

