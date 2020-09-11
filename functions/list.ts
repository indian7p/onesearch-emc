export async function paginateArray(array) {
  return await array.map(() => array.splice(0, 10)).filter(a => a);
}