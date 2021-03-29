export declare function command(): u8;
export declare function read(): u8;
export declare function write(x: u8): void;

const ARRAY_LIMIT = 30000;
const VALUE_LIMIT: u8 = (2 << 6) - 1;

enum Cmd {
    Increment = 43,
    Decrement = 45,
    MoveRight = 62,
    MoveLeft = 60,
    Output = 46,
    Input = 44,
    LoopBegin = 91,
    LoopEnd = 93,
}

export function brainfuck(): void {
    const commands = readCommands(),
          arr = new Array<u8>(1).fill(0),
          stack = new Array<i32>(1).fill(-1);

    let i = 0, p = 0, cmd: u8;

    while (i < commands.length) {
        switch (cmd = commands[i++]) {
            case Cmd.Increment:
                increment(p, arr);
                break;
            case Cmd.Decrement:
                decrement(p, arr);
                break;
            case Cmd.MoveRight:
                p = moveRight(p, arr);
                break;
            case Cmd.MoveLeft:
                p = moveLeft(p);
                break;
            case Cmd.Output:
                write(arr[p]);
                break;
            case Cmd.Input:
                arr[p] = read();
                break;
            case Cmd.LoopBegin:
                if (arr[p] == 0) {  // skip the loop
                    let level = 1;
                    while (level > 0 && i < commands.length) {
                        if (commands[i] == Cmd.LoopBegin) level++;
                        else if (commands[i] == Cmd.LoopEnd) level--;
                        i++;
                    }
                    if (level > 0) throw new SyntaxError('No mathing `]`');
                } else stack.push(i - 1);
                break;
            case Cmd.LoopEnd:
                const _i = stack.pop();
                if (_i == -1) throw new SyntaxError('unmatched ]');
                i = _i;
                break;
        }
    }
    if (stack.pop() != -1) throw new SyntaxError('unmatched [');
}

function readCommands(): Array<u8> {
    const commands = new Array<u8>();
    let c: u8;
    while ((c = command())) commands.push(c);
    return commands;
}

@inline
function moveRight(p: i32, arr: Array<u8>): i32 {
    if (p == ARRAY_LIMIT) throw new Error('Index out of bounds: ' + ARRAY_LIMIT.toString());
    if (arr.length == p + 1) arr.push(0);
    return p + 1;
}

@inline
function moveLeft(p: i32): i32 {
    if (p == 0) throw new Error('Index out of bounds: 0');
    return p - 1;
}

@inline
function increment(p: i32, arr: Array<u8>): void {
    if (arr[p] == VALUE_LIMIT) {
        arr[p] = 0;
        return;
    }
    arr[p]++;
}

@inline
function decrement(p: i32, arr: Array<u8>): void {
    if (arr[p] == 0) {
      arr[p] = VALUE_LIMIT;
      return;
    }
    arr[p]--;
}
