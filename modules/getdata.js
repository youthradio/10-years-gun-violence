import { csvParse } from 'd3-dsv'
import { group } from 'd3-array'
const fs = require('fs-extra')
const fetch = require('node-fetch')

const DURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaEu4kTlAHyqAV-vIHBHIgOoJtoSzHYDZlvbs6ryP4w1YQTJDDWYGULgecXp9O-JP9fAbm3NqzgJV_/pub?output=csv'

module.exports = function fetchData () {
  // writeData writes the data to a file given the path
  // Same as in previous solution
  const writeData = (path, data) => {
    return new Promise((resolve, reject) => {
      try {
        fs.ensureFileSync(path)
        fs.writeJson(path, data, resolve(`${path} Write Successful`))
      } catch (e) {
        console.error(`${path} Write failed. ${e}`)
        reject(`${path} Write Failed. ${e}`)
      }
    })
  }

  const getData = async (builder) => {
    const csvdata = await fetch(DURL)
      .then(d => d.text())
      .then(d => csvParse(d))
      .then(d => d.filter(e => e.File_Name !== 'noaudio'))
      .then(d => d.map(e => Object.assign({ isActive: false }, e)))

    const storiesChapters = Array.from(group(csvdata, e => e.Chapter),
      ([key, value]) => ({ chapter: key, stories: value, length: value.length }))

    fs.emptyDir('data/')
    console.log(`STARTING JSON BUILD FOR ${URL}...`)
    const fetcher = []

    const basePath = `data/`
    if (!fs.pathExistsSync(basePath)) { fs.emptyDir(basePath) }
    const fileName = `${basePath}/data.json`
    console.log(`PROCESSING ${fileName}...`)

    // Write list to file
    fetcher.push(writeData(fileName, { content: storiesChapters }))

    return Promise.all(fetcher)
      .then(() => {
        console.log('JSON Build complete!')
      })
      .catch((e) => {
        throw e
      })
  }

  // Run it before the nuxt build stage
  this.nuxt.hook('build:before', getData)
}
