"use server";

import { getUserSubscription } from "@/db/queries";
import { stripe } from "@/lib/stripe";
import { absoulteURL } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs";

const returnURL = absoulteURL("/shop");

export const createStripeUrl = async () => {
  const { userId } = auth();
  const user = await currentUser();
  if (!userId || !user) {
    throw new Error("Unauthorized");
  }
  const userSubscripn = await getUserSubscription();
  if (userSubscripn && userSubscripn.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscripn.stripeCustomerId,
      return_url: returnURL,
    });
    return {
      data: stripeSession.url,
    };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: "DuolinClone",
            description: "Unlimited Hearts",
          },
          unit_amount: 2000, //$20.00 USD
          recurring: {
            interval: "month",
          },
        },
      },
    ],
    metadata: {
      userId,
    },
    success_url: returnURL,
    cancel_url: returnURL,
  });
  return { data: stripeSession.url };
};
