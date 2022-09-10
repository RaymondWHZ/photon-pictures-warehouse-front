import {SanityImageSource} from "@sanity/image-url/lib/types/types";
import React, {useState} from "react";
import {Carousel, Image} from "antd";
import {urlFor} from "../util/utils";

interface KitImagesProps {
  images: SanityImageSource[]
  width: any
  height: any
}

export const KitImages: React.FC<KitImagesProps> = ({ images, width, height }) => {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  return (
    <div style={{ width, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Carousel
        autoplay
        style={{ width }}
        afterChange={setIndex}
      >
        {images?.map(image => (
          <div>
            <Image
              src={urlFor(image)}
              width={width}
              height={height}
              preview={{ visible: false }}
              onClick={() => setVisible(true)}
              style={{ objectFit: "contain", objectPosition: "center", background: "#364d79" }}
            />
          </div>
        ))}
      </Carousel>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis), current: index }}>
          {images?.map(image => (
            <Image src={urlFor(image)} />
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  )
}