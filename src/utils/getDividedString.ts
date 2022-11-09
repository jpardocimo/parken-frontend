export default function getDividedString(
  textToWrap: string,
  width: number,
): string[] {
  const result = [];
  let line: string[] = [];
  let length = 0;
  textToWrap.split(' ').forEach(word => {
    if (length + word.length >= width) {
      result.push(line.join(' '));
      line = [];
      length = 0;
    }
    length += word.length + 1;
    line.push(word);
  });
  if (line.length > 0) {
    result.push(line.join(' '));
  }
  return result;
}
