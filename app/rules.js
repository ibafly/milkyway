// all transformation rules of English word appendings.
var bakruleArray = [
  "-g-n-i",
  "-g-n-i+e",
  "-g-n-i-%2-%s-%1$$;",
  "-g-n-i-y+i+e;",
  "-s-g-n-i-%2$+e", //lodging -> lodge
  "-s-g-n-i", //meanderings -> meander

  "-d-e$",
  "-d-e",
  "-d-e-%2-%s-%1$$",

  "-s", /////////////pl_for_a_noun,
  "-s-e-s$",
  "-s-e-c$",
  "-s-e-x$",
  "-s-e-o$",
  "-s-e-h$",
  "-s-e-i+y",
  "-s-e-v+f",

  "-s-e-v+f+e",

  "-y-l", //likely -> like
  "-y-l-i----$$$$+y", // luckily -> lucky
  "-y-l-a-c-i$$", // dramatically -> dramatic
  "-y-l$+e", // gently-> gentle

  "-r-e$", //__bijiaoji
  "-r-e",
  "-r-e-i+y",
  "-r-e-%2-%s-%1$$",
  "-t-s-e$",
  "-t-s-e",
  "-t-s-e-i+y",
  "-t-s-e-%2-%s-%1$$",

  "-s-r-e$", // workers->work
  "-s-r-e",
  "-s-r-e-i+y",
  "-s-r-e-%2-%2-%1$$",

  "-c-i-%2$", //prophetic -> prophet
  "-n-o-i-%2$", // invention -> invent
  "-n-o-i-%2-a-%2$+e", // limitation -> limite

  "-l-a-c$", // historical->historic
  "-l-a-c$+e", // practical->practice
  "-y-t-i-%2$", // originality->original
  "-e-v-i-t-----$$$$$$", // subjective -> subject
  "-e-v-i-t$+e-----$$$$$", // generative -> generate
  "-e-v-i-t-i-%2%+e", // competitive -> competite
]

var ruleArray = new Object()

//ruleArray = {
//    "g": {
//        "n": {
//            "i": ["self", "+e", "-%2-%s-%1$$;", "-y+i+e;"]
//        }
//    },
//    "s": {
//        "g": {
//            "n": {
//                "i": ["self", "-%2$+e"]
//            }
//        }
//    }
//}

ruleArray = {
  e: {},
  d: {
    a: {
      or: [";"], // ; -> self delete all suffix, $$ -> reserve partial
      e: {
        p: ["$$$"], // reserve
        h: ["$$$"], // reserve
        l: ["$$-a"],
      },
      m: ["$", "-e$$"],
      v: ["$", "-l$+b"],
      l: ["$+g"],
      h: ["$+t"],
      k: ["-k$$"],
      d: ["-e-d-a-k$$$$"],
      s: ["-k$$"],
      n: ["$$", "-n-o$$+d"],
      r: ["-b$+e+r"],
    },
    i: {
      a: {
        i: ["$+n"],
        v: ["$$$$", "$"],
        d: ["-e-d-a-k$$$$", "-n-e-i-i$$$+s"],
        m: ["-e$$"],
      },
      e: {
        s: ["+n+e", "-t$$+e"],
        d: ["+n+e", "$"],
        t: ["-h$+e"],
        m: ["$", "$+i+s", "-k-s-e$$+e", "-e-d$$"],
        g: ["$+e"],
        r: ["$", "$$$$"],
        l: ["$", "$$$$"],
        n: ["$$$$"],
      },
      i: {
        or: ["-%2$$$$"], // l, m, r, s, v
      },
      o: {
        or: ["-k$$$", "-%2$$$$"], // koi; h, l
      },
      õ: {
        or: ["-n$$$$"],
      },
      d: {
        or: ["$"],
        n: ["$+t", "-e-õ$$$$"],
        r: ["$+t"],
      },
      l: {
        or: ["-%1$$"], // a, e, o
        l: ["$$$$"],
        g: ["$$$$"],
      },
      n: {
        i: ["$$$$"],
        e: ["$$"],
      },
      p: {
        a: ["$$$$"], // kõrvaklapid
      },
      r: {
        or: ["$"],
        a: ["$$$$"],
        ä: ["$$$$"],
        t: ["$$$$"],
      },
      s: {
        or: ["$", "-%1-%2$", "-%1-%2$$", "-%1$"],
        e: ["-g$+i", "-n$+i"], // addition to "-%1-%2$", "-%1-%2$$"
        s: ["$", "$$$$"],
        k: ["$", "$$$$"],
        t: ["$", "$$$$"],
      },
      t: {
        or: ["$"],
        e: ["$$$$"],
      },
    },
    u: {},
    n: {},
    e: {},
    u: {},
    e: {}, // ZŽžÕõÜüŠšÄäÖö
    ö: {},
    r: {},
    o: {},
    l: {},
  },
  s: {},
  a: {
    or: [";"], // ; -> self delete all suffix, $$ -> reserve partial
    e: {
      p: ["$$$"], // reserve
      h: ["$$$"], // reserve
      l: ["$$-a"],
    },
    m: ["$", "-e$$"],
    v: ["$", "-l$+b"],
    l: ["$+g"],
    h: ["$+t"],
    k: ["-k$$"],
    d: ["-e-d-a-k$$$$"],
    s: ["-k$$"],
    n: ["$$", "-n-o$$+d"],
    r: ["-b$+e+r"],
  },
  i: {
    a: {
      i: ["$+n"],
      v: ["$$$"],
    },
    e: {
      t: ["-r$$$$"],
      g: ["$$$"], // gei
      r: ["$$$"], // patarei
      l: ["$$$"], // kantselei
    },
    i: {
      r: ["$$$"],
      t: ["$$$"],
      n: ["$$$"],
    },
    o: {
      or: ["-k$$$", "-g$$$"], // koi, papagoi
    },
    õ: {
      or: ["$$"], // kasvõi, või
    },
    d: {
      or: ["$"],
      n: ["$+t", "-e-õ$$$$", "$$$"],
      r: ["$+t"],
    },
    l: {
      or: ["-%1$$", "-%1$$$"],
      l: ["$$$"],
      s: ["$$$"],
      g: ["$$$"],
    },
    n: {
      or: ["-%1$$$"],
      e: ["$$"],
    },
    r: {
      or: ["-%1$$$", "$"],
      r: ["$$$"], // turri
    },
    s: {
      or: ["$", "-%1$$$"],
      s: ["$$$"],
      k: ["$$$"],
      t: ["$$$"],
      g: ["$$$"],
    },
    t: {
      or: ["$", "-%1$$$"],
      h: ["$$$"],
      n: ["$$$"],
      r: ["$$$"],
      s: ["$$$"],
    },
  },
  u: {
    t: {
      a: {
        or: ["-%s$$$"],
        e: ["-v$$$$$"],
        m: ["$$", "$$$$"], // v-ma-tu
        d: ["$$$$"],
        h: ["$$$$"],
        j: ["$$$$"],
        l: ["$$$$"],
        r: ["$$$$"],
        s: ["$$$$"],
        t: ["$$$$"],
        v: ["$$$$"],
      },
      ä: ["$$$"],
      e: {
        or: ["-%2$$$$"],
        o: ["$$$$"],
        u: ["$$$$"],
      },
      i: {
        or: ["-%2$$$$"],
        e: ["$$$$"],
      },

      ö: ["$$$"],
      u: {
        or: ["-%2$$$$"],
        õ: ["$$$$"],
      },
      ü: ["$$$"],
      h: ["$$$", "$+i"],
      t: ["$$$", "-u$+d+u"],
      l: ["$$$"],
      s: ["$$$", "$$$+m+a"],
    },
  },
  ü: {},
  o: {},
  ö: {},
  ä: {},
  õ: {},
}
