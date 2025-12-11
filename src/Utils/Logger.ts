// import {c} from 'chalk';


const log = (message: any = 123) => {

    const stack = new Error().stack;
    const stackArray: any = stack?.split('\n');
    let caller = stackArray[2];

    // Find the line that is not part of the Logger class itself
    // for (let i = 0; i < stackArray.length; i++) {
    //     if (!stackArray[i].includes('Logger.log') && stackArray[i].includes('.ts')) {
    //         caller = stackArray[i];
    //         break;
    //     }
    // }

    console.log("HEREE", stack);

    console.log("FOUND MATCH", caller);
    if (caller) {
        const match = caller.match(/\(([^)]+)\)/);
        if (match) {
            const parts = match[1].split(':');
            const fileName = parts[0].split('/').pop();
            const lineNumber = parts[1];
            const columnNumber = parts[2];
            console.log(`${fileName} > ${lineNumber}:${columnNumber} > ${message}`);

            // console.log(
            //     `${chalk.bgGreenBright(fileName)} >
            //      ${chalk.bgCyanBright(`${lineNumber}:${columnNumber}`)} > ${message}`);
        } else {
            console.log(`Unknown source > ${message}`);
        }
    } else {
        console.log(`Unknown source > ${message}`);
    }
}

// const Logger = () => {
//     const stack = new Error().stack;
//     console.log('HEREEE', stack?.split('\n'));
// }

export default log;
