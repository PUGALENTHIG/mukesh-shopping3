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
import { useRouter } from "next/router";

const profileFallback = "./default-profile.jpg";

type WelcomeModalProps = {
  id?: string | undefined;
  banner?: string;
  image?: string | null;
  name?: string | null;
  username?: string | null;
  bio?: string;
  email?: string | null;
  isOpen?: boolean;
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
  activity,
}: WelcomeModalProps) => {
  const router = useRouter();
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
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      className="z-50"
      size="3xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {activity} your profile!
            </ModalHeader>
            <ModalBody>
              <div className="border-b">
                <form onSubmit={handleUpdateProfile}>
                  <div className="banner h-32 w-full md:h-64">
                    {profileData.banner ? (
                      <Image
                        removeWrapper
                        src={profileData.banner ?? ""}
                        alt="profile banner"
                        className="aspect-video object-fill md:h-full md:w-full"
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
                      className="-mt-8 h-16  w-16 md:-mt-16 md:h-32 md:w-32"
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
                        className="m-1 bg-violet-500 font-semibold"
                        type="submit"
                        onClick={handleUpdateProfile}
                      >
                        Update Profile
                      </Button>
                      {/* <Button
                        className="m-1 font-semibold"
                        type="button"
                        onClick={onClose}
                      >
                        Close
                      </Button> */}
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
