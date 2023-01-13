export function debug<T>(x: T, label = "") {
  console.log(label, x);
  return x;
}
