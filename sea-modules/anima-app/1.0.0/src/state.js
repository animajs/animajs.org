
  function StateStack() {
    var that = this;

    that.move = null;
    that.transition = null;
    that.datas = null;

    that._states = [];
    that._stateIdx = 0;
    that._stateLimit = 100;
  }

  var StateStackProto = {
    reset: function() {
      var that = this;

      that.move = null;
      that.transition = null;
      that.datas = null;
      that.type = null;

      that._states = [];
      that._stateIdx = 0;
      that._stateLimit = 100;
    },

    pushState: function(name, fragment, params, args) {
      var that = this,
        states = that._states,
        stateIdx = that._stateIdx,
        stateLimit = that._stateLimit,
        stateLen = states.length,
        move = that.move,
        transition = that.transition,
        datas = that.datas,
        type = that.type,

        prev = states[stateIdx - 1],
        next = states[stateIdx + 1],
        cur = {
          name : name,
          fragment : fragment,
          type: type,
          params : params || {},
          datas : datas || {}
        }
        ;


      for (var p in args) {
        cur.datas[p] = args[p];
      }

      if (move == null) {
        if (!datas && StateStack.isEquals(prev, cur)) {
          transition = move = 'backward';
        } else {
          transition = move = 'forward';
        }
      }

      if (move === 'backward') {
        if (stateIdx === 0 && stateLen > 0) {
          states.unshift(cur);
        } else if (stateIdx > 0) {
          stateIdx--;
          cur = prev;
        }
      } else if (move === 'forward') {
        if (stateIdx === stateLimit - 1) {
          states.shift();
          states.push(cur);
          cur.referer = location.href.replace(/#[^#]*/, '#' + states[stateIdx - 1].fragment);
        } else if (stateIdx === 0 && stateLen === 0) {
          states.push(cur);
          cur.referer = document.referer || '';
        } else if (!datas && StateStack.isEquals(next, cur)){
          stateIdx++;
          cur = next;
        } else if (StateStack.isEquals(states[stateIdx], cur)){
          cur = states[stateIdx];
        } else {
          stateIdx++;
          states.splice(stateIdx);
          states.push(cur);
          cur.referer = location.href.replace(/#[^#]*/, '#' + states[stateIdx - 1].fragment);
        }
      } else if (move === 'replace') {
        cur.referer = location.href.replace(/#[^#]*/, '#' + states[stateIdx].fragment);
        states[stateIdx] = cur;
      }

      cur.move = move;
      cur.transition = transition;
      cur.index = stateIdx;

      that.move = null;
      that.transition = null;
      that.datas = null;
      that._stateIdx = stateIdx;

      return cur;
    },

    getState: function() {
      return this._states[this._stateIdx];
    },

    getIndex: function() {
      return this._stateIdx;
    }
  }

  for (var p in StateStackProto) {
    StateStack.prototype[p] = StateStackProto[p];
  }

  StateStack.isEquals = function(state1, state2) {
    if (!state1 || !state2) return false;

    if (state1.name !== state2.name ||
        state1.fragment !== state2.fragment)
      return false;

    return true;
  }
