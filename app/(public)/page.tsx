
import { Badge } from "@/components/ui/badge";
import {buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";

interface featureProps {
  title: string;
  description: string;
  icon: string;
}

const features: featureProps[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a wide range of carefully designed courses created by industry experts.",
    icon: "📚",
  },
  {
    title: "Expert Instructors",
    description:
      "Learn from experienced professionals who bring real-world knowledge to the classroom.",
    icon: "👨‍🏫",
  },
  {
    title: "Flexible Learning",
    description:
      "Study at your own pace with 24/7 access to all course materials.",
    icon: "⏰",
  },
  {
    title: "Certifications",
    description:
      "Earn recognized certificates that enhance your resume and career prospects.",
    icon: "🏆",
  },
];

export default async function Home() {
  return (
    <>
      <section className="relative py-20">
        <div className=" flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">The future of Online Eduction</Badge>
          <h1 className="text-4xl md:text-6xl ">
            Elevate your Learning Expreience
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Discover a new way to learn with our modern,interactive learning
            mangment system.Acces high-quality coursesanytime,anywhere{" "}
          </p>
          <div className="flex fex-col sm:flex-row gap-4 mt-8 ">
            <Link className={buttonVariants({ size: "lg" })} href="/courses">
              {" "}
              Explore Courses
            </Link>
            <Link
              className={buttonVariants({ size: "lg", variant: "outline" })}
              href="/login"
            >
              {" "}
              Login
            </Link>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
