function parseMath(string){
    while(string.indexOf("\\(") !== -1 && string.indexOf("\\)" !== -1)){
        var start = string.indexOf("\\(");
        var end = string.indexOf("\\)");
        string = string.slice(0, start) + "<Latex>{\"$" + escapeSlashes(string.slice(start+2, end)) + "$\"}</Latex>" + string.slice(end+2)
    }
    console.log(string);
    return string;
}

function escapeSlashes(string){
    return string.replace('\\', '\\\\')
}

export default parseMath;