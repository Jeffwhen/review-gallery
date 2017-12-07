
export const getImageSize = async url => {
  const image = new Image();
  const p = new Promise(fn => {
    image.onload = () => fn({
      width: image.naturalWidth,
      height: image.naturalHeight
    });
  });
  image.src = url;
  return p;
};
