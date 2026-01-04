import { Sparkles, Users, Rocket, Lightbulb } from "lucide-react";
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

const CareersLoading = () => {
  return (
    <div>
      <section className="bg-linear-to-r from-slate-800 to-slate-700">
        <div className="max-w-5xl mx-auto py-20 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center text-slate-100 space-y-8">
            {/* Small label/badge */}
            <div className="inline-flex items-center rounded-full border border-sky-500/40 bg-slate-900/40 px-4 py-1 text-xs font-medium tracking-wide text-sky-300 backdrop-blur">
              <span className="mr-2 h-2 w-2 rounded-full bg-sky-400" />
              Careers
            </div>

            {/* Heading + description */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                Build Your Future With
                <span className="text-sky-400"> ShafaCode</span>
              </h1>

              <p className="text-slate-200/80 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
                Join a passionate team of creators, developers, and innovators.
                Explore opportunities to grow your career, learn new skills, and
                make an impact.
              </p>
            </div>

            {/* Career categories */}
            <ul className="flex flex-wrap gap-y-2 gap-4 justify-center text-sky-200 mt-6">
              <li className="text-sm w-full sm:w-auto">💻 Engineering</li>
              <li className="text-sm w-full sm:w-auto">🎨 Design & Creative</li>
              <li className="text-sm w-full sm:w-auto">
                📈 Marketing & Growth
              </li>
              <li className="text-sm w-full sm:w-auto">
                🤝 Operations & Support
              </li>
            </ul>
          </div>
        </div>
      </section>
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
    </div>
  );
};

export default CareersLoading;
