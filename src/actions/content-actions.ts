"use server";

import { revalidatePath } from "next/cache";
import {
  WebsiteContent,
  WebsiteContentSchema,
  HeroSectionData,
  HeroSectionDataSchema,
  ExpertiseCard,
  ExpertiseCardSchema,
  BentoCard,
  BentoCardSchema,
} from "@/lib/types";
import { getWebsiteContent, writeWebsiteContent } from "@/lib/content";

function triggerRevalidations() {
  revalidatePath("/", "page");
  revalidatePath("/admin", "page");
}

/**
 * Replace the entire website content tree.
 */
export async function updateEntireContentAction(newContent: WebsiteContent) {
  try {
    const validated = WebsiteContentSchema.parse(newContent);
    await writeWebsiteContent(validated);
    triggerRevalidations();

    return {
      success: true,
      data: validated,
      message: "Entire website content updated successfully.",
    };
  } catch (error: unknown) {
    console.error("updateEntireContentAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update entire content.",
    };
  }
}

/**
 * Update the kinetic Hero section data.
 */
export async function updateHeroAction(heroData: unknown) {
  try {
    const validatedHero = HeroSectionDataSchema.parse(heroData);
    const currentContent = await getWebsiteContent();

    currentContent.hero = validatedHero;
    await writeWebsiteContent(currentContent);
    triggerRevalidations();

    return {
      success: true,
      data: validatedHero,
      message: "Hero section updated successfully.",
    };
  } catch (error: unknown) {
    console.error("updateHeroAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update hero section.",
    };
  }
}

/**
 * Upsert an Expertise Card ("Build & Grow").
 * If the card ID exists, it updates it; otherwise it appends a new card.
 */
export async function upsertExpertiseCardAction(card: ExpertiseCard) {
  try {
    const validatedCard = ExpertiseCardSchema.parse(card);
    const currentContent = await getWebsiteContent();

    const existingIndex = currentContent.coreExpertise.cards.findIndex(
      (c) => c.id === validatedCard.id
    );

    if (existingIndex >= 0) {
      currentContent.coreExpertise.cards[existingIndex] = validatedCard;
    } else {
      currentContent.coreExpertise.cards.push(validatedCard);
    }

    await writeWebsiteContent(currentContent);
    triggerRevalidations();

    return {
      success: true,
      card: validatedCard,
      message: `Expertise card "${validatedCard.title}" saved successfully.`,
    };
  } catch (error: unknown) {
    console.error("upsertExpertiseCardAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upsert expertise card.",
    };
  }
}

/**
 * Delete an Expertise Card by ID.
 */
export async function deleteExpertiseCardAction(cardId: string) {
  try {
    const currentContent = await getWebsiteContent();
    const originalCount = currentContent.coreExpertise.cards.length;

    currentContent.coreExpertise.cards = currentContent.coreExpertise.cards.filter(
      (c) => c.id !== cardId
    );

    if (currentContent.coreExpertise.cards.length === originalCount) {
      return {
        success: false,
        error: `Expertise card with ID "${cardId}" not found.`,
      };
    }

    await writeWebsiteContent(currentContent);
    triggerRevalidations();

    return {
      success: true,
      message: `Expertise card "${cardId}" deleted successfully.`,
    };
  } catch (error: unknown) {
    console.error("deleteExpertiseCardAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete expertise card.",
    };
  }
}

/**
 * Upsert a Bento Card ("Project Support").
 * If the card ID exists, it updates it; otherwise it appends a new card.
 */
export async function upsertBentoCardAction(card: BentoCard) {
  try {
    const validatedCard = BentoCardSchema.parse(card);
    const currentContent = await getWebsiteContent();

    const existingIndex = currentContent.projectSupport.cards.findIndex(
      (c) => c.id === validatedCard.id
    );

    if (existingIndex >= 0) {
      currentContent.projectSupport.cards[existingIndex] = validatedCard;
    } else {
      currentContent.projectSupport.cards.push(validatedCard);
    }

    await writeWebsiteContent(currentContent);
    triggerRevalidations();

    return {
      success: true,
      card: validatedCard,
      message: `Bento card "${validatedCard.title}" saved successfully.`,
    };
  } catch (error: unknown) {
    console.error("upsertBentoCardAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upsert bento card.",
    };
  }
}

/**
 * Delete a Bento Card by ID.
 */
export async function deleteBentoCardAction(cardId: string) {
  try {
    const currentContent = await getWebsiteContent();
    const originalCount = currentContent.projectSupport.cards.length;

    currentContent.projectSupport.cards = currentContent.projectSupport.cards.filter(
      (c) => c.id !== cardId
    );

    if (currentContent.projectSupport.cards.length === originalCount) {
      return {
        success: false,
        error: `Bento card with ID "${cardId}" not found.`,
      };
    }

    await writeWebsiteContent(currentContent);
    triggerRevalidations();

    return {
      success: true,
      message: `Bento card "${cardId}" deleted successfully.`,
    };
  } catch (error: unknown) {
    console.error("deleteBentoCardAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete bento card.",
    };
  }
}
