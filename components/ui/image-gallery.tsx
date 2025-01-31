import Image from "next/image";

export const ImageGallery = ({
  images,
  selectedImage,
  onImageSelect,
  name,
}: {
  images: string[];
  selectedImage: number;
  onImageSelect: (index: number) => void;
  name: string;
}) => (
  <div className="space-y-4">
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
      <Image
        src={images[selectedImage] || "/placeholder.svg"}
        alt={name}
        fill
        className="object-cover"
        priority={selectedImage === 0}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
    <div className="flex gap-2 overflow-x-auto pb-2">
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onImageSelect(index)}
          className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
            selectedImage === index ? "ring-2 ring-primary" : ""
          }`}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={`${name} view ${index + 1}`}
            fill
            className="object-cover"
            sizes="80px"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  </div>
);
