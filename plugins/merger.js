var e = require('../events')
var fs = require('fs')
var ffmpeg = require('fluent-ffmpeg')
var {MessageType,Mimetype} = require('@adiwajshing/baileys')
const c = require('../config')
var {query} = require('raganork-bot')
var v = c.SESSION
var fm = c.WORKTYPE == 'public' ? false : true
e.addCommand({pattern: 'avmix ?(.*)', fromMe: fm}, (async (m, match) => {    
var rm = m.reply_message;
var am = m.reply_message.data.quotedMessage.audioMessage;
var vm = m.reply_message.data.quotedMessage.videoMessage;
var q = await m.client.downloadAndSaveMediaMessage({key: { remoteJid: m.reply_message.jid,id: m.reply_message.id}, message: m.reply_message.data.quotedMessage});
var qb = await m.client.downloadMediaMessage({key: { remoteJid: m.reply_message.jid,id: m.reply_message.id}, message: m.reply_message.data.quotedMessage});
if (!rm) return await m.client.sendMessage(m.jid, '_Reply to an audio or video!_', MessageType.text, {quoted: m.data})
if (!am && !vm) return await m.client.sendMessage(m.jid, '_Reply to an audio or video!_', MessageType.text, {quoted: m.data})
if (rm && am && !fs.existsSync('audio_v.mp3')) {
ffmpeg(q)
.format('mp3')
.save('audio_v.mp3')
.on('end', async () => {
await m.client.sendMessage(m.jid, '_Saved audio! Next, reply to the video to be mixed_', MessageType.text, {quoted: m.data})})}
if (rm && vm && !fs.existsSync('vid.mp4')) {
await fs.writeFileSync('vid.mp4',qb)
await m.client.sendMessage(m.jid, '_Saved video! Next, Processing.._', MessageType.text, {quoted: m.data})}
if (rm && vm && fs.existsSync('audio_v.mp3') && fs.existsSync('vid.mp4')) {
query.AVmix('vid.mp4','audio_v.mp3','AV_mix.mp4',v, async function(video) {
return await m.client.sendMessage(m.jid, video, MessageType.video, { mimetype: Mimetype.mp4, quoted: m.data});
});    
}
}));
e.addCommand({pattern: 'aamix ?(.*)', fromMe: fm}, (async (m, match) => {    
var rm = m.reply_message;
var am = m.reply_message.data.quotedMessage.audioMessage;
var q = await m.client.downloadAndSaveMediaMessage({key: { remoteJid: m.reply_message.jid,id: m.reply_message.id}, message: m.reply_message.data.quotedMessage});
if (!rm) return await m.client.sendMessage(m.jid, '_Reply to an audio or video!_', MessageType.text, {quoted: m.data})
if (!am) return await m.client.sendMessage(m.jid, '_Reply to an audio or video!_', MessageType.text, {quoted: m.data})
if (rm && am && !fs.existsSync('audio_1.mp3')) {
ffmpeg(q)
.format('mp3')
.save('audio_1.mp3')
.on('end', async () => {
await m.client.sendMessage(m.jid, '_Saved audio 1_', MessageType.text, {quoted: m.data})})}
if (rm && am && !fs.existsSync('audio_2.mp3')) {
ffmpeg(q)
.format('mp3')
.save('audio_2.mp3')
.on('end', async () => {
await m.client.sendMessage(m.jid, '_Saved audio 2. Processing..._', MessageType.text, {quoted: m.data})})}
if (rm && vm && fs.existsSync('audio_1.mp3') && fs.existsSync('audio_2.mp3')) {
query.MixAudio('audio_1.mp3','audio_2.mp3','amix.mp3',v, async function(audio) {
return await m.client.sendMessage(m.jid, audio, MessageType.audio, { mimetype: Mimetype.mp3, quoted: m.data});
});    
}
}));
    