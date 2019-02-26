export class LOG {
    static toConsole = function(caption, obj) {
        console.log(`🡦 ${caption} 🡧`);
        console.log(obj);
        console.log('\r\n');
    }
}
