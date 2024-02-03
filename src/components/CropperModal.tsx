import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type TProps = {
  image: HTMLImageElement | null;
  show: boolean;
  onHide: () => void;
  setCroppedImage: React.Dispatch<React.SetStateAction<string>>;
};

const CropperModal = (props: TProps) => {
  const { image, show, onHide, setCroppedImage } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (image) {
      handleCanvasDraw();
    }
  }, [image, scale, position]);

  const handleCanvasDraw = () => {
    const canvas = canvasRef.current;
    if (canvas && image) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
          image,
          position.x,
          position.y,
          image.width * scale,
          image.height * scale
        );
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const offsetX = mouseX - position.x;
      const offsetY = mouseY - position.y;

      const onMouseMove = (e: MouseEvent) => {
        setPosition({
          x: e.clientX - rect.left - offsetX,
          y: e.clientY - rect.top - offsetY,
        });
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const scaleIncrement = 0.1;
    const delta = e.deltaY < 0 ? 1 : -1;
    const newScale = scale + delta * scaleIncrement;
    setScale(Math.max(0.1, newScale));
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const croppedCanvas = document.createElement("canvas");
      const ctx = croppedCanvas.getContext("2d");
      if (ctx) {
        croppedCanvas.width = canvas.width;
        croppedCanvas.height = canvas.height;
        ctx.clearRect(0, 0, croppedCanvas.width, croppedCanvas.height);
        ctx.globalCompositeOperation = "destination-over";
        ctx.drawImage(canvas, 0, 0);
        setCroppedImage(croppedCanvas.toDataURL("image/png"));
        onHide();
      }
    }
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.1));
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column justify-content-center align-items-center gap-4 bg-dark-subtle">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ cursor: "grab" }}
          className="border bg-white shadow border"
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
        ></canvas>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div className="d-flex gap-2">
          <Button onClick={handleZoomIn}>+</Button>
          <Button onClick={handleZoomOut}>-</Button>
        </div>
        <div className="d-flex gap-2">
          <Button onClick={handleCrop}>Crop Image</Button>
          <Button onClick={props.onHide} variant="secondary">
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CropperModal;
