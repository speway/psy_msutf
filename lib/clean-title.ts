const MARKDOWN_BOLD = /\*\*(.*?)\*\*/g;
const MARKDOWN_ITALIC = /\*(.*?)\*/g;
const MARKDOWN_CODE = /`([^`]+)`/g;
const URL_PATTERN = /https?:\/\/\S+/g;
const EMOJI_PATTERN =
  /[〰️▫️✨⭐️⏰➡️🌟🎗️💡🌬🤩🏛📒📍☹️❄️👀‼️🆕🌞🟡🔵🟣⚪️❤️🩶🖊️🐌🐰⛓💙🩷💚💜🧡💛💬🗒🗣🔘🔜🔛🔚🔙😊😁😂🤣😍🥰😘💕❤️‍🔥🫂🩹☺♦️🏆💫🔥💪🎓📌📢🔔✅🎯🎭📖✏️🎨🧠💭🗯️💬👁️‍🗨️🔍⚡🌐📰🎙️💻📱🖥️⌨️🖱️🖨️📸🎥🎬📺📻🔊📯🎵🎶🎼💿📀💾💽🧩🎮🕹️🎲♟️🎯🎱🎳🀄🎴🔮🪄🧿🪬🕯️💡🔦🏮📔📕📗📘📙📚📓✒️🖊️🖋️✏️📝📁📂🗂️📎🔗🧷📐📏✂️🔒🔓🔑🗝️🔨🪛🔧⚙️🗜️🔩⚗️🧪🧫🧬🔬🔭🩺💉🩸🦠🧮📊📈📉🗓️📅📆⏳⌛⏰🕛🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🌍🌎🌏🌐🗺️🧭🏔️⛰️🌋🗻🏕️🏖️🏜️🏝️🏞️🏟️🏛️🏗️🏘️🏚️🏠🏡🏢🏣🏤🏥🏦🏨🏩🏪🏫🏬🏭🏯🏰💒🗼🗽⛪🕌🛕🕍⛩️🕋⛲⛺🌁🌃🏙️🌄🌅🌆🌇🌉🌌🎆🎇🌈🏳️‍🌈🏴‍☠️🟥🟧🟨🟩🟦🟪⬛⬜🔲🔳🔴🟠🟡🟢🔵🟣⚫⚪🟤🔶🔷🔸🔹🔺🔻💠🔘🔳🔲▪️▫️◾️◽️◼️◻️➖➗➰➿✔️🔃🔄▶️⏩⏭️⏸️⏯️⏹️⏺️⏏️🎦🔅🔆📶📳📴♻️📛⭕❌❎❗❕⚠️🚫🚳🚯🚱🚷📵🔞☢️☣️✴️❇️✳️❇️💹〽️✖️➕➖➗♾️‼️⁉️❓❔❕❗#️⃣*️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟🔠🔡🔢🔣🔤🅰️🆎🅱️🆑🆒🆓🆔🆕🆖🆗🆘🆙🆚🈁🈂️🈷️🈶🈯🉐🈹🈚🈲🈳🈴🈵🈶🈷️🈸🈹🈺🉐🉑🈶🈚🈸🈹🈺💮🉐🈶🈚🈸🈹🈺🆚🈁🈂️㊗️㊙️🈺🈵🈳🉑🆖🆗🆙🆒🆕🆓🆔🆚🈁🈂️🆎🆑🆘🆖🆗🆙🆒🆕🆓🆔🆚🈁🈂️🅰️🅱️🆎🆑🆒🆓🆔🆕🆖🆗🆘🆙🆚]+/g;

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, c) =>
      String.fromCodePoint(Number.parseInt(c, 16))
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#[xy]?\w+;/g, "")
    .replace(/&[a-z]+;/g, "");
}

export function cleanTitle(text: string): string {
  return decodeHtmlEntities(text)
    .replace(MARKDOWN_BOLD, "$1")
    .replace(MARKDOWN_ITALIC, "$1")
    .replace(MARKDOWN_CODE, "$1")
    .replace(URL_PATTERN, "")
    .replace(EMOJI_PATTERN, "")
    .replace(/\(\?q=[^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
