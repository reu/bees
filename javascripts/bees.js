(function() {
  var Bee, Simulation,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Vector.dist = function(v1, v2) {
    var dx, dy, dz;
    dx = v1.x - v2.x;
    dy = v1.y - v2.y;
    dz = v1.z - v2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  Vector.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
  };

  Bee = (function() {

    function Bee(x, y) {
      this.spread = __bind(this.spread, this);
      this.approximate = __bind(this.approximate, this);      this.location = new Vector(x, y);
      this.acceleration = new Vector(0, 0);
      this.velocity = new Vector(0, 0);
      this.radius = 5;
      this.maxspeed = 4;
      this.maxforce = 0.4;
      this.approximation = 5;
    }

    Bee.prototype.approximate = function() {
      if (this.approximation < 4) {
        return this.approximation = 4;
      } else {
        return this.approximation -= 0.6;
      }
    };

    Bee.prototype.spread = function() {
      if (this.approximation > 8) {
        return this.approximation = 8;
      } else {
        return this.approximation += 0.2;
      }
    };

    Bee.prototype.applyForce = function(force) {
      return this.acceleration.add(force);
    };

    Bee.prototype.applySeparation = function(bees) {
      var force;
      force = this.separate(bees);
      force.mult(2);
      return this.applyForce(force);
    };

    Bee.prototype.applySeek = function(target) {
      var force;
      force = this.seek(target);
      return this.applyForce(force);
    };

    Bee.prototype.seek = function(target) {
      var desired, steering;
      desired = Vector.sub(target, this.location);
      desired.normalize();
      desired.mult(this.maxspeed);
      steering = Vector.sub(desired, this.velocity);
      steering.limit(this.maxforce);
      return steering;
    };

    Bee.prototype.separate = function(bees) {
      var bee, count, desired, diff, distance, force, _i, _len;
      desired = this.radius * this.approximation;
      force = new Vector(0, 0);
      count = 0;
      for (_i = 0, _len = bees.length; _i < _len; _i++) {
        bee = bees[_i];
        if (!(bee !== this)) continue;
        distance = Vector.dist(this.location, bee.location);
        if (distance > 0 && distance < desired) {
          diff = Vector.sub(this.location, bee.location);
          diff.normalize();
          diff.div(distance);
          force.add(diff);
          count += 1;
        }
      }
      if (count > 0) {
        force.div(count);
        force.normalize();
        force.mult(this.maxspeed);
        force.sub(this.velocity);
        force.limit(this.maxforce);
      }
      return force;
    };

    Bee.prototype.update = function() {
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxspeed);
      this.location.add(this.velocity);
      return this.acceleration = new Vector(0, 0);
    };

    Bee.prototype.draw = function(ctx) {
      var h, kappa, ox, oy, w, x, xe, xm, y, ye, ym;
      ctx.fillStyle = "#FFE92B";
      ctx.strokeStyle = "#000";
      w = 10;
      h = 6;
      x = this.location.x;
      y = this.location.y;
      kappa = .5522848;
      ox = (w / 2) * kappa;
      oy = (h / 2) * kappa;
      xe = x + w;
      ye = y + h;
      xm = x + w / 2;
      ym = y + h / 2;
      ctx.beginPath();
      ctx.moveTo(x, ym);
      ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      ctx.closePath();
      ctx.stroke();
      return ctx.fill();
    };

    return Bee;

  })();

  (function() {
    var time, vendor, _i, _len, _ref;
    time = 0;
    _ref = ["ms", "moz", "webkit", "o"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      vendor = _ref[_i];
      if (!(!window.requestAnimationFrame)) continue;
      window.requestAnimationFrame = window[vendor + "RequestAnimationFrame"];
      window.cancelRequestAnimationFrame = window[vendor + "CancelRequestAnimationFrame"];
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var delta, now, old;
        now = new Date().getTime();
        delta = Math.max(0, 16 - (now - old));
        setTimeout((function() {
          return callback(time + delta);
        }), delta);
        return old = now + delta;
      };
    }
    if (!window.cancelAnimationFrame) {
      return window.cancelAnimationFrame = function(id) {
        return clearTimeout(id);
      };
    }
  })();

  Simulation = (function() {

    function Simulation() {
      this.approximateBees = __bind(this.approximateBees, this);
      this.resize = __bind(this.resize, this);
      this.updateMousePosition = __bind(this.updateMousePosition, this);
      this.loop = __bind(this.loop, this);      this.mouseX = this.mouseY = 0;
      this.canvas = document.getElementById("bees");
      this.ctx = this.canvas.getContext("2d");
      this.resize();
      this.attachEvents();
      this.createBees();
    }

    Simulation.prototype.createBees = function() {
      var number, random;
      random = function(max) {
        return Math.floor(Math.random() * max);
      };
      return this.bees = (function() {
        var _results;
        _results = [];
        for (number = 0; number <= 80; number++) {
          _results.push(new Bee(random(this.canvas.width), random(this.canvas.height)));
        }
        return _results;
      }).call(this);
    };

    Simulation.prototype.attachEvents = function() {
      var _this = this;
      $(this.canvas).on("mousemove", this.updateMousePosition);
      $(this.canvas).on("mousedown", function() {
        return _this.mousePressed = true;
      });
      $(this.canvas).on("mouseup", function() {
        return _this.mousePressed = false;
      });
      return $(window).on("resize", this.resize);
    };

    Simulation.prototype.start = function() {
      return this.loop();
    };

    Simulation.prototype.loop = function() {
      var bee, mousePosition, _i, _len, _ref, _results;
      requestAnimationFrame(this.loop);
      this.clearFrame();
      mousePosition = new Vector(this.mouseX, this.mouseY);
      _ref = this.bees;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bee = _ref[_i];
        if (this.mousePressed) {
          bee.maxspeed = Vector.dist(bee.location, mousePosition) / 10;
          bee.approximate();
        } else {
          bee.maxspeed = 5;
          bee.spread();
        }
        bee.applySeparation(this.bees);
        bee.applySeek(mousePosition);
        bee.update();
        _results.push(bee.draw(this.ctx));
      }
      return _results;
    };

    Simulation.prototype.clearFrame = function() {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      return this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };

    Simulation.prototype.updateMousePosition = function(event) {
      this.mouseX = event.clientX;
      return this.mouseY = event.clientY;
    };

    Simulation.prototype.resize = function() {
      this.canvas.width = window.innerWidth;
      return this.canvas.height = window.innerHeight;
    };

    Simulation.prototype.approximateBees = function() {
      var bee, _i, _len, _ref, _results;
      _ref = this.bees;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bee = _ref[_i];
        _results.push(bee.approximate());
      }
      return _results;
    };

    return Simulation;

  })();

  window.Simulation = Simulation;

}).call(this);
