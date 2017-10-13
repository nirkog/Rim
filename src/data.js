const Constants = require('./constants');
const Statements = require('./statements');
const Strings = require('./strings');
const Comments = require('./comments');

const fs = require('fs');
const path = require('path');

function cleanData(raw) {
    let data = raw.toString().split('\r\n');

    let inString = inComment = false;
    data = data.join('');

    for(let i = 0; i < data.length; i++) {
        if(data[i] == '\'' || data[i] == '"') {
            inString = !inString;
        } else if(data[i] == Constants.commentChar) {
            inComment = !inComment;
        } else if(data[i] == ' ') {
            if(!inString && !inComment) {
                data = data.substr(0, i) + data.substr(i + 1);
                i--;
            }
        }
    }

    return data;
}

module.exports.cleanData = cleanData;

/* 

Not Used!!!!!
Should be implemeted instead of inline searching!

*/
function searchForStrings(data) {
    let stringPositions = [];
    let inString = escaped = false;
    let stringCount = 0;

    for(let i = 0; i < data.length; i++) {
        if((data[i] == '\'' || data[i] == '"') && !escaped) {
            inString = !inString;

            if(inString) {
                stringPositions.push([i]);
            } else {
                stringPositions[stringCount].push(i);

                stringCount++;
            }
        } else if(data[i] === Constants.escapeChar) {
            escaped = true;
        } else {
            escaped = false;
        }
    }

    return stringPositions;
}

function handleDoctype(line) {
    if(line.substr(0, Constants.doctypeKeyword.length) === Constants.doctypeKeyword) {
        if(line.length === Constants.doctypeKeyword.length)
            return Constants.doctypes['html'];
        
        for(doctype in Constants.doctypes) {
            if(Constants.doctypes.hasOwnProperty(doctype)) {
                if(line.substr(Constants.doctypeKeyword.length + 1, line.length) === doctype) {
                    return Constants.doctypes[doctype];
                }
            }
        }

        return -1;
    } else {
        return false;
    }
}

//Not finished
/*function handleEmptyLines(data) {
    data.forEach((line) => {
        let noSpaces = line.split(' ').join('');
        if(noSpaces == '\n' || noSpaces == '\r\n' || noSpaces === '') {
            //Detects empty lines
        }
    });
}*/

function spaceProtected(i, protectedPositions) {
    for(let positions of protectedPositions) {
        for(let position of positions) {
            if(i > position[0] && i < position[1]) {
                return true;
            }
        }
    }
}

function removeSpaces(data, protectedPositions) {
    for(let i = 0; i < data.length; i++) {
        if(data[i] == ' ') {
            if(!spaceProtected(i, protectedPositions)) {
                data = data.slice(0, i) + data.slice(i + 1, data.length);
                i--;

                protectedPositions.forEach((positions) => {
                    positions.forEach((position) => {

                        if(position[0] > i) {
                            position[0]--;
                            position[1]--;
                        }
                    });
                });
            }
        }
    }

    return data;
}

function handleImports(data) {
    let indexesToClean = [];
    while(data.indexOf(Constants.importKeyword) != -1) {
        let startIndex = data.indexOf(Constants.importKeyword);

        let inString = false;

        for(let i = 0; i < stringPositions.length; i++) {
            if(startIndex > stringPositions[i][0] && startIndex < stringPositions[i][1]) {
                inString = true;
                break;
            }
        }

        if(inString) {
            data = data.slice(0, startIndex + 2) + '0' + data.slice(startIndex + 2, data.length);
            indexesToClean.push(startIndex + 2);
            continue;
        }

        let endIndex = null;
        let importFile = '';

        for(let i = startIndex + Constants.importKeyword.length; i < data.length; i++) {
            if(data[i] == ';') {
                endIndex = i;
                break;
            }
         }

        let statement = data.slice(startIndex, endIndex + 1);

        if(importFile.indexOf(',') == -1) {
            let file = fs.readFileSync(path.join(dirPath, importFile));
            data = data.replace(statement, cleanData(file.toString()));
        } else {
            let addedData = '';
            let files = importFile.split(',');

            files.forEach((file) => {
                let fileData = fs.readFileSync(path.join(dirPath, file));
                addedData += fileData.toString();
            });

            data = data.replace(statement, cleanData(addedData));
        }

        stringPositions = searchForStrings(data);
    }

    indexesToClean.forEach((index) => {
        data = data.replace(data[index], '');
    });

    return data;
}

module.exports.getData = (raw, dirPath, defaultDoctype) => {
    let data = raw.split('\r\n');
    
    let doctype = handleDoctype(data[0]);

    if(doctype && doctype != -1) {
        doctype += '\n';
        data.splice(0, 1);
    } else if(doctype == -1) {
        if(data[0].indexOf(';') == -1) {
            throw new Error(`${data[0].substr(Constants.doctypeKeyword.length + 1, data[0].length)} is not a supported doctype.`);

            doctype = '';
            data.splice(0, 1);
        } else {
            //Handle single line doctype statements

            let expression = data[0].substring(0, data[0].indexOf(';'))
            let type = data[0].substring(Constants.doctypeKeyword.length + 1, data[0].indexOf(';'));
            
            if(type == ';') {
                doctype = Constants.doctypes['html'] + '\n';
            } else if(type in Constants.doctypes) {
                doctype = Constants.doctypes[type] + '\n';
            } else {
                throw new Error(`${type} is not a supported doctype.`);
            }

            data[0] = data[0].slice(data[0].indexOf(';') + 1, data[0].length);
        }
    } else {
        if(defaultDoctype)
            doctype = Constants.doctypes['html'] + '\n';
        else
            doctype = '';
    }

    //handleEmptyLines(data);

    data = data.join('');

    let stringPositions = Strings.getPositions(data);
    let commentPositions = Comments.getPositions(data, stringPositions);
    let forPositions = Statements.findForLoops(data, stringPositions);
    let protectedPositions = [stringPositions, commentPositions, forPositions];

    let inString = inComment = escaped = false;

    let stringCount = 0;

    data = removeSpaces(data, protectedPositions);
    data = handleImports(data);

    return [data, doctype];
};

module.exports.importFile = (path) => {
    let file = fs.readFileSync(path);

    return file.toString();
};