import React, { type FormEvent } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Image,
  Avatar,
  Input,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { CameraIcon } from "@heroicons/react/24/outline";
import { api } from "@/utils/api";

const profileFallback = "./default-profile.jpg";

type WelcomeModalProps = {
  id?: string | undefined;
  banner?: string;
  image?: string | null;
  name?: string | null;
  username?: string | null;
  bio?: string;
  email?: string | null;
  isOpen: boolean;
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
}: WelcomeModalProps) => {
  const { onOpenChange } = useDisclosure();
  const [profileData, setProfileData] = React.useState({
    id: id,
    banner: banner ?? "",
    image: image ?? "",
    email: email ?? "",
    name: name ?? "",
    username: username ?? "",
    bio: bio,
  });
  const updateUser = api.user.updateUser.useMutation();

  const handleImageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return; // No files selected

    const file = files[0]; // Get the first selected file

    if (!file) return; // Ensure that a file exists

    const encodedImage = await encodeImageToBase64(file);
    setProfileData({
      ...profileData,
      banner: encodedImage,
    });
  };

  const encodeImageToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          resolve(e.target.result);
        } else {
          reject(new Error("Failed to read image as base64."));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  function handleUpdateProfile(e: FormEvent) {
    e.preventDefault();
    updateUser.mutate({ ...profileData });
  }

  return (
    <Modal
      backdrop="blur"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      className="z-50"
      size="3xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Complete your profile!
            </ModalHeader>
            <ModalBody>
              <div className="border-b">
                <form onSubmit={handleUpdateProfile}>
                  <div className="banner h-64 w-full">
                    {profileData.banner ? (
                      <Image
                        removeWrapper
                        src={profileData.banner ?? ""}
                        alt="profile banner"
                        className="aspect-video h-full w-full object-fill"
                        radius="none"
                      />
                    ) : (
                      <div className="fallback group flex h-full w-full cursor-pointer items-center justify-center bg-gray-600 transition-colors hover:bg-gray-800">
                        <label htmlFor="bannerUpload">
                          <input
                            aria-label="add image"
                            id="bannerUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              void handleImageInput(e);
                            }}
                          />
                          <CameraIcon
                            className="cursor-pointer rounded-full p-4 group-hover:bg-white group-hover:bg-opacity-20"
                            width={64}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="mx-6 flex flex-row justify-between">
                    <Avatar
                      className="-mt-16  h-32 w-32"
                      isBordered
                      src={image ?? profileFallback}
                    />
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
                        color="primary"
                        type="submit"
                        onClick={handleUpdateProfile}
                      >
                        Action
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
