
let isDrawing = false;
let startX: number, startY: number, endX, endY;
let screenshotImgUrl = '';
let send: (response?: any) => void

// 创建遮罩层
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
overlay.style.zIndex = '9999';
overlay.style.cursor = 'crosshair';

// 创建选择框
const selectionBox = document.createElement('div');
selectionBox.style.position = 'absolute';
selectionBox.style.border = '2px dashed #fff';
overlay.appendChild(selectionBox);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'areaCaptureStart') {
    send = sendResponse
    screenshotImgUrl = request.screenshotUrl;
    document.body.appendChild(overlay);
  }
  return true
});

overlay.addEventListener('mousedown', (e) => {
  isDrawing = true;
  startX = e.clientX;
  startY = e.clientY;
  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  selectionBox.style.width = '0';
  selectionBox.style.height = '0';
});

overlay.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    endX = e.clientX;
    endY = e.clientY;
    selectionBox.style.left = `${Math.min(startX, endX)}px`;
    selectionBox.style.top = `${Math.min(startY, endY)}px`;
    selectionBox.style.width = `${Math.abs(endX - startX)}px`;
    selectionBox.style.height = `${Math.abs(endY - startY)}px`;
  }
});

overlay.addEventListener('mouseup', () => {
  if (isDrawing) {
    isDrawing = false;
    const rect = selectionBox.getBoundingClientRect();
    document.body.removeChild(overlay);
    processScreenshot(rect.x, rect.y, rect.width, rect.height);
  }
});

function processScreenshot(x: number, y: number, width: number, height: number) {
  const img = new Image();
  img.src = screenshotImgUrl;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 计算缩放比例以考虑设备像素比
    const scale = window.devicePixelRatio;

    ctx?.drawImage(
      img,
      x * scale,
      y * scale,
      width * scale,
      height * scale,
      0,
      0,
      width,
      height
    );

    const croppedImage = canvas.toDataURL('image/png');
    send({
        // action: 'areaCaptureEnd',
        dataUrl: croppedImage
    })
    // downloadImage(croppedImage);
  };
}

function downloadImage(dataUrl: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'screenshot.png';
  a.click();
}