const remove = (arr, func) =>
    Array.isArray(arr)
        ? arr.filter(func).reduce((acc, val) => {
            arr.splice(arr.indexOf(val), 1);
            return acc.concat(val);
        }, [])
        : [];
// 通过filter得到要移除的数据
// 将要移除的数据放入 acc, 并在 arr 中移除掉
// 运行结束后,acc 中为要移除的数据,arr为移除后的数据
// example
const arr0 = [1, 2, 3, 4]
const arr1 = remove(arr0, n => n % 2 === 0); // [2, 4]
console.log('arr0', arr0)
console.log('arr1', arr1)


const arr2 = [1, 2, 3, 4]
const arr3 = arr2.filter(n => n % 2 === 0)
console.log('arr2', arr2)
console.log('arr3', arr3)
