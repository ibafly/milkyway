var demo = document.getElementById("demo")
demo.oncontextmenu = (e) => e.preventDefault()

var allFiller = new Object()
var fillObjs = new Array()
var wordSet = []
var state_in_excise = false
var reviewLocation = window.location.origin + window.location.pathname

var excise_cheat1 = 0
var excise_cheat2 = 1
var remove_dup = true

var url1 = window.location.origin + window.location.pathname
var urlData = "data://application/json;charset=utf-8,"

function getDataString(a, l, u = urlData) {
  var eea = encodeURIComponent(encodeURIComponent(getDate() + "\n" + a))
  var eel = encodeURIComponent(encodeURIComponent(JSON.stringify(l)))
  u +=
    "?article=" +
    eea +
    "&redundant=" +
    eel +
    "&theme=" +
    window.currentThemeIndex
  return u
}

function loadString(search) {
  var article = search.match(/article=([^&]+)/)
  var lastExclude = search.match(/redundant=([^&]+)/)
  var theme = search.match(/theme=([^&]+)/)
  var res = {}
  if (article) {
    article = article[1]
    res.article = decodeURIComponent(article)
  } else res.article = ""
  if (lastExclude) {
    res.lastExclude = lastExclude[1]
    res.redundantList = JSON.parse(decodeURIComponent(res.lastExclude))
  } else res.redundantList = []
  if (theme) res.theme = theme[1]
  res.submiter = function (switcharticle = true) {
    if (res.article && switcharticle) {
      window.article = res.article
      document.getElementById("maininput").value = res.article
      sendText(false)
    }
    if (res.redundantList) {
      window.lastExclude = res.lastExclude
      window.redundantList = [
        ...new Set([...window.redundantList, ...res.redundantList]),
      ]
      excludeRedundant()
    }

    // var h=document.getElementById("changeable-head")
    // h.href=getDataString(res.article, res.redundantList)
    // h.download="mw_"+getDate()+".txt"
    listWords(false)
    if (res.theme) changeTheme(res.theme)
  }
  return res
}

window.cookout((s) => {
  loadString(s).submiter()
  window.scroll(0, demo.parentNode.offsetTop - 30)
  //window.scrollTo(0, demo.parentNode.parentNode.offsetTop-160)
})

var urlLoader = loadString(window.location.search)
if (urlLoader.article || urlLoader.redundantList) {
  urlLoader.submiter()
}

function fReader(fun, swa = true) {
  var f = document.createElement("input")
  f.type = "file"
  f.multiple = "multiple"

  f.onchange = () => {
    ;[...f.files].forEach((x) => {
      var r = new FileReader()
      var t = ""
      r.onload = () => {
        t = r.result
        fun(t, swa)
      }
      r.readAsText(x)
    })
  }
  f.click()
}

function loadAndSubmit(s, swa = true) {
  loadString(s).submiter(swa)
}

document.getElementById("local-loader").onclick = () => fReader(loadAndSubmit)
document.getElementById("local-list").onclick = () =>
  fReader(loadAndSubmit, false)

function refreshRedundant() {
  var redObjs = [...demo.getElementsByClassName("word-filler-done")]
  redundantList = []
  redObjs.forEach((e) => {
    redundantList.push(elemInfo(e).voc)
  })
}
function getDate() {
  // var dateStr = new Date().toLocaleString('zh-CN', {hour12:false})
  var now = new Date()
  var dateStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .replace(/\....Z$/g, "")
  dateStr = dateStr.split("/").join("-")
  dateStr = dateStr.split(":").join("-")
  dateStr = dateStr.split(" ").join("_")
  return dateStr
}

/* update local cache */
function refreshChangeable() {
  var head = document.getElementById("changeable-head") // export btn
  var mainString = document.getElementById("maininput").value // user input of target language
  var l = mainString.replace(/^[\s\n]+|[\s\n]+$/g, "").split("\n") // delete all blank lines, split every line as substring, l becomes array
  if (l.length <= 0) l = ["Milky-Way welcomes you."]
  var title = l[l.length - 1]
    .replace(/^[\s\n]+|[\s\n]+$/g, "")
    .slice(0, 25)
    .replace(/[\s\n]+$/g, "")
  //var dateStr = getDate() + "\n";
  //var excludeStr = JSON.stringify(redundantList)
  //reviewLocation = window.location.origin + window.location.pathname + "?article=" + encodeURIComponent( dateStr + mainString ) + "&redundant="+encodeURIComponent(excludeStr)
  var reviewLocation = getDataString(mainString, window.redundantList)
  head.href = reviewLocation
  head.download = "AXV_" + getDate() + "_" + title + ".milkyway" // downloaded file named as `AXV_2021-06-04T08-08-08_first25LettersOfLastline.milkyway.txt`, file itself started with `?article=2021-06-04T08-08-08...`
  console.log(
    decodeURIComponent(getDataString(mainString, window.redundantList, url1))
  )
  window.cookin(decodeURIComponent(reviewLocation)) // set local cache/cookie
}

function fillIn(nLast, n, l, s, label = "word-filler") {
  var insThis = document.createElement("span")
  var orgWord = s.slice(n, n + l)
  insThis.className = label
  insThis.id = label + "-" + n
  insThis.innerHTML = orgWord
  var preWord = s.slice(nLast, n).replace(/</g, "《").replace(/>/g, "》")
  var s1 = preWord + insThis.outerHTML
  var res = new Object()
  res.objId = insThis.id
  res.inText = orgWord
  res.enlonged = s1
  return res
}
function fillAll(s, words) {
  var res = new Object()
  res.wordList = []
  var sorted = words.sort((a, b) => (a[0] >= b[0] ? 1 : -1))
  var nLast = 0
  var s1 = ""
  for (var i in sorted) {
    var n = sorted[i][0]
    var l = sorted[i][1]
    var wd = sorted[i][2]
    var iRes = fillIn(nLast, n, l, s)
    s1 = s1 + iRes.enlonged
    delete iRes.enlonged
    res.wordList.push(iRes)
    nLast = n + l
  }
  res.enlonged = s1 + s.slice(nLast)
  res.enlonged = res.enlonged.split("\n").join("<br>")
  return res
}
// fillAll with labels...
function fillAllLabeled(s, words) {
  var res = new Object()
  var wordList = []
  var sorted = words.sort((a, b) => a[0] >= b[0])
  var nLast = 0
  var s1 = ""
  for (var i in sorted) {
    var charHead = sorted[i][0]
    var charLength = sorted[i][1]
    var voc = sorted[i][2]
    var label = sorted[i][3]
    var iRes
    if (label) iRes = fillIn(nLast, charHead, charLength, s, label)
    else iRes = fillIn(nLast, charHead, charLength, s)
    iRes.voc = voc
    s1 = s1 + iRes.enlonged
    wordList.push(iRes)
    nLast = charHead + charLength
  }
  res.enlonged = s1 + s.slice(nLast)
  res.enlonged = res.enlonged.split("\n").join("<br>")

  wordDict = new Object()
  for (w of wordList) wordDict[w.objId] = w
  res.wordDict = wordDict
  return res
}

var s = document.getElementById("maininput").value
var words1 = allWords(s)

/* extract all words, return an array of array [index, wordLength, wordItself]  */
function allWords(s) {
  //   var reWord = /[a-zA-Z][a-zA-Z']+/g; // regex match english word
  var reWord = /[a-zA-ZŽžÕõÜüŠšÄäÖö][a-zA-ZŽžÕõÜüŠšÄäÖö\-]+/g // a regex to match est
  var iterAll = s.matchAll(reWord)
  var words = []
  for (var w of iterAll) {
    words.push([w.index, w[0].length, w[0]])
  }
  return words
}

function useRule(s, r, st = [], last = new Object()) {
  if ((!s || s.length == 0) && st.length == 0) return null
  else if (r.length == 0) return s
  else {
    var r0 = r[0] // first character of that rule or sliced rule
    // change ss sHead under condition r0==- bc s.length can be zero.
    var ss = s[s.length - 1] // last letter of word or sliced word, eg: if 'likely' drops 'y' in first iterate, then now ss=l
    var sHead = s.slice(0, s.length - 1) // letter array of word or sliced word, not including the last letter, in the example above, ss=likel
    if (r0 == ";") return s
    if (r0 == "-") {
      st.push(ss)
      last.worker = (f) => (f(ss) ? sHead : null)
      last.reader = (a) => (x) => x == a
      return useRule(sHead, r.slice(1), st, last)
    } else if (r0 == "+") {
      last.worker = (f) => s + f()
      last.reader = (a) => () => a
      return useRule(s, r.slice(1), st, last)
    } else if (r0 == "$") {
      if (st.length == 0) return null
      var pp = st.pop()
      s = s + pp
      return useRule(s, r.slice(1), st, new Object())
    } else if (r0 == "%") {
      last.reader = transSig
      return useRule(s, r.slice(1), st, last)
    } else if (r0 == "/") {
      if (st.length == 0) return null
      else {
        st.pop()
        return useRule(s, r.slice(1), st, {})
      }
    } else {
      s = last.worker(last.reader(r0))
      if (s) return useRule(s, r.slice(1), st, last)
      else return null
    }
  }

  function transSig(a) {
    if (a == "2")
      return (x) => {
        return "bcdfghjklmnpqrstvwxyzčšž".includes(x) // add est consonants
      }
    if (a == "1")
      return (x) => {
        return "aeiouäõöü".includes(x) // add est vowels
      }
    if (a == "s")
      return (x) => {
        return st.length > 1 && st[st.length - 1] == st[st.length - 2]
      }
    if (a == "g") return (x) => s[s.length - 1]
  }
}

/* use word to match rules, return an array of words in their original case */
function word2rules(word, rules, slicedTail = [], wordsNew = []) {
  var ss = word[word.length - 1]
  var sHead = word.slice(0, word.length - 1)

  // var matchedRules = new Map(rules)
  var matchedRules = new Object(rules)
  //   const [firstRuleKey, ...restRulesKeys] = Object.keys(matchedRules)
  var firstRuleKey = Object.keys(matchedRules)[0]
  var firstRuleValue = matchedRules[firstRuleKey]

  if (firstRuleKey === "or" && firstRuleValue) {
    for (var r of firstRuleValue) {
      var w = useRule(word, r, slicedTail)
      if (w) wordsNew.push(w)
    }
    // delete matchedRules[firstRuleKey]
  }

  for (var letterToMatch in matchedRules) {
    var nearObj = matchedRules[letterToMatch]

    nearHasLetter = nearObj.constructor === Array ? false : true

    if (letterToMatch == ss && nearHasLetter == true) {
      // match current last letter and the next part of rule is still letter

      console.log("GOTCHA and near has letter")
      slicedTail.push(ss)
      return word2rules(sHead, nearObj, slicedTail, wordsNew)
    } else if (letterToMatch != ss || Object.keys(nearObj).length === 0) {
      console.log("NOT match, continue loop directly")
      continue
    } else {
      // else nearHasLetter == false, next(last) part of rule is an array of strings

      // var wordsNew = [word + slicedTail.reverse().join("")]; Estonia declensions are too many, so the possibility the word itself is the original case is relatively small. move this to mark 'reserve'.
      //            var wordsNew = [];
      slicedTail.push(ss)
      for (var r of nearObj) {
        // delete 'self' in the beginning of the array, find out (heads of) all possible original cases of one head
        console.log("head:" + sHead + " rules:" + r + " stack:" + slicedTail)
        var w = useRule(sHead, r, slicedTail)
        if (w) wordsNew.push(w)
      }
    }
  }
  return wordsNew
}

function wordsIter(words, rules, iter = 2) {
  if (iter <= 0) return words
  var res = []
  for (w of words) res = res.concat(word2rules(w, rules).slice(1))
  return words.concat(wordsIter(res, rules, iter - 1))
}

function ruleAllWords(words, rules, filterWord, label = "word-filler") {
  var res = []
  for (var w of words) {
    var wp = w[0] // index
    var wl = w[1] // length of that word
    var ww = w[2] // word itself
    var wNew = word2rules(ww.toLowerCase(), rules) // an array including all possible original cases, only one is right
    console.log(wNew)
    //var wNew=wordsIter([ww.toLowerCase()], rules)
    var iValid = wNew.findIndex(filterWord.good) // find the index of that one right original case, findIndex method returns the index of the first element in the array that satisfies the provided testing function
    var iBad = wNew.findIndex(filterWord.bad)

    if (iValid >= 0 && (iValid < iBad || iBad < 0)) {
      // found in dict, not found in BadList, iBad = -1 iValid > 0
      // found in BadList, not found in dict, iBad > 0 iValid = -1
      // not found in both, iBad = -1 iValid = -1
      res.push([wp, wl, wNew[iValid], label]) // word array that should be learned
    }
  }
  return res
}

function keywords() {
  return Object.keys(dictInUse()) // iterate and return dict object keys, keys are words in original cases
}
/* filter words in dictionary from all words in original case */
function getSimpleFilter() {
  var dictIndices = keywords()
  return {
    // see if some words in all words in original case match words in dict (good) or words in badList (bad), what's a badList? words a learner already learned?
    good: (x) => dictIndices.includes(x),
    bad: (x) => badList.includes(x),
  }
}

/*
  words1=allWords(s)
  var validWords = ruleAllWords(words1, rls, (x)=>keywords.includes(x))
  var allFill=fillAllLabeled(s, validWords, "word-filled")
  asd.innerHTML=allFill.enlonged
*/

function elemInfo(elem, allFiller1 = allFiller) {
  var eid = elem.id
  var info = allFiller1.wordDict[eid]
  // info.audio = getAudio(info.voc);
  return info
}
function sendText(do_jump = true, removeDup = remove_dup) {
  var s = document.getElementById("maininput").value
  //   find word-break on end of line which is seperated by '-', replace it with a normal word.
  s = s.replace(/([a-zA-Z]+)+-\n([a-zA-Z]+)/g, "$1$2\n")
  if (do_jump) {
    // user click parse and window scroll to demo area
    window.scroll(0, demo.parentNode.offsetTop - 30)
    //window.scroll(0, demo.parentNode.offsetTop-30)
    window.scrollTo(0, demo.parentNode.parentNode.offsetTop - 160)
    demo.style.backgroundImage =
      'url("' +
      baseServer +
      "/text-faces/?article=" +
      encodeURIComponent(s) +
      "&redundantList=" +
      encodeURIComponent(encodeURIComponent(JSON.stringify(redundantList))) +
      '__large.png")'
    refreshChangeable() // update local cache bc user click parse btn to parse a new article
  }
  var words = allWords(s)
  var wordsValid = ruleAllWords(words, ruleArray, getSimpleFilter())
  console.log(wordsValid)
  allFiller = fillAllLabeled(s, wordsValid)
  demo.innerHTML = ""
  demo.innerHTML = allFiller.enlonged
  fillObjs = []
  Object.keys(allFiller.wordDict).forEach((e) =>
    fillObjs.push(document.getElementById(e))
  )
  if (removeDup) refineList()

  //    for (var o of fillObjs){
  fillObjs.forEach(
    (o) =>
      (o.onmousedown = function () {
        currentFill_1 = fillObjs.findIndex((e) => e == this)
        if (currentFill_1 >= 0) currentFill = currentFill_1
        elemExplain(o, false)
      })
  )

  //o.onmouseup = function(){var t = this.offsetTop - this.parentNode.offsetTop; console.log(t); demo.parentNode.scrollTop=t-100}

  for (var o of document.getElementsByClassName("word-filler-dup")) {
    o.onmousedown = function () {
      elemExplain(this, false)
    }
  }
  listWords(false)
}

function tailCover(s, head = 1, tail = 1) {
  var longtail = s.length - head
  tail = longtail >= tail ? tail : longtail
  var starNum = longtail - tail
  starNum = starNum >= 0 ? starNum : 0

  return (
    s.slice(0, head) + "_".repeat(starNum) + s.slice(s.length - tail, s.length)
  )
}

function elemCover(elem, head = 1, tail = 1) {
  var s = allFiller.wordDict[elem.id].inText
  elem.innerHTML =
    "<span class='red-zone'>" + tailCover(s, head, tail) + "<span>"
}
function coverAll(allFiller1 = allFiller) {
  for (o of fillObjs) {
    elemCover(o)
  }
}
/* parse entry */
document.getElementById("main-clicker").onclick = sendText
/* clear input entry */
document.getElementById("clear-clicker").onclick = () => {
  document.getElementById("maininput").value = ""
}

sendText(false)

var currentFill = 0
var currentElem
var currentInput = ""
var currentExplain = ""

function excludeRedundant() {
  fillObjs.forEach((e) => {
    if (redundantList.includes(elemInfo(e).voc)) {
      elemReveal(e)
      e.className = "word-filler-done"
    }
  })
}
document.getElementById("exclude-clicker").onclick = excludeRedundant
function word2board(w) {
  if (navigator.clipboard) navigator.clipboard.writeText(w)
}

function elemExplain(
  elem,
  cover = true,
  head = excise_cheat1,
  tail = excise_cheat2
) {
  var dictList = dictInUse()
  var info = elemInfo(elem)
  var voc = info.voc
  var inText = info.inText
  if (inText.toLowerCase() == voc) inText = ""
  var explain = getDef(dictList[voc], cover)
  if (cover) var explainHead = tailCover(voc, head, tail)
  else {
    var explainHead = voc + " &#8594 " + inText
    // info.audio.currentTime = 0
    word2board(voc)
  }
  document.getElementById("explain-head").innerHTML = explainHead
  document.getElementById("explain-area").innerHTML = explain
  showIndexInfo(currentFill, fillObjs.length)
}

function elemReveal(elem) {
  var info = elemInfo(elem)
  var inText = info.inText
  elem.innerHTML = inText
  elem.className = "word-filler-done"
}

var elemNoter = document.createElement("span")
elemNoter.className = "current-noter-container"

var bringPreserve = demo.parentNode.getClientRects()[0].height / 3
function elemBring(o, reserve = bringPreserve, fill = true) {
  var t = o.offsetTop - o.parentNode.offsetTop
  demo.parentNode.scrollTop = t - reserve
  if (fill) o.className = "word-filler-current"
  else {
    o.prepend(elemNoter)
  }
}

function elemBringMinor(o, reserve = bringPreserve) {
  var exArea = document.getElementById("explain-area")
  var objElem = document.getElementById(o.id + "-exp")
  if (!objElem) return false
  var t = objElem.offsetTop
  exArea.parentNode.scrollTop = t - reserve
  return true
}

function elemClear(o, head = excise_cheat1, tail = excise_cheat2) {
  currentInput = ""
  elemCover(o, head, tail)
  elemBring(o)
  elemExplain(o, true)
}

function elemFill(elem, s) {
  var info = elemInfo(elem)
  var inText = info.inText
  var covered = tailCover(inText)
  elem.innerHTML = s // + covered
  if (s == inText.toLowerCase()) {
    elemModify(elem)
    elemExplain(elem, false)
  } else {
    elemExplain(elem, true)
    s = s.slice(0, inText.length)
    covered = covered.slice(s.length)
    document.getElementById("explain-head").innerHTML = s + covered
    elem.className = "word-filler-current"
  }
}

function elemCheck(e) {
  var info = elemInfo(e)
  var inText = info.inText
  return e.innerHTML.toLowerCase() == inText.toLowerCase()
}
function elemModify(e, inFilling = true) {
  if (!elemCheck(e)) {
    if (inFilling) {
      e.className = "word-filler-current"
      //elemExplain(e)
    } else e.className = "word-filler"
    return false
  } else {
    elemReveal(e)
    //elemExplain(e, false)
    return true
  }
}

/* cloze excise start btn */
function fillCurrent() {
  var elem = fillObjs[currentFill]
  elemBring(elem)
  elemClear(elem)
}
function startFill() {
  if (state_in_excise) {
    return
  }
  state_in_excise = true
  ;[...demo.getElementsByClassName("word-filler-current")].forEach((e) => {
    e.className = "word-filler"
  })
  fillObjs = [...demo.getElementsByClassName("word-filler")]
  currentFill = 0
  coverAll()
  //fillNext(0)
  fillObjs.forEach((e) => {
    e.className = "word-filler"
  })
  if (!lastExclude)
    alert(
      "Finish the cloze using keyboard, pressing: \n ,/. to move back/forth; \n BACKSPACE/SPACE to clear the buffer;\n  1 / ENTER to show the partial / full solution of the blank."
    )
}

/* start playing entry */
document.getElementById("excise-clicker").onclick = startFill

/* read out functions */
var readState = []
function startRead(i = currentFill) {
  var rate = document.getElementById("read-speed").value / 100.0
  // state_in_excise=true;
  if (readState.length == 0) {
    ;[...demo.getElementsByClassName("word-filler-current")].forEach((e) => {
      e.className = "word-filler"
    })
    fillObjs = [...demo.getElementsByClassName("word-filler")]
  }
  if (!currentFill || currentFill < 0) currentFill = 0

  let ti = i - currentFill
  if (ti > 2 || ti < -2) {
    i = currentFill
  } else {
    i = i % fillObjs.length
    currentFill = i
  }
  var blankLast = fillObjs[i]
  var info = elemInfo(blankLast)
  //    fillObjs.forEach(e => e.className="word-filler")

  elemBring(blankLast, bringPreserve, false)
  elemExplain(blankLast, false)
  readState.pop()
  readState.push(
    setTimeout(() => startRead(i + 1), info.audio.duration * (1 + rate) * 1000)
  )
}

document.getElementById("start-reader").onclick = (e) => startRead(currentFill)

function fillNext(pace = 1) {
  var elem0 = fillObjs[currentFill]
  if (state_in_excise) elemModify(elem0, false)
  else if (elem0.className == "word-filler-current") {
    elem0.className = "word-filler"
  }
  currentFill = (currentFill + pace) % fillObjs.length
  currentInput = ""
  var elem = fillObjs[currentFill]
  elemBring(elem)
  var elemState = true
  if (!elemCheck(elem)) {
    elemState = false
    elemClear(elem)
  }
  elemExplain(elem, !elemState)
}

function fillPrevious(pace = 1) {
  var elem0 = fillObjs[currentFill]
  if (state_in_excise) elemModify(elem0, false)
  else if (elem0.className == "word-filler-current") {
    elem0.className = "word-filler"
  }
  currentFill =
    (((currentFill - pace) % fillObjs.length) + fillObjs.length) %
    fillObjs.length
  currentInput = ""
  var elem = fillObjs[currentFill]
  elemBring(elem)
  var elemState = true
  if (!elemCheck(elem)) {
    elemState = false
  }
  elemExplain(elem, !elemState)
}

function showIndexInfo(i, n) {
  var ar = document.getElementById("explain-area")
  var info = document.createElement("p")
  info.innerHTML = " ---- " + (i + 1) + " of " + n + " ---- "
  ar.appendChild(info)

  var listCaller = document.createElement("div")
  listCaller.className = "dark-button text-base w-auto"
  listCaller.onclick = (e) => listWords(true)
  listCaller.innerText = "Back To Word List"
  ar.appendChild(listCaller)
}

currentElem = fillObjs[currentFill]
var partialRevealer = getRevealer()

function charAdder(c) {
  currentInput = currentInput + c
  elemFill(fillObjs[currentFill], currentInput)
}
function transKeys(e) {
  function k2char(k) {
    return "abcdefghijklmnopqrstuvwxyzžõüšäöč"[k - 65]
  }
  if (65 <= e.keyCode && e.keyCode <= 90) charAdder(k2char(e.keyCode))
  else if (e.keyCode == 188) {
    e.stopPropagation()
    fillPrevious()
  } else if (e.keyCode == 190) fillNext()
  else if (e.keyCode == 8) {
    elemClear(fillObjs[currentFill])
    elemBring(fillObjs[currentFill])
  } else if (e.keyCode == 32) {
    e.preventDefault()
    e.stopPropagation()
    elemClear(fillObjs[currentFill])
    elemBring(fillObjs[currentFill])
  } else if (e.keyCode == 53) {
    elemReveal(fillObjs[currentFill])
    elemExplain(fillObjs[currentFill], false)
  } else if (e.keyCode == 13 || e.keyCode == 186 || e.keyCode == 59)
    elemExplain(fillObjs[currentFill], false)
  else if (e.keyCode == 49) partialRevealer()
  else if (e.keyCode == 52) {
    var o = fillObjs[currentFill]
    if (o.className != "word-filler-done") elemReveal(o)
    else o.className = "word-filler"
  } else if (e.keyCode == 57)
    // 9
    fillPrevious(5)
  else if (e.keyCode == 48) fillNext(5)
  else console.log(e.keyCode)
}
document.body.onkeydown = transKeys
document.getElementById("maininput").onkeydown = (e) => e.stopPropagation()

function listWords(excludeLess = true) {
  ;[...demo.getElementsByClassName("word-filler-current")].forEach(
    (e) => (e.className = "word-filler")
  )
  wordSet = []
  var dictList = dictInUse()
  if (readState && readState.length > 0) {
    readState.forEach((n) => clearTimeout(n))
    readState = []
  }
  var words1 = [...demo.getElementsByClassName("word-filler")]
  var words2 = [...demo.getElementsByClassName("word-filler-done")]

  if (excludeLess) {
    state_in_excise = false
    refreshRedundant()
    refreshChangeable()
  }

  var words = words1.concat(words2)

  var orgElem = fillObjs[currentFill]

  document.getElementById("show-answer").value =
    "Pause & Reveal: " + words1.length + "/" + words.length
  res = ""
  for (w of words) {
    var r = document.createElement("p")
    var info = elemInfo(w)
    wordSet.push(info.voc)
    w.innerHTML = info.voc
    w.id += "-exp"
    r.innerHTML = w.outerHTML + " " + getDef(dictList[info.voc])
    w.innerHTML = info.inText
    w.id = info.objId
    res = res + r.outerHTML
  }

  function ws2head(wds) {
    wds
      .sort((a, b) => (elemInfo(a).voc >= elemInfo(b).voc ? 1 : -1))
      .forEach((o) => {
        var oHead = o.cloneNode()
        oHead.innerText = elemInfo(o).voc
        headDiv.appendChild(oHead)
        headDiv.append(" ")
        oHead.onmousedown = () => {
          ;[...demo.getElementsByClassName("word-filler-current")].forEach(
            (e) => (e.className = "word-filler")
          )
          elemBring(o, 80, false)
          //	elemBringMinor(o, 10)
          wordInfo = elemInfo(o)
          wordInfo.audio.play()
          word2board(wordInfo.voc)
          var cNew = fillObjs.findIndex((e) => e == o)
          if (cNew && cNew >= 0) {
            currentFill = cNew
          }
          if (navigator.clipboard)
            navigator.clipboard.writeText(elemInfo(oo).voc)
        }
      })
  }

  var headDiv = document.getElementById("explain-head")
  headDiv.innerText = ""
  ws2head(words1)
  headDiv.appendChild(document.createElement("br"))
  ws2head(words2)

  //    document.getElementById("explain-head").innerHTML=words1.map(e => elemInfo(e).voc).sort().join(" ") + "<br>" + words2.map(e=>elemInfo(e).voc).sort().join(" ")

  document.getElementById("explain-area").innerHTML = res

  fillObjs = [...demo.querySelectorAll(".word-filler, .word-filler-done")]
  if (orgElem) {
    var cf1 = fillObjs.findIndex((o) => o == orgElem)
    if (cf1 >= 0) currentFill = cf1
    elemBringMinor(orgElem, 0)
  }

  var allExp = [
    ...document
      .getElementById("explain-area")
      .querySelectorAll(".word-filler,.word-filler-current, .word-filler-done"),
  ]
  allExp.forEach((o) => {
    // console.log(o)
    o.onmousedown = () => {
      ;[...demo.getElementsByClassName("word-filler-current")].forEach(
        (e) => (e.className = "word-filler")
      )
      var oo = document.getElementById(o.id.replace(/-exp$/, ""))
      elemBring(oo, 75, false)
      // elemBringMinor(oo, 10)
      ooInf = elemInfo(oo)
      ooInf.audio.play()
      var cNew = fillObjs.findIndex((e) => e == oo)
      if (cNew && cNew >= 0) {
        currentFill = cNew
      }
      if (navigator.clipboard) navigator.clipboard.writeText(ooInf.voc)
    }
  })
  return res
}

document.getElementById("show-answer").onclick = listWords

function refillObjs() {
  fillObjs.forEach((e) => (e.className = "word-filler"))
  return
}
document.getElementById("refill-clicker").onclick = refillObjs

function getDef(d, cover = false) {
  var res = ""

  //  if (!cover && d.ipa) {
  //    res = res + d.ipa + " -- \n";
  //  }
  //  if (d.def) {
  //    res = res + d.def;
  //  } else {
  //    res = res + d;
  //  }

  res =
    "<span class='font-bold'>" + d[0].translations.join(", ") + "</span><br>"

  //  for (entry of d.slice(1)) {
  //    res = res + "<br><span class='font-semibold'>" + entry.phrase + ": </span>" + entry.translations;
  //  }
  return res
}

function refineList() {
  wordSet = []
  for (k of Object.keys(allFiller.wordDict)) {
    w = allFiller.wordDict[k]
    if (!wordSet.includes(w.voc)) wordSet.push(w.voc)
    else {
      document.getElementById(k).className = "word-filler-dup"
    }
  }
  fillObjs = [...demo.getElementsByClassName("word-filler")]
  return wordSet
}

function dictInUse() {
  var inuse = document.getElementById("nonsense-voting").value
  return window[inuse]
}

function getRevealer() {
  var currentFill_r = currentFill
  var current_head = 1
  return function () {
    var e = fillObjs[currentFill]
    if (currentFill != currentFill_r) {
      current_head = 1
      currentFill_r = currentFill
    }
    elemExplain(e, true, current_head, excise_cheat2)
    currentInput = elemInfo(e).inText.toLowerCase().slice(0, current_head)
    elemFill(e, currentInput)
    current_head += 1
  }
}
