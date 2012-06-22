do ->
  time = 0

  for vendor in ["ms", "moz", "webkit", "o"] when not window.requestAnimationFrame
    window.requestAnimationFrame = window[ vendor + "RequestAnimationFrame"]
    window.cancelRequestAnimationFrame = window[ vendor + "CancelRequestAnimationFrame"]

  if not window.requestAnimationFrame
    window.requestAnimationFrame = (callback, element) ->
      now = new Date().getTime()
      delta = Math.max 0, 16 - (now - old)
      setTimeout (-> callback(time + delta)), delta
      old = now + delta

  if not window.cancelAnimationFrame
    window.cancelAnimationFrame = (id) -> clearTimeout id

class Simulation
  constructor: ->
    @mouseX = @mouseY = 0

    @canvas  = document.getElementById("bees")
    @ctx = @canvas.getContext("2d")

    do @resize
    do @attachEvents
    do @createBees

  createBees: ->
    random = (max) -> Math.floor(Math.random() * max)

    @bees = for number in [0..80]
      new Bee random(@canvas.width), random(@canvas.height)

  attachEvents: ->
    $(@canvas).on  "mousemove", @updateMousePosition
    $(@canvas).on  "mousedown", => @mousePressed = true
    $(@canvas).on  "mouseup",   => @mousePressed = false
    $(window).on   "resize",    @resize

  start: -> do @loop

  loop: =>
    requestAnimationFrame @loop

    do @clearFrame

    mousePosition = new Vector(@mouseX, @mouseY)

    for bee in @bees
      if @mousePressed
        bee.maxspeed = Vector.dist(bee.location, mousePosition) / 10
        do bee.approximate
      else
        bee.maxspeed = 5
        do bee.spread

      bee.applySeparation @bees
      bee.applySeek mousePosition
      do bee.update

      bee.draw @ctx

  clearFrame: ->
    @ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    @ctx.fillRect 0, 0, @canvas.width, @canvas.height

  updateMousePosition: (event) =>
    @mouseX = event.clientX
    @mouseY = event.clientY

  resize: =>
    @canvas.width  = window.innerWidth
    @canvas.height = window.innerHeight

  approximateBees: => do bee.approximate for bee in @bees

window.Simulation = Simulation
