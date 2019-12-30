const pipeAsyncFunctions = (...fns) => arg => fns.reduce((p, f) => p.then(f), Promise.resolve(arg));
// arg 输入启动值,并封装成 promise => Promise.resolve(arg)
// example
const sum = pipeAsyncFunctions(
    x => x + 1,
    x => new Promise(resolve => setTimeout(() => resolve(x + 2), 1000)),
    x => x + 3,
    async x => (await x) + 4
);
(async () => {
    console.log(await sum(5)); // 15 (after one second)
})();

