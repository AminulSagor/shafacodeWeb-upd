import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Server, Image, Smartphone } from 'lucide-react';
import Link from "next/link";


const developerSOPs = [
  {
    title: "Flutter Development SOP",
    description:
      "Step-by-step procedures for building cross-platform mobile applications using Flutter with scalable architecture and clean UI.",
    icon: Smartphone,
    url: "/admin/sop/Flutter?status=active",
    topics: [
      "Project setup & folder structure",
      "State management (Provider / Bloc / Riverpod)",
      "API & Firebase integration",
      "UI implementation from Figma",
      "Testing & app store deployment"
    ]
  },
  {
    title: "IoT Development SOP",
    description:
      "Guidelines for developing IoT and embedded solutions including hardware, firmware, and backend integration.",
    icon: Server,
    url: "/admin/sop/IoT?status=active",
    topics: [
      "Hardware setup (Arduino / ESP32)",
      "Firmware development",
      "Sensor data collection",
      "MQTT / HTTP communication",
      "Backend integration & monitoring"
    ]
  },
  {
    title: "Next.js Development SOP",
    description:
      "Standard procedures for building modern, scalable web applications using Next.js with best practices.",
    icon: Monitor,
    url: "/admin/sop/Next.js?status=active",
    topics: [
      "Project setup & app router",
      "Component & folder architecture",
      "Server Components & API routes",
      "Authentication & authorization",
      "CI/CD & deployment"
    ]
  },
  {
    title: "Design (UI/UX) SOP",
    description:
      "Processes for designing intuitive, accessible, and user-centered interfaces and experiences.",
    icon: Image,
    url: "/admin/sop/UI-UX?status=active",
    topics: [
      "Requirement analysis & user flow",
      "Wireframing & prototyping",
      "UI design using Figma",
      "Design systems & consistency",
      "Handoff to development"
    ]
  }
];


const page = () => {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
     
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-slate-900">SOP Management</h1>
        <p className="mt-3 text-slate-600 text-lg max-w-2xl mx-auto">
          Select a category below to view, add, or update Standard Operating
          Procedures.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developerSOPs.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link key={cat.url} href={cat.url}>
              <Card className="group cursor-pointer hover:shadow-lg transition">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-sky-600 group-hover:text-sky-700 transition" />
                    <h2 className="text-xl font-semibold text-slate-900">
                      {cat.title}
                    </h2>
                  </div>
                  <p className="text-sm text-slate-600">{cat.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default page;
