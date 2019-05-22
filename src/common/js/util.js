/*
 解析url
 
 */
export default function () {
    let urlstring = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = urlstring.match(reg);
    if (arr) {
        arr.forEach((item) => {
            // substring()返回值是一个字符串 从index开始，包括index 向后截取字符串
            let tempArr = item.substring(1).split("=");

            // obj[tempArr[0]] == [tempArr[1]]
            let key = decodeURIComponent(obj[tempArr[0]]);
            let val = decodeURIComponent(obj[tempArr[1]]);
            obj[key] = val
        });
    }


    return obj;
}