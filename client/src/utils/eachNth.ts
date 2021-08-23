export default (arr: any[], n: number, l: number):any[] => {
    return arr.map((a: any,i:number) => arr[i + n + (l - 1) * i]).filter(e => e)
}