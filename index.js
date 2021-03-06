const zeroWidthChar = [
  '\u200B',  //零宽空格
  '\u200C',  //零宽非连接符
  '\u200D',  //零宽连接符
  '\uFEFF', //零宽度非换行空格
]
const zeroWidthCharReg = new RegExp(`[${zeroWidthChar.join('')}]`, 'g')

//清空字符串中的零宽字符
function removeZeroWidthChar(string) {
  return string.replace(zeroWidthCharReg, '')
}

//添加水印
function encodeMark(string, watermark) {
  string = removeZeroWidthChar(string);
  if (!string.length) {
    return {
      string, success: false, error: '原字符串不能为空'
    }
  }
  watermark = removeZeroWidthChar(watermark);
  let result = '';
  for (let i = 0, length = watermark.length; i < length; i ++) {
    const utf16 = watermark.charCodeAt(i);
    const binaryString = utf16.toString(2);
    const joinChar = i === length - 1 ? '' : zeroWidthChar[2];
    result += binaryString.split('').map(d => zeroWidthChar[Number(d)]).join('') + joinChar
  }
  return {
    string: string.slice(0, 1) + result + string.slice(1),
    success: true
  }
}

//解码水印
function decodeMark(string) {
  if (!string.length) {
    return {
      success: false, error: '原字符串不能为空'
    }
  }
  const charArr = string.match(zeroWidthCharReg);
  if (!charArr) {
    return {
      mark: '', success: true
    };
  }

  const binaryArr = charArr.join('').split(zeroWidthChar[2]);
  const mark = binaryArr.map(binary => {
    const binaryString = binary.split('').map(b => zeroWidthChar.indexOf(b)).join('');
    const utf16 = parseInt(binaryString, 2);
    return String.fromCharCode(utf16)
  }).join('')
  return {
    mark, success: true
  };
}

module.exports = {
  encodeMark,
  decodeMark,
  removeZeroWidthChar
}
