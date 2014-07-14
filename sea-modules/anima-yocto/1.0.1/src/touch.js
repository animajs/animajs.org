define(function(require, exports, module){
var $ = Yocto = require('./core')
utils = {};

utils.PCevts = {
    'touchstart': 'mousedown',
    'touchmove': 'mousemove',
    'touchend': 'mouseup',
    'touchcancel': 'mouseout'
};

utils.hasTouch = ('ontouchstart' in window);

utils.getPCevts = function(evt) {
    return this.PCevts[evt] || evt;
};

utils.getPosOfEvent = function(ev) {
    if (this.hasTouch) {
        var posi = [];
        var src = null;

        for (var t = 0, len = ev.touches.length; t < len; t++) {
            src = ev.touches[t];
            posi.push({
                x: src.pageX,
                y: src.pageY
            });
        }
        return posi;
    } else {
        return [{
            x: ev.pageX,
            y: ev.pageY
        }];
    }
};

utils.getDistance = function(pos1, pos2) {
    var x = pos2.x - pos1.x,
        y = pos2.y - pos1.y;
    return Math.sqrt((x * x) + (y * y));
};

utils.getFingers = function(ev) {
    return ev.touches ? ev.touches.length : 1;
};

// 璁＄畻pinch姣斾緥
utils.calScale = function(pstart, pmove) {
    if (pstart.length >= 2 && pmove.length >= 2) {
        var disStart = this.getDistance(pstart[1], pstart[0]);
        var disEnd = this.getDistance(pmove[1], pmove[0]);

        return disEnd / disStart;
    }
    return 1;
};

// 璁＄畻瑙掑害锛岀敤鏉ヨ瘑鍒玸wipe鏂瑰悜
utils.getAngle = function(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
};

// 璁＄畻瑙掑害锛岀敤鏉ヨ瘑鍒玶otate瑙掑害
utils.getAngle180 = function(p1, p2) {
    var agl = Math.atan((p2.y - p1.y) * -1 / (p2.x - p1.x)) * (180 / Math.PI);
    return (agl < 0 ? (agl + 180) : agl);
};

utils.getDirectionFromAngle = function(agl) {
    var directions = {
        up: agl < -45 && agl > -135,
        down: agl >= 45 && agl < 135,
        left: agl >= 135 || agl <= -135,
        right: agl >= -45 && agl <= 45
    };
    for (var key in directions) {
        if (directions[key]) return key;
    }
    return null;
};

utils.getXYByElement = function(el) {
    var left = 0,
        top = 0;

    while (el.offsetParent) {
        left += el.offsetLeft;
        top += el.offsetTop;
        el = el.offsetParent;
    }
    return {
        left: left,
        top: top
    };
};

utils.reset = function() {
    inst.startEvent = inst.moveEvent = inst.endEvent = null;
    inst.__tapped = inst.__touchStart = inst.startSwiping = inst.startPinch = false;
    inst.startDrag = false;
    inst.pos = {};
};

utils.isTouchMove = function(ev) {
    return (ev.type === 'touchmove' || ev.type === 'mousemove');
};

utils.isTouchEnd = function(ev) {
    return (ev.type === 'touchend' || ev.type === 'mouseup' || ev.type === 'touchcancel');
};

utils.getAngleDiff = function(currentPos, inst) {
    var diff = parseInt(inst.__initial_angle - utils.getAngle180(currentPos[0], currentPos[1]), 10);
    var count = 0;

    while (Math.abs(diff - inst.__rotation) > 90 && count++ < 50) {
        if (_inst._rotation < 0) {
            diff -= 180;
        } else {
            diff += 180;
        }
    }
    inst.__rotation = parseInt(diff, 10);
    return inst.__rotation;
};

utils.triggerEvent = function(el, evt, detail) {

    detail = detail || {};
    var e, opt = {
            bubbles: true,
            cancelable: true,
            detail: detail
        };

    try {
        if (typeof CustomEvent !== 'undefined') {
            e = new CustomEvent(evt, opt);
            if (el) {
                el.dispatchEvent(e);
            }
        } else {
            e = document.createEvent("CustomEvent");
            e.initCustomEvent(evt, true, true, detail);
            if (el) {
                el.dispatchEvent(e);
            }
        }
    } catch (ex) {
        console.warn("Touch.js is not supported by environment.");
    }
};

var smrEventList = {
    TOUCH_START: 'touchstart',
    TOUCH_MOVE: 'touchmove',
    TOUCH_END: 'touchend',
    TOUCH_CANCEL: 'touchcancel',
    MOUSE_DOWN: 'mousedown',
    MOUSE_MOVE: 'mousemove',
    MOUSE_UP: 'mouseup',
    CLICK: 'click',
    PINCH_START: 'pinchstart',
    PINCH_END: 'pinchend',
    PINCH: 'pinch',
    PINCH_IN: 'pinchin',
    PINCH_OUT: 'pinchout',
    ROTATE_START: 'rotatstart',
    ROTATE_END: 'rotateend',
    ROTATE: 'rotate',
    SWIPE_START: 'swipestart',
    SWIPING: 'swiping',
    SWIPE_END: 'swipeend',
    SWIPE_LEFT: 'swipeleft',
    SWIPE_RIGHT: 'swiperight',
    SWIPE_UP: 'swipeup',
    SWIPE_DOWN: 'swipedown',
    SWIPE: 'swipe',
    DRAG: 'drag',
    DRAGSTART: 'dragstart',
    DRAGEND: 'dragend',
    LONGT_TAP: 'longTap',
    TAP: 'tap',
    DOUBLE_TAP: 'doubleTap'
};

// 杩囩▼鍙傛暟
var inst = {
    pos: {
        start: null,
        move: null,
        end: null
    },
    startTime: 0,
    fingers: 0,
    startEvent: null,
    moveEvent: null,
    endEvent: null,
    startSwiping: false,
    startPinch: false,
    startDrag: false,
    __offset: {},
    __touchStart: false,
    __holdTimer: false,
    __tapped: false,
    __lastTapEndTime: null,
    __tapTimer: null,
    __scale_last_rate: 1,
    __initial_angle: 0,
    __rotation: 0,
    __prev_tapped_end_time: 0,
    __prev_tapped_pos: null
};

var handlerOriginEvent = function(ev) {

    var el = ev.target;
    switch (ev.type) {
        case 'touchstart':
        case 'mousedown':
            inst.__touchStart = true;
            if (!inst.pos.start || inst.pos.start.length < 2) {
                inst.pos.start = utils.getPosOfEvent(ev);
            }
            if (utils.getFingers(ev) >= 2) {
                inst.__initial_angle = parseInt(utils.getAngle180(pos.start[0], pos.start[1]), 10);
            }

            inst.startTime = Date.now();
            inst.startEvent = ev;
            inst.__offset = {};

            var box = el.getBoundingClientRect();
            var docEl = document.documentElement;
            inst.__offset = {
                top: box.top + (window.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0),
                left: box.left + (window.pageXOffset || docEl.scrollLeft) - (docEl.clientLeft || 0)
            };

            $.gestures.longTap && $.gestures.longTap(ev, utils, inst, smrEventList);
            break;
        case 'touchmove':
        case 'mousemove':
            if (!inst.__touchStart || !inst.pos.start) return;
            inst.pos.move = utils.getPosOfEvent(ev);
            if (utils.getFingers(ev) >= 2) {
                $.gestures.transform && $.gestures.transform(ev, utils, inst, smrEventList);
            } else {
                $.gestures.swipe && $.gestures.swipe(ev, utils, inst, smrEventList);
            }
            break;
        case 'touchend':
        case 'touchcancel':
        case 'mouseup':
        case 'mouseout':
            if (!inst.__touchStart) return;
            inst.endEvent = ev;

            if (inst.startPinch || inst.startRotate) {
                $.gestures.transform && $.gestures.transform(ev, utils, inst, smrEventList);
            } else if (inst.startSwiping) {
                $.gestures.swipe && $.gestures.swipe(ev, utils, inst, smrEventList);
            } else {
                $.gestures.tap && $.gestures.tap(ev, utils, inst, smrEventList);
            }

            utils.reset();
            inst.__initial_angle = 0;
            inst.__rotation = 0;
            if (ev.touches && ev.touches.length === 1) {
                inst.__touchStart = true;
            }
            break;
    }
};

(function() {
    var mouseEvents = 'mouseup mousedown mousemove mouseout',
        touchEvents = 'touchstart touchmove touchend touchcancel';

    var bindingEvents = utils.hasTouch ? touchEvents : mouseEvents;

    bindingEvents.split(" ").forEach(function(evt) {
        document.addEventListener(evt, handlerOriginEvent, false);
    });
})();

(function($) {
    $.gestures = {
        config: {
            tapMaxDistance: 10,
            tapTime: 0,
            holdTime: 650,
            maxDoubleTapInterval: 300
        },
        tap: function(ev, utils, inst, smrEventList) {
            var config = $.gestures.config;
            var el = ev.target;
            var now = Date.now();
            var touchTime = now - inst.startTime;
            var distance = utils.getDistance(inst.pos.start[0], inst.pos.move ? inst.pos.move[0] : inst.pos.start[0]);

            clearTimeout(inst.__holdTimer);

            if (config.tapMaxDistance < distance) return;

            if (config.holdTime > touchTime && utils.getFingers(ev) <= 1) {
                inst.__tapped = true;
                inst.__prev_tapped_end_time = now;
                inst.__prev_tapped_pos = inst.pos.start[0];
                inst.__tapTimer = setTimeout(function() {
                        utils.triggerEvent(el, smrEventList.TAP, {
                            type: smrEventList.TAP,
                            originEvent: ev,
                            fingersCount: utils.getFingers(ev),
                            position: inst.__prev_tapped_pos
                        });
                    },
                    config.tapTime);
            }
        },
        longTap: function(ev, utils, inst, smrEventList) {
            var el = ev.target;
            var config = $.gestures.config;

            clearTimeout(inst.__holdTimer);

            inst.__holdTimer = setTimeout(function() {
                    if (!inst.pos.start) return;
                    var distance = utils.getDistance(inst.pos.start[0], inst.pos.move ? inst.pos.move[0] : inst.pos.start[0]);
                    if (config.tapMaxDistance < distance) return;

                    if (!inst.__tapped) {
                        utils.triggerEvent(el, "longTap", {
                            type: 'longTap',
                            originEvent: ev,
                            fingersCount: utils.getFingers(ev),
                            position: inst.pos.start[0]
                        });
                    }
                },
                config.holdTime);
        }
    };

    ['tap', 'longTap', 'doubletap'].forEach(function(eventName) {
        $.fn[eventName] = function(callback) {
            return this.on(eventName, callback)
        }
    });
})(Yocto)
});
