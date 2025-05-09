export function preparePreview(html: string, maxLength: number = 900): string {
  let output = '';
  let charCount = 0;
  const tagStack: string[] = [];

  const regex = /<\/?[^>]+>|[^<]+/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null && charCount < maxLength) {
    const part = match[0];

    if (part.startsWith('<')) {
      output += part;
      if (!part.startsWith('</') && !part.endsWith('/>')) {
        const tagName = part.match(/<(\w+)/)?.[1];
        if (tagName) {
          tagStack.push(tagName);
        }
      } else if (part.startsWith('</')) {
        tagStack.pop();
      }
    } else {
      const remainingChars = maxLength - charCount;
      if (part.length > remainingChars) {
        output += part.slice(0, remainingChars);
        charCount += remainingChars;
      } else {
        output += part;
        charCount += part.length;
      }
    }
  }

  while (tagStack.length > 0) {
    output += `</${tagStack.pop()}>`;
  }

  return output;
}
