const CareerHero = () => {
  return (
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
            <li className="text-sm w-full sm:w-auto">📈 Marketing & Growth</li>
            <li className="text-sm w-full sm:w-auto">
              🤝 Operations & Support
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CareerHero;
