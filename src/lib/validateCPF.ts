export function validateCpf(value: string) {
  return /^[0-9]{11}$/.test(value) ? true : false;
}
