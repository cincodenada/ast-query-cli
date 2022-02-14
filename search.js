#!/usr/bin/env node
const acorn = require('acorn')
const ASTQ = require('astq')
const fs = require('fs').promises

const astq = new ASTQ()
astq.adapter('mozast')

const selector = astq.compile(process.argv[2], true)
for (let i = 3; i < process.argv.length; i++) {
  const filename = process.argv[i]
  fs.readFile(filename, 'utf8').then(source => {
    try {
      const ast = acorn.parse(source, {allowHashBang: true})
      astq.execute(ast, selector).forEach(node => console.log(`${filename}: ${source.substring(node.start, node.end)}`))
    } catch(error) {
      console.error(`Error parsing ${filename}:`)
      console.error(error)
      console.error(source)
    }
  })
}
