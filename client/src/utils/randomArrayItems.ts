export default (arr: any[], n: number):any[] => {
    return arr.sort(() => (Math.random() > .5) ? 1 : -1).slice(0,n)
}