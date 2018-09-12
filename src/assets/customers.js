const { random } = require('../util/helpers')

const firstNames = {
  male: ['bert', 'phy', 'ian', 'ius', 'on', 'el', 'ender', 'an', 'pher', 'on', 'gan', 'iel', 'las', 'nic', 'iel'],
  female: ['onica', 'gelica', 'ia', 'a', 'anda', 'ella', 'ette', 'gail', 'beth', 'y', 'elope', 'ie', 'ora', 'lyn']
}

const lastNames = {
  pre: ['Angry', 'Furious', 'Vicious', 'Annoy', 'Irate', 'Rage', 'Wrath', 'Hate', 'Rabid', 'Up-Yours', 'Pi**ed'],
  ending: ['man', 'venson', 'bert', 'ton', 'son', 'ler', 'len', 'bell', 'chell', 'wards', 'gan', 'nett', 'kin', 'zales']
}

const characters = ['DEFAULT', 'BRO', 'SUBMISSIVE', 'TRUMP', 'FOREIGN', 'TIGHTLIPPED']

const generateName = () => {
  const gender = random(0, 1) === 0 ? 'male' : 'female'
  const firstName = 'Customer' + firstNames[gender][random(0, firstNames[gender].length - 1)]
  const lastName = lastNames.pre[random(0, lastNames.pre.length - 1)] + lastNames.ending[random(0, lastNames.ending.length - 1)]
  return firstName + ' ' + lastName
}

const generateCharacter = () => {

}

const getText = (situation, character) => {

}

module.exports = {
  generateName,
  generateCharacter,
  getText
}
