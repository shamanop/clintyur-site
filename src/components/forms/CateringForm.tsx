"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const cateringSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  eventType: z.enum([
    "Private Dinner",
    "Corporate Event",
    "Wedding",
    "Birthday",
    "Other",
  ]),
  eventDate: z.string().min(1, "Please select a date"),
  guestCount: z
    .number()
    .min(1, "At least 1 guest")
    .max(500, "Max 500 guests"),
  message: z.string().optional(),
});

type CateringFormData = z.infer<typeof cateringSchema>;

export default function CateringForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CateringFormData>({
    resolver: zodResolver(cateringSchema),
  });

  const onSubmit = async (data: CateringFormData) => {
    console.log("Catering inquiry:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <h3
          className="text-[clamp(1.5rem,3vw,2rem)] text-text-primary mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          We&apos;ll be in touch.
        </h3>
        <p className="text-text-secondary">
          Thank you for your inquiry. Clintyur will reach out within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-text-secondary">
          Full Name
        </Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Your name"
          className="bg-surface border-[#333333] text-text-primary placeholder:text-text-muted"
        />
        {errors.name && (
          <p className="text-deep-red text-xs">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-text-secondary">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="you@email.com"
          className="bg-surface border-[#333333] text-text-primary placeholder:text-text-muted"
        />
        {errors.email && (
          <p className="text-deep-red text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-text-secondary">
          Phone
        </Label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          placeholder="(555) 000-0000"
          className="bg-surface border-[#333333] text-text-primary placeholder:text-text-muted"
        />
        {errors.phone && (
          <p className="text-deep-red text-xs">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-secondary">Event Type</Label>
        <Select
          onValueChange={(val) =>
            setValue("eventType", val as CateringFormData["eventType"])
          }
        >
          <SelectTrigger className="bg-surface border-[#333333] text-text-primary">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-[#333333]">
            {[
              "Private Dinner",
              "Corporate Event",
              "Wedding",
              "Birthday",
              "Other",
            ].map((type) => (
              <SelectItem
                key={type}
                value={type}
                className="text-text-primary"
              >
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.eventType && (
          <p className="text-deep-red text-xs">{errors.eventType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="eventDate" className="text-text-secondary">
          Event Date
        </Label>
        <Input
          id="eventDate"
          type="date"
          {...register("eventDate")}
          className="bg-surface border-[#333333] text-text-primary"
        />
        {errors.eventDate && (
          <p className="text-deep-red text-xs">{errors.eventDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="guestCount" className="text-text-secondary">
          Guest Count
        </Label>
        <Input
          id="guestCount"
          type="number"
          {...register("guestCount")}
          placeholder="25"
          className="bg-surface border-[#333333] text-text-primary placeholder:text-text-muted"
        />
        {errors.guestCount && (
          <p className="text-deep-red text-xs">{errors.guestCount.message}</p>
        )}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="message" className="text-text-secondary">
          Additional Details
        </Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Tell us about your vision..."
          className="bg-surface border-[#333333] text-text-primary placeholder:text-text-muted min-h-[120px]"
        />
      </div>

      <div className="md:col-span-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber hover:bg-amber-dark text-[#0A0A0A] font-bold text-lg py-6 tracking-wide transition-colors cursor-pointer"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {isSubmitting ? "Sending..." : "Book Clintyur"}
        </Button>
      </div>
    </form>
  );
}
