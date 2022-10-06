import imageUrlBuilder from '@sanity/image-url'
import sanityClient from "@sanity/client";
import {SanityImageSource} from "@sanity/image-url/lib/types/types";

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2021-10-21',
  useCdn: true
})

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client)

// Then we like to make a simple function like this that gives the
// builder an image and returns url to the image
export function urlFor(source: SanityImageSource) {
  return builder.image(source).url()
}