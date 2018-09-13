const { random } = require('../util/helpers')

const firstNames = {
  male: ['bert', 'phy', 'ian', 'ius', 'on', 'el', 'ender', 'an', 'pher', 'on', 'gan', 'iel', 'las', 'nic', 'iel'],
  female: ['onica', 'gelica', 'ia', 'a', 'anda', 'ella', 'ette', 'gail', 'beth', 'y', 'elope', 'ie', 'ora', 'lyn']
}

const lastNames = {
  pre: ['Angry', 'Furious', 'Vicious', 'Annoy', 'Irate', 'Rage', 'Wrath', 'Hate', 'Rabid', 'Up-Yours', 'Pi**ed'],
  ending: ['man', 'venson', 'bert', 'ton', 'son', 'ler', 'len', 'bell', 'chell', 'wards', 'gan', 'nett', 'kin', 'zales']
}

const texts = {
  offline: [
    `My connection is dead. Can you fix this please???`,
    `Noooo, not now! I almost finished :,(`,
    `Have you tried turning it off and on again?`,
    `People are telling me about your internet all the time. They are saying tremendous things about it. But I'm not buying it. You are FAKE INTERNET, Sir!`,
    `Dude, where is my interwebz. Nothing's working. Fix this ASAP!`,
    `Dear Sir or Madam, I would be highly delighted if you could find the time to fix my internet connection. Please?`,
    `No need to fix my connection. I have to beat the highscore first. Go for gold, little T-Rex!`,
    `At least my mom is glad that I'm no longer blocking the phone...`,
    `It says 'no internet connection'... Is this bad?...`,
    `I. Need. Cat. Memes!`
  ],
  slow: [
    `Booooooring!`,
    `Is this jpeg supposed to load this long?...Jeez, it's been 2 days already.`,
    `When will the connection be faster, brother?`,
    `I HATE BUFFERING!!!`,
    `Have you tried turning it off and on again?`,
    `Seriously, you guys? Sending my emails via USPS or carrier pigeons would have been faster by now.`,
    `I know a thing or two and this does not feel like glorious 56K. I'm sure you can do better.`,
    `"Go fast, follow dreams", they said... But not with this connection I'm not.`,
    `Yeah, if could send a few mor bits and bytes over to me. That'd be great.`
  ],
  cancelled: [
    `I'm canceling my contract. You guys are incompetent.`,
    `RAGEQUIT!!!!`,
    `That's it. I'm out!`,
    `Goodbye. Better luck next time!`,
    `Where do I have to sign to get out of here?`,
    `I would have cancelled earlier but I couldn't reach you due to the CONSTANT DOWNTIMES!!!`,
    `Your internet is irrelevant. I only use the best internet. You failed ISP. So sad!`
  ]
}

const generateName = () => {
  const gender = random(0, 1) === 0 ? 'male' : 'female'
  const firstName = 'Customer' + firstNames[gender][random(0, firstNames[gender].length - 1)]
  const lastName = lastNames.pre[random(0, lastNames.pre.length - 1)] + lastNames.ending[random(0, lastNames.ending.length - 1)]
  return firstName + ' ' + lastName
}

const getText = occasion => texts[occasion][random(0, texts[occasion].length - 1)]

module.exports = {
  generateName,
  getText
}
