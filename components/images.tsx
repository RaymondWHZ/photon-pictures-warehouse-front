import React, {useState} from "react";
import {Carousel, Image} from "antd";

interface KitImagesProps {
  images: string[]
  width: any
  height: any
}

export const KitImages: React.FC<KitImagesProps> = ({ images, width, height }) => {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  return (
    <div style={{ width, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Carousel
        autoplay={!visible}
        style={{ width, height }}
        afterChange={setIndex}
      >
        {images?.map((image, index) => (
          <Image
            key={index}
            src={image + '&width=800'}
            width={width}
            height={height}
            preview={{ visible: false }}
            onClick={() => setVisible(true)}
            style={{ objectFit: "contain", objectPosition: "center", background: "#364d79" }}
          />
        ))}
      </Carousel>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis), current: index }}>
          {images?.map((image, index) => (
            <Image key={index} src={image} />
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  )
}