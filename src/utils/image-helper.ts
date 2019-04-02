export function removeMIMEFromDataURI(imageDataURI) {
  return imageDataURI.slice(imageDataURI.indexOf(',') + 1);
}
