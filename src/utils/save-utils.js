export const saveBlob = (filename, blob) => {
  saveImage(filename, URL.createObjectURL(blob));
};

export const saveCanvas = (filename, canvas) => {
  saveImage(filename, canvas.toDataURL());
};

export const saveImage = (filename, dataUrl) => {
  const anchor = document.createElement('a');
  anchor.setAttribute('href', dataUrl);
  anchor.setAttribute('target', '_blank');
  anchor.setAttribute('download', filename);
  if (document.createEvent) {
    const evtObj = document.createEvent('MouseEvents');
    evtObj.initEvent('click', true, true);
    anchor.dispatchEvent(evtObj);
  } else if (anchor.click) {
    anchor.click();
  }
};

export const saveChart = (chart, filename, width = 800, height = 800) => {
  const oldStyle = chart.canvas.parentNode.style;
  const oldClass = chart.canvas.parentNode.className;
  chart.canvas.parentNode.style.width = `${width}px`;
  chart.canvas.parentNode.style.height = `${height}px`;
  chart.canvas.parentNode.className = '';
  chart.resize();
  chart.render();
  const dataUrl = chart.toBase64Image('image/png');
  saveImage(filename, dataUrl);
  chart.canvas.parentNode.style = oldStyle;
  chart.canvas.parentNode.className = oldClass;
};
