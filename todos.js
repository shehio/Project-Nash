var fs = require('fs');

Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};

var walk = function (dir, ignore) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function (file) {
        if (ignore.contains(file)) return;
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(walk(file, ignore))
        else results.push(file)
    })
    return results
}


files = walk('.', new Array('.git', '.gitignore', 'LICENSE', 'node_modules', 'package.json', 'todos.js'));
/**
 *  Assumption as a future practce to end a todo with a full stop (period).
 */
files.forEach((file) => {
    fs.readFile(file, 'utf8', (err, content) => {
        let start = content.indexOf("@todo");
        while (start > -1) {
            content = content.substring(start);
            let end = 0;
            if (content.indexOf('!') > -1) {
                end = content.indexOf('!');
            }
            else if (content.indexOf('.')) {
                end = content.indexOf('.');
            }
            else {
                break;
            }
            console.log(`${file}: ${content.substring(0, end + 1)}`);
            content = content.substring(end);
            start = content.indexOf("@todo");
        }
    })
})