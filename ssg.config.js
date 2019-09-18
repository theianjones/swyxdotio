const fs = require('fs')
const path = require('path')

const writingPlugin = require('./remarkplugin')({
  dirPath: 'content/writing'
})
const talksPlugin = require('./remarkplugin')({
  dirPath: 'content/talks'
})

exports.getDataSlice = async (key, uid) => {
  let result // initialize to undefined
  if (key === 'writing') {
    return writingPlugin.getDataSlice(uid)
  } else if (key === 'talks') {
    return talksPlugin.getDataSlice(uid)
  }
  if (typeof result === 'undefined')
    throw new Error('no data found for ' + slug)
  return result
}
exports.getIndex = () => {
  return require(path.resolve('.ssg/data.json'))
}
let mainIndex = {} // failed attempt to keep in memory
exports.createIndex = async () => {
  console.log('getting intial data')

  let _talks = await talksPlugin.createIndex()
  console.log('Number of talks:', _talks.length)
  _talks = _talks.filter(x => new Date(x.metadata.date) <= new Date())
  mainIndex.talks = extractSlugObjectFromArray(_talks)

  let _writing = await writingPlugin.createIndex()
  console.log('Number of posts:', _writing.length)
  _writing = _writing.filter(x => new Date(x.metadata.date) <= new Date())
  mainIndex.writing = extractSlugObjectFromArray(_writing)

  return mainIndex
}

function extractSlugObjectFromArray(arr) {
  let obj = {}
  arr.forEach(item => (obj[item.metadata.slug] = item))
  return obj
}