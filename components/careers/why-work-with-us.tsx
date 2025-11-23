import React from "react";
import { Sparkles, Users, Rocket, Lightbulb } from "lucide-react";

const WhyWorkWithUs = () => {
  const items = [
    {
      title: "Growth & Learning",
      desc: "We invest in your skills with mentorship, courses, and hands-on projects.",
      icon: <Lightbulb className="w-6 h-6 text-sky-400" />,
    },
    {
      title: "Collaborative Culture",
      desc: "Join a supportive team where creativity, ownership, and teamwork thrive.",
      icon: <Users className="w-6 h-6 text-sky-400" />,
    },
    {
      title: "Real Impact",
      desc: "Work on meaningful products that help real businesses and users grow.",
      icon: <Rocket className="w-6 h-6 text-sky-400" />,
    },
    {
      title: "Innovation First",
      desc: "We value bold ideas, modern tech, and exploring better ways to build.",
      icon: <Sparkles className="w-6 h-6 text-sky-400" />,
    },
  ];

  return (
    <section className="bg-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center space-y-12">
        {/* Heading */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-100">
            Why Work With Us?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
            At ShafaCode, you’re not just joining a team — you’re joining a
            culture built on creativity, trust, and continuous improvement.
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4 backdrop-blur-sm hover:border-sky-400/40 transition"
            >
              <div className="flex justify-center">{item.icon}</div>
              <h3 className="text-lg font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithUs;
