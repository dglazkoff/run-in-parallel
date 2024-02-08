#!/usr/bin/env node

import { spawn } from 'node:child_process';

const controller = new AbortController();
const { signal } = controller;

const CONSOLE_COLOR = {
    cyan: "\x1b[36m",
    green: "\x1b[32m",
};

function coloredLog(color, text) {
    console.log(`${color}%s\x1b[0m`, text);
}

const processArguments = process.argv.slice(2);
const isInherit = processArguments.some((arg) => arg === '--output=inherit');

const processes = processArguments.reduce((acc, arg) => {
    const [process, ...args] = arg.split(' ');

    if (!process.startsWith('--')) {
        acc[process] = args;
    }

    return acc;
}, {});

const childProcesses = Object.keys(processes).map((process) => {
    let onSuccess = !isInherit ? () => coloredLog(CONSOLE_COLOR.green, `✓ ${process}: executed successfully!`) : undefined;

    return createChildProcess(process, processes[process], { onSuccess });
})

try {
    await Promise.all(childProcesses);

    coloredLog(CONSOLE_COLOR.green, `✅ All processes executed successfully!`);
} catch (err) {
    const exitCode = (err === 1 || err === 2) ? err : 1;
    controller.abort();
    process.exit(exitCode);
}

function createChildProcess(process, args, options = {}) {
    return new Promise((resolve, reject) => {
        coloredLog(CONSOLE_COLOR.cyan, `Start: ${process} ${args.join(' ')}`);

        const childProcess = spawn(process, args, { signal, stdio: isInherit ? 'inherit' : 'pipe' });

        childProcess.stdout?.on('data', (data) => {
            console.log(`${process}: ${data}`);
        });

        childProcess.stderr?.on('data', (data) => {
            console.error(`${process}: ${data}`);
        });

        childProcess.on('exit', (code) => {
            if (code === 0) {
                options.onSuccess?.();
                resolve(process);
            } else {
                reject(code);
            }
        })
    });
}

