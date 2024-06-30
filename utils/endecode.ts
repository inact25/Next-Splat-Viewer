const hexEncode = (str: any) => {
    return [...str]
        .map(char => char.charCodeAt(0).toString(16))
        .join('');
};


const hexDecode = (hex: { match: (arg0: RegExp) => any[]; }) => {
    return hex
        .match(/.{1,2}/g)
        .map(byte => String.fromCharCode(parseInt(byte, 16)))
        .join('');
};

export {hexEncode, hexDecode}
