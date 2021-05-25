const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = (content) => {
  const window = (new JSDOM(content)).window
  const regex = /^h['1-6']/i
  const headers = []
  const missing = []
  const report = {}

  const breakdown = {
    missing: 0,
    h1: 0,
    empty: 0,
    length: 0,
    count: 0
  }

  const tags = [...window.document.querySelectorAll('*')].filter(e => regex.test(e.tagName)).length
  breakdown.count = tags

  if (tags === 0) {
    report.headers = missing
    report.results = breakdown

    return report
  }

  window.document.querySelectorAll('*').forEach(el => {
    if (regex.test(el.tagName)) {
      headers.push({
        tag: el.tagName,
        text: el.textContent.replace(/\s+/g, ' ').trim() || false,
        empty: !el.textContent.replace(/\s|\n|\r/, '').trim(),
        length: el.textContent.replace(/\s+/g, ' ').trim().length >= 70,
        missing: false
      })
    }
  })

  headers.forEach((e, k) => {
    missing.push(e)

    if (e.tag === 'H1') { breakdown.h1++ }
    if (e.length) { breakdown.length++ }
    if (e.empty) { breakdown.empty++ }

    const currentTagValue = parseInt(e.tag.substr(-1))

    if (!headers[k + 1]) { return }

    const nextTagValue = parseInt(headers[k + 1].tag.substr(-1))

    if (nextTagValue > currentTagValue + 1) {
      const diff = nextTagValue - (currentTagValue + 1)
      for (let i = 1; i <= diff; i++) {
        breakdown.missing++
        missing.push({
          tag: 'H' + (i + currentTagValue),
          text: false,
          empty: false,
          missing: true,
          length: false
        })
      }
    }
  })

  if (breakdown.h1 === 0) {
    breakdown.missing++
    const additional = []
    additional.push({
      tag: 'H1',
      text: false,
      empty: false,
      missing: true,
      length: false
    })

    const diff = parseInt(missing[0].tag.substr(-1)) - 2
    for (let i = 1; i <= diff; i++) {
      breakdown.missing++
      additional.push({
        tag: 'H' + (i + 1),
        text: false,
        empty: false,
        missing: true,
        length: false
      })
    }

    missing.unshift(...additional)
  }

  report.headers = missing
  report.results = breakdown

  return report
}
