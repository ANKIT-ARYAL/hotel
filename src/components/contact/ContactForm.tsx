"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { submitContact } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .refine((s) => s.trim().length > 0, "Name cannot be just spaces"),
  email: z.string().trim().email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number (10-15 digits)"),
  subject: z.string().trim().min(5, "Subject must be at least 5 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await submitContact(data);
      if (res.success) {
        setIsSuccess(true);
        reset();
      } else {
        toast.error(res.error || "Failed to send message.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-zinc-200/50 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-3xl font-argine text-zinc-900 mb-4">Message Sent</h3>
        <p className="text-zinc-500 font-oklean mb-8 max-w-md">
          Thank you for reaching out to us. We have received your message and will get back to you shortly.
        </p>
        <Button
          onClick={() => setIsSuccess(false)}
          className="bg-zinc-900 text-white hover:bg-zinc-800 h-12 px-8 rounded-full font-medium"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border-[0.5px] border-zinc-300 p-8 md:p-10 rounded-3xl shadow-xl shadow-zinc-200/50 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Full Name</label>
          <Input
            {...register("name")}
            className="h-12 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Email Address</label>
          <Input
            {...register("email")}
            className="h-12 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Phone Number</label>
          <Input
            {...register("phone")}
            className="h-12 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl"
            placeholder="+1 (555) 000-0000"
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Subject</label>
          <Input
            {...register("subject")}
            className="h-12 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl"
            placeholder="How can we help?"
          />
          {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">Message</label>
        <Textarea
          {...register("message")}
          className="min-h-[150px] bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl resize-y"
          placeholder="Write your message here..."
        />
        {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-14 rounded-full font-medium tracking-wide shadow-md"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
        {isSubmitting ? "Sending Message..." : "Send Message"}
      </Button>
    </form>
  );
}
