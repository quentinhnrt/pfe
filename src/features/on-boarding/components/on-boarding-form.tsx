"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { ImageIcon, PencilIcon, UserCircleIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, FieldErrors } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/shadcn/form";
import { type FileWithPreview } from "@/components/utils/image-cropper";

import { AccountTypeStep } from "@/features/on-boarding/components/account-type-step";
import { BannerImageStep } from "@/features/on-boarding/components/banner-image-step";
import { NavButtons } from "@/features/on-boarding/components/nav-buttons";
import { PersonalInfoStep } from "@/features/on-boarding/components/personal-info-step";
import { ProfileDetailsStep } from "@/features/on-boarding/components/profile-details-step";
import { StepIndicator } from "@/features/on-boarding/components/step-indicator";

import {
  NOTIFICATION_MESSAGES,
  STEP_DESCRIPTIONS,
  STEP_TITLES,
} from "@/features/on-boarding/constants";
import { FormValues, StepType, formSchema } from "@/features/on-boarding/types";

export default function OnBoardingForm({ user }: { user: User }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [validSteps, setValidSteps] = useState<number[]>([]);

  const [profileImageDialogOpen, setProfileImageDialogOpen] = useState(false);
  const [bannerImageDialogOpen, setBannerImageDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<FileWithPreview | null>(
    null
  );
  const [bannerImage, setBannerImage] = useState<FileWithPreview | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      role: user.role ?? "USER",
      image: null,
      bannerImage: null,
      bio: user.bio ?? "",
      website: user.website ?? "",
      location: user.location ?? "",
      username: user.name ?? "",
    },
    mode: "onChange", // Valider à chaque changement
  });

  const role = form.watch("role");
  const firstname = form.watch("firstname");
  const lastname = form.watch("lastname");
  const bio = form.watch("bio");
  const username = form.watch("username");
  const location = form.watch("location");

  // Créer les étapes du formulaire avec icônes et descriptions
  const steps: StepType[] = [
    {
      title: STEP_TITLES[0],
      description: STEP_DESCRIPTIONS[0],
      icon: <UserCircleIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      title: STEP_TITLES[1],
      description: STEP_DESCRIPTIONS[1],
      icon: <PencilIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      title: STEP_TITLES[2],
      description: STEP_DESCRIPTIONS[2],
      icon: <ImageIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      title: STEP_TITLES[3],
      description: STEP_DESCRIPTIONS[3],
      icon: <UserIcon className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  // Profile Image Dropzone
  const {
    getRootProps: getProfileRootProps,
    getInputProps: getProfileInputProps,
  } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    },
    maxSize: 5000000, // 5MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        }) as FileWithPreview;
        setProfileImage(fileWithPreview);
        form.setValue("image", file);
        setProfileImageDialogOpen(true);
      }
    },
  });

  // Banner Image Dropzone
  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
  } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    },
    maxSize: 5000000, // 5MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        }) as FileWithPreview;
        setBannerImage(fileWithPreview);
        form.setValue("bannerImage", file);
        setBannerImageDialogOpen(true);
      }
    },
  });

  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      if (profileImage?.preview) URL.revokeObjectURL(profileImage.preview);
      if (bannerImage?.preview) URL.revokeObjectURL(bannerImage.preview);
    };
  }, [profileImage, bannerImage]);

  const validateStep = async (stepIndex: number): Promise<boolean> => {
    let isValid = false;

    switch (stepIndex) {
      case 0:
        // Étape 1: Validation du nom et prénom (obligatoires)
        isValid = await form.trigger(["firstname", "lastname"]);

        // Vérifier que les champs ne sont pas vides
        const firstnameValue = form.getValues("firstname");
        const lastnameValue = form.getValues("lastname");

        if (!firstnameValue.trim() || !lastnameValue.trim()) {
          toast(NOTIFICATION_MESSAGES.FIELDS_REQUIRED.title, {
            description: NOTIFICATION_MESSAGES.FIELDS_REQUIRED.description,
          });
          return false;
        }

        // Vérifier que la photo de profil est ajoutée
        if (!profileImage && !user.image) {
          toast(NOTIFICATION_MESSAGES.FIELDS_REQUIRED.title, {
            description: "A profile picture is required",
          });
          return false;
        }
        break;

      case 1:
        // Étape 2: Valider les champs de profil (tous obligatoires)
        isValid = await form.trigger(["username", "bio", "location"]);

        // Si le nom d'utilisateur n'est pas défini, générer un par défaut
        const usernameValue = form.getValues("username");
        if (!usernameValue || !usernameValue.trim()) {
          const defaultUsername = `${firstname.toLowerCase()}-${lastname.toLowerCase()}`;
          form.setValue("username", defaultUsername);
        }

        // Vérifier tous les champs obligatoires
        if (
          !isValid ||
          !bio ||
          !bio.trim() ||
          !location ||
          !location.trim() ||
          !username ||
          !username.trim()
        ) {
          toast(NOTIFICATION_MESSAGES.FIELDS_REQUIRED.title, {
            description: "Please complete all required fields",
          });
          return false;
        }
        break;

      case 2:
        // Étape 3: L'image de bannière est obligatoire
        if (!bannerImage && !user.bannerImage) {
          toast(NOTIFICATION_MESSAGES.FIELDS_REQUIRED.title, {
            description: "A banner image is required",
          });
          return false;
        }
        isValid = true;
        break;

      case 3:
        // Étape 4: Vérifier que le rôle a bien été choisi
        isValid = await form.trigger(["role"]);
        const roleValue = form.getValues("role");
        if (!roleValue) {
          toast(NOTIFICATION_MESSAGES.ROLE_REQUIRED.title, {
            description: NOTIFICATION_MESSAGES.ROLE_REQUIRED.description,
          });
          return false;
        }
        isValid = true;
        break;

      default:
        isValid = false;
    }

    return isValid;
  };

  const markStepAsValid = (stepIndex: number) => {
    if (!validSteps.includes(stepIndex)) {
      setValidSteps((prev) => [...prev, stepIndex]);
    }
  };

  // Form submission logic
  async function onSubmit(values: FormValues) {
    // Vérifier une dernière fois que tout est valide
    const allValid = await form.trigger();
    if (!allValid) {
      toast(NOTIFICATION_MESSAGES.FORM_INCOMPLETE.title, {
        description: NOTIFICATION_MESSAGES.FORM_INCOMPLETE.description,
      });
      return;
    }

    const formData = new FormData();

    // Ajouter seulement les valeurs non-null au FormData
    for (const key in values) {
      const value = values[key as keyof typeof values];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        toast(NOTIFICATION_MESSAGES.ERROR.title, {
          description: data.message || NOTIFICATION_MESSAGES.ERROR.description,
        });
        return;
      }

      // Marquer toutes les étapes comme validées avant la redirection
      const allSteps = Array.from({ length: steps.length }, (_, i) => i);
      setValidSteps(allSteps);

      toast(NOTIFICATION_MESSAGES.SUCCESS.title, {
        description: NOTIFICATION_MESSAGES.SUCCESS.description,
      });

      // Use router.push instead of redirect for client-side navigation
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast(NOTIFICATION_MESSAGES.ERROR.title, {
        description: NOTIFICATION_MESSAGES.ERROR.description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Navigate directly to a specific step
  const goToStep = (stepIndex: number) => {
    if (
      stepIndex >= 0 &&
      stepIndex < steps.length &&
      stepIndex <= Math.max(...validSteps, currentStep)
    ) {
      setCurrentStep(stepIndex);
    }
  };

  // Function to handle step validation before proceeding
  const validateAndProceed = async () => {
    const isCurrentStepValid = await validateStep(currentStep);

    if (isCurrentStepValid) {
      // Marquer l'étape comme validée
      markStepAsValid(currentStep);

      if (currentStep === steps.length - 1) {
        // Submit form on last step
        form.handleSubmit(onSubmit)();
      } else {
        // Passer à l'étape suivante
        goToNextStep();
      }
    }
  };

  // Vérifier la validité des étapes lorsque les champs changent
  useEffect(() => {
    const checkCurrentStepValidity = async () => {
      // Vérifier les champs de l'étape actuelle
      switch (currentStep) {
        case 0:
          // Étape 1: Nom, prénom et photo de profil
          if (
            firstname &&
            lastname &&
            firstname.trim() &&
            lastname.trim() &&
            (profileImage || user.image)
          ) {
            markStepAsValid(currentStep);
          }
          break;
        case 1:
          // Étape 2: Nom d'utilisateur, bio et localisation
          if (
            username &&
            bio &&
            location &&
            username.trim() &&
            bio.trim() &&
            location.trim()
          ) {
            markStepAsValid(currentStep);
          }
          break;
        case 2:
          // Étape 3: Image de bannière
          if (bannerImage || user.bannerImage) {
            markStepAsValid(currentStep);
          }
          break;
        case 3:
          // Étape 4: Rôle
          if (role) {
            markStepAsValid(currentStep);
          }
          break;
      }
    };

    checkCurrentStepValidity();
  }, [
    firstname,
    lastname,
    username,
    bio,
    location,
    role,
    profileImage,
    bannerImage,
    currentStep,
    user.image,
    user.bannerImage,
    markStepAsValid,
  ]);

  return (
    <div className="w-full max-w-full mx-auto px-4 py-8 md:px-8">
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        goToStep={goToStep}
        validSteps={validSteps}
      />
      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
            className="space-y-8"
            aria-label="Formulaire d'onboarding"
          >
            {currentStep === 0 && (
              <PersonalInfoStep
                form={form}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                profileImageDialogOpen={profileImageDialogOpen}
                setProfileImageDialogOpen={setProfileImageDialogOpen}
                getProfileRootProps={getProfileRootProps}
                getProfileInputProps={getProfileInputProps}
                user={user}
              />
            )}

            {currentStep === 1 && (
              <ProfileDetailsStep
                form={form}
                firstname={firstname}
                lastname={lastname}
              />
            )}

            {currentStep === 2 && (
              <BannerImageStep
                bannerImage={bannerImage}
                setBannerImage={setBannerImage}
                bannerImageDialogOpen={bannerImageDialogOpen}
                setBannerImageDialogOpen={setBannerImageDialogOpen}
                getBannerRootProps={getBannerRootProps}
                getBannerInputProps={getBannerInputProps}
                user={user}
                form={form}
              />
            )}

            {currentStep === 3 && <AccountTypeStep form={form} role={role} />}

            <NavButtons
              currentStep={currentStep}
              steps={steps}
              goToPreviousStep={goToPreviousStep}
              validateAndProceed={validateAndProceed}
              isLoading={isLoading}
            />

            {Object.entries(form.formState.errors).length > 0 && (
              <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-md text-sm text-red-700">
                <ul className="list-disc pl-5">
                  {Object.entries(form.formState.errors as FieldErrors<FormValues>).map(
                    ([name, error]) => (
                      <li key={name}>
                        {error.message?.toString() ||
                          `Erreur sur le champ ${name}`}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
