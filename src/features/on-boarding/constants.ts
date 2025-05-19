// File validation constants
export const MAX_FILE_SIZE = 5000000; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const ACCEPTED_IMAGE_FORMATS = ".jpg, .jpeg, .png, .webp";

// Form steps defined by their names and descriptions
export const STEP_TITLES = [
  "Personal Information",
  "Location and Biography",
  "Banner Image",
  "Account Type",
];

export const STEP_DESCRIPTIONS = [
  "Add your name and profile picture",
  "Complete your profile with information about yourself",
  "Choose an image that represents your profile",
  "Select the type of account you want to create",
];

// Notification messages for validation
export const NOTIFICATION_MESSAGES = {
  FIELDS_REQUIRED: {
    title: "Missing Information",
    description: "Please fill in all required fields",
  },
  BIO_RECOMMENDED: {
    title: "Suggestion",
    description: "We recommend adding a biography to complete your profile",
  },
  BANNER_RECOMMENDED: {
    title: "Suggestion",
    description: "A custom banner image enhances your profile",
  },
  ROLE_REQUIRED: {
    title: "Selection Required",
    description: "Please select your account type",
  },
  FORM_INCOMPLETE: {
    title: "Incomplete Information",
    description: "Please check all form fields",
  },
  ERROR: {
    title: "Error",
    description: "An error occurred during saving",
  },
  SUCCESS: {
    title: "Profile Updated",
    description: "Your profile has been successfully updated",
  },
};
