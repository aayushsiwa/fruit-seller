import { useState } from "react";

const useNewsletter = () => {
    const [newsletterStatus, setNewsletterStatus] = useState<
        "success" | "error" | null
    >(null);

    const handleNewsletterSubmit = async (
        values: { email: string },
        {
            setSubmitting,
            resetForm,
        }: {
            setSubmitting: (isSubmitting: boolean) => void;
            resetForm: () => void;
        }
    ) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setNewsletterStatus("success");
            resetForm();
        } catch (error) {
            console.error("Error submitting newsletter subscription:", error);
            setNewsletterStatus("error");
        } finally {
            setSubmitting(false);
        }
    };

    return {
        newsletterStatus,
        handleNewsletterSubmit,
    };
};

export default useNewsletter;
