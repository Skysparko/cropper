import React, { useRef, useState } from "react";
import CropperModal from "./CropperModal";
import auctionImage from "../assets/auction.png";
const ImageCropper: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [showCropperModal, setShowCropperModal] = useState(false);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
      setShowCropperModal(true);
    }
  };

  const handleModalHide = () => {
    setShowCropperModal(false);
    setImage(null);
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  return (
    <>
      <CropperModal
        image={image}
        show={showCropperModal}
        onHide={handleModalHide}
        setCroppedImage={setCroppedImage}
      />
      <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
        <label
          htmlFor="image"
          className="border border-dark-subtle rounded-3 shadow"
          style={{
            cursor: "pointer",
          }}
        >
          {croppedImage ? (
            <img
              src={croppedImage}
              alt="Cropped"
              style={{
                height: 100,
              }}
            />
          ) : (
            <img
              src={auctionImage}
              alt="Default"
              style={{
                height: 100,
              }}
            />
          )}
        </label>
        {croppedImage && (
          <a href={croppedImage} download={true}>
            Download Image
          </a>
        )}
        <input
          type="file"
          onChange={handleFileChange}
          id="image"
          className="d-none"
          ref={inputFileRef}
        />
      </div>
    </>
  );
};

export default ImageCropper;
