(function() {
  var CanvasExtensions, method, name;

  CanvasExtensions = {
    circle: function(x, y, radius) {
      return this.arc(x, y, radius, 0, Math.PI * 2, true);
    },
    fillCircle: function(x, y, radius) {
      this.circle(x, y, radius);
      return this.fill();
    },
    strokeCircle: function(x, y, diameter) {
      this.circle(x, y, radius);
      return this.stroke();
    },
    ellipse: function(x, y, width, height) {
      var kappa, ox, oy, xe, xm, ye, ym;
      kappa = .5522848;
      ox = (width / 2) * kappa;
      oy = (height / 2) * kappa;
      xe = x + width;
      ye = y + height;
      xm = x + width / 2;
      ym = y + height / 2;
      this.beginPath();
      this.moveTo(x, ym);
      this.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      this.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      this.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      this.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      return this.closePath();
    },
    fillEllipse: function(x, y, width, height) {
      this.ellipse(x, y, width, height);
      return this.fill();
    },
    strokeEllipse: function(x, y, width, height) {
      this.ellipse(x, y, width, height);
      return this.stroke();
    }
  };

  if (typeof CanvasRenderingContext2D !== "undefined" && CanvasRenderingContext2D !== null) {
    for (name in CanvasExtensions) {
      method = CanvasExtensions[name];
      if (!CanvasRenderingContext2D.prototype.hasOwnProperty(name)) {
        CanvasRenderingContext2D.prototype[name] = method;
      }
    }
  }

}).call(this);
