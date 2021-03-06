Vector.dist = (v1, v2) ->
  dx = v1.x - v2.x
  dy = v1.y - v2.y
  dz = v1.z - v2.z

  Math.sqrt dx * dx + dy * dy + dz * dz

Vector::toString = -> "(#{@x}, #{@y})"

class Bee
  constructor: (x, y) ->
    @location     = new Vector x, y
    @acceleration = new Vector(0, 0)
    @velocity     = new Vector(0, 0)

    @radius   = 5
    @maxspeed = 4
    @maxforce = 0.4
    @approximation = 5

  approximate: => if @approximation < 4 then @approximation = 4 else @approximation -= 0.6
  spread:      => if @approximation > 8 then @approximation = 8 else @approximation += 0.2

  applyForce: (force) ->
    @acceleration.add force

  applySeparation: (bees) ->
    force = @separate bees
    force.mult(2)
    @applyForce force

  applySeek: (target) ->
    force = @seek target
    @applyForce force

  seek: (target) ->
    desired = Vector.sub target, @location

    desired.normalize()
    desired.mult(@maxspeed)

    steering = Vector.sub desired, @velocity
    steering.limit(@maxforce)

    steering

  separate: (bees) ->
    desired = @radius * @approximation
    force = new Vector 0, 0

    count = 0

    for bee in bees when bee != this
      distance = Vector.dist @location, bee.location

      if distance > 0 and distance < desired
        diff = Vector.sub @location, bee.location
        do diff.normalize
        diff.div distance
        force.add diff

        count += 1

    if count > 0
      force.div count
      do force.normalize
      force.mult @maxspeed
      force.sub @velocity
      force.limit @maxforce

    return force

  update: ->
    @velocity.add @acceleration
    @velocity.limit @maxspeed
    @location.add @velocity
    @acceleration = new Vector(0, 0)

  draw: (ctx) ->
    ctx.fillStyle = "#FFE92B"
    ctx.strokeStyle = "#000"
    ctx.ellipse @location.x, @location.y, 10, 6
    do ctx.stroke
    do ctx.fill
