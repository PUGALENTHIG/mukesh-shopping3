/* import type { NextApiRequest, NextApiResponse } from "next"; */

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();

/* const auth = (req: NextApiRequest, res: NextApiResponse) => ({ id: "fakeId" }); */ /// Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  profilePicture: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete((data) => console.log("file", data)),
  bannerImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  }).onUploadComplete((data) => console.log("file", data)),
  postMedia: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
    video: { maxFileSize: "32MB", maxFileCount: 4 },
  }).onUploadComplete((data) => console.log("file", data)),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
