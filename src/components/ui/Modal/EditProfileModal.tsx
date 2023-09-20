import React, { type FormEvent } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Avatar,
  Input,
  Textarea,
  Spinner,
} from "@nextui-org/react";
import { CameraIcon } from "@heroicons/react/24/outline";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { UploadButton } from "@/utils/uploadthing";
const profileFallback = "./default-profile.jpg";

type EditProfileModalProps = {
  id?: string | undefined;
  banner?: string | undefined | null;
  image?: string | undefined | null;
  name?: string | null;
  username?: string | null;
  bio?: string | null;
  email?: string | null;
  isOpen?: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  activity: string;
};

const WelcomeModal = ({
  id,
  banner,
  image,
  name,
  username,
  bio,
  email,
  isOpen,
  onOpenChange,
  activity,
}: EditProfileModalProps) => {
  const router = useRouter();

  const [profileData, setProfileData] = React.useState({
    id: id,
    banner: banner ?? "",
    image: image ?? "",
    email: email ?? "",
    name: name ?? "",
    username: username ?? "",
    bio: bio ?? "",
  });
  const [avatarIsLoading, setAvatarIsLoading] = React.useState<boolean>(false);
  const [bannerIsLoading, setBannerIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setProfileData({
      id: id,
      banner: banner ?? "",
      image: image ?? "",
      email: email ?? "",
      name: name ?? "",
      username: username ?? "",
      bio: bio ?? "",
    });
  }, [banner, bio, email, id, image, name, username]);

  const updateUser = api.user.updateUser.useMutation();

  function handleUpdateProfile(e: FormEvent) {
    e.preventDefault();
    try {
      updateUser.mutate({ ...profileData });
    } catch (error) {
      console.log(error);
    }
    router.reload();
  }

  return (
    <Modal
      backdrop="blur"
      isDismissable={activity === "update" ? true : false}
      isKeyboardDismissDisabled={activity === "update" ? false : true}
      hideCloseButton={activity === "update" ? false : true}
      className="z-50"
      size="3xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {activity} your profile!
            </ModalHeader>
            <ModalBody>
              <div className="">
                <form onSubmit={handleUpdateProfile}>
                  <div className="banner h-32 w-full md:h-64">
                    <div
                      style={{
                        backgroundImage: `url(${profileData.banner})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                      className="fallback flex h-full w-full items-center justify-center bg-background bg-opacity-50 bg-blend-overlay transition-colors"
                    >
                      <label htmlFor="bannerUpload">
                        <UploadButton
                          aria-label="add banner"
                          className="hidden"
                          endpoint="bannerImage"
                          onClientUploadComplete={(res) => {
                            // Do something with the response
                            console.log("Files: ", res?.[0]?.url);
                            setBannerIsLoading(false);
                            setProfileData({
                              ...profileData,
                              banner: res?.[0]?.url ?? "",
                            });
                            alert("Upload Completed");
                          }}
                          onUploadError={(error: Error) => {
                            // Do something with the error.
                            alert(`ERROR! ${error.message}`);
                          }}
                          onUploadBegin={
                            (/* name */) => {
                              // Do something once upload begins
                              setBannerIsLoading(true);
                              /* console.log("Uploading: ", name); */
                            }
                          }
                        />
                        {!bannerIsLoading ? (
                          <CameraIcon
                            className="cursor-pointer rounded-full p-2 hover:bg-background hover:bg-opacity-20"
                            width={64}
                          />
                        ) : (
                          <Spinner />
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="relative mx-6 flex flex-row ">
                    <label>
                      <UploadButton
                        aria-label="add profile picture"
                        className="hidden h-fit"
                        endpoint="profilePicture"
                        onClientUploadComplete={(res) => {
                          // Do something with the response
                          console.log("Files: ", res?.[0]?.url);
                          setAvatarIsLoading(false);
                          setProfileData({
                            ...profileData,
                            image: res?.[0]?.url ?? "",
                          });
                          alert("Upload Completed");
                        }}
                        onUploadError={(error: Error) => {
                          // Do something with the error.
                          alert(`ERROR! ${error.message}`);
                        }}
                        onUploadBegin={
                          (/* name */) => {
                            // Do something once upload begins
                            setAvatarIsLoading(true);
                            /* console.log("Uploading: ", name); */
                          }
                        }
                      />

                      <div className="group -mt-8 h-16 w-16 md:-mt-16 md:h-32 md:w-32">
                        {!avatarIsLoading ? (
                          <CameraIcon
                            width={16}
                            className="bg-dark absolute z-20 h-16 w-16 cursor-pointer rounded-full bg-background bg-opacity-40 p-5 group-hover:bg-opacity-70 md:h-32 md:w-32 md:p-10"
                          />
                        ) : (
                          <Spinner className="absolute z-20 h-16 w-16 rounded-full bg-background bg-opacity-80 p-5 md:h-32 md:w-32  md:p-10" />
                        )}

                        <Avatar
                          className="h-full w-full"
                          isBordered
                          src={profileData.image ?? profileFallback}
                        />
                      </div>
                    </label>
                  </div>
                  <div className="mx-6 my-4">
                    <div className="pfp pb-3 text-xl font-bold">
                      <Input
                        label="Name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="email pb-3 text-xl font-bold">
                      <Input label="Email" value={profileData.email} required />
                    </div>
                    <div className="username ">
                      <Input
                        label="Username"
                        value={profileData.username}
                        startContent="@"
                        pattern="/^[a-zA-Z0-9]+$/"
                        title="No spaces or special characters"
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            username: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="bio mt-3">
                      <Textarea
                        value={profileData.bio}
                        label="Bio"
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button
                        className="m-1 bg-violet-500 font-semibold"
                        type="submit"
                        onClick={handleUpdateProfile}
                      >
                        Update Profile
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default WelcomeModal;
