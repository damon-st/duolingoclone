import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import {
  challengeProgess,
  courses,
  lessons,
  units,
  userProgress,
  userSubscription,
} from "./schema";

export const getUserProgress = cache(async () => {
  const { userId } = auth();
  if (!userId) return null;
  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });
  return data;
});

export const getUnits = cache(async () => {
  const { userId } = auth();
  const userProgress = await getUserProgress();
  if (!userId || !userProgress?.activeCourse) {
    return [];
  }
  //TODO: confirm wheter order is needed
  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourse.id),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
            with: {
              challengeProgess: {
                where: eq(challengeProgess.userId, userId),
              },
            },
          },
        },
      },
    },
  });
  const normalizeData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      if (lesson.challenges.length === 0) {
        return { ...lesson, completed: false };
      }
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgess &&
          challenge.challengeProgess.length > 0 &&
          challenge.challengeProgess.every((progress) => progress.completed)
        );
      });
      return { ...lesson, completed: allCompletedChallenges };
    });
    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizeData;
});

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();
  return data;
});

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      units: {
        orderBy: (unints, { asc }) => [asc(unints.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
          },
        },
      },
    },
  });
  return data;
});

export const getCourseProgress = cache(async () => {
  const { userId } = auth();
  const userProgress = await getUserProgress();
  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }
  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgess: {
                where: eq(challengeProgess.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      //TODO: if somehtin does not work check the las if clause
      return lesson.challenges.some((challange) => {
        return (
          !challange.challengeProgess ||
          challange.challengeProgess.length === 0 ||
          challange.challengeProgess.some(
            (progress) => progress.completed === false
          )
        );
      });
    });

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  };
});

export const getLesson = cache(async (id?: number) => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  const courseProgress = await getCourseProgress();

  const lessonId = id ?? courseProgress?.activeLessonId;
  if (!lessonId) {
    return null;
  }
  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengesOptions: true,
          challengeProgess: {
            where: eq(challengeProgess.userId, userId),
          },
        },
      },
    },
  });
  if (!data || !data.challenges) {
    return null;
  }

  const normalizedChallanges = data.challenges.map((challenge) => {
    //TODO: if somehtin does not work check the las if clause
    const completed =
      challenge.challengeProgess &&
      challenge.challengeProgess.length > 0 &&
      challenge.challengeProgess.every((progress) => progress.completed);
    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallanges };
});

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();
  if (!courseProgress?.activeLessonId) {
    return 0;
  }
  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) {
    return 0;
  }
  const completedChallanges = lesson.challenges.filter(
    (challenge) => challenge.completed
  );

  const percetage = Math.round(
    (completedChallanges.length / lesson.challenges.length) * 100
  );
  return percetage;
});

const DAY_IN_MS = 86_400_000;

export const getUserSubscription = cache(async () => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  const data = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });
  if (!data) return null;
  const isActive =
    data.stripePriceId &&
    data.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();
  return {
    ...data,
    isActive: !!isActive,
  };
});

export const getTopTenUsers = cache(async () => {
  const { userId } = auth();
  if (!userId) {
    return [];
  }
  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      userImageSrc: true,
      points: true,
    },
  });
  return data;
});
