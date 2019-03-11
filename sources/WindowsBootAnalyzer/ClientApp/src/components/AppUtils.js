export class LOG {
    static toConsole = function(caption, obj) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`🡦 ${caption} 🡧`);
            console.log(obj);
            console.log('\r\n');
        }
    }
}
