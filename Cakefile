{exec} = require "child_process"

printOut = (error, output) ->
  throw error if error
  process.stdout.write output

outputFile = "public/bees.js"

task "watch", ->
  watch = exec "coffee -j #{outputFile} -cw src/"
  watch.stdout.on "data", (data) -> process.stdout.write data

task "build", ->
  exec "coffee -j #{outputFile} -c src/", printOut
