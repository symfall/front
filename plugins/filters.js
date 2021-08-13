import Vue from 'vue'

Vue.filter('formatDate', (value) => {
  const date = new Date(value)
  return date.toLocaleString(['en-US'], {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
})

Vue.filter('emojiFormat', (value) => {
  const regexExp = /^(\u00A9|\u00AE|[\u2000-\u3300]|\uD83C[\uD000-\uDFFF]|\uD83D[\uD000-\uDFFF]|\uD83E[\uD000-\uDFFF])$/
  if (regexExp.test(value)) {
    return 32
  } else {
    return
  }
})
